import { MistWebGL2Renderer, MistWebGPURenderer } from ".";
import Renderer, { MistRendererAPI } from "./Renderer";
import { WebGL2IndexBuffer, WebGL2VertexBuffer } from "./api/WebGL2/Buffer";
import { WebGPUIndexBuffer, WebGPUVertexBuffer } from "./api/WebGpu/Buffer";

export class VertexBuffer {
	constructor() {}

	public static Create(renderer: Renderer, vertices: Float32Array) {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2VertexBuffer(renderer as MistWebGL2Renderer, vertices);

			case MistRendererAPI.WebGPU:
				return new WebGPUVertexBuffer(renderer as MistWebGPURenderer, vertices);
			default:
				throw new Error(`API: ${renderer.GetApi()} is not supported`);
		}
	}

	public Bind() {}
	public UnBind() {}
}

export class IndexBuffer {
	constructor() {}

	public static Create(renderer: Renderer, indices: Uint32Array): IndexBuffer {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2IndexBuffer(renderer as MistWebGL2Renderer, indices);

			case MistRendererAPI.WebGPU:
				return new WebGPUIndexBuffer(renderer as MistWebGPURenderer, indices);

			default:
				throw new Error(`API: ${renderer.GetApi()} is not supported`);
		}
	}

	public Bind() {}
	public UnBind() {}
}
