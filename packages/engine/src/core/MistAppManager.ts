import MistAppBase from './MistAppBase'

export default class MistAppManager {
  private static currentInstance: MistAppBase | null = null

  static getCurrent() {
    return this.currentInstance
  }

  static isAnyActive() {
    return this.currentInstance !== null
  }
  static detach() {
    this.currentInstance = null
  }

  static setCurrent(app: MistAppBase) {
    this.currentInstance = app as MistAppBase
  }
}
