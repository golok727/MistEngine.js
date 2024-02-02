import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	resolve: {
		alias: {
			"@mist": path.resolve(__dirname, "packages"),
		},
	},

	build: {
		lib: {
			entry: path.resolve(__dirname, "bundles/mist.js/index.ts"),
			formats: ["es"],
			name: "mist.js",
			fileName: "index",
		},
		outDir: path.resolve(__dirname, "build"),
	},
	plugins: [dts({ rollupTypes: true })],
});
