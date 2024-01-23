import { Context } from "@mist-engine/renderers/Context";

export class WebGL2Context implements Context<WebGL2RenderingContext> {
	private canvas: HTMLCanvasElement;
	context!: WebGL2RenderingContext;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.init();
	}

	get inner(): WebGL2RenderingContext {
		return this.context;
	}

	clearColor(r: number, g: number, b: number, a: number): void {
		const gl = this.context;
		gl.clearColor(r, g, b, a);
	}

	clear(): void {
		const gl = this.context;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	setViewport(x: number, y: number, width: number, height: number): void {
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
