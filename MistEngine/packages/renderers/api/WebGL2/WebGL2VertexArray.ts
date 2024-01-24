import { Renderer } from "@mist-engine/renderers";
import {
	MistIndexBuffer,
	MistVertexBuffer,
	shaderDataTypeToGLBaseDataType,
} from "@mist-engine/renderers/Buffer";
import { getGLContext } from "@mist-engine/renderers/Context";
import { MistVertexArrayBase } from "@mist-engine/renderers/VertexArray";

export class WebGL2VertexArray implements MistVertexArrayBase {
	private _gl: WebGL2RenderingContext;
	private vao: WebGLVertexArrayObject;
	private ibo!: MistIndexBuffer;
	private vbo!: MistVertexBuffer;

	constructor(renderer: Renderer) {
		this._gl = getGLContext(renderer);
		const vao = this._gl.createVertexArray();
		if (!vao) throw new Error("Error creating WebGL Vertex Array");
		this.vao = vao;
		this._gl.bindVertexArray(vao);
	}

	setVertexBuffer(buffer: MistVertexBuffer): void {
		this.vbo = buffer;
		this.vbo.use();

		const gl = this._gl;
		const layout = buffer.getLayout();
		for (const element of layout) {
			gl.enableVertexAttribArray(element.location);
			gl.vertexAttribPointer(
				element.location,
				element.componentCount,
				shaderDataTypeToGLBaseDataType(element.type),
				element.normalized,
				layout.stride,
				element.offset
			);
		}
	}

	setIndexBuffer(buffer: MistIndexBuffer): void {
		this.ibo = buffer;
		this.ibo.use();
	}

	use(): void {
		this._gl.bindVertexArray(this.vao);
	}

	detach(): void {
		this._gl.bindVertexArray(null);
		this.vbo.detach();
		this.ibo.detach();
	}

	delete(): void {
		this._gl.deleteVertexArray(this.vao);
	}
}
