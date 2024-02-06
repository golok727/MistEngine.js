declare namespace MistGlobal {}

type Values<T> = T[keyof T]
type Keys<T> = keyof T

interface MistGlobalObject {}

declare var __MIST__: Window['__MIST__']

interface Window {
  MistEventType: MistEventTypeT
  __MIST__: MistGlobalObject
}
declare var MistEventType: Window['MistEventType']
