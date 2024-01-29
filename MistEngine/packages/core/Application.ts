import "./MistGlobalFill";

import {
	MistRendererAPI,
	Renderer,
	MistWebGL2Renderer,
} from "@mist-engine/renderers";

import LayerStack from "@mist-engine/core/LayerStack";
import Layer from "@mist-engine/core/Layer";
import MistInput from "@mist-engine/core/Input/Input";

import type { LayerWithContext } from "@mist-engine/core/Layer";

import { MistLogger } from "@mist-engine/logger";

import { mistIntro__ } from "@mist-engine/utils";
import { Context } from "./Context";
import { MistEventDispatcher } from "@mist-engine/core/Events";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: Omit<"None", MistRendererAPI>;
};

export class MistApp extends MistEventDispatcher {
	// private _id: string;
	private _allowPerformanceMetrics: boolean;
	private currentFrameId?: number;
	private appName: string;
	private renderer: Renderer;
	private input: MistInput;
	private layerStack: LayerStack;
	private isRunning: boolean;
	private lastTime: number;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		// this._id = uuid();
		super();
		this._allowPerformanceMetrics = !import.meta.env.PROD; // for now
		this.appName = name;
		this.layerStack = new LayerStack();
		this.input = new MistInput(canvas);
		this.isRunning = false;
		this.lastTime = 0;

		switch (rendererAPI) {
			case MistRendererAPI.WebGL2:
				this.renderer = new MistWebGL2Renderer(canvas);
				break;

			case MistRendererAPI.WebGPU:
				logger.error("Implement WebGPU Renderer");
				throw "";

			default:
				throw new Error(`Renderer Api ${rendererAPI} is not supported!`);
		}

		/*  Performance Measure Should be moved in to this */

		this.initPerformanceMatrices();
		/* Initialize Mist Input */
		MistInput.Init();
		this.addInputEventListeners();
	}

	get name() {
		return this.appName;
	}

	public getRenderer() {
		return this.renderer;
	}

	public getRenderingAPI() {
		return this.renderer.GetRenderAPI();
	}

	private initPerformanceMatrices() {
		if (this._allowPerformanceMetrics)
			Object.assign(this, {
				__performance: {
					averageFPS: 0,
					fpsMeasureStack: [],
				},
			});
	}

	private updatePerformanceMatrices(_now: number) {}

	private setRunning(enable: boolean) {
		this.isRunning = enable;
	}

	public Run() {
		if (this.isRunning)
			throw new Error(`App: '${this.name}' is already running!`);

		this.dispatchEvent({ type: MistEventType.AppStart, target: this });

		this.setRunning(true);
		logger.log("Using {0}", this.renderer.GetApi());
		this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
	}
	/*
	  Pauses a application and can restart with the Run() fn 
	 */
	public Pause() {
		this._stop();
	}

	/*
	 Completely kills the App and remove alls the input events. Global keyboard events are preserved 
	 */
	public ShutDown() {
		this._stop();
		this.dispatchEvent({ type: MistEventType.AppShutDown, target: this });
		this.input.destroy();
	}

	/*
	  Stops and restarts the app 
	 */
	public Restart() {
		this._restartApp();
	}

	// Main Loop
	private loop(timestamp: number) {
		if (!this.isRunning) return;

		if (this._allowPerformanceMetrics)
			this.updatePerformanceMatrices(timestamp);

		if (!this.lastTime) this.lastTime = timestamp;

		const deltaTime = timestamp - this.lastTime;

		this.renderer.Resize();
		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(deltaTime);
		}

		this.lastTime = timestamp;

		this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
	}

	private _stop() {
		if (this.currentFrameId) cancelAnimationFrame(this.currentFrameId);
		this.setRunning(false);
		this.currentFrameId = undefined;
	}

	private _restartApp() {
		this._stop();
		this.dispatchEvent({ type: MistEventType.AppRestart, target: this });
		this.Run();
	}

	// Layer Stuff
	public pushLayer<T extends new (...args: any[]) => Layer>(
		layerConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const layer = new layerConstructor(...args);
		this.provideContextToLayer(layer as LayerWithContext);
		layer.onAttach();
		this.layerStack.pushLayer(layer);
	}

	public pushOverlay<T extends new (...args: any[]) => Layer>(
		overlayConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const overlay = new overlayConstructor(...args);
		this.provideContextToLayer(overlay as LayerWithContext);

		overlay.onAttach();
		this.layerStack.pushOverlay(overlay);
	}

	/* 
		Add Events for inputs
	*/

	// prettier-ignore
	private addInputEventListeners() {
		MistInput.globalDispatch.addEventListener(MistEventType.KeyDown, this.onInputKeyDown);
		MistInput.globalDispatch.addEventListener(MistEventType.KeyUp, this.onInputKeyUp);

		this.input.addEventListener(MistEventType.MouseDown, this.onInputMouseDown);
		this.input.addEventListener(MistEventType.MouseMove, this.onInputMouseMove);
		this.input.addEventListener(MistEventType.MouseUp, this.onInputMouseUp);
		this.input.addEventListener(MistEventType.MouseWheel, this.onInputMouseWheel);

		// removal of events will be handled by 
	}
	private onInputKeyDown: MistEventListenerCallback<MistKeyDownEvent> = (
		ev
	) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onKeyDown && layer.onKeyDown(ev);
		}
	};

	private onInputKeyUp: MistEventListenerCallback<MistKeyUpEvent> = (ev) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onKeyUp && layer.onKeyUp(ev);
		}
	};

	private onInputMouseDown: MistEventListenerCallback<MistMouseDownEvent> = (
		ev
	) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onMouseDown && layer.onMouseDown(ev);
		}
	};

	private onInputMouseUp: MistEventListenerCallback<MistMouseUpEvent> = (
		ev
	) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onMouseUp && layer.onMouseUp(ev);
		}
	};
	private onInputMouseMove: MistEventListenerCallback<MistMouseMoveEvent> = (
		ev
	) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onMouseMove && layer.onMouseMove(ev);
		}
	};

	private onInputMouseWheel: MistEventListenerCallback<MistMouseWheelEvent> = (
		ev
	) => {
		for (const layer of this.layerStack.reversed()) {
			layer.onMouseWheel && layer.onMouseWheel(ev);
		}
	};

	/*
		Provide context for each layer when a layer is created
 */
	private provideContextToLayer(layer: LayerWithContext) {
		const context: Context = {
			App: this,
			RenderAPI: this.renderer.GetRenderAPI(),
			Renderer: this.renderer,
			Input: this.input,
		};

		Object.defineProperty(layer, "__context__", {
			value: context,
			writable: false,
		});
	}
}

export const CreateMistApp = async (
	setup: () => Promise<MistApp> | MistApp
) => {
	mistIntro__();
	let mayBePromiseApp = setup();
	let app: MistApp;
	if (mayBePromiseApp instanceof Promise) app = await mayBePromiseApp;
	else app = mayBePromiseApp;
	app.Run();
	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
};

// Loop with custom framerate
// private loop(timestamp: number) {
// 	if (!this.isRunning) return;

// 	if (this._allowPerformanceMetrics)
// 		this.updatePerformanceMatrices(timestamp);

// 	if (!this.lastTime) this.lastTime = timestamp;

// 	const interval = 1000 / 90;
// 	const deltaTime = timestamp - this.lastTime;

// 	if (deltaTime > interval) {
// 		this.renderer.Resize();
// 		for (const layer of this.layerStack.reversed()) {
// 			layer.onUpdate(deltaTime);
// 		}
// 		this.lastTime = timestamp - (deltaTime % interval);
// 	}

// 	this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
// }
