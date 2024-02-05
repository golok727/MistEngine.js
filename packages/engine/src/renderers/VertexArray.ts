import MistAppManager from '../core/MistAppManager'
import { MistIndexBuffer, MistVertexBuffer } from './Buffer'
import { MistRendererAPI, Renderer, MistAPIUsable } from './Renderer'
import { MistWebGL2VertexArray } from './api/WebGL2/WebGL2VertexArray'

export interface MistVertexArray extends MistAPIUsable {
  addVertexBuffer(vertexBuffer: MistVertexBuffer): void
  setIndexBuffer(indexBuffer: MistIndexBuffer): void
  getVertexBuffers(): MistVertexBuffer[]
  getIndexBuffer(): MistIndexBuffer
}

export class VertexArrayFactory {
  static Create(renderer?: Renderer): MistVertexArray {
    renderer = renderer ? renderer : MistAppManager.getCurrent()?.getRenderer()
    if (!renderer)
      throw new Error(
        'Mist.VertexArray Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[1] for context',
      )

    switch (renderer.GetApiType()) {
      case MistRendererAPI.WebGL2:
        return new MistWebGL2VertexArray(renderer)
      case MistRendererAPI.WebGPU:
        throw new Error('VertexArray for WEBGL2 is not implemented yet')
      default:
        throw new Error(
          `Unsupported Renderer Api '${renderer.GetApiType()}' for creating VertexArray`,
        )
    }
  }
}
