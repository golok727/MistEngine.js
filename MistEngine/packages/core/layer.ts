import { MistApp } from "..";

export class Layer {
	private _name: string;
	public _app!: MistApp;
	constructor(name: string) {
		this._name = name;
	}

	get name() {
		return this._name;
	}
	link(app: MistApp) {
		this._app = app;
	}

	get app() {
		return this._app;
	}

	public onAttach() {}
	public onUpdate(deltaTime: number) {
		deltaTime;
	}
	public onDetach() {}
}
