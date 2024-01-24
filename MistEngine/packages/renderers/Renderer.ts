import { Context } from "./Context";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer<Ctx = unknown> {
	api: MistRendererAPI;
	GetContext(): Context<Ctx>;
	GetApi(): Renderer["api"];
	getWidth(): number;
	getHeight(): number;
	getNativeContext(): Ctx;
}

export interface MistAPIUsable {
	use(): void;
	detach(): void;
	delete(): void;
}
