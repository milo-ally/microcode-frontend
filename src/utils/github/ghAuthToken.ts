import { execSyncWithDefaults_DEPRECATED } from '../execFileNoThrow.js'

export type GitHubTokenProvider = 'github-models' | 'github-copilot'

const providerEnvNames: Record<GitHubTokenProvider, string[]> = {
  'github-models': ['GITHUB_MODELS_TOKEN'],
  'github-copilot': ['GITHUB_COPILOT_TOKEN'],
}

const cachedTokens = new Map<GitHubTokenProvider, string | undefined>()

function getEnvToken(envNames: string[]): string | undefined {
  for (const envName of envNames) {
    const value = process.env[envName]
    if (value) {
      return value
    }
  }

  return undefined
}

function resolveGhAuthToken(provider: GitHubTokenProvider): string | undefined {
  const envToken = getEnvToken([
    ...providerEnvNames[provider],
    'GH_TOKEN',
    'GITHUB_TOKEN',
  ])
  if (envToken) {
    return envToken
  }

  return execSyncWithDefaults_DEPRECATED('gh auth token', {
    timeout: 5000,
    stdio: ['ignore', 'pipe', 'ignore'],
  }) ?? undefined
}

export function getGitHubAuthToken(
  provider: GitHubTokenProvider,
): string | undefined {
  if (cachedTokens.has(provider)) {
    return cachedTokens.get(provider)
  }

  const token = resolveGhAuthToken(provider)
  cachedTokens.set(provider, token)
  return token
}
