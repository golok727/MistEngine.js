import { Matrix4 } from "@mist-engine/math/mat4";
import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import { MistWebGL2Shader } from "@mist-engine/renderers/api/WebGL2/WebGL2Shader";

export interface MistShader extends MistAPIUsable {
	setUniform3f(name: string, x: number, y: number, z: number): void;
	setUniform1i(name: string, v: number): void;
	setUniformMat4(name: string, m: Matrix4): void;
}

export class ShaderFactory {
	static Create(
		renderer: Renderer,
		vertexShaderSrc: string,
		fragmentShaderSrc: string
	): MistShader {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGL2Shader(
					renderer,
					this.cleanShaderCode(vertexShaderSrc),
					this.cleanShaderCode(fragmentShaderSrc)
				);
			case MistRendererAPI.WebGL2:
				throw new Error(
					`Renderer API ${renderer.GetApi()} is under construction`
				);
			default:
				throw new Error(`Renderer API ${renderer.GetApi()} is not supported`);
		}
	}
	// Strip the first line of if the first line is empty
	private static cleanShaderCode(code: string) {
		return code.replace(/^\s*\n/g, "");
	}
}
