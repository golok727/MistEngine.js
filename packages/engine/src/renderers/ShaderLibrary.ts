/*
	@mist/engine/ShaderLibrary
	A shader library which stores all the shaders in one location which can be loaded into any Mist Application;

	The shader files provided should be a `Mist Shader` which allows loading multiple shaders in single file. More in the docs
*/
import { MistShader, ShaderFactory } from './Shader'
import MistShaderParser from './MistShaderParser'
import type { MistApp } from '../core/Application'

export default class MistShaderLibrary {
  private static loadedShaders: Map<string, MistShader> = new Map()

  /**
	 * @param url  Preloaded url of the shader file preloaded_filepath#shaderName\
	 * For example, if you used `Mist.ShaderLibrary.Preload('your-app', 'myShader.mist.glsl')`
	to load a shader and you named your shader `basicShader` with `@MistShaderBegin(basicShader)`  then you would access the shader file like this

	@example

	```ts
	Mist.ShaderLibrary.Load('myShader.mist.glsl/#basicShader');
	// preloaded_filepath/#shaderName
```

	 */
  public static Load(url: string) {
    url = url.trim()

    const shader = this.loadedShaders.get(url)
    if (!shader) {
      throw new Error(
        `MistShaderLibrary.Load: Shader not found '${url}'\nPlease preload the shader to the shader library or add a shader to the library`,
      )
    }
    return shader
  }

  public static Add(name: string, shader: MistShader) {
    this.loadedShaders.set(name.trim(), shader)
  }

  public static async Preload(app: MistApp, url: string) {
    const res = await fetch(url)

    const mistShaderSourceFile = await res.text()

    const mistParser = new MistShaderParser(mistShaderSourceFile)
    const mistShaders = await mistParser.parse()

    const renderer = app.getRenderer()

    for (const shaderSrc of mistShaders) {
      const shader = ShaderFactory.Create(
        shaderSrc.vertex,
        shaderSrc.fragment,
        renderer,
      )
      const name = url + '/'
      this.Add(`${name}#${shaderSrc.name}`, shader)
    }
  }
}
