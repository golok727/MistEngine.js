import { MistVertexArray } from "./VertexArray";
import { RenderingAPI } from "./RenderingApi";
import { MistEventDispatcher } from "@mist-engine/core/Events";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer<Ctx = unknown> extends MistEventDispatcher {
	GetRenderAPI(): RenderingAPI<Ctx>;
	GetApi(): MistRendererAPI;
	Resize(): void;
	get width(): number;
	get height(): number;
	get aspect(): number;
	getNativeContext(): Ctx;
	BeginScene(): void;
	Submit(vertexArray: MistVertexArray): void;
	EndScene(): void;
}

export interface MistAPIUsable {
	use(): void;
	use(slot: number): void;
	detach(): void;
	delete(): void;
}
