import { execSyncWithDefaults_DEPRECATED } from '../execFileNoThrow.js'

const COPILOT_ENDPOINT_QUERY =
  'query { viewer { copilotEndpoints { api } } }'

let cachedCopilotApiUrl: string | null | undefined

function normalizeUrl(url: string | undefined): string | undefined {
  if (!url) {
    return undefined
  }

  try {
    const normalized = new URL(url)
    normalized.pathname = normalized.pathname.replace(/\/+$/, '') || '/'
    return normalized.toString().replace(/\/$/, '')
  } catch {
    return undefined
  }
}

function getEnvCopilotApiUrl(): string | undefined {
  return (
    normalizeUrl(process.env.GITHUB_COPILOT_BASE_URL) ||
    normalizeUrl(process.env.GITHUB_COPILOT_API_URL)
  )
}

function getGhCliCopilotApiUrl(): string | undefined {
  const raw = execSyncWithDefaults_DEPRECATED(
    `gh api graphql -f query='${COPILOT_ENDPOINT_QUERY}'`,
    {
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    },
  )

  if (!raw) {
    return undefined
  }

  try {
    const parsed = JSON.parse(raw) as {
      data?: {
        viewer?: {
          copilotEndpoints?: {
            api?: string
          }
        }
      }
    }

    return normalizeUrl(parsed.data?.viewer?.copilotEndpoints?.api)
  } catch {
    return undefined
  }
}

export function getGitHubCopilotApiUrl(): string | undefined {
  if (cachedCopilotApiUrl !== undefined) {
    return cachedCopilotApiUrl ?? undefined
  }

  const resolved = getEnvCopilotApiUrl() || getGhCliCopilotApiUrl()
  cachedCopilotApiUrl = resolved ?? null
  return resolved
}
