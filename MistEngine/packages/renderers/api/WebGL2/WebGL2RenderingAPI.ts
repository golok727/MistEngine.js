import { MistVertexArray } from "@mist-engine/renderers";
import { RenderingAPI } from "@mist-engine/renderers/RenderingApi";

export class WebGL2RenderingAPI
	implements RenderingAPI<WebGL2RenderingContext>
{
	private canvas: HTMLCanvasElement;
	context!: WebGL2RenderingContext;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.init();
	}

	get inner(): WebGL2RenderingContext {
		return this.context;
	}

	public ClearColor(r: number, g: number, b: number, a: number): void {
		const gl = this.context;
		gl.clearColor(r, g, b, a);
	}

	public Clear(): void {
		const gl = this.context;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	public DrawIndexed(vertexArray: MistVertexArray): void {
		const gl = this.context;
		gl.drawElements(
			gl.TRIANGLES,
			vertexArray.getIndexBuffer().getCount(),
			gl.UNSIGNED_INT,
			0
		);
	}

	public SetViewport(
		x: number,
		y: number,
		width: number,
		height: number
	): void {
		const gl = this.context;
		gl.viewport(x, y, width, height);
	}

	private init() {
		const pixelRatio = window.devicePixelRatio ?? 1;
		this.canvas.width = this.canvas.offsetWidth * pixelRatio;
		this.canvas.height = this.canvas.offsetHeight * pixelRatio;

		const context = this.canvas.getContext("webgl2");
		if (!context) throw new Error("Error getting WebGL2 context");

		this.context = context;
	}
}
