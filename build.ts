#!/usr/bin/env bun
import { $ } from 'bun'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const entrypoint = './src/bootstrap-entry.ts'
const outfile = './dist/microcode'

console.log('Building microcode executable...')

// Mark native modules as external
const externalModules = [
  'image-processor-napi',
  'modifiers-napi',
  'audio-capture-napi',
  'url-handler-napi',
]

const externalArgs = externalModules.flatMap(m => ['--external', m])

await $`bun build --compile --target=bun --minify ${externalArgs} ${entrypoint} --outfile ${outfile}`.quiet()

// Install to ~/.local/bin
const home = process.env.HOME || ''
const installDir = join(home, '.local', 'bin')
const installPath = join(installDir, 'microcode')

if (!existsSync(installDir)) {
  mkdirSync(installDir, { recursive: true })
}

await $`cp ${outfile} ${installPath}`.quiet()
await $`chmod +x ${installPath}`.quiet()

console.log(`\nDone! Installed to: ${installPath}`)
console.log(`Run with: microcode`)
