// Stub for build - feature not included in this codebase
export type CachedMCState = unknown
export type CacheEditsBlock = unknown
export type PinnedCacheEdits = unknown

export function createCachedMCState(): CachedMCState {
  return {}
}

export function resetCachedMCState(_state: CachedMCState): void {}

export function createCacheEditsBlock(
  _state: CachedMCState,
  _tools: unknown,
): CacheEditsBlock {
  return {}
}

export function getPinnedCacheEditsFromBlock(
  _block: CacheEditsBlock,
): PinnedCacheEdits[] {
  return []
}

export function cachedMicrocompactPath(
  _messages: unknown[],
  _querySource: string,
): Promise<unknown> {
  return Promise.resolve(null)
}
