/*
  
	Mist WebGPU Renderer
  
 */
import Renderer, { MistRendererApi } from "../../Renderer";
import { WebGPUContext } from "./Context";

export class MistWebGPURenderer extends Renderer {
	public static readonly API: MistRendererApi = MistRendererApi.WebGPU;
	private context: WebGPUContext;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGPU);
		this.context = new WebGPUContext(canvas);
		this.context;
	}
}
