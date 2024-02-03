import path from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
export const common = {
  resolve: {
    alias: [
      {
        find: 'mist.js',
        replacement: path.resolve(__dirname, './bundles/mist/src/index.ts'),
      },
      {
        find: /^@mist\/(.+)$/,
        replacement: path.resolve(__dirname, './packages/$1/src/index.ts'),
      },
    ],
  },
}

export default defineConfig({
  ...common,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'bundles/mist/src/index.ts'),
      formats: ['es'],
      name: 'mist.js',
      fileName: 'index',
    },
    outDir: path.resolve(__dirname, 'build'),
  },
  plugins: [dts({rollupTypes: true})],
})
