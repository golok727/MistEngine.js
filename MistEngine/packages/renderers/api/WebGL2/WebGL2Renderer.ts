import { MistRendererAPI, Renderer } from "@mist-engine/renderers/Renderer";
import { registerContext } from "@mist-engine/renderers/RenderingApi";

import { MistWebGL2RenderingAPI } from "./WebGL2RenderingAPI";
import { MistVertexArray } from "@mist-engine/renderers/VertexArray";

export class MistWebGL2Renderer implements Renderer<WebGL2RenderingContext> {
	private canvas: HTMLCanvasElement;
	private readonly API: MistRendererAPI;
	private renderAPI: MistWebGL2RenderingAPI;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.API = MistRendererAPI.WebGL2;
		this.renderAPI = new MistWebGL2RenderingAPI(this.canvas);

		registerContext(this);
	}

	BeginScene(): void {}

	Submit(vertexArray: MistVertexArray): void {
		const renderAPI = this.GetRenderAPI();
		vertexArray.use();
		renderAPI.DrawIndexed(vertexArray);
	}

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
		return this.renderAPI;
	}

	public GetApi(): MistRendererAPI {
		return this.API;
	}
}
