/*
  MistInput
  Singleton design for the Keyboard input
  Separated mouse events for canvas elements
*/

import MistKey from "./MistKey";

type MistInputMap = Record<string, boolean>;

type GlobalInputState = {
	inputMap: MistInputMap;
	destroyFn?: () => void;
};

type ElementInputState = {
	mouse: {
		mouseX: number;
		mouseY: number;
		isDown: boolean;
		buttons: {
			left: boolean;
			right: boolean;
			middle: boolean;
			b4: boolean;
			b5: boolean;
		};
		wheel: {
			isActive: boolean;
			deltaX: number;
			deltaY: number;
			dirX: number;
			dirY: number;
		};
	};
	destroyFn?: () => void;
	// TODO add dragState
};

/** 
	global and local input system for mist
 */

export default class MistInput {
	private static _isInitialized = false;
	private static GlobalInputState: GlobalInputState;
	private static preventDefaultBehavior: boolean = false;

	private state: ElementInputState;

	constructor(element: HTMLElement) {
		this.state = {
			mouse: {
				mouseX: 0,
				mouseY: 0,
				isDown: false,
				buttons: {
					left: false,
					middle: false,
					right: false,
					b4: false,
					b5: false,
				},

				wheel: {
					isActive: false,
					deltaX: 0,
					deltaY: 0,
					dirX: 1,
					dirY: 1,
				},
			},
		};

		this.addEventListeners(element);
	}

	/*	
		Destroys the input for the element initialized with
	*/
	public destroy() {
		this.state.destroyFn && this.state.destroyFn();
		this.reset();
	}
	/** Returns if a key is pressed or not */
	public isPressed(key: MistKey): boolean {
		return MistInput.GlobalInputState.inputMap[key];
	}

	public arePressed(...keys: MistKey[]): boolean {
		return keys.every((key) => MistInput.GlobalInputState.inputMap[key]);
	}

	public anyPressed(...keys: MistKey[]): boolean {
		return keys.some((key) => MistInput.GlobalInputState.inputMap[key]);
	}
	/*
		Tells Mist Input input to enable or disable default behavior
	 */
	public setAllowDefaultBehavior(enable: boolean) {
		MistInput.preventDefaultBehavior = !enable;
	}

	/* Getters START */
	get mouseX(): number {
		return this.state.mouse.mouseX;
	}
	get mouseY(): number {
		return this.state.mouse.mouseY;
	}
	get isMouseDown(): boolean {
		return this.state.mouse.isDown;
	}
	get wheel() {
		return this.state.mouse.wheel;
	}
	get mouseBtn() {
		return this.state.mouse.buttons;
	}

	/* Getters END */

	/* Instance Methods */
	private addEventListeners(element: HTMLElement) {
		element.addEventListener("mousedown", this.onMouseDown);
		element.addEventListener("mousemove", this.onMouseMove);
		element.addEventListener("mouseup", this.onMouseUp);
		element.addEventListener("mouseleave", this.onMouseUp);

		const onWheelHandle = this.onWheelHandleConstructor();
		element.addEventListener("wheel", onWheelHandle);

		this.state.destroyFn = () => {
			element.removeEventListener("mousedown", this.onMouseDown);
			element.removeEventListener("mousemove", this.onMouseMove);
			element.removeEventListener("mouseup", this.onMouseUp);
			element.removeEventListener("mouseleave", this.onMouseUp);
			element.removeEventListener("wheel", onWheelHandle);
		};
	}

	private onWheelHandleConstructor = () => {
		// This function checks for wheel end with help of setTimeout
		let wheelEndTimeout: number;
		return (ev: WheelEvent) => {
			if (wheelEndTimeout !== undefined) clearTimeout(wheelEndTimeout);

			this.state.mouse.wheel.isActive = true;
			const { deltaX, deltaY } = ev;

			this.state.mouse.wheel.deltaX = deltaX;
			this.state.mouse.wheel.deltaY = deltaY;

			this.state.mouse.wheel.dirX = Math.sign(deltaX);
			this.state.mouse.wheel.dirY = Math.sign(deltaY);

			wheelEndTimeout = setTimeout(() => {
				this.state.mouse.wheel.isActive = false;
			}, 100);
		};
	};

