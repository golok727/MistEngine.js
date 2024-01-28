import { MistRendererAPI, Renderer } from "@mist-engine/renderers/Renderer";

import MistWebGL2RenderingAPI from "./WebGL2RenderingAPI";
import { MistVertexArray } from "@mist-engine/renderers/VertexArray";
import { MistEventDispatcher } from "@mist-engine/core/Events";

export class MistWebGL2Renderer
	extends MistEventDispatcher
	implements Renderer<WebGL2RenderingContext>
{
	private canvas: HTMLCanvasElement;
	private readonly API: MistRendererAPI;
	private renderAPI: MistWebGL2RenderingAPI;

	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
		this.API = MistRendererAPI.WebGL2;
		this.renderAPI = new MistWebGL2RenderingAPI(this.canvas);
	}

	public BeginScene(): void {}

	public Submit(vertexArray: MistVertexArray): void {
		const renderAPI = this.GetRenderAPI();
		vertexArray.use();
		renderAPI.DrawIndexed(vertexArray);
	}

	public EndScene(): void {}

	public Resize(): void {
		const canvas = this.canvas as HTMLCanvasElement;
		const dpr = window.devicePixelRatio || 1;
		const w = Math.round(canvas.clientWidth * dpr);
		const h = Math.round(canvas.clientHeight * dpr);
		if (w !== canvas.width || h !== canvas.height) {
			canvas.width = w;
			canvas.height = h;

			this.dispatchEvent({
				type: MistEventType.RendererResize,
				width: canvas.width,
				height: canvas.height,
				target: this,
			});
		}
	}

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
