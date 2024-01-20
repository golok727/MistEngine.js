import {
	MistWebGL2Renderer,
	Renderer,
	MistRendererApi,
	MistWebGPURenderer,
} from "@mist-engine/renderer";

import { MistLogger } from "@mist-engine/logger";

import type { MistRendererApiT } from "@mist-engine/renderer";
import { vec2 } from "..";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererApiT;
};

export class MistApp {
	private appName: string;
	private renderer: Renderer;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		this.appName = name;

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

	getApi<T extends typeof Renderer>(api: T) {
		if (this.renderer instanceof api) {
			return this.renderer as InstanceType<T>;
		}

		throw new Error(`The current renderer is not of type ${api.name}`);
	}

	get name() {
		return this.appName;
	}

	Run() {
		logger.error("{0} is not implemented yet", "MistApp.Run");
	}
}

export const CreateMist = (setup: () => MistApp) => {
	mistIntro__();

	const app = setup();
	logger.log("{0}", "Radhey Shyam");
	logger.log("{0}", "Radha Vallabh Shri Harivansh");

	logger.log(
		"p1 = {0}, \n\t\t p2 = {1}",
		vec2(0).toString(),
		vec2(10).toString()
	);

	console.time("MistLogger");
	logger.info("Using {0}", app.name);
	console.timeEnd("MistLogger");

	console.time("console");
	console.log(`Using ${app.name}`);
	console.timeEnd("console");

	app.Run();
};

//-----------------------------------------------------------

//-----------------------------------------------------------
function mistIntro__() {
	console.log(
		"%c❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️️️️️️️",
		"font-size: 2rem;"
	);
	console.log(
		"%cMist Engine",
		"font-weight: bold; font-size: 3rem; color: transparent; background: linear-gradient(to right, orange, red); padding: 5px; background-clip: text;"
	);
	console.log(
		"%c❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️️️️️️️",
		"font-size: 2rem;"
	);
}
