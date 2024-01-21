/*
  
	Mist WebGPU Renderer
  
 */
import Renderer, { MistRendererAPI } from "../../Renderer";
import { WebGPUContext } from "./Context";

export class MistWebGPURenderer extends Renderer {
	public static readonly API: MistRendererAPI = MistRendererAPI.WebGPU;
	protected context: WebGPUContext;
	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererAPI.WebGPU);
		this.context = new WebGPUContext(canvas);
		this.context;
	}
}
