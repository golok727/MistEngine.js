import {
	MistWebGL2Renderer,
	Renderer,
	MistRendererApi,
	MistWebGPURenderer,
} from "@mist-engine/renderer";
import { LayerStack } from "@mist-engine/core/layerStack";
import { Layer } from "@mist-engine/core/layer";

import { MistLogger } from "@mist-engine/logger";

import type { MistRendererApiT } from "@mist-engine/renderer";
import { mistIntro__ } from "@mist-engine/utils";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererApiT;
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

	public getApi() {
		return this.renderer;
	}

	private setRunning(enable: boolean) {
		this.running = enable;
	}

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

	private loop(time: number) {
		if (!this.running) return;

		const deltaTime = this.lastTime ? time - this.lastTime : this.lastTime;

		requestAnimationFrame(this.loop.bind(this));

		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(deltaTime);
		}

		this.lastTime = time;
	}

	public Run() {
		this.setRunning(true);
		requestAnimationFrame(this.loop.bind(this));
	}
}

export const CreateMist = (setup: () => MistApp) => {
	mistIntro__();

	const app = setup();
	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
	app.Run();
};
