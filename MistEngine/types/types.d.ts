type Values<T> = T[keyof T];
type Keys<T> = keyof T;

interface MistGlobal {
	contexts: WeakMap<Renderer, Context>;
}

declare var __MIST__: Window["__MIST__"];

interface Window {
	MistEventType: MistEventTypeT;
}
declare var MistEventType: Window["MistEventType"];
