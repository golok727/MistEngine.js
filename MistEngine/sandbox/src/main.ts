import "./style.css";

import { CreateMist, Layer, MistApp } from "../../packages";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class ExampleLayer extends Layer {
	constructor() {
		super("ExampleLayer");
	}

	override onAttach(): void {}

	override onUpdate(_delta: number): void {
		// Each Frame
	}

	override onDetach(): void {}
}
class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: "webgl2" });
		this.pushLayer(new ExampleLayer());
	}
}

CreateMist(() => new SandboxApp());
