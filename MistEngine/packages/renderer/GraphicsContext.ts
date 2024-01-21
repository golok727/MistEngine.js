export class GraphicsContext<T> {
	protected canvas: HTMLCanvasElement;
	protected context!: T;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}
}
