import path from "path";
import { defineConfig } from "vite";

// Todo add dts plugin for ts types
export default defineConfig({
	resolve: {
		alias: {
			"@mist-engine": path.resolve(__dirname, "packages/engine"),
			"@mist-math": path.resolve(__dirname, "packages/math"),
			"@": path.resolve(__dirname, "packages"),
			"@mist": path.resolve(__dirname, "packages/engine"),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "packages"),
			formats: ["es"],
			name: "MistEngine",
			fileName: "index",
		},
		outDir: path.resolve(__dirname, "lib"),
	},
});
