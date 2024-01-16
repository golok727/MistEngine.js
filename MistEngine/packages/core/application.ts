type ApplicationConstructorProps = { name: string; canvas: HTMLCanvasElement };

export class Application {
	private appName: string;
	// @ts-ignore
	private canvas: HTMLCanvasElement;

	constructor({ name, canvas }: ApplicationConstructorProps) {
		this.appName = name;
		this.canvas = canvas;
	}

	get name() {
		return this.appName;
	}

	protected onUpdate() {}

	run() {
		console.log("Hello from Mist Engine");
		console.log(`App ${this.appName} running...`);
		this.onUpdate();
	}
}

export const CreateApplication = (setup: () => Application) => {
	const app = setup();
	app.run();
};
