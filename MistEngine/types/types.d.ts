type Values<T> = T[keyof T];
type Keys<T> = keyof T;

interface MistGlobal {
	currentAppInstance: import("@mist-engine/core/Application").MistApp | null;
}

declare var __MIST__: Window["__MIST__"];

interface Window {
	MistEventType: MistEventTypeT;
	__MIST__: MistGlobal;
}
declare var MistEventType: Window["MistEventType"];
