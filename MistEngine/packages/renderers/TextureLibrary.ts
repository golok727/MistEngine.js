import { loadImageAsync } from "@mist-engine/utils";
import { MistTexture, Texture } from ".";
import { MistApp } from "@mist-engine/Mist";

export default class MistTextureLibrary {
	private static preloadedImages: Map<string, HTMLImageElement> = new Map();
	private static mistTextures: Map<string, MistTexture> = new Map();
	/**
	 * This API is fairly new which will be changed later
	 * @param url Url of the image to load
	 */

	public static AddTextureFromElement(name: string, image: HTMLImageElement) {
		image.onload = () => {
			this.preloadedImages.set(name, image);
		};
	}

	public static async PreloadImage(src: string): Promise<void> {
		try {
			const image = await loadImageAsync(src);
			this.preloadedImages.set(src, image);
		} catch (error) {
			console.error(
				`Mist.TextureLibrary.PreloadTexture(): Error loading image from '${src}'`
			);
		}
	}

	/**
	 *
	 * @param tImageUrl  the name or url in which the image is loaded as
	 * @description Creates the api specific texture from the given image url for the app
	 */
	public static async Create(app: MistApp, tImageUrl: string) {
		const exists = this.mistTextures.get(tImageUrl);

		if (!this.preloadedImages.get(tImageUrl))
			await this.PreloadImage(tImageUrl);

		if (exists) return exists;

		const texture = Texture.Create(tImageUrl, app.getRenderer());
		this.mistTextures.set(tImageUrl, texture);
		return texture;
	}

	/**
	 * Returns the `Mist.Texture` loaded
	 */
	public static Get(name: string) {
		const texture = this.mistTextures.get(name);
		if (!texture)
			throw new Error("Mist.TextureLibrary.Get(): Texture is not loaded ");

		return texture;
	}

	public static GetImageForTexture(preloadedImageUrl: string) {
		return this.preloadedImages.get(preloadedImageUrl);
	}
}
