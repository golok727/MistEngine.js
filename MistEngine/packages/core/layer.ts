import { MistApp } from "..";

export class Layer {
	private _name: string;
	constructor(name: string) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	public onAttach(_app: MistApp) {}
	public onUpdate(_app: MistApp, deltaTime: number) {
		deltaTime;
	}

	public onEvent(_type: string, _app: MistApp) {}

	public onDetach(_app: MistApp) {}
}
