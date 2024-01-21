import { VertexBuffer, IndexBuffer } from "@mist-engine/renderer/Buffer";
import { MistWebGPURenderer } from "./Renderer";

export class WebGPUVertexBuffer extends VertexBuffer {
	constructor(renderer: MistWebGPURenderer, data: Float32Array) {
		super();
		renderer;
		data;
	}

	public override Bind(): void {}

	public override UnBind(): void {}
}

export class WebGPUIndexBuffer extends IndexBuffer {
	constructor(renderer: MistWebGPURenderer, data: Uint32Array) {
		super();
		renderer;
		data;
	}

	public override Bind(): void {}

	public override UnBind(): void {}
}
