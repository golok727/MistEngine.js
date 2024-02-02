import {
	MistRendererAPI,
	MistWebGL2Renderer,
	Renderer,
} from "@mist-engine/renderers";
import { MistEventDispatcher } from "./Events";
import LayerStack from "./LayerStack";
import MistInput from "./Input/Input";
import { Context } from "./Context";
import Layer, { LayerWithContext } from "./Layer";
import { MistLogger } from "@mist-engine/logger";
import MistAppManager from "./MistAppManager";

const logger = new MistLogger({ name: "App" });

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererAPI;
};

type AppWithPerformanceMeasure = MistAppBase & {
	__performance__: {
		averageFPS: number;
		fpsReadings: number[];
		performanceLastTime: number;
	};
};

export default abstract class MistAppBase extends MistEventDispatcher {
	protected _allowPerformanceMetrics: boolean;
	protected appName: string;
	protected input: MistInput;
	protected layerStack: LayerStack;
	protected renderer!: Renderer;

	protected isRunning: boolean;
	protected lastTime: number;
	protected currentFrameId?: number;

	constructor({ name, canvas, rendererAPI }: ApplicationConstructorProps) {
		super();
		this._allowPerformanceMetrics = !import.meta.env.PROD; // for now
		this.appName = name;
		this.layerStack = new LayerStack();
		this.input = new MistInput(canvas);
		this.isRunning = false;
		this.lastTime = 0;

		this.initRenderer(rendererAPI, canvas);

		this.initPerformanceMatrices();
		MistInput.Init();
		this.addInputEventListeners();
	}

	get name() {
		return this.appName;
	}
	get performance() {
		const _this = this as any as AppWithPerformanceMeasure;

		if (!_this || !this._allowPerformanceMetrics) {
			return { averageFps: 0 };
		}

		const avgFps = _this.__performance__.averageFPS;

		return { averageFps: avgFps };
	}
	public getRenderer() {
		return this.renderer;
	}

	public getRenderingAPI() {
		return this.renderer.GetRenderAPI();
	}

	protected setRunning(enable: boolean) {
		this.isRunning = enable;
	}

	public Run() {
		this._run();
	}

	/*
  Pauses a Mist Application
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

	protected onAttach() {
		throw new Error("MistAppBase: onAttach should be overridden");
	}

	protected onTick(_delta: number) {
		throw new Error("MistAppBase: onTick Method should be overridden");
	}

	protected onDetach() {
		throw new Error("MistAppBase: onDetach should be overridden");
	}

	private loop(timestamp: number) {
		if (!this.isRunning) return;
		const delta = timestamp - this.lastTime;

		if (this._allowPerformanceMetrics) this.updatePerformanceMatrices(delta);

		if (!this.lastTime) this.lastTime = timestamp;

		MistAppManager.setCurrent(this);
		this.renderer.Resize();

		this.onTick(delta);

		this.lastTime = timestamp;
		this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
	}

	private updatePerformanceMatrices(
		delta: number,
		updateInterval: number = 1000
	) {
		if (!delta) return;
		const fps = 1000 / delta;
		const _this = this as any as AppWithPerformanceMeasure;
		if (!_this) return;
		_this.__performance__.fpsReadings.push(fps);

		const now = performance.now();
		const lastTime = _this.__performance__.performanceLastTime;

		if (now - lastTime > updateInterval) {
			const readings = _this.__performance__.fpsReadings;

			const averageFPS = readings.reduce((s, c) => c + s, 0) / readings.length;

			_this.__performance__.averageFPS = averageFPS;
			_this.__performance__.fpsReadings = [];
			_this.__performance__.performanceLastTime = now;
		}
	}

	private _run() {
		if (this.isRunning)
			throw new Error(`App: '${this.appName}' is already running!`);

		this.dispatchEvent({ type: MistEventType.AppStart, target: this });

		MistAppManager.setCurrent(this);
		this.onAttach();

		this.setRunning(true);
		logger.log("Using {0}", this.renderer.GetApiType());
		this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
	}
	private _stop() {
		if (this.currentFrameId) cancelAnimationFrame(this.currentFrameId);
		this.setRunning(false);
		this.currentFrameId = undefined;

		MistAppManager.setCurrent(this);
		for (const layer of this.layerStack.reversed()) layer.onDetach();
	}

	private _restartApp() {
		this._stop();
		this.dispatchEvent({ type: MistEventType.AppRestart, target: this });
		this.Run();
	}

	private initRenderer(
		rendererAPI: MistRendererAPI,
		canvas: HTMLCanvasElement
	) {
		switch (rendererAPI) {
			case MistRendererAPI.WebGL2:
				this.renderer = new MistWebGL2Renderer(canvas);
				break;

			case MistRendererAPI.WebGPU:
				throw new Error("Implement WebGPU Renderer");

			default:
				throw new Error(`Renderer Api ${rendererAPI} is not supported!`);
		}
	}

	protected pushLayer<T extends new (...args: any[]) => Layer>(
		layerConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const layer = new layerConstructor(...args);
		this.provideContextToLayer(layer as LayerWithContext);
		this.layerStack.pushLayer(layer);
	}

	protected pushOverlay<T extends new (...args: any[]) => Layer>(
		overlayConstructor: T,
		...args: ConstructorParameters<T>
	) {
		const overlay = new overlayConstructor(...args);
		this.provideContextToLayer(overlay as LayerWithContext);

		this.layerStack.pushOverlay(overlay);
	}

	private provideContextToLayer(layer: LayerWithContext) {
		const context: Context = {
			App: this as any,
			RenderAPI: this.renderer.GetRenderAPI(),
			Renderer: this.renderer,
			Input: this.input,
		};

		Object.defineProperty(layer, "__context__", {
			value: context,
			writable: false,
		});
	}

	private initPerformanceMatrices() {
		if (this._allowPerformanceMetrics)
			Object.assign(this, {
				__performance__: {
					averageFPS: 0,
					fpsReadings: [],
					performanceLastTime: 0,
				},
			});
	}

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
}
