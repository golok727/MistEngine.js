import MistAppManager from "@mist-engine/core/MistAppManager";
import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import { MistWebGL2Shader } from "@mist-engine/renderers/api/WebGL2/WebGL2Shader";

export interface MistShader extends MistAPIUsable {
	is<T extends MistShader>(): this is T;
}

export class ShaderFactory {
	static Create(
		vertexShaderSrc: string,
		fragmentShaderSrc: string,
		renderer?: Renderer
	): MistShader {
		renderer = renderer ? renderer : MistAppManager.getCurrent()?.getRenderer();
		if (!renderer)
			throw new Error(
				"Mist.Shader Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[3] for context"
			);

		switch (renderer.GetApiType()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGL2Shader(
					renderer,
					this.cleanShaderCode(vertexShaderSrc),
					this.cleanShaderCode(fragmentShaderSrc)
				);
			case MistRendererAPI.WebGL2:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is under construction`
				);
			default:
				throw new Error(
					`Renderer API ${renderer.GetApiType()} is not supported`
				);
		}
	}
	// Strip the first line of if the first line is empty
	private static cleanShaderCode(code: string) {
		return code.replace(/^\s*\n/g, "");
	}
}
