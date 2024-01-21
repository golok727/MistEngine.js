import { GraphicsContext } from "./GraphicsContext";

export const MistRendererApi = {
	WebGL2: "webgl2",
	WebGPU: "webgpu",
	None: "none",
} as const;

export type MistRendererApiT =
	(typeof MistRendererApi)[keyof typeof MistRendererApi];

export default class Renderer {
	protected canvas: HTMLCanvasElement;
	public readonly API: MistRendererApiT;
	public static readonly API: MistRendererApiT = MistRendererApi.None;

	constructor(canvas: HTMLCanvasElement, rendererApi: MistRendererApiT) {
		this.API = rendererApi;
		this.canvas = canvas;
	}
}
