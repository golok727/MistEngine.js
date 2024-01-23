import { MistRendererAPI, Renderer } from "./Renderer";
import { WebGL2Shader } from "@mist-engine/renderers/api/WebGL2/WebGL2Shader";
export interface Shader {
	use(): void;
	detach(): void;
	delete(): void;
	setUniform3f(name: string, x: number, y: number, z: number): void;
}

export class ShaderFactory {
	static Create(
		renderer: Renderer,
		vertexShaderSrc: string,
		fragmentShaderSrc: string
	): Shader {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new WebGL2Shader(renderer, vertexShaderSrc, fragmentShaderSrc);
			case MistRendererAPI.WebGL2:
				throw new Error(
					`Renderer API ${renderer.GetApi()} is under construction`
				);
			default:
				throw new Error(`Renderer API ${renderer.GetApi()} is not supported`);
		}
	}
}