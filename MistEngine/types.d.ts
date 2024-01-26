type Values<T> = T[keyof T];
type Keys<T> = keyof T;

interface MistGlobal {
	contexts: WeakMap<Renderer, Context>;
}

interface Window {}

declare var __MIST__: Window["__MIST__"];
