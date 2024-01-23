export interface Context<Ctx = unknown> {
	get inner(): Ctx;
	clearColor(r: number, g: number, b: number, a: number): void;
	clear(): void;
	setViewport(x: number, y: number, width: number, height: number): void;
}
