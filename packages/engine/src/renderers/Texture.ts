import MistAppManager from "../core/MistAppManager";
import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import { MistWebGLTexture } from "./api/WebGL2/WebGL2Texture";

export interface MistTexture extends MistAPIUsable {}

export class TextureFactory {
	/**
	 * @param renderer
	 * @param name The preloaded file name
	 */
	public static Create(mistUrl: string, renderer?: Renderer): MistTexture {
		renderer = renderer ? renderer : MistAppManager.getCurrent()?.getRenderer();
		if (!renderer)
			throw new Error(
				"Mist.Texture Create called without an active context. Please use this inside a Mist.App or Mist.Layer or provide a Mist.Renderer as arg[2] for context"
			);

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
