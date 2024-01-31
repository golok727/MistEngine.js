if (window.__MIST__ === undefined) {
	window.__MIST__ = {};
}

window.MistEventType = Object.freeze({
	AppReady: "AppReady",
	AppStart: "AppStart",
	AppShutDown: "AppShutDown",
	AppRestart: "AppRestart",
	RendererResize: "RendererResize",
	MouseDown: "MouseDown",
	MouseMove: "MouseMove",
	MouseUp: "MouseUp",
	KeyDown: "KeyDown",
	KeyUp: "KeyUp",
	MouseWheel: "MouseWheel",
});
