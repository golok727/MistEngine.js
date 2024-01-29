import { Context } from "./Context";

export default abstract class Layer {
	private _name: string;

	public onKeyDown?(ev: MistKeyDownEvent): boolean;
	public onKeyUp?(ev: MistKeyUpEvent): boolean;
	public onMouseMove?(ev: MistMouseMoveEvent): boolean;
	public onMouseDown?(ev: MistMouseDownEvent): boolean;
	public onMouseUp?(ev: MistMouseUpEvent): boolean;
	public onMouseWheel?(ev: MistMouseWheelEvent): boolean;

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

	public onDetach() {}
}

export type LayerWithContext<T = Layer> = T & { readonly __context__: Context };
