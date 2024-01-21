import {
	MistWebGL2Renderer,
	MistRendererApi,
	MistWebGPURenderer,
	Renderer,
} from "@mist-engine/renderer";
import { LayerStack } from "./LayerStack";
import { Layer } from "./Layer";

import { MistLogger } from "@mist-engine/logger";

import { mistIntro__ } from "@mist-engine/utils";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererApi;
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
			case MistRendererApi.WebGL2:
				this.renderer = new MistWebGL2Renderer(canvas);
				break;

			case MistRendererApi.WebGPU:
				this.renderer = new MistWebGPURenderer(canvas);
				break;

			default:
				throw new Error(`Renderer Api ${rendererAPI} is not supported!`);
		}

		this.renderer; //! ignore
	}

	get name() {
		return this.appName;
	}

	public getRenderer<T extends Renderer>() {
		return this.renderer as T;
	}

	private setRunning(enable: boolean) {
		this.running = enable;
	}

	public Run() {
		this.setRunning(!true); //!
		logger.log("Using {0}", this.renderer.GetApi());
		requestAnimationFrame(this.loop.bind(this));
	}

	// Main Loop
	private loop(time: number) {
		if (!this.running) return;

		const deltaTime = this.lastTime ? time - this.lastTime : this.lastTime;

		requestAnimationFrame(this.loop.bind(this));

		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(deltaTime);
		}

		this.lastTime = time;
	}

	// Layer Stuff
	public pushLayer(layer: Layer) {
		layer.onAttach();
		this.layerStack.pushLayer(layer);
	}

	public popLayer(layer: Layer) {
		layer.onDetach();
		this.layerStack.popLayer(layer);
	}

	public pushOverlay(overlay: Layer) {
		overlay.onAttach();
		this.layerStack.pushOverlay(overlay);
	}

	public popOverlay(overlay: Layer) {
		overlay.onDetach();
		this.layerStack.popOverlay(overlay);
	}
}

export const CreateMist = (setup: () => MistApp) => {
	mistIntro__();

	const app = setup();
	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
	app.Run();

	return () => {};
};
