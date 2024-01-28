type MistEventTypesK =
	| "AppReady"
	| "AppStart"
	| "AppShutDown"
	| "AppRestart"
	| "RendererResize";

interface Window {
	MistEventType: MistEventTypeT;
}
declare var MistEventType: Window["MistEventType"];

type MistEventTypeT = {
	[K in MistEventTypesK]: K;
};

interface MistBaseEvent<T> {
	target: T;
}

interface MistAppReadyEvent extends MistBaseEvent<MistApp> {
	type: MistEventType.AppReady;
}

interface MistAppStartEvent extends MistBaseEvent<MistApp> {
	type: MistEventType.AppStart;
}

interface MistAppShutDownEvent extends MistBaseEvent<MistApp> {
	type: MistEventType.AppShutDown;
}

interface MistAppRestartEvent extends MistBaseEvent<MistApp> {
	type: MistEventType.AppRestart;
}

interface MistRendererResizeEvent extends MistBaseEvent<Renderer> {
	type: MistEventType.RendererResize;
	width: number;
	height: number;
}

interface MistEventMap {
	[MistEventType.AppReady]: MistAppReadyEvent;
	[MistEventType.AppStart]: MistAppStartEvent;
	[MistEventType.AppShutDown]: MistAppShutDownEvent;
	[MistEventType.AppRestart]: MistAppRestartEvent;
	[MistEventType.RendererResize]: MistRendererResizeEvent;
}

type MistEvent =
	| MistAppReadyEvent
	| MistAppStartEvent
	| MistAppShutDownEvent
	| MistAppRestartEvent
	| MistRendererResizeEvent;

type MistEventListenerCallback<E = MistEvent> = (event: E) => any;
