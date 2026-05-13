import type { AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS } from '../../services/analytics/index.js'
import { isEnvTruthy } from '../envUtils.js'
import {
  getActiveProviderConfig,
  getConfiguredAnthropicBaseUrl,
  isOpenAICompatibleProviderType,
} from './providerConfig.js'

export type APIProvider = 'firstParty' | 'bedrock' | 'vertex' | 'foundry'

function getConfiguredBuiltInProvider(): APIProvider | undefined {
  const providerConfig = getActiveProviderConfig() as
    | Record<string, unknown>
    | undefined

  const configuredProvider =
    providerConfig?.provider ??
    providerConfig?.apiProvider ??
    providerConfig?.type ??
    providerConfig?.kind

  return configuredProvider === 'bedrock' ||
    configuredProvider === 'vertex' ||
    configuredProvider === 'foundry'
    ? configuredProvider
    : undefined
}

export function getAPIProvider(): APIProvider {
  const configuredBuiltInProvider = getConfiguredBuiltInProvider()

  return isEnvTruthy(process.env.MICROCODE_USE_BEDROCK)
    ? 'bedrock'
    : isEnvTruthy(process.env.MICROCODE_USE_VERTEX)
      ? 'vertex'
      : isEnvTruthy(process.env.MICROCODE_USE_FOUNDRY)
        ? 'foundry'
        : configuredBuiltInProvider ?? 'firstParty'
}

export function getAPIProviderForStatsig(): AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS {
  return getAPIProvider() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
}

/**
 * Check if ANTHROPIC_BASE_URL is a first-party Anthropic API URL.
 * Returns true if not set (default API) or points to api.anthropic.com
 * (or api-staging.anthropic.com for ant users).
 */
export function isFirstPartyAnthropicBaseUrl(): boolean {
  if (isOpenAICompatibleProviderType(getActiveProviderConfig().type)) {
    return false
  }
  const baseUrl = getConfiguredAnthropicBaseUrl()
  if (!baseUrl) {
    return true
  }
  try {
    const host = new URL(baseUrl).host
    const allowedHosts = ['api.anthropic.com']
    if (process.env.USER_TYPE === 'ant') {
      allowedHosts.push('api-staging.anthropic.com')
    }
    return allowedHosts.includes(host)
  } catch {
    return false
  }
}
