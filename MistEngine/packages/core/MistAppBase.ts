import { mistIntro__ } from "@mist-engine/utils";
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

export type ApplicationConstructorProps = {
	name: string;
	canvas: HTMLCanvasElement;
	rendererAPI: MistRendererAPI;
};

export default abstract class MistAppBase extends MistEventDispatcher {
	protected appName: string;
	protected _allowPerformanceMetrics: boolean;
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

	protected setRunning(enable: boolean) {
		this.isRunning = enable;
	}

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

	protected onTick(_timestamp: number) {
		throw new Error("onTick Method should be overridden");
	}

	private updatePerformanceMatrices(_now: number) {}

	private loop(timestamp: number) {
		if (!this.isRunning) return;

		if (this._allowPerformanceMetrics)
			this.updatePerformanceMatrices(timestamp);

		if (!this.lastTime) this.lastTime = timestamp;

		this.renderer.Resize();
		this.onTick(timestamp);

		this.lastTime = timestamp;
		this.currentFrameId = requestAnimationFrame(this.loop.bind(this));
	}

	public Run() {
		if (this.isRunning)
			throw new Error(`App: '${this.appName}' is already running!`);

		this.dispatchEvent({ type: MistEventType.AppStart, target: this });

		this.setRunning(true);
		console.log("Using {0}", this.renderer.GetApi());
		this.currentFrameId = requestAnimationFrame(this.onTick.bind(this));
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
				__performance: {
					averageFPS: 0,
					fpsMeasureStack: [],
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
