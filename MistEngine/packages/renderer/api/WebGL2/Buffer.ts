import { VertexBuffer, IndexBuffer } from "@mist-engine/renderer/Buffer";
import { MistWebGL2Renderer } from "./Renderer";

export class WebGL2VertexBuffer extends VertexBuffer {
	protected override buffer: WebGLBuffer;
	protected override renderer: MistWebGL2Renderer;

	constructor(renderer: MistWebGL2Renderer, data: Float32Array) {
		super();
		this.renderer = renderer;

		const gl = renderer.GetContext().inner;
		const buffer = gl.createBuffer();

		if (!buffer) throw new Error("Error creating buffer");
		this.buffer = buffer;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	public override Bind(): void {
		const gl = this.renderer.GetContext().inner;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	}

	public override UnBind(): void {
		const gl = this.renderer.GetContext().inner;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}
}

export class WebGL2IndexBuffer extends IndexBuffer {
	protected override buffer: WebGLBuffer;
	protected override renderer: MistWebGL2Renderer;

	constructor(renderer: MistWebGL2Renderer, data: Uint32Array) {
		super();

		this.renderer = renderer;

		const gl = renderer.GetContext().inner;
		const buffer = gl.createBuffer();

		if (!buffer) throw new Error("Error creating buffer");
		this.buffer = buffer;

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	public override Bind(): void {
		const gl = this.renderer.GetContext().inner;

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
	}

	public override UnBind(): void {
		const gl = this.renderer.GetContext().inner;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}
}
