import { Matrix4 } from '@mist/math'
import { Renderer } from '../../Renderer'
import { getGLRenderingContext } from '../../RenderingApi'
import { MistShader } from '../../Shader'

type ShaderTypes = 'VERTEX' | 'FRAGMENT'

export class MistWebGL2Shader implements MistShader {
  _gl: WebGL2RenderingContext
  private program: WebGLProgram
  private uniformCache: Map<string, WebGLUniformLocation>

  constructor(
    renderer: Renderer,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.uniformCache = new Map()

    this._gl = getGLRenderingContext(renderer)
    const vertexShader = this.createShader('VERTEX', vertexShaderSource)
    const fragmentShader = this.createShader('FRAGMENT', fragmentShaderSource)
    this.program = this.createProgram(vertexShader, fragmentShader)
  }
  /*
	 This is only for cheating typescript before i fully abstract the API
	 */
  public is<T extends MistShader>(): this is T {
    return this instanceof MistWebGL2Shader
  }

  public use(): void {
    this._gl.useProgram(this.program)
  }
  public detach(): void {
    this._gl.useProgram(null)
  }
  public delete(): void {
    this._gl.deleteProgram(this.program)
  }

  public setUniform1i(name: string, v: number): void {
    const location = this.getUniformLocation(name)
    this._gl.uniform1i(location, v)
  }

  public setUniform3f(name: string, x: number, y: number, z: number): void {
    const location = this.getUniformLocation(name)
    this._gl.uniform3f(location, x, y, z)
  }

  public setUniformMat4(name: string, m: Matrix4): void {
    const location = this.getUniformLocation(name)
    const data = new Float32Array(m.toArray())
    this._gl.uniformMatrix4fv(location, false, data)
  }

  private getUniformLocation(name: string): WebGLUniformLocation | null {
    const cache = this.uniformCache.get(name)
    if (cache !== undefined) return cache

    const location = this._gl.getUniformLocation(this.program, name)

    if (location === null && !import.meta.env.PROD) {
      console.warn(`Uniform ${name} not found`)
      return location
    }

    this.uniformCache.set(name, location!)
    return location
  }

  private createProgram(...shaders: WebGLShader[]): WebGLProgram {
    const { _gl: gl } = this
    const program = gl.createProgram()
    if (!program) throw new Error('Error Creating Shader Program')

    shaders.forEach((shader) => {
      gl.attachShader(program, shader)
    })

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)

      shaders.forEach((shader) => {
        gl.deleteShader(shader)
      })

      throw new Error(`Error linking program :${info}`)
    }

    shaders.forEach((shader) => {
      gl.deleteShader(shader)
    })

    return program
  }

  private createShader(type: ShaderTypes, source: string): WebGLShader {
    const shaderType = this.getGLShaderType(type)

    const { _gl: gl } = this
    const shader = gl.createShader(shaderType)
    if (!shader) throw new Error(`Error creating Shader ${type}`)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Error compiling shader ${type}:\n${info}`)
    }
    return shader
  }

  private getGLShaderType(type: ShaderTypes) {
    switch (type) {
      case 'VERTEX':
        return this._gl.VERTEX_SHADER
      case 'FRAGMENT':
        return this._gl.FRAGMENT_SHADER
      default:
        return -1
    }
  }
}
