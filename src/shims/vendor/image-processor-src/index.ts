// Stub for build - native module not included
export type ClipboardImageResult = {
  data: Buffer
  width: number
  height: number
}

export type NativeModule = {
  processImage: (data: Buffer) => Promise<Buffer>
}

export const defaultExport = {
  processImage: async (data: Buffer) => data,
}

export function getNativeModule(): NativeModule {
  return defaultExport as unknown as NativeModule
}

export const sharp = null
