import { GraphicsContext } from "./GraphicsContext";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export default class Renderer {
	protected canvas: HTMLCanvasElement;
	public readonly API: MistRendererAPI;
	public static readonly API: MistRendererAPI = MistRendererAPI.None;
	protected context!: GraphicsContext<any>; // Should be initialized by the child class

	constructor(canvas: HTMLCanvasElement, rendererApi: MistRendererAPI) {
		this.API = rendererApi;
		this.canvas = canvas;
	}

	GetContext() {
		return this.context;
	}

	GetApi() {
		return this.API;
	}
}
