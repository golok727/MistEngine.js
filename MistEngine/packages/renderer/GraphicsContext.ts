export class GraphicsContext<T> {
	protected canvas: HTMLCanvasElement;
	protected context!: T;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	clearColor(_r: number, _g: number, _b: number, _a: number) {}

	clear() {}

	get inner() {
		return this.context;
	}
}
