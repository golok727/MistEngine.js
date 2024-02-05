# MIST Engine

A Game engine Work in Progress

```typescript
import { Mist } from 'mist.js'

const canvas = document.getElementById('canvas')

class GameLayer extends Mist.Layer {
  constructor() {
    super('GameLayer')
  }

  onAttach() {
    const aspect = this.getContext().Renderer.aspect
    this.camera = new Mist.OrthographicCamera(-aspect, aspect, 1, -1)
  }

  onUpdate(delta: number) {
    const { Input, Renderer, RendererAPI } = this.getContext()
    RendererAPI.ClearColor(1, 1, 1, 1)
    RendererAPI.Clear()

    Renderer.BeginScene(this.camera)

    Renderer.Submit(/*..params...*/)
    Renderer.EndScene()
  }

  onDetach() {}
}
class MyApp extends Mist.App {
  constructor() {
    super({ name: 'MyApp', canvas })
    this.pushLayer(GameLayer)
  }
}

Mist.CreateApp(async () => {
  const app = new MyApp()

  await Mist.TextureLibrary.Create(app, '/my-texture.png')
  await Mist.ShaderLibrary.Preload(app, '/sandbox.mist.glsl')

  return app
})
```
