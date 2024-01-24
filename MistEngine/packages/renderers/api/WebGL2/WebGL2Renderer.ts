import { MistRendererAPI, Renderer } from "@mist-engine/renderers/Renderer";
import { registerContext } from "@mist-engine/renderers/Context";

import { WebGL2Context } from "./WebGL2Context";

export class WebGL2Renderer implements Renderer<WebGL2RenderingContext> {
	private canvas: HTMLCanvasElement;
	readonly api: MistRendererAPI;
	private context: WebGL2Context;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.api = MistRendererAPI.WebGL2;
		this.context = new WebGL2Context(this.canvas);

		registerContext(this);
	}

	getNativeContext(): WebGL2RenderingContext {
		return this.GetContext().inner;
	}

	getWidth(): number {
		return this.canvas.width;
	}

	getHeight(): number {
		return this.canvas.height;
	}

	GetContext() {
		return this.context;
	}

	GetApi(): MistRendererAPI {
		return this.api;
	}
}
