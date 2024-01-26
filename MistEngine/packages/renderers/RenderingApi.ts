import { MistVertexArray } from "./VertexArray";
import { MistRendererAPI, Renderer } from "./Renderer";
import MistWebGL2RenderingAPI from "./api/WebGL2/WebGL2RenderingAPI";

export interface RenderingAPI<Ctx = unknown> {
	get inner(): Ctx;
	SetClearColor(r: number, g: number, b: number, a: number): void;
	Clear(): void;
	SetViewport(x: number, y: number, width: number, height: number): void;
	Resize(onResize?: () => void): void;
	DrawIndexed(vertexArray: MistVertexArray): void;
}

export function getGpuRenderingContext(renderer: Renderer): GPUCanvasContext {
	throw new Error(`getGpuContext for ${renderer.GetApi} is not implemented`);
}

export function getGLRenderingContext(
	renderer: Renderer
): WebGL2RenderingContext {
	const renderAPI = renderer.GetRenderAPI();

	// Check if the context is webgl2 context
	if (!(renderAPI instanceof MistWebGL2RenderingAPI)) {
		throw new Error(
			"This buffer should be used within the WebGL2 rendering context"
		);
	}

	return renderAPI.inner;
}

export function registerContextToGlobalMist(renderer: Renderer) {
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
