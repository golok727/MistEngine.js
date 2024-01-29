import { Context } from "./Context";

export default class Layer {
	private _name: string;
	constructor(name: string) {
		this._name = name;
	}

	get name() {
		return this._name;
	}

	protected getContext(): Context {
		const _this = this as LayerWithContext<this>;
		return _this.__context__;
	}

	public onAttach() {}

	public onUpdate(_deltaTime: number) {}

	public onKeyDown() {}
	public onKeyUp() {}

	public onMouseMove() {}
	public onMouseDown() {}
	public onMouseUp() {}

	public onDetach() {}
}

export type LayerWithContext<T = Layer> = T & { readonly __context__: Context };
