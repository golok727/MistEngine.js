import { Context } from "./Context";

export enum MistRendererAPI {
	WebGL2 = "WebGL2",
	WebGPU = "WebGPU",
	None = "None",
}

export interface Renderer<Ctx = unknown> {
	GetContext(): Context<Ctx>;
	GetApi(): MistRendererAPI;
	getWidth(): number;
	getHeight(): number;
	getNativeContext(): Ctx;
}

export interface MistAPIUsable {
	use(): void;
	detach(): void;
	delete(): void;
}
