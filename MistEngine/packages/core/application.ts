import {
	WebGL2Renderer,
	Renderer,
	MistRendererApi,
	WebGPURenderer,
} from "@mist-engine/renderer";
import type { MistRendererApiT } from "@mist-engine/renderer";

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererApiT;
};

const ignore = (_?: any) => {};
ignore();

export class MistApp {
	private appName: string;

	private renderer: Renderer;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		this.appName = name;

		// Select renderer API
		switch (rendererAPI) {
			case MistRendererApi.WebGL2:
				this.renderer = new WebGL2Renderer(canvas);
				break;

			case MistRendererApi.WebGPU:
				this.renderer = new WebGPURenderer(canvas);
				break;

			default:
				throw new Error(`Renderer Api ${rendererAPI} is not supported!`);
		}
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
