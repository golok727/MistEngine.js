import { RenderingAPI } from "@mist-engine/renderers/RenderingApi";
import { MistApp } from "./Application";
import { Renderer } from "@mist-engine/renderers";
import MistInput from "./input/Input";

export interface Context {
	readonly App: MistApp;
	readonly Renderer: Renderer;
	readonly RenderAPI: RenderingAPI;
	readonly Input: MistInput;
}
