// Content for the microcode-api bundled skill.
// Each .md file is inlined as a string at build time via Bun's text loader.

import csharpMicrocodeApi from './microcode-api/csharp/microcode-api.md'
import curlExamples from './microcode-api/curl/examples.md'
import goMicrocodeApi from './microcode-api/go/microcode-api.md'
import javaMicrocodeApi from './microcode-api/java/microcode-api.md'
import phpMicrocodeApi from './microcode-api/php/microcode-api.md'
import pythonAgentSdkPatterns from './microcode-api/python/agent-sdk/patterns.md'
import pythonAgentSdkReadme from './microcode-api/python/agent-sdk/README.md'
import pythonMicrocodeApiBatches from './microcode-api/python/microcode-api/batches.md'
import pythonMicrocodeApiFilesApi from './microcode-api/python/microcode-api/files-api.md'
import pythonMicrocodeApiReadme from './microcode-api/python/microcode-api/README.md'
import pythonMicrocodeApiStreaming from './microcode-api/python/microcode-api/streaming.md'
import pythonMicrocodeApiToolUse from './microcode-api/python/microcode-api/tool-use.md'
import rubyMicrocodeApi from './microcode-api/ruby/microcode-api.md'
import skillPrompt from './microcode-api/SKILL.md'
import sharedErrorCodes from './microcode-api/shared/error-codes.md'
import sharedLiveSources from './microcode-api/shared/live-sources.md'
import sharedModels from './microcode-api/shared/models.md'
import sharedPromptCaching from './microcode-api/shared/prompt-caching.md'
import sharedToolUseConcepts from './microcode-api/shared/tool-use-concepts.md'
import typescriptAgentSdkPatterns from './microcode-api/typescript/agent-sdk/patterns.md'
import typescriptAgentSdkReadme from './microcode-api/typescript/agent-sdk/README.md'
import typescriptMicrocodeApiBatches from './microcode-api/typescript/microcode-api/batches.md'
import typescriptMicrocodeApiFilesApi from './microcode-api/typescript/microcode-api/files-api.md'
import typescriptMicrocodeApiReadme from './microcode-api/typescript/microcode-api/README.md'
import typescriptMicrocodeApiStreaming from './microcode-api/typescript/microcode-api/streaming.md'
import typescriptMicrocodeApiToolUse from './microcode-api/typescript/microcode-api/tool-use.md'

// @[MODEL LAUNCH]: Update the model IDs/names below. These are substituted into {{VAR}}
// placeholders in the .md files at runtime before the skill prompt is sent.
// After updating these constants, manually update the two files that still hardcode models:
//   - microcode-api/SKILL.md (Current Models pricing table)
//   - microcode-api/shared/models.md (full model catalog with legacy versions and alias mappings)
export const SKILL_MODEL_VARS = {
  OPUS_ID: 'claude-opus-4-6',
  OPUS_NAME: 'Microcode Opus 4.6',
  SONNET_ID: 'claude-sonnet-4-6',
  SONNET_NAME: 'Microcode Sonnet 4.6',
  HAIKU_ID: 'claude-haiku-4-5',
  HAIKU_NAME: 'Microcode Haiku 4.5',
  // Previous Sonnet ID — used in "do not append date suffixes" example in SKILL.md.
  PREV_SONNET_ID: 'claude-sonnet-4-5',
} satisfies Record<string, string>

export const SKILL_PROMPT: string = skillPrompt

export const SKILL_FILES: Record<string, string> = {
  'csharp/microcode-api.md': csharpMicrocodeApi,
  'curl/examples.md': curlExamples,
  'go/microcode-api.md': goMicrocodeApi,
  'java/microcode-api.md': javaMicrocodeApi,
  'php/microcode-api.md': phpMicrocodeApi,
  'python/agent-sdk/README.md': pythonAgentSdkReadme,
  'python/agent-sdk/patterns.md': pythonAgentSdkPatterns,
  'python/microcode-api/README.md': pythonMicrocodeApiReadme,
  'python/microcode-api/batches.md': pythonMicrocodeApiBatches,
  'python/microcode-api/files-api.md': pythonMicrocodeApiFilesApi,
  'python/microcode-api/streaming.md': pythonMicrocodeApiStreaming,
  'python/microcode-api/tool-use.md': pythonMicrocodeApiToolUse,
  'ruby/microcode-api.md': rubyMicrocodeApi,
  'shared/error-codes.md': sharedErrorCodes,
  'shared/live-sources.md': sharedLiveSources,
  'shared/models.md': sharedModels,
  'shared/prompt-caching.md': sharedPromptCaching,
  'shared/tool-use-concepts.md': sharedToolUseConcepts,
  'typescript/agent-sdk/README.md': typescriptAgentSdkReadme,
  'typescript/agent-sdk/patterns.md': typescriptAgentSdkPatterns,
  'typescript/microcode-api/README.md': typescriptMicrocodeApiReadme,
  'typescript/microcode-api/batches.md': typescriptMicrocodeApiBatches,
  'typescript/microcode-api/files-api.md': typescriptMicrocodeApiFilesApi,
  'typescript/microcode-api/streaming.md': typescriptMicrocodeApiStreaming,
  'typescript/microcode-api/tool-use.md': typescriptMicrocodeApiToolUse,
}
