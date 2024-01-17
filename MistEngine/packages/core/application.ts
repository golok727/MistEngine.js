import {
	MistWebGL2Renderer,
	Renderer,
	MistRendererApi,
	MistWebGPURenderer,
} from "@mist-engine/renderer";
import type { MistRendererApiT } from "@mist-engine/renderer";

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
		mistLog__();
	}
}

export const CreateMist = (setup: () => MistApp) => {
	const app = setup();
	app.Run();
};

//-----------------------------------------------------------

//-----------------------------------------------------------
function mistLog__() {
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
