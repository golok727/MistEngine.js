import "./MistGlobalFill";

import { MistLogger } from "@mist-engine/logger";

import { printMistInto } from "@mist-engine/utils";
import MistAppBase, { ApplicationConstructorProps } from "./MistAppBase";

const logger = new MistLogger({ name: "App" });

export class MistApp extends MistAppBase {
	constructor(props: ApplicationConstructorProps) {
		super(props);
	}

	protected override onTick(delta: number): void {
		for (const layer of this.layerStack.reversed()) {
			layer.onUpdate(delta);
		}
	}
}

export const CreateMistApp = async (
	setup: () => Promise<MistApp> | MistApp
) => {
	printMistInto();
	let mayBePromiseApp = setup();
	let app: MistApp;
	if (mayBePromiseApp instanceof Promise) app = await mayBePromiseApp;
	else app = mayBePromiseApp;
	app.dispatchEvent({ type: MistEventType.AppReady, target: app });

	app.Run();
	logger.log("{0}\n\t {1}", "Radha Vallabh Shri Harivansh", "Radhey Shyam");
};
