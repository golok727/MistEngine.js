import { MistRendererAPI, Renderer } from "@mist-engine/renderers/Renderer";
import { registerContext } from "@mist-engine/renderers/RenderingApi";

import { WebGL2RenderingAPI } from "./WebGL2RenderingAPI";

export class WebGL2Renderer implements Renderer<WebGL2RenderingContext> {
	private canvas: HTMLCanvasElement;
	private readonly API: MistRendererAPI;
	private context: WebGL2RenderingAPI;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.API = MistRendererAPI.WebGL2;
		this.context = new WebGL2RenderingAPI(this.canvas);

		registerContext(this);
	}

	BeginScene(): void {}

	Submit(): void {}

	EndScene(): void {}

	public getNativeContext(): WebGL2RenderingContext {
		return this.GetRenderAPI().inner;
	}

	public getWidth(): number {
		return this.canvas.width;
	}

	public getHeight(): number {
		return this.canvas.height;
	}

	public GetRenderAPI() {
		return this.context;
	}

	public GetApi(): MistRendererAPI {
		return this.API;
	}
}
