import {Renderer} from '../../Renderer'
import {getGLRenderingContext} from '../../RenderingApi'
import TextureLibrary from '../../TextureLibrary'
import {MistTexture} from '../../Texture'

function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0
}

export class MistWebGLTexture implements MistTexture {
  private _gl: WebGL2RenderingContext
  private texture!: WebGLTexture
  private isLoaded: boolean
  constructor(renderer: Renderer, url: string) {
    this._gl = getGLRenderingContext(renderer)
    let image = TextureLibrary.GetImageForTexture(url)
    this.isLoaded = !!image

    if (!image) {
      const image = new Image()
      image.onload = () => {
        this.isLoaded = true
        this.setup(image)
      }
      image.src = url
    } else {
      this.setup(image)
    }
  }
  private setup(image: HTMLImageElement) {
    const gl = this._gl

    const texture = gl.createTexture()
    if (!texture) throw new Error('Error creating texture')
    this.texture = texture
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }
  }
  use(): void
  use(slot: number): void
  use(slot?: number): void {
    if (this.isLoaded) {
      slot = slot ?? 0
      const gl = this._gl
      gl.activeTexture(gl.TEXTURE0 + slot)
      gl.bindTexture(gl.TEXTURE_2D, this.texture)
    }
  }

  detach(): void {
    const gl = this._gl
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  delete(): void {
    const gl = this._gl
    gl.deleteTexture(this.texture)
  }
}
