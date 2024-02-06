import { MistRendererAPI, Renderer } from '../../Renderer'

import MistWebGL2RenderingAPI from './WebGL2RenderingAPI'
import { MistVertexArray } from '../../VertexArray'
import { MistEventDispatcher } from '@mist/events'
import { Camera } from '../../../cameras'
import { MistShader } from '../../Shader'
import { Matrix4 } from '@mist/math'
import { MistWebGL2Shader } from './WebGL2Shader'

export class MistWebGL2Renderer
  extends MistEventDispatcher
  implements Renderer<WebGL2RenderingContext>
{
  private canvas: HTMLCanvasElement
  private readonly API: MistRendererAPI
  private renderAPI: MistWebGL2RenderingAPI
  private currentViewProjection?: Matrix4
  constructor(canvas: HTMLCanvasElement) {
    super()
    this.canvas = canvas
    this.API = MistRendererAPI.WebGL2
    this.renderAPI = new MistWebGL2RenderingAPI(this.canvas)
  }

  public get width(): number {
    return this.canvas.width
  }

  public get aspect(): number {
    return this.canvas.width / this.canvas.height
  }

  public get height(): number {
    return this.canvas.height
  }

  public get canvasWidth(): number {
    return this.canvas.clientWidth
  }
  public get canvasHeight(): number {
    return this.canvas.clientHeight
  }
  Is<T extends Renderer<unknown>>(): this is T {
    return this instanceof MistWebGL2Renderer
  }

  public BeginScene(camera: Camera): void {
    this.currentViewProjection = camera.viewProjection
  }

  public Submit(
    vertexArray: MistVertexArray,
    shader: MistShader,
    transform: Matrix4,
  ): void {
    if (this.currentViewProjection === undefined)
      console.warn('Please Begin a scene before submitting to the Renderer')
    const renderAPI = this.GetRenderAPI()
    const s = shader as MistWebGL2Shader

    s.use()

    s.setUniformMat4(
      'u_ViewProjection',
      this.currentViewProjection || new Matrix4(),
    )

    s.setUniformMat4('u_Transform', transform)

    vertexArray.use()
    renderAPI.DrawIndexed(vertexArray)
  }

  public EndScene(): void {
    this.currentViewProjection = undefined
  }

  public Resize(): void {
    const canvas = this.canvas as HTMLCanvasElement
    const dpr = window.devicePixelRatio || 1
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (w !== canvas.width || h !== canvas.height) {
      canvas.width = w
      canvas.height = h

      this.dispatchEvent({
        type: MistEventType.RendererResize,
        width: canvas.width,
        height: canvas.height,
        target: this,
      })
    }
  }

  public getNativeContext(): WebGL2RenderingContext {
    return this.GetRenderAPI().inner
  }

  public GetRenderAPI() {
    return this.renderAPI
  }

  public GetApiType(): MistRendererAPI {
    return this.API
  }
}
