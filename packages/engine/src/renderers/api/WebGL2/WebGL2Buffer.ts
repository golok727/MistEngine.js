import { BufferLayout, MistIndexBuffer, MistVertexBuffer } from '../../Buffer'
import { Renderer } from '../../Renderer'
import { getGLRenderingContext } from '../../RenderingApi'

export class MistWebGL2VertexBuffer implements MistVertexBuffer {
  private buffer: WebGLBuffer
  private layout!: BufferLayout
  private _gl: WebGL2RenderingContext

  constructor(renderer: Renderer, data: Float32Array) {
    const gl = getGLRenderingContext(renderer)
    this._gl = gl

    const buffer = gl.createBuffer()
    if (!buffer) throw new Error('Error creating vertex buffer')

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    this.buffer = buffer
  }

  public setLayout(layout: BufferLayout): void {
    this.layout = layout
  }

  public getLayout(): BufferLayout {
    return this.layout
  }

  public delete(): void {
    this._gl.deleteBuffer(this.buffer)
  }

  public use(): void {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.buffer)
  }

  public detach(): void {
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null)
  }
}

export class WebGL2IndexBuffer implements MistIndexBuffer {
  private buffer: WebGLBuffer
  private _gl: WebGL2RenderingContext
  private readonly count: number

  constructor(renderer: Renderer, data: Uint32Array) {
    const gl = getGLRenderingContext(renderer)
    this._gl = gl
    this.count = data.length

    const buffer = gl.createBuffer()
    if (!buffer) throw new Error('Error creating index buffer')

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)

    this.buffer = buffer
  }

  public getCount(): number {
    return this.count
  }

  public use(): void {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this.buffer)
  }

  public detach(): void {
    this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null)
  }

  public delete(): void {
    this._gl.deleteBuffer(this.buffer)
  }
}
