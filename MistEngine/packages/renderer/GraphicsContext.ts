export class GraphicsContext<T> {
	protected canvas: HTMLCanvasElement;
	protected context!: T;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	// @ts-ignore
	clearColor(r: number, g: number, b: number, a: number) {}

	clear() {}

	get inner() {
		return this.context;
	}
}