	private onMouseDown = (ev: MouseEvent) => {
		if (MistInput.preventDefaultBehavior) ev.preventDefault();

		this.state.mouse.mouseX = ev.offsetX;
		this.state.mouse.mouseY = ev.offsetY;
		this.state.mouse.isDown = true;

		this.state.mouse.buttons.left = ev.button === 0;
		this.state.mouse.buttons.middle = ev.button === 1;
		this.state.mouse.buttons.right = ev.button === 2;
		this.state.mouse.buttons.b4 = ev.button === 4;
		this.state.mouse.buttons.b5 = ev.button === 5;
	};

	private onMouseMove = (ev: MouseEvent) => {
		if (MistInput.preventDefaultBehavior) ev.preventDefault();

		this.state.mouse.mouseX = ev.offsetX;
		this.state.mouse.mouseY = ev.offsetY;
	};

	private onMouseUp = (ev: MouseEvent) => {
		if (MistInput.preventDefaultBehavior) ev.preventDefault();

		this.state.mouse.isDown = false;

		this.state.mouse.buttons.left = false;
		this.state.mouse.buttons.middle = false;
		this.state.mouse.buttons.right = false;
		this.state.mouse.buttons.b4 = false;
		this.state.mouse.buttons.b5 = false;
	};

	private reset() {
		this.state = {
			mouse: {
				mouseX: 0,
				mouseY: 0,
				isDown: false,
				buttons: {
					left: false,
					middle: false,
					right: false,
					b4: false,
					b5: false,
				},

				wheel: {
					isActive: false,
					deltaX: 0,
					deltaY: 0,
					dirX: 1,
					dirY: 1,
				},
			},
		};
	}

	/* Instance Methods END */

	/* Static Input Methods START */
	/**
	 * Initializes the global input
	 * Does nothing if already initialized
	 */
	public static Init() {
		if (this._isInitialized) return;
		const inputMap: GlobalInputState["inputMap"] = {};

		for (const key of Object.keys(MistKey)) {
			inputMap[key] = false;
		}

		this.GlobalInputState = { ...this.GlobalInputState };
		Object.assign(this.GlobalInputState, { inputMap });

		this.addGlobalEventListeners();
		this._isInitialized = true;
	}

	public static setAllowDefaultBehavior(enable: boolean) {
		this.preventDefaultBehavior = !enable;
	}

	// Returns if the input is already initialized
	public static isInitialized() {
		return this.isInitialized;
	}

	private static Reset() {
		this._isInitialized = false;
		this.GlobalInputState = { inputMap: {} };
	}

	// Destroy Global Inputs
	public static Destroy() {
		if (!this._isInitialized) return;
		this.GlobalInputState.destroyFn && this.GlobalInputState.destroyFn();
		this.Reset();
	}

	public static isPressed(key: MistKey): boolean {
		return this.GlobalInputState.inputMap[key];
	}

	public static arePressed(...keys: MistKey[]): boolean {
		return keys.every((key) => this.GlobalInputState.inputMap[key]);
	}

	public static anyPressed(...keys: MistKey[]): boolean {
		return keys.some((key) => MistInput.GlobalInputState.inputMap[key]);
	}

	private static addGlobalEventListeners() {
		this._isInitialized = true;

		window.addEventListener("keydown", this.onGlobalKeyDown);
		window.addEventListener("keyup", this.onGlobalKeyUp);

		this.GlobalInputState.destroyFn = () => {
			window.removeEventListener("keydown", this.onGlobalKeyDown);
			window.removeEventListener("keyup", this.onGlobalKeyUp);
		};
	}

	private static onGlobalKeyDown = (ev: KeyboardEvent) => {
		if (this.preventDefaultBehavior) ev.preventDefault();
		this.GlobalInputState.inputMap[ev.key] = true;
	};

	private static onGlobalKeyUp = (ev: KeyboardEvent) => {
		if (this.preventDefaultBehavior) ev.preventDefault();
		this.GlobalInputState.inputMap[ev.key] = false;
	};
	/* Static Input Methods END */
}
