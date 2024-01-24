import { MistRendererAPI, Renderer } from "./Renderer";
import { WebGL2Context } from "./api/WebGL2/WebGL2Context";

export interface Context<Ctx = unknown> {
	get inner(): Ctx;
	clearColor(r: number, g: number, b: number, a: number): void;
	clear(): void;
	setViewport(x: number, y: number, width: number, height: number): void;
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

export function registerContext(renderer: Renderer) {
	if (!window.__MIST__)
		throw new Error("For some reason mist is not initialized ");
	const nativeContext = renderer.getNativeContext();

	switch (renderer.GetApi()) {
		case MistRendererAPI.WebGL2:
			if (!(nativeContext instanceof WebGL2RenderingContext)) {
				throw new Error(
					"WebGL2 renderer context should be WebGL2RenderingContext"
				);
			}
			break;
		case MistRendererAPI.WebGPU:
			if (!(nativeContext instanceof GPUCanvasContext))
				throw new Error(
					"WebGPU renderer context should be of type GPUCanvasContext"
				);
			break;
		default:
			throw new Error(`Unsupported renderer API '${renderer.GetApi()}'`);
	}

	window.__MIST__.contexts.set(renderer, nativeContext);
}
