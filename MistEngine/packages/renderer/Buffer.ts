import { MistWebGL2Renderer } from ".";
import Renderer, { MistRendererAPI } from "./Renderer";
import { WebGL2IndexBuffer, WebGL2VertexBuffer } from "./api/WebGL2/Buffer";

export class VertexBuffer {
	constructor() {}

	public static Create(
		renderer: Renderer,
		vertices: Float32Array
	): VertexBuffer {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2VertexBuffer(renderer as MistWebGL2Renderer, vertices);
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
			default:
				throw new Error(`API: ${renderer.GetApi()} is not supported`);
		}
	}

	public Bind() {}
	public UnBind() {}
}
