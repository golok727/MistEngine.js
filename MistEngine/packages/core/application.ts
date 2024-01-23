import {
	MistRendererAPI,
	Renderer,
	WebGL2Renderer,
} from "@mist-engine/renderers";

import { LayerStack } from "./LayerStack";
import { Layer } from "./Layer";

import { MistLogger } from "@mist-engine/logger";

import { mistIntro__ } from "@mist-engine/utils";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: Omit<"None", MistRendererAPI>;
};

export class MistApp {
	private appName: string;
	private renderer: Renderer;
	private layerStack: LayerStack;
	private running: boolean;
	private lastTime: number;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		this.appName = name;
		this.layerStack = new LayerStack();
		this.running = false;
		this.lastTime = 0;
		// Select renderer API
		switch (rendererAPI) {
			case MistRendererAPI.WebGL2:
				this.renderer = new WebGL2Renderer(canvas);
				break;

			// case MistRendererAPI.WebGPU:
			// 	logger.log("Implement WebGPU Renderer");
			// 	break;

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

		requestAnimationFrame(this.loop.bind(this));

		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(this, deltaTime);
		}

		this.lastTime = time;
	}

	// Layer Stuff
	public pushLayer<T extends new (...args: any[]) => Layer>(
		layerConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const layer = new layerConstructor(...args);

		layer.onAttach(this);
		this.layerStack.pushLayer(layer);
	}

	public pushOverlay<T extends new (...args: any[]) => Layer>(
		overlayConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const overlay = new overlayConstructor(...args);

		overlay.onAttach(this);
		this.layerStack.pushOverlay(overlay);
	}
}

export const CreateMist = (setup: () => MistApp) => {
	mistIntro__();

	const app = setup();
	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
	app.Run();

	return () => {};
};
