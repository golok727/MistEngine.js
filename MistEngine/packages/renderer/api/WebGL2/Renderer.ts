import Renderer, { MistRendererAPI } from "../../Renderer";
import { WebGL2Context } from "./Context";

export class MistWebGL2Renderer extends Renderer {
	public static readonly API: MistRendererAPI = MistRendererAPI.WebGL2;
	protected context: WebGL2Context;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererAPI.WebGL2);
		this.context = new WebGL2Context(this.canvas);
	}

	GetContext(): WebGL2Context {
		return this.context;
	}
}
