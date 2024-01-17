import Renderer, { MistRendererApi } from "./renderer";
import type { MistRendererApiT } from "./renderer";

export class WebGL2Renderer extends Renderer {
	public static readonly API: MistRendererApiT = MistRendererApi.WebGL2;
	private gl: WebGL2RenderingContext;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGL2);
		const gl = this.canvas.getContext("webgl2");
		if (!gl) throw new Error("Webgl 2 is not supported in your browser");
		this.gl = gl;

		this.gl; //! ignore
	}
}
