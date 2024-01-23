import { WebGL2Context } from "./api/WebGL2/WebGL2Context";
import { Context } from "./Context";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer {
	api: MistRendererAPI;
	GetContext(): Context<unknown>;
	GetApi(): Renderer["api"];
	getWidth(): number;
	getHeight(): number;
}

export function getGpuContext(renderer: Renderer) {
	throw new Error(`getGpuContext for ${renderer.GetApi} is not implemented`);
}

export function getGLContext(renderer: Renderer): WebGL2RenderingContext {
	const context = renderer.GetContext();

	// Check if the context is webgl2 context
	if (!(context instanceof WebGL2Context)) {
		throw new Error(
			"This buffer should be used within the WebGL2 rendering context"
		);
	}

	return context.inner;
}
