import "./style.css";

import { MistApp, CreateMist } from "../../packages";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas });
	}
}

CreateMist(() => new SandboxApp());
