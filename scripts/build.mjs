import { build } from 'vite'
import workspacesRun from 'workspaces-run'
import path from 'path'
const packages = []

await workspacesRun.default(
  { cwd: path.resolve(), orderByDep: true },
  async (pkg) => {
    if (!pkg.config.private) {
      packages.push(pkg)
    }
  },
)
/**
 * @return {import('vite').InlineConfig[]}
 */

const configFile = path.resolve('./vite.config.js')
const configs = packages.map((pkg) => {
  const basePath = pkg.dir
  const entry = path.join(basePath, 'src/index.ts')
  /**
   * @type {import('vite').InlineConfig}
   */
  const config = {
    build: {
      lib: {
        entry,
        formats: ['es', 'cjs'],
        fileName: 'index',
      },
      outDir: path.join(basePath, 'lib'),
    },
    configFile,
  }

  return config
})

for (const config of configs) {
  await build(config)
}
