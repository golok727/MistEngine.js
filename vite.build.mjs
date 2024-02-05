import { build } from 'vite'
import workspacesRun from 'workspaces-run'
import path from 'path'
const packages = []

await workspacesRun.default(
  { cwd: process.cwd(), orderByDep: true },
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
  const basePath = path.resolve(pkg.dir)
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
// console.log(JSON.stringify(configs, null, 2))

for (const config of configs) {
  console.log('Building', config.build.lib.entry)
  await build(config)
}
