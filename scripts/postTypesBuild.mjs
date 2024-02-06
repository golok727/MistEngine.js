import { readdir, rename, readFile, writeFile } from 'fs/promises'
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

const globalRefRegex = /(reference) types="packages\/[^\/]+\/(global)"/

for (const dir of all) {
  const libDir = path.resolve(dir, 'lib')

  await rename(path.resolve(dir, 'src'), libDir)
  const indexFileBuffer = await readFile(
    path.resolve(libDir, 'index.d.ts'),
    'utf-8',
  )

  writeFile(
    path.resolve(libDir, 'index.d.ts'),
    indexFileBuffer.replace(globalRefRegex, `$1 path='../$2.d.ts'`),
    { encoding: 'utf-8' },
  )
}
