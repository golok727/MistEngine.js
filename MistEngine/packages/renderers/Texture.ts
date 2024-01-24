import { MistAPIUsable, MistRendererAPI, Renderer } from "./Renderer";
import { MistWebGLTexture } from "./api/WebGL2/WebGL2Texture";

export interface MistTexture extends MistAPIUsable {}

export class TextureFactory {
	/**
	 * @param renderer
	 * @param name The preloaded file name
	 */
	public static Create(renderer: Renderer, mistUrl: string): MistTexture {
		switch (renderer.GetApi()) {
			case MistRendererAPI.WebGL2:
				return new MistWebGLTexture(renderer, mistUrl);

			case MistRendererAPI.WebGL2:
				throw new Error(
					`Renderer API ${renderer.GetApi()} is under construction`
				);
			default:
				throw new Error(`Renderer API ${renderer.GetApi()} is not supported`);
		}
	}
}
