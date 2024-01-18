import { MistLogger } from "../packages/logger";
import { afterAll, describe, it, expect, vi } from "vitest";

describe("should mock console.log", () => {
	const logger = new MistLogger({ pattern: "%n: %s", name: "App" });

	const consoleMock = vi
		.spyOn(console, "log")
		.mockImplementation(() => undefined);

	afterAll(() => {
		consoleMock.mockReset();
	});
	const out = "App: Radha";
	it("should log `App: Radha`", () => {
		// test log
		logger.log("Radha");
		expect(consoleMock).toHaveBeenCalledOnce();
		expect(consoleMock).toHaveBeenLastCalledWith(out);

		// Test Placeholder
		logger.log("{0}", { x: 10, y: 10 });
		expect(consoleMock).toHaveBeenLastCalledWith(
			"App: " + JSON.stringify({ x: 10, y: 10 })
		);
		// Test Spacing
		logger.log("{:0}", { x: 10, y: 10 });
		expect(consoleMock).toHaveBeenLastCalledWith(
			"App: " + JSON.stringify({ x: 10, y: 10 }, null, 2)
		);

		logger.log("{0}-{1}-{2}", 1, 2, 3);
		expect(consoleMock).toHaveBeenLastCalledWith("App: 1-2-3");
	});
});
