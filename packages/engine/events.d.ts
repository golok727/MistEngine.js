type MistEventTypesK =
  | 'AppReady'
  | 'AppStart'
  | 'AppShutDown'
  | 'AppRestart'
  | 'RendererResize'
  | 'MouseDown'
  | 'MouseMove'
  | 'MouseUp'
  | 'MouseWheel'
  | 'KeyDown'
  | 'KeyUp'

type MistEventTypeT = {
  [K in MistEventTypesK]: K
}

interface MistEventMap {
  [MistEventType.AppReady]: MistAppReadyEvent
  [MistEventType.AppStart]: MistAppStartEvent
  [MistEventType.AppShutDown]: MistAppShutDownEvent
  [MistEventType.AppRestart]: MistAppRestartEvent
  [MistEventType.RendererResize]: MistRendererResizeEvent

  [MistEventType.KeyDown]: MistKeyDownEvent
  [MistEventType.KeyUp]: MistKeyUpEvent

  [MistEventType.MouseUp]: MistMouseUpEvent
  [MistEventType.MouseMove]: MistMouseMoveEvent
  [MistEventType.MouseDown]: MistMouseDownEvent
  [MistEventType.MouseWheel]: MistMouseWheelEvent
}

type MistEvent =
  | MistAppReadyEvent
  | MistAppStartEvent
  | MistAppShutDownEvent
  | MistAppRestartEvent
  | MistRendererResizeEvent
  | MistKeyUpEvent
  | MistKeyDownEvent
  | MistMouseDownEvent
  | MistMouseUpEvent
  | MistMouseMoveEvent
  | MistMouseWheelEvent

type MistEventListenerCallback<E = MistEvent> = (event: E) => any

interface MistBaseEvent<T> {
  target: T
}

interface DefaultPrevent {
  preventDefault(): void
}

interface MistAppReadyEvent
  extends MistBaseEvent<
    import('packages/engine/src/core/MistAppBase.ts').default
  > {
  type: MistEventTypeT['AppReady']
}

interface MistAppStartEvent
  extends MistBaseEvent<
    import('packages/engine/src/core/MistAppBase.ts').default
  > {
  type: MistEventTypeT['AppStart']
}

interface MistAppShutDownEvent
  extends MistBaseEvent<
    import('packages/engine/src/core/MistAppBase.ts').default
  > {
  type: MistEventTypeT['AppShutDown']
}

interface MistAppRestartEvent
  extends MistBaseEvent<
    import('packages/engine/src/core/MistAppBase.ts').default
  > {
  type: MistEventTypeT['AppRestart']
}

interface MistRendererResizeEvent
  extends MistBaseEvent<
    import('packages/engine/src/renderers/Renderer.ts').Renderer<any>
  > {
  type: MistEventTypeT['RendererResize']
  width: number
  height: number
}
// Global Keyboard
interface MistKeyUpEvent
  extends MistBaseEvent<
      typeof import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['KeyUp']
  key: MistKey
  native: KeyboardEvent
}

interface MistKeyDownEvent
  extends MistBaseEvent<
      typeof import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['KeyDown']
  key: MistKey
  native: KeyboardEvent
}

// Mouse

interface MistMouseDownEvent
  extends MistBaseEvent<
      import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['MouseDown']
  x: number
  y: number
  button: import('packages/engine/src/core/Input/Input.ts').ElementInputState['mouse']['button']
  native: MouseEvent
}

interface MistMouseUpEvent
  extends MistBaseEvent<
      import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['MouseUp']
  x: number
  y: number
  button: import('packages/engine/src/core/Input/Input.ts').ElementInputState['mouse']['button']
  native: MouseEvent
}

interface MistMouseMoveEvent
  extends MistBaseEvent<
      import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['MouseMove']
  x: number
  y: number
  isDown: boolean
  button: import('packages/engine/src/core/Input/Input.ts').ElementInputState['mouse']['button']
  native: MouseEvent
}

interface MistMouseWheelEvent
  extends MistBaseEvent<
      import('packages/engine/src/core/Input/Input.ts').default
    >,
    DefaultPrevent {
  type: MistEventTypeT['MouseWheel']

  deltaX: number
  deltaY: number
  dirX: number
  dirY: number

  native: WheelEvent
}
