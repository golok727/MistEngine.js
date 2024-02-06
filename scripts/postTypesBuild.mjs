import { readdir, rename } from 'fs/promises'
import path from 'path'

const out = path.resolve('out')
const bundlesDir = path.join(out, 'bundles')
const packagesDir = path.join(out, 'packages')

const bundles = (
  await readdir(bundlesDir, {
    withFileTypes: true,
  })
)
  .filter((p) => p.isDirectory())
  .map((p) => path.resolve(p.path, p.name))

const packages = (
  await readdir(packagesDir, {
    withFileTypes: true,
  })
)
  .filter((p) => p.isDirectory())
  .map((p) => path.resolve(p.path, p.name))

const all = [...bundles, ...packages]

for (const dir of all) {
  const src = path.resolve(dir, 'src')
  await rename(src, path.resolve(dir, 'lib'))
}
