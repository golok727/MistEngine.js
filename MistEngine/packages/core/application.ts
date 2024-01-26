import "./polyfill";

import {
	MistRendererAPI,
	Renderer,
	MistWebGL2Renderer,
} from "@mist-engine/renderers";

import { LayerStack } from "@mist-engine/core/LayerStack";
import { Layer } from "@mist-engine/core/Layer";

import type { LayerWithContext } from "@mist-engine/core/Layer";

import { MistLogger } from "@mist-engine/logger";

import { mistIntro__, uuid } from "@mist-engine/utils";
import { Context } from "./Context";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: Omit<"None", MistRendererAPI>;
};

export class MistApp {
	private _id: string;
	private appName: string;
	private renderer: Renderer;
	private layerStack: LayerStack;
	private running: boolean;
	private lastTime: number;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		this._id = uuid();
		this.appName = name;
		this.layerStack = new LayerStack();
		this.running = false;
		this.lastTime = 0;
		// Select renderer API
		switch (rendererAPI) {
			case MistRendererAPI.WebGL2:
				this.renderer = new MistWebGL2Renderer(canvas);
				break;

			case MistRendererAPI.WebGPU:
				logger.error("Implement WebGPU Renderer");
				throw "";

			default:
				throw new Error(`Renderer Api ${rendererAPI} is not supported!`);
		}
	}

	get name() {
		return this.appName;
	}

	public getRenderer() {
		return this.renderer;
	}
	public getRenderingAPI() {
		return this.renderer.GetRenderAPI();
	}

	private setRunning(enable: boolean) {
		this.running = enable;
	}

	public Run() {
		this.setRunning(true); //!
		logger.log("Using {0}", this.renderer.GetApi());

		requestAnimationFrame(this.loop.bind(this));
	}

	// Main Loop
	private loop(time: number) {
		if (!this.running) return;

		const deltaTime = this.lastTime ? time - this.lastTime : this.lastTime;

		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(deltaTime);
		}

		this.lastTime = time;
		requestAnimationFrame(this.loop.bind(this));
	}

	// Layer Stuff
	public pushLayer<T extends new (...args: any[]) => Layer>(
		layerConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const layer = new layerConstructor(...args);
		this.attachAppToLayer(layer as LayerWithContext);
		layer.onAttach();
		this.layerStack.pushLayer(layer);
	}

	public pushOverlay<T extends new (...args: any[]) => Layer>(
		overlayConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const overlay = new overlayConstructor(...args);
		this.attachAppToLayer(overlay as LayerWithContext);

		overlay.onAttach();
		this.layerStack.pushOverlay(overlay);
	}

	private attachAppToLayer(layer: LayerWithContext) {
		const context: Context = {
			App: this,
			RenderAPI: this.renderer.GetRenderAPI(),
			Renderer: this.renderer,
		};

		Object.defineProperty(layer, "__context__", {
			value: context,
			writable: false,
		});
	}
}

export const CreateMistApp = async (
	setup: () => Promise<MistApp> | MistApp
) => {
	mistIntro__();
	let mayBePromiseApp = setup();
	let app: MistApp;
	if (mayBePromiseApp instanceof Promise) app = await mayBePromiseApp;
	else app = mayBePromiseApp;
	app.Run();

	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
};
