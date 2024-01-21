import { VertexBuffer, IndexBuffer } from "@mist-engine/renderer/Buffer";
import { MistWebGL2Renderer } from "./Renderer";

export class WebGL2VertexBuffer extends VertexBuffer {
	constructor(renderer: MistWebGL2Renderer, data: Float32Array) {
		super();
		renderer;
		data;
	}

	public override Bind(): void {}

	public override UnBind(): void {}
}

export class WebGL2IndexBuffer extends IndexBuffer {
	constructor(renderer: MistWebGL2Renderer, data: Uint32Array) {
		super();
		renderer;
		data;
	}

	public override Bind(): void {}

	public override UnBind(): void {}
}
