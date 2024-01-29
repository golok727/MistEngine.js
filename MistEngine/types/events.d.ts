//! May add handled?

interface MistBaseEvent<T> {
	target: T;
}
interface MistAppReadyEvent extends MistBaseEvent<MistApp> {
	type: MistEventTypeT["AppReady"];
}

interface MistAppStartEvent extends MistBaseEvent<MistApp> {
	type: MistEventTypeT["AppStart"];
}

interface MistAppShutDownEvent extends MistBaseEvent<MistApp> {
	type: MistEventTypeT["AppShutDown"];
}

interface MistAppRestartEvent extends MistBaseEvent<MistApp> {
	type: MistEventTypeT["AppRestart"];
}

interface MistRendererResizeEvent extends MistBaseEvent<Renderer> {
	type: MistEventTypeT["RendererResize"];
	width: number;
	height: number;
}
class MistInput {
	public static isPressed(key: MistKey): boolean;
	public static arePressed(...keys: MistKey[]): boolean;
	public static anyPressed(...keys: MistKey[]): boolean;

	public isPressed(key: MistKey): boolean;
	public arePressed(...keys: MistKey[]): boolean;
	public anyPressed(...keys: MistKey[]): boolean;
}
// Global Keyboard
interface MistKeyUpEvent extends MistBaseEvent<typeof MistInput> {
	type: MistEventTypeT["KeyUp"];
	key: MistKey;
	native: KeyboardEvent;
}

interface MistKeyDownEvent extends MistBaseEvent<typeof MistInput> {
	type: MistEventTypeT["KeyDown"];
	key: MistKey;
	native: KeyboardEvent;
}

// Mouse

interface MistMouseDownEvent extends MistBaseEvent<MistInput> {
	type: MistEventTypeT["MouseDown"];
	x: number;
	y: number;
	button: ElementInputState["mouse"]["button"];
	native: MouseEvent;
}

interface MistMouseUpEvent extends MistBaseEvent<MistInput> {
	type: MistEventTypeT["MouseUp"];
	x: number;
	y: number;
	button: ElementInputState["mouse"]["button"];
	native: MouseEvent;
}

interface MistMouseMoveEvent extends MistBaseEvent<MistInput> {
	type: MistEventTypeT["MouseMove"];
	x: number;
	y: number;
	isDown: boolean;
	button: ElementInputState["mouse"]["button"];
	native: MouseEvent;
}

interface MistMouseWheelEvent extends MistBaseEvent<MistInput> {
	type: MistEventTypeT["MouseWheel"];

	deltaX: number;
	deltaY: number;
	dirX: number;
	dirY: number;

	native: WheelEvent;
}
