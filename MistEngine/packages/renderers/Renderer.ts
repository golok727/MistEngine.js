import { MistVertexArray } from "./VertexArray";
import { RenderingAPI } from "./RenderingApi";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer<Ctx = unknown> {
	GetRenderAPI(): RenderingAPI<Ctx>;
	GetApi(): MistRendererAPI;
	getWidth(): number;
	getHeight(): number;
	getNativeContext(): Ctx;
	BeginScene(): void;
	Submit(vertexArray: MistVertexArray): void;
	EndScene(): void;
}

export interface MistAPIUsable {
	use(): void;
	detach(): void;
	delete(): void;
}
