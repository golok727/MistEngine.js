import "./style.css";

import { CreateMist, MistApp } from "../../packages";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas, rendererAPI: "webgl2" });
	}
}

CreateMist(() => new SandboxApp());
