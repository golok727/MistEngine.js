import { MistVertexArray } from "./VertexArray";
import { Renderer } from "./Renderer";
import MistWebGL2RenderingAPI from "./api/WebGL2/WebGL2RenderingAPI";

export interface RenderingAPI<Ctx = unknown> {
	get inner(): Ctx;
	SetClearColor(r: number, g: number, b: number, a: number): void;
	Clear(): void;
	SetViewport(x: number, y: number, width: number, height: number): void;
	DrawIndexed(vertexArray: MistVertexArray): void;
}

export function getGpuRenderingContext(renderer: Renderer): GPUCanvasContext {
	throw new Error(
		`getGpuContext for ${renderer.GetApiType} is not implemented`
	);
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
