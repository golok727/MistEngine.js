import "./style.css";

import {
	CreateMist,
	Layer,
	MistApp,
	MistRendererApi,
} from "@mist-engine/index";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class ExampleLayer extends Layer {
	constructor() {
		super("ExampleLayer");
	}

	override onAttach(): void {
		console.log("Layer Attach");
	}

	override onUpdate(_delta: number): void {
		// Each Frame
	}

	override onDetach(): void {}
}

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: MistRendererApi.WebGL2 });
		this.pushLayer(new ExampleLayer());
	}
}

CreateMist(() => new SandboxApp());
