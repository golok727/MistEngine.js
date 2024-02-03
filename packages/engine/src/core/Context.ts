import { RenderingAPI } from "../renderers/RenderingApi";
import { MistApp } from "./Application";
import { Renderer } from "../renderers";
import MistInput from "./Input/Input";

export interface Context {
	readonly App: MistApp;
	readonly Renderer: Renderer;
	readonly RenderAPI: RenderingAPI;
	readonly Input: MistInput;
}
