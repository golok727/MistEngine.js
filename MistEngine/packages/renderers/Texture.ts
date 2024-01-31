import { getCurrentApp } from "@mist-engine/core/MistAppBase";
import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import { MistWebGLTexture } from "./api/WebGL2/WebGL2Texture";

export interface MistTexture extends MistAPIUsable {}

export class TextureFactory {
	/**
	 * @param renderer
	 * @param name The preloaded file name
	 */
	public static Create(mistUrl: string): MistTexture {
		const app = getCurrentApp();
		if (!app) throw "App is null";

		const renderer = app.getRenderer();
		switch (renderer.GetApiType()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGLTexture(renderer, mistUrl);

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
}
