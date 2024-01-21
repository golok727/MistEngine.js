import { GraphicsContext } from "@mist-engine/renderer/GraphicsContext";

export class WebGPUContext extends GraphicsContext<GPUCanvasContext> {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
		if (!navigator.gpu)
			throw new Error("WEBGPU is not supported in your browser");

		const context = canvas.getContext("webgpu");
		if (!context) throw new Error("Error getting webgpu context");
		this.context = context;
	}
}
