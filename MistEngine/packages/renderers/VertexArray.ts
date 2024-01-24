import { MistIndexBuffer, MistVertexBuffer } from "./Buffer";
import { MistRendererAPI, Renderer, MistAPIUsable } from "./Renderer";
import { WebGL2VertexArray } from "./api/WebGL2/WebGL2VertexArray";

export interface MistVertexArrayBase extends MistAPIUsable {
	addVertexBuffer(vertexBuffer: MistVertexBuffer): void;
	setIndexBuffer(indexBuffer: MistIndexBuffer): void;
	getVertexBuffers(): MistVertexBuffer[];
	getIndexBuffer(): MistIndexBuffer;
}

export class VertexArrayFactory {
	static Create(renderer: Renderer): MistVertexArrayBase {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2VertexArray(renderer);
			case MistRendererAPI.WebGPU:
				throw new Error("VertexArray for WEBGL2 is not implemented yet");
			default:
				throw new Error(
					`Unsupported Renderer Api '${renderer.GetApi()}' for creating VertexArray`
				);
		}
	}
}
