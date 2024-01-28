/*
  From: 
  https://github.com/mrdoob/eventdispatcher.js
 */

import { MistEvent } from "./MistEvent";

type MistEventListenerCallback = (event: MistEvent) => any;

export interface MistEventDispatcherBase {
	addEventListener(type: string, listener: MistEventListenerCallback): void;
	removeEventListener(type: string, listener: MistEventListenerCallback): void;
	hasEventListener(type: string, listener: MistEventListenerCallback): void;
	dispatchEvent(event: MistEvent): void;
}

export class MistEventDispatcher implements MistEventDispatcherBase {
	private _listeners!: Record<string, MistEventListenerCallback[]>;

	addEventListener(type: string, listener: MistEventListenerCallback) {
		if (this._listeners === undefined) this._listeners = {};

		const listeners = this._listeners;

		if (listeners[type] === undefined) {
			listeners[type] = [];
		}

		if (listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	}

	hasEventListener(type: string, listener: MistEventListenerCallback) {
		if (this._listeners === undefined) return false;

		const listeners = this._listeners;

		return (
			listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
		);
	}

	removeEventListener(type: string, listener: MistEventListenerCallback) {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[type];

		if (listenerArray !== undefined) {
			const index = listenerArray.indexOf(listener);

			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	}

	dispatchEvent(event: MistEvent) {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[event.type];

		if (listenerArray !== undefined) {
			event.target = this;

			// Make a copy, in case listeners are removed while iterating.
			const array = listenerArray.slice(0);

			for (let i = 0, l = array.length; i < l; i++) {
				array[i].call(this, event);
			}
		}
	}
}
