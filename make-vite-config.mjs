import fs from 'fs/promises'
import path from 'path'

const packages = (
  await fs.readdir(path.resolve('packages'), {
    withFileTypes: true,
  })
).filter((dir) => dir.isDirectory())

const configs = packages.map((packages) => {
  const rootPath = path.join(packages.path, 'vite.config.js')
  const content = `
    import path from path
    import { defineConfig } from "vite";
    import dts from "vite-plugin-dts";
    
    import { common } from "${path.resolve('vite.config.js')}"

    export default defineConfig({
      ...common,
      build: {
        lib: {
          entry: path.resolve(__dirname, "./src/index.ts"),
          formats: ["es"],
          name: "lib.js",
          fileName: "index",
        },
        outDir: path.resolve(__dirname, "lib"),
      },
      plugins: [dts({ rollupTypes: true })],
    });
  `

  return {
    rootPath,
    content,
  }
})

console.log(configs[0].content)
