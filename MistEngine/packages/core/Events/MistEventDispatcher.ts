/*
  Extended From: 
  https://github.com/mrdoob/eventdispatcher.js
 */

interface MistEventDispatcherBase {
	addEventListener(type: string, listener: MistEventListenerCallback): void;
	removeEventListener(type: string, listener: MistEventListenerCallback): void;
	hasEventListener(type: string, listener: MistEventListenerCallback): boolean;
	// dispatchEvent(event: MistEvent): void;
}

export default class MistEventDispatcher implements MistEventDispatcherBase {
	private _listeners!: Record<string, Set<MistEventListenerCallback<any>>>;

	addEventListener<K extends keyof MistEventMap>(
		type: K,
		listener: MistEventListenerCallback<MistEventMap[K]>
	): void {
		if (this._listeners === undefined) this._listeners = {};
		const listeners = this._listeners;

		if (listeners[type] === undefined) {
			listeners[type] = new Set();
		}

		listeners[type].add(listener);
	}

	hasEventListener<K extends keyof MistEventMap>(
		type: K,
		listener: MistEventListenerCallback<MistEventMap[K]>
	): boolean {
		if (this._listeners === undefined) return false;

		const listeners = this._listeners;

		return listeners[type] !== undefined && listeners[type].has(listener);
	}

	removeEventListener<K extends keyof MistEventMap>(
		type: K,
		listener: MistEventListenerCallback<MistEventMap[K]>
	): void {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[type];

		listenerArray.delete(listener);
	}

	protected dispatchEvent<E extends MistEvent>(event: E): void {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerSet = listeners[event.type];

		if (listenerSet !== undefined) {
			// Make a copy, in case listeners are removed while iterating.
			const cloneSet = new Set(listenerSet);
			cloneSet.forEach((listener) => listener.call(this, event));
		}
	}
	protected makeEvent<K extends keyof MistEventMap>(
		type: K,
		event: Omit<MistEventMap[K], "type">
	): MistEventMap[K] {
		const ev = event as any;
		Object.defineProperty(ev, "type", {
			value: type,
		});
		return ev as MistEventMap[K];
	}
}
