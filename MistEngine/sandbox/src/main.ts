import "./style.css";
import { MistApp, CreateApplication, Mathf } from "../../packages";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class SandboxApp extends MistApp {
	constructor() {
		super({ name: "SandboxApp", canvas });
	}
}

CreateApplication(() => new SandboxApp());
