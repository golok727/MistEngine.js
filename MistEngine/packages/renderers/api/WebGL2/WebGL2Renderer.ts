import { MistRendererAPI, Renderer } from "@mist-engine/renderers/Renderer";
import { WebGL2Context } from "./WebGL2Context";

export class WebGL2Renderer implements Renderer {
	private canvas: HTMLCanvasElement;
	readonly api: MistRendererAPI;
	private context: WebGL2Context;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.api = MistRendererAPI.WebGL2;
		this.context = new WebGL2Context(this.canvas);
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
