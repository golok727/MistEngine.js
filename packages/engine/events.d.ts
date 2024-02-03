namespace globalThis {
  interface MistBaseEvent<T> {
    target: T
  }

  interface DefaultPrevent {
    preventDefault(): void
  }

  interface MistAppReadyEvent
    extends MistBaseEvent<import('../packages/core/MistAppBase.ts').default> {
    type: MistEventTypeT['AppReady']
  }

  interface MistAppStartEvent
    extends MistBaseEvent<import('../packages/core/MistAppBase.ts').default> {
    type: MistEventTypeT['AppStart']
  }

  interface MistAppShutDownEvent
    extends MistBaseEvent<import('../packages/core/MistAppBase.ts').default> {
    type: MistEventTypeT['AppShutDown']
  }

  interface MistAppRestartEvent
    extends MistBaseEvent<import('../packages/core/MistAppBase.ts').default> {
    type: MistEventTypeT['AppRestart']
  }

  interface MistRendererResizeEvent
    extends MistBaseEvent<
      import('../packages/renderers/Renderer.ts').Renderer<any>
    > {
    type: MistEventTypeT['RendererResize']
    width: number
    height: number
  }
  // Global Keyboard
  interface MistKeyUpEvent
    extends MistBaseEvent<
        typeof import('../packages/core/Input/Input.ts').default
      >,
      DefaultPrevent {
    type: MistEventTypeT['KeyUp']
    key: MistKey
    native: KeyboardEvent
  }

  interface MistKeyDownEvent
    extends MistBaseEvent<
        typeof import('../packages/core/Input/Input.ts').default
      >,
      DefaultPrevent {
    type: MistEventTypeT['KeyDown']
    key: MistKey
    native: KeyboardEvent
  }

  // Mouse

  interface MistMouseDownEvent
    extends MistBaseEvent<import('../packages/core/Input/Input.ts').default>,
      DefaultPrevent {
    type: MistEventTypeT['MouseDown']
    x: number
    y: number
    button: import('@mist/engine/core/Input/Input.ts').ElementInputState['mouse']['button']
    native: MouseEvent
  }

  interface MistMouseUpEvent
    extends MistBaseEvent<import('../packages/core/Input/Input.ts').default>,
      DefaultPrevent {
    type: MistEventTypeT['MouseUp']
    x: number
    y: number
    button: import('@mist/engine/core/Input/Input.ts').ElementInputState['mouse']['button']
    native: MouseEvent
  }

  interface MistMouseMoveEvent
    extends MistBaseEvent<import('../packages/core/Input/Input.ts').default>,
      DefaultPrevent {
    type: MistEventTypeT['MouseMove']
    x: number
    y: number
    isDown: boolean
    button: import('@mist/engine/core/Input/Input.ts').ElementInputState['mouse']['button']
    native: MouseEvent
  }

  interface MistMouseWheelEvent
    extends MistBaseEvent<import('../packages/core/Input/Input.ts').default>,
      DefaultPrevent {
    type: MistEventTypeT['MouseWheel']

    deltaX: number
    deltaY: number
    dirX: number
    dirY: number

    native: WheelEvent
  }
}
