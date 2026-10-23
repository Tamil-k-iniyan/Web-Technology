import { cp, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const frontendDirectory = fileURLToPath(new URL('../', import.meta.url))
const distDirectory = path.join(frontendDirectory, 'dist')

const builtHtml = await readFile(path.join(distDirectory, 'app.html'), 'utf8')
await writeFile(
  path.join(frontendDirectory, 'index.html'),
  builtHtml.replace(/\r\n/g, '\n'),
)
await cp(
  path.join(distDirectory, 'assets'),
  path.join(frontendDirectory, 'assets'),
  { recursive: true },
)

for (const entry of await readdir(distDirectory, { withFileTypes: true })) {
  if (entry.name === 'app.html' || entry.name === 'assets') continue

  await cp(
    path.join(distDirectory, entry.name),
    path.join(frontendDirectory, entry.name),
    { recursive: true },
  )
}
