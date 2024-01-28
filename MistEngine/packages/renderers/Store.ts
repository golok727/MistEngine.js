import { loadImageAsync } from "@mist-engine/utils";

export class Store {
	private static textures: Map<string, HTMLImageElement> = new Map();

	/**
	 * This API is fairly new which will be changed later
	 * @param url Url of the image to load
	 */
	public static async addTexture(src: string) {
		try {
			const image = await loadImageAsync(src);
			this.textures.set(src, image);
		} catch (error) {
			console.error(`Error loading image from '${src}'`);
		}
	}
	public static getTexture(name: string) {
		return this.textures.get(name);
	}
}

/**
 * This API is fairly new which will be changed later
 * @param url Url of the image to load
 */
export async function preloadTexture(src: string) {
	await Store.addTexture(src);
}
