import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
})
