export enum MistRendererApi {
	WebGL2 = "webgl2",
	WebGPU = "webgpu",
	None = "none",
}

export default class Renderer {
	protected canvas: HTMLCanvasElement;
	public readonly API: MistRendererApi;
	public static readonly API: MistRendererApi = MistRendererApi.None;

	constructor(canvas: HTMLCanvasElement, rendererApi: MistRendererApi) {
		this.API = rendererApi;
		this.canvas = canvas;
	}
}
