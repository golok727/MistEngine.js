import { MistShader, ShaderFactory } from "./Shader";
import MistShaderParser from "./MistShaderParser";
import { MistApp } from "@mist-engine/Mist";

export default class MistShaderLibrary {
	private static loadedShaders: Map<string, MistShader> = new Map();

	/**
	 * @param url  Preloaded url of the shader file
	 * @param name optional name to store it as if not provided it will be stored with the name with the extension removed and you can access it with the url provided
	 */
	public static Load(url: string) {
		url = url.trim();

		const shader = this.loadedShaders.get(url);
		if (!shader) {
			throw new Error(
				`MistShaderLibrary.Load: Shader not found '${url}'\nPlease preload the shader to the shader library or add a shader to the library`
			);
		}
		return shader;
	}

	public static Add(name: string, shader: MistShader) {
		this.loadedShaders.set(name.trim(), shader);
	}

	public static async Preload(app: MistApp, url: string) {
		const res = await fetch(url);

		const mistShaderSourceFile = await res.text();

		const mistParser = new MistShaderParser(mistShaderSourceFile);
		const mistShaders = await mistParser.parse();

		const renderer = app.getRenderer();

		for (const shaderSrc of mistShaders) {
			const shader = ShaderFactory.Create(
				renderer,
				shaderSrc.vertex,
				shaderSrc.fragment
			);
			const name = url + "/";
			this.Add(`${name}#${shaderSrc.name}`, shader);
		}
	}
}
