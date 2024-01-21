import { GraphicsContext } from "@mist-engine/renderer/GraphicsContext";

export class WebGL2Context extends GraphicsContext<WebGL2RenderingContext> {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		const gl = this.canvas.getContext("webgl2");
		if (!gl) throw new Error("Error getting WebGL2Context...");
		this.context = gl;
	}

	override Init() {}
}
