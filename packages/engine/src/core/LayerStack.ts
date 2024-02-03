import Layer from './Layer'

export default class LayerStack {
  private layerStack: Layer[]

  constructor() {
    this.layerStack = []
  }

  pushLayer(layer: Layer) {
    this.layerStack.unshift(layer)
  }

  pushOverlay(overlay: Layer) {
    this.layerStack.push(overlay)
  }

  popLayer(layer: Layer) {
    const pos = this.layerStack.findIndex((v) => v === layer)
    if (pos >= 0) {
      this.layerStack.splice(pos, 1)
    }
  }

  popOverlay(overlay: Layer) {
    const pos = this.layerStack.findIndex((v) => v === overlay)
    if (pos >= 0) {
      this.layerStack.splice(pos, 1)
    }
  }

  [Symbol.iterator](): Iterator<Layer> {
    let index = 0

    return {
      next: (): IteratorResult<Layer> => {
        if (index < this.layerStack.length) {
          return {value: this.layerStack[index++], done: false}
        } else {
          return {value: null as any, done: true}
        }
      },
    }
  }
  reversed(): IterableIterator<Layer> {
    let index = this.layerStack.length - 1

    return {
      next: () => {
        if (index >= 0) return {value: this.layerStack[index--], done: false}
        else {
          return {value: undefined, done: true}
        }
      },

      [Symbol.iterator]: function () {
        return this
      },
    }
  }
}
