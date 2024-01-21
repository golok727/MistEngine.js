import "./style.css";

import {
	CreateMist,
	Layer,
	MistApp,
	MistRendererApi,
} from "@mist-engine/index";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class TestLayer extends Layer {
	constructor() {
		super("TestLayer");
	}

	override onAttach(app: SandboxApp): void {
		console.log("Layer Attach: ", this.name);
		const context = app.getRenderer().GetContext();
		context.clearColor(0.2, 0.2, 0.2, 1);
		context.clear();
	}

	override onUpdate(_app: SandboxApp, _delta: number): void {
		// Each Frame
	}

	override onDetach(): void {}
}

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: MistRendererApi.WebGL2 });
		this.pushLayer(TestLayer);
	}
}

CreateMist(() => new SandboxApp());
