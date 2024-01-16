import "./style.css";
import { Application, CreateApplication } from "../../packages";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

class SandboxApp extends Application {
	constructor() {
		super({ name: "SandboxApp", canvas });
	}
	override onUpdate(): void {
		console.log("Client Update function");
	}
}

CreateApplication(() => new SandboxApp());
