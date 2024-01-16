type ApplicationConstructorProps = { name: string; canvas: HTMLCanvasElement };

const ignore = (_: any) => {};
export class MistApp {
	private appName: string;

	private canvas: HTMLCanvasElement;
	private gl: WebGL2RenderingContext;

	constructor({ name, canvas }: ApplicationConstructorProps) {
		this.appName = name;
		this.canvas = canvas;
		const gl = canvas.getContext("webgl2");

		// Todo better error handling
		if (!gl) throw new Error("WebGL2 is not supported in your browser");
		this.gl = gl;

		ignore(this.canvas);
		ignore(this.gl);
	}

	get name() {
		return this.appName;
	}

	run() {
		console.log(
			"%cMist Engine",
			"font-weight: bold; font-size: 3rem; color: transparent; background: linear-gradient(to right, orange, red); padding: 5px; background-clip: text;"
		);

		console.log(`App '${this.appName}' running...`);
	}
}

export const CreateApplication = (setup: () => MistApp) => {
	const app = setup();
	app.run();
};
