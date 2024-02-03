import { Renderer } from "../../Renderer";
import {
	MistIndexBuffer,
	MistVertexBuffer,
	shaderDataTypeToGLBaseDataType,
} from "../../Buffer";
import { getGLRenderingContext } from "../../RenderingApi";
import { MistVertexArray } from "../../VertexArray";

export class MistWebGL2VertexArray implements MistVertexArray {
	private _gl: WebGL2RenderingContext;
	private vao: WebGLVertexArrayObject;
	private indexBuffer!: MistIndexBuffer;
	private vertexBuffers: MistVertexBuffer[];

	constructor(renderer: Renderer) {
		this._gl = getGLRenderingContext(renderer);
		this.vertexBuffers = [];

		const vao = this._gl.createVertexArray();
		if (!vao) throw new Error("Error creating WebGL Vertex Array");
		this.vao = vao;
		this._gl.bindVertexArray(vao);
	}

	public use(): void {
		this._gl.bindVertexArray(this.vao);
	}

	public detach(): void {
		this._gl.bindVertexArray(null);
	}

	public delete(): void {
		this._gl.deleteVertexArray(this.vao);
	}

	public getVertexBuffers(): MistVertexBuffer[] {
		return this.vertexBuffers;
	}

	public getIndexBuffer(): MistIndexBuffer {
		return this.indexBuffer;
	}

	public addVertexBuffer(vertexBuffer: MistVertexBuffer): void {
		const gl = this._gl;
		gl.bindVertexArray(this.vao);

		vertexBuffer.use();

		const layout = vertexBuffer.getLayout();
		if (layout === undefined)
			throw new Error("Vertex buffer has no layout set");

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
		this.vertexBuffers.push(vertexBuffer);
	}

	public setIndexBuffer(indexBuffer: MistIndexBuffer): void {
		const gl = this._gl;
		gl.bindVertexArray(this.vao);
		indexBuffer.use();

		this.indexBuffer = indexBuffer;
	}
}
