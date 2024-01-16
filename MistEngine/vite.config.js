import path from "path";
import { defineConfig } from "vite";

// Todo add dts plugin for ts types
export default defineConfig({
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
