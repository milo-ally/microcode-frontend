#!/usr/bin/env bun
import { $ } from 'bun'
import { join } from 'path'
import { homedir } from 'os'
import { existsSync, mkdirSync } from 'fs'
import { copyFile } from 'fs/promises'

const isWindows = process.platform === 'win32'
const isUnix = !isWindows
const exeSuffix = isWindows ? '.exe' : ''
const homedirPath = homedir()

const entrypoint = './src/bootstrap-entry.ts'
const outDir = './dist'
const outfile = join(outDir, `microcode${exeSuffix}`)

const externalModules = [
  'image-processor-napi',
  'modifiers-napi',
  'audio-capture-napi',
  'url-handler-napi',
]
const externalArgs = externalModules.flatMap(m => ['--external', m])

try {
  console.log('Building microcode executable...')

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  await $`bun build --compile --target=bun --minify ${externalArgs} ${entrypoint} --outfile ${outfile}`.quiet()

  let installDir: string
  if (isWindows) {
    installDir = join(homedirPath, 'AppData', 'Local', 'bin')
  } else {
    installDir = join(homedirPath, '.local', 'bin')
  }
  const installPath = join(installDir, `microcode${exeSuffix}`)

  if (!existsSync(installDir)) {
    mkdirSync(installDir, { recursive: true })
    console.log(`Created install directory: ${installDir}`)
  }

  await copyFile(outfile, installPath)

  if (isUnix) {
    await $`chmod +x ${installPath}`.quiet()
  }

  console.log('\nBuild & installation completed successfully!')
  console.log(`Installed to: ${installPath}`)
  console.log(`Run command: microcode${exeSuffix}`)

  if (isWindows) {
    console.log('\nWindows note: Please add the following path to your system PATH environment variable:')
    console.log(`   ${installDir}`)
  }

} catch (error) {
  console.error('\nError occurred:', error)
  process.exit(1)
}