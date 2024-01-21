/*
  
	Mist WebGPU Renderer
  
 */
import Renderer, { MistRendererApi } from "../../Renderer";
import type { MistRendererApiT } from "../../Renderer";
import { WebGPUContext } from "./Context";

export class MistWebGPURenderer extends Renderer {
	public static readonly API: MistRendererApiT = MistRendererApi.WebGPU;
	public context: WebGPUContext;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGPU);
		this.context = new WebGPUContext(canvas);
	}
}
