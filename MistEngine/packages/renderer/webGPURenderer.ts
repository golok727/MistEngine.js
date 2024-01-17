import Renderer, { MistRendererApi } from "./renderer";
import type { MistRendererApiT } from "./renderer";

export class WebGPURenderer extends Renderer {
	public static readonly API: MistRendererApiT = MistRendererApi.WebGPU;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGPU);
	}
}
