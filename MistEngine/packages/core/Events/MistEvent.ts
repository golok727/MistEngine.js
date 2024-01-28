import { MistEventDispatcher } from "./MistEventDispatcher";

export enum MistEventType {
	AppStart = "AppStart",
	AppShutDown = "AppShutDown",
	AppRestart = "AppRestart",
	RendererResize = "RendererResize",
}

interface MistEventBase {
	type: MistEvent;
	target: MistEventDispatcher;
}

interface MistAppStartEvent {}

export interface MistEvent {
	target: MistEventDispatcher;
	type: string;
	message: any;
}
