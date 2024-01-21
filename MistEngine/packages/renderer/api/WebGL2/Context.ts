import { GraphicsContext } from "@mist-engine/renderer/GraphicsContext";

export class WebGL2Context extends GraphicsContext<WebGL2RenderingContext> {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		const gl = this.canvas.getContext("webgl2");
		if (!gl) throw new Error("Error getting WebGL2Context...");
		this.context = gl;
	}
	private getContext() {
		return this.context;
	}

	clear(): void {
		const gl = this.getContext();
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	clearColor(r: number, g: number, b: number, a: number): void {
		const gl = this.getContext();
		gl.clearColor(r, g, b, a);
	}
}
