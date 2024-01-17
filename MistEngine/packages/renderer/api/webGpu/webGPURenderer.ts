/*
  
	Mist WebGPU Renderer
  
 */
import Renderer, { MistRendererApi } from "../../renderer";
import type { MistRendererApiT } from "../../renderer";

export class MistWebGPURenderer extends Renderer {
	public static readonly API: MistRendererApiT = MistRendererApi.WebGPU;

	constructor(canvas: HTMLCanvasElement) {
		super(canvas, MistRendererApi.WebGPU);

		if (!navigator.gpu) {
			throw new Error("WebGPU is not supported in your browser yet");
		}
	}
}
