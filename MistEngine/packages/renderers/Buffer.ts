import { MistRendererAPI, Renderer } from "./Renderer";
import {
	WebGL2IndexBuffer,
	WebGL2VertexBuffer,
} from "./api/WebGL2/WebGL2Buffer";

export interface MistBufferT {
	Bind(): void;
	unBind(): void;
	delete(): void;
}

export class BufferFactory {
	/**
	 * Creates a vertex buffer based on the given renderer API
	 */
	public static Vertex(renderer: Renderer, data: Float32Array): MistBufferT {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2VertexBuffer(renderer, data);
			case MistRendererAPI.WebGPU:
				throw new Error(
					`Renderer API ${renderer.GetApi()} is under construction`
				);
			default:
				throw new Error(`Renderer API ${renderer.GetApi()} is not supported`);
		}
	}

	/**
	 * Creates a index buffer based on the given renderer API
	 */
	public static Index(renderer: Renderer, data: Uint32Array): MistBufferT {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2IndexBuffer(renderer, data);

			case MistRendererAPI.WebGPU:
				throw new Error(
					`Renderer API ${renderer.GetApi()} is under construction`
				);

			default:
				throw new Error(`Renderer API ${renderer.GetApi()} is not supported`);
		}
	}
}
