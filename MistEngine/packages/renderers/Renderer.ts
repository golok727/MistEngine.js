import { MistVertexArray } from "./VertexArray";
import { RenderingAPI } from "./RenderingApi";
import { MistEventDispatcher } from "@mist-engine/core/Events";
import { Camera } from "@mist-engine/cameras";

import { MistShader } from "@mist-engine/renderers";
import { Matrix4 } from "@mist-engine/math/mat4";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer<API = unknown> extends MistEventDispatcher {
	GetRenderAPI(): RenderingAPI<API>;
	GetApiType(): MistRendererAPI;
	Resize(): void;
	get width(): number;
	get height(): number;

	get canvasWidth(): number;
	get canvasHeight(): number;

	get aspect(): number;
	getNativeContext(): API;
	BeginScene(camera: Camera): void;
	Submit(
		vertexArray: MistVertexArray,
		shader: MistShader,
		transform: Matrix4
	): void;
	EndScene(): void;
	Is<T extends Renderer>(): this is T;
}

export interface MistAPIUsable {
	use(): void;
	use(slot: number): void;
	detach(): void;
	delete(): void;
}
