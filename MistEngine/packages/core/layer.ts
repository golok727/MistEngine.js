export class Layer {
	private _name: string;
	constructor(name: string) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	public onAttach() {}
	public onUpdate(deltaTime: number) {
		deltaTime;
	}
	public onDetach() {}
}
