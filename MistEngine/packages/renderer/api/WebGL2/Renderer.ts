import Renderer, { MistRendererApi } from "../../Renderer";
import { WebGL2Context } from "./Context";

export class MistWebGL2Renderer extends Renderer {
	public static readonly API: MistRendererApi = MistRendererApi.WebGL2;
	private context: WebGL2Context;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGL2);
		this.context = new WebGL2Context(this.canvas);
		this.context;
	}

	hello() {}
}
