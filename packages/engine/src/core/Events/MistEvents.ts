/// <reference path="../Application.ts" />

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
