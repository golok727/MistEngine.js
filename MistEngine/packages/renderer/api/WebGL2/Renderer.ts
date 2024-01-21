import { WebGL2Context } from "./Context";
import Renderer, { MistRendererApi } from "../../Renderer";
import type { MistRendererApiT } from "../../Renderer";

export class MistWebGL2Renderer extends Renderer {
	public static readonly API: MistRendererApiT = MistRendererApi.WebGL2;
	protected context: WebGL2Context;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGL2);
		this.context = new WebGL2Context(this.canvas);
	}
}
