import { MistIndexBuffer, MistVertexBuffer } from "./Buffer";
import { MistRendererAPI, Renderer, MistAPIUsable } from "./Renderer";
import { MistWebGL2VertexArray } from "./api/WebGL2/WebGL2VertexArray";

export interface MistVertexArray extends MistAPIUsable {
	addVertexBuffer(vertexBuffer: MistVertexBuffer): void;
	setIndexBuffer(indexBuffer: MistIndexBuffer): void;
	getVertexBuffers(): MistVertexBuffer[];
	getIndexBuffer(): MistIndexBuffer;
}

export class VertexArrayFactory {
	static Create(renderer: Renderer): MistVertexArray {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGL2VertexArray(renderer);
			case MistRendererAPI.WebGPU:
				throw new Error("VertexArray for WEBGL2 is not implemented yet");
			default:
				throw new Error(
					`Unsupported Renderer Api '${renderer.GetApi()}' for creating VertexArray`
				);
		}
	}
}
