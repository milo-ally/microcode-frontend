// 项目内部模块
import { profileCheckpoint, profileReport } from './utils/startupProfiler.js'; // TODO: src/utils
profileCheckpoint('main_tsx_entry');

import { startMdmRawRead } from './utils/settings/mdm/rawRead.js'; // TODO: src/utils
startMdmRawRead();

import { ensureKeychainPrefetchCompleted, startKeychainPrefetch } from './utils/secureStorage/keychainPrefetch.js'; // TODO: src/utils
startKeychainPrefetch();

// 第三方库
import { feature } from 'bun:bundle'; // Bun 内置模块
import { Command as CommanderCommand, InvalidArgumentError, Option } from '@commander-js/extra-typings'; // 命令行解析库
import chalk from 'chalk'; // 终端颜色库
import { readFileSync } from 'fs'; // Node.js 内置文件系统
import mapValues from 'lodash-es/mapValues.js'; // Lodash 工具函数
import pickBy from 'lodash-es/pickBy.js'; // Lodash 工具函数
import uniqBy from 'lodash-es/uniqBy.js'; // Lodash 工具函数
import React from 'react'; // React 框架

// 项目内部模块
import { getOauthConfig } from './constants/oauth.js'; // TODO: src/constants
import { getRemoteSessionUrl } from './constants/product.js'; // TODO: src/constants
import { getSystemContext, getUserContext } from './context.js'; // TODO: src/
import { init, initializeTelemetryAfterTrust } from './entrypoints/init.js'; // TODO: src/entrypoints
import { addToHistory } from './history.js'; // TODO: src/
import type { Root } from './ink.js'; // TODO: src/
import { launchRepl } from './replLauncher.js'; // TODO: src/
import { hasGrowthBookEnvOverride, initializeGrowthBook, refreshGrowthBookAfterAuthChange } from './services/analytics/growthbook.js'; // TODO: src/services/analytics
import { fetchBootstrapData } from './services/api/bootstrap.js'; // TODO: src/services/api
import { type DownloadResult, downloadSessionFiles, type FilesApiConfig, parseFileSpecs } from './services/api/filesApi.js'; // TODO: src/services/api
import { prefetchPassesEligibility } from './services/api/referral.js'; // TODO: src/services/api
import { prefetchOfficialMcpUrls } from './services/mcp/officialRegistry.js'; // TODO: src/services/mcp
import type { McpSdkServerConfig, McpServerConfig, ScopedMcpServerConfig } from './services/mcp/types.js'; // TODO: src/services/mcp
import { isPolicyAllowed, loadPolicyLimits, refreshPolicyLimits, waitForPolicyLimitsToLoad } from './services/policyLimits/index.js'; // TODO: src/services/policyLimits
import { loadRemoteManagedSettings, refreshRemoteManagedSettings } from './services/remoteManagedSettings/index.js'; // TODO: src/services/remoteManagedSettings
import type { ToolInputJSONSchema } from './Tool.js'; // TODO: src/
import { createSyntheticOutputTool, isSyntheticOutputToolEnabled } from './tools/SyntheticOutputTool/SyntheticOutputTool.js'; // TODO: src/tools
import { getTools } from './tools.js'; // TODO: src/
import { canUserConfigureAdvisor, getInitialAdvisorSetting, isAdvisorEnabled, isValidAdvisorModel, modelSupportsAdvisor } from './utils/advisor.js'; // TODO: src/utils
import { isAgentSwarmsEnabled } from './utils/agentSwarmsEnabled.js'; // TODO: src/utils
import { count, uniq } from './utils/array.js'; // TODO: src/utils
import { installAsciicastRecorder } from './utils/asciicast.js'; // TODO: src/utils
import { getSubscriptionType, isMicrocodeAISubscriber, prefetchAwsCredentialsAndBedRockInfoIfSafe, prefetchGcpCredentialsIfSafe, validateForceLoginOrg } from './utils/auth.js'; // TODO: src/utils
import { checkHasTrustDialogAccepted, getGlobalConfig, getRemoteControlAtStartup, isAutoUpdaterDisabled, saveGlobalConfig } from './utils/config.js'; // TODO: src/utils
import { seedEarlyInput, stopCapturingEarlyInput } from './utils/earlyInput.js'; // TODO: src/utils
import { getInitialEffortSetting, parseEffortValue } from './utils/effort.js'; // TODO: src/utils
import { getInitialFastModeSetting, isFastModeEnabled, prefetchFastModeStatus, resolveFastModeStatusFromCache } from './utils/fastMode.js'; // TODO: src/utils
import { applyConfigEnvironmentVariables } from './utils/managedEnv.js'; // TODO: src/utils
import { createSystemMessage, createUserMessage } from './utils/messages.js'; // TODO: src/utils
import { getPlatform } from './utils/platform.js'; // TODO: src/utils
import { getBaseRenderOptions } from './utils/renderOptions.js'; // TODO: src/utils
import { getSessionIngressAuthToken } from './utils/sessionIngressAuth.js'; // TODO: src/utils
import { settingsChangeDetector } from './utils/settings/changeDetector.js'; // TODO: src/utils/settings
import { skillChangeDetector } from './utils/skills/skillChangeDetector.js'; // TODO: src/utils/skills
import { jsonParse, writeFileSync_DEPRECATED } from './utils/slowOperations.js'; // TODO: src/utils
import { computeInitialTeamContext } from './utils/swarm/reconnection.js'; // TODO: src/utils/swarm
import { initializeWarningHandler } from './utils/warningHandler.js'; // TODO: src/utils
import { isWorktreeModeEnabled } from './utils/worktreeModeEnabled.js'; // TODO: src/utils

// 项目内部模块
const getTeammateUtils = () => require('./utils/teammate.js') as typeof import('./utils/teammate.js'); // TODO: src/utils
const getTeammatePromptAddendum = () => require('./utils/swarm/teammatePromptAddendum.js') as typeof import('./utils/swarm/teammatePromptAddendum.js'); // TODO: src/utils/swarm
const getTeammateModeSnapshot = () => require('./utils/swarm/backends/teammateModeSnapshot.js') as typeof import('./utils/swarm/backends/teammateModeSnapshot.js'); // TODO: src/utils/swarm
const coordinatorModeModule = feature('COORDINATOR_MODE') ? require('./coordinator/coordinatorMode.js') as typeof import('./coordinator/coordinatorMode.js') : null; // TODO: src/coordinator
const assistantModule = feature('KAIROS') ? require('./assistant/index.js') as typeof import('./assistant/index.js') : null; // TODO: src/assistant
const kairosGate = feature('KAIROS') ? require('./assistant/gate.js') as typeof import('./assistant/gate.js') : null; // TODO: src/assistant

// 第三方库
import { relative, resolve } from 'path'; // Node.js 内置模块

// 项目内部模块
import { isAnalyticsDisabled } from 'src/services/analytics/config.js'; // TODO: src/services/analytics
import { getFeatureValue_CACHED_MAY_BE_STALE } from 'src/services/analytics/growthbook.js'; // TODO: src/services/analytics
import { type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS, logEvent } from 'src/services/analytics/index.js'; // TODO: src/services/analytics
import { initializeAnalyticsGates } from 'src/services/analytics/sink.js'; // TODO: src/services/analytics
import { getOriginalCwd, setAdditionalDirectoriesForMicrocodeMd, setIsRemoteMode, setMainLoopModelOverride, setMainThreadAgentType, setTeleportedSessionInfo } from './bootstrap/state.js'; // TODO: src/bootstrap
import { filterCommandsForRemoteMode, getCommands } from './commands.js'; // TODO: src/
import type { StatsStore } from './context/stats.js'; // TODO: src/context
import { launchAssistantInstallWizard, launchAssistantSessionChooser, launchInvalidSettingsDialog, launchResumeChooser, launchSnapshotUpdateDialog, launchTeleportRepoMismatchDialog, launchTeleportResumeWrapper } from './dialogLaunchers.js'; // TODO: src/
import { SHOW_CURSOR } from './ink/termio/dec.js'; // TODO: src/ink
import { exitWithError, exitWithMessage, getRenderContext, renderAndRun, showSetupScreens } from './interactiveHelpers.js'; // TODO: src/
import { initBuiltinPlugins } from './plugins/bundled/index.js'; // TODO: src/plugins
import { checkQuotaStatus } from './services/microcodeAiLimits.js'; // TODO: src/services
import { getMcpToolsCommandsAndResources, prefetchAllMcpResources } from './services/mcp/client.js'; // TODO: src/services/mcp
import { VALID_INSTALLABLE_SCOPES, VALID_UPDATE_SCOPES } from './services/plugins/pluginCliCommands.js'; // TODO: src/services/plugins
import { initBundledSkills } from './skills/bundled/index.js'; // TODO: src/skills
import type { AgentColorName } from './tools/AgentTool/agentColorManager.js'; // TODO: src/tools/AgentTool
import { getActiveAgentsFromList, getAgentDefinitionsWithOverrides, isBuiltInAgent, isCustomAgent, parseAgentsFromJson } from './tools/AgentTool/loadAgentsDir.js'; // TODO: src/tools/AgentTool
import type { LogOption } from './types/logs.js'; // TODO: src/types
import type { Message as MessageType } from './types/message.js'; // TODO: src/types
import { assertMinVersion } from './utils/autoUpdater.js'; // TODO: src/utils
import { MICROCODE_IN_CHROME_SKILL_HINT, MICROCODE_IN_CHROME_SKILL_HINT_WITH_WEBBROWSER } from './utils/microcodeInChrome/prompt.js'; // TODO: src/utils
import { setupMicrocodeInChrome, shouldAutoEnableMicrocodeInChrome, shouldEnableMicrocodeInChrome } from './utils/microcodeInChrome/setup.js'; // TODO: src/utils
import { getContextWindowForModel } from './utils/context.js'; // TODO: src/utils
import { loadConversationForResume } from './utils/conversationRecovery.js'; // TODO: src/utils
import { buildDeepLinkBanner } from './utils/deepLink/banner.js'; // TODO: src/utils
import { hasNodeOption, isBareMode, isEnvTruthy, isInProtectedNamespace } from './utils/envUtils.js'; // TODO: src/utils
import { refreshExampleCommands } from './utils/exampleCommands.js'; // TODO: src/utils
import type { FpsMetrics } from './utils/fpsTracker.js'; // TODO: src/utils
import { getWorktreePaths } from './utils/getWorktreePaths.js'; // TODO: src/utils
import { findGitRoot, getBranch, getIsGit, getWorktreeCount } from './utils/git.js'; // TODO: src/utils
import { getGhAuthStatus } from './utils/github/ghAuthStatus.js'; // TODO: src/utils
import { safeParseJSON } from './utils/json.js'; // TODO: src/utils
import { logError } from './utils/log.js'; // TODO: src/utils
import { getModelDeprecationWarning } from './utils/model/deprecation.js'; // TODO: src/utils
import { getDefaultMainLoopModel, getUserSpecifiedModelSetting, normalizeModelStringForAPI, parseUserSpecifiedModel } from './utils/model/model.js'; // TODO: src/utils
import { ensureModelStringsInitialized } from './utils/model/modelStrings.js'; // TODO: src/utils
import { PERMISSION_MODES } from './utils/permissions/PermissionMode.js'; // TODO: src/utils
import { checkAndDisableBypassPermissions, getAutoModeEnabledStateIfCached, initializeToolPermissionContext, initialPermissionModeFromCLI, isDefaultPermissionModeAuto, parseToolListFromCLI, removeDangerousPermissions, stripDangerousPermissionsForAutoMode, verifyAutoModeGateAccess } from './utils/permissions/permissionSetup.js'; // TODO: src/utils
import { cleanupOrphanedPluginVersionsInBackground } from './utils/plugins/cacheUtils.js'; // TODO: src/utils
import { initializeVersionedPlugins } from './utils/plugins/installedPluginsManager.js'; // TODO: src/utils
import { getManagedPluginNames } from './utils/plugins/managedPlugins.js'; // TODO: src/utils
import { getGlobExclusionsForPluginCache } from './utils/plugins/orphanedPluginFilter.js'; // TODO: src/utils
import { getPluginSeedDirs } from './utils/plugins/pluginDirectories.js'; // TODO: src/utils
import { countFilesRoundedRg } from './utils/ripgrep.js'; // TODO: src/utils
import { processSessionStartHooks, processSetupHooks } from './utils/sessionStart.js'; // TODO: src/utils
import { cacheSessionTitle, getSessionIdFromLog, loadTranscriptFromFile, saveAgentSetting, saveMode, searchSessionsByCustomTitle, sessionIdExists } from './utils/sessionStorage.js'; // TODO: src/utils
import { ensureMdmSettingsLoaded } from './utils/settings/mdm/settings.js'; // TODO: src/utils
import { getInitialSettings, getManagedSettingsKeysForLogging, getSettingsForSource, getSettingsWithErrors } from './utils/settings/settings.js'; // TODO: src/utils
import { resetSettingsCache } from './utils/settings/settingsCache.js'; // TODO: src/utils
import type { ValidationError } from './utils/settings/validation.js'; // TODO: src/utils
import { DEFAULT_TASKS_MODE_TASK_LIST_ID, TASK_STATUSES } from './utils/tasks.js'; // TODO: src/utils
import { logPluginLoadErrors, logPluginsEnabledForSession } from './utils/telemetry/pluginTelemetry.js'; // TODO: src/utils
import { logSkillsLoaded } from './utils/telemetry/skillLoadedEvent.js'; // TODO: src/utils
import { generateTempFilePath } from './utils/tempfile.js'; // TODO: src/utils
import { validateUuid } from './utils/uuid.js'; // TODO: src/utils
import { registerMcpAddCommand } from 'src/commands/mcp/addCommand.js'; // TODO: src/commands/mcp
import { registerMcpXaaIdpCommand } from 'src/commands/mcp/xaaIdpCommand.js'; // TODO: src/commands/mcp
import { logPermissionContextForAnts } from 'src/services/internalLogging.js'; // TODO: src/services
import { fetchMicrocodeAIMcpConfigsIfEligible } from 'src/services/mcp/microcodeai.js'; // TODO: src/services/mcp
import { clearServerCache } from 'src/services/mcp/client.js'; // TODO: src/services/mcp
import { areMcpConfigsAllowedWithEnterpriseMcpConfig, dedupMicrocodeAiMcpServers, doesEnterpriseMcpConfigExist, filterMcpServersByPolicy, getMicroCodeMcpConfigs, getMcpServerSignature, parseMcpConfig, parseMcpConfigFromFilePath } from 'src/services/mcp/config.js'; // TODO: src/services/mcp
import { excludeCommandsByServer, excludeResourcesByServer } from 'src/services/mcp/utils.js'; // TODO: src/services/mcp
import { isXaaEnabled } from 'src/services/mcp/xaaIdpLogin.js'; // TODO: src/services/mcp
import { getRelevantTips } from 'src/services/tips/tipRegistry.js'; // TODO: src/services
import { logContextMetrics } from 'src/utils/api.js'; // TODO: src/utils
import { MICROCODE_IN_CHROME_MCP_SERVER_NAME, isMicrocodeInChromeMCPServer } from 'src/utils/microcodeInChrome/common.js'; // TODO: src/utils
import { registerCleanup } from 'src/utils/cleanupRegistry.js'; // TODO: src/utils
import { eagerParseCliFlag } from 'src/utils/cliArgs.js'; // TODO: src/utils
import { createEmptyAttributionState } from 'src/utils/commitAttribution.js'; // TODO: src/utils
import { countConcurrentSessions, registerSession, updateSessionName } from 'src/utils/concurrentSessions.js'; // TODO: src/utils
import { getCwd } from 'src/utils/cwd.js'; // TODO: src/utils
import { logForDebugging, setHasFormattedOutput } from 'src/utils/debug.js'; // TODO: src/utils
import { errorMessage, getErrnoCode, isENOENT, TeleportOperationError, toError } from 'src/utils/errors.js'; // TODO: src/utils
import { getFsImplementation, safeResolvePath } from 'src/utils/fsOperations.js'; // TODO: src/utils
import { gracefulShutdown, gracefulShutdownSync } from 'src/utils/gracefulShutdown.js'; // TODO: src/utils
import { setAllHookEventsEnabled } from 'src/utils/hooks/hookEvents.js'; // TODO: src/utils
import { refreshModelCapabilities } from 'src/utils/model/modelCapabilities.js'; // TODO: src/utils
import { peekForStdinData, writeToStderr } from 'src/utils/process.js'; // TODO: src/utils
import { setCwd } from 'src/utils/Shell.js'; // TODO: src/utils
import { type ProcessedResume, processResumedConversation } from 'src/utils/sessionRestore.js'; // TODO: src/utils
import { parseSettingSourcesFlag } from 'src/utils/settings/constants.js'; // TODO: src/utils
import { plural } from 'src/utils/stringUtils.js'; // TODO: src/utils
import { type ChannelEntry, getInitialMainLoopModel, getIsNonInteractiveSession, getSdkBetas, getSessionId, getUserMsgOptIn, setAllowedChannels, setAllowedSettingSources, setChromeFlagOverride, setClientType, setCwdState, setDirectConnectServerUrl, setFlagSettingsPath, setInitialMainLoopModel, setInlinePlugins, setIsInteractive, setKairosActive, setOriginalCwd, setQuestionPreviewFormat, setSdkBetas, setSessionBypassPermissionsMode, setSessionPersistenceDisabled, setSessionSource, setUserMsgOptIn, switchSession } from './bootstrap/state.js'; // TODO: src/bootstrap

// 项目内部模块
const autoModeStateModule = feature('TRANSCRIPT_CLASSIFIER') ? require('./utils/permissions/autoModeState.js') as typeof import('./utils/permissions/autoModeState.js') : null; // TODO: src/utils

// 项目内部模块
import { migrateAutoUpdatesToSettings } from './migrations/migrateAutoUpdatesToSettings.js'; // TODO: src/migrations
import { migrateBypassPermissionsAcceptedToSettings } from './migrations/migrateBypassPermissionsAcceptedToSettings.js'; // TODO: src/migrations
import { migrateEnableAllProjectMcpServersToSettings } from './migrations/migrateEnableAllProjectMcpServersToSettings.js'; // TODO: src/migrations
import { migrateFennecToOpus } from './migrations/migrateFennecToOpus.js'; // TODO: src/migrations
import { migrateLegacyOpusToCurrent } from './migrations/migrateLegacyOpusToCurrent.js'; // TODO: src/migrations
import { migrateOpusToOpus1m } from './migrations/migrateOpusToOpus1m.js'; // TODO: src/migrations
import { migrateReplBridgeEnabledToRemoteControlAtStartup } from './migrations/migrateReplBridgeEnabledToRemoteControlAtStartup.js'; // TODO: src/migrations
import { migrateSonnet1mToSonnet45 } from './migrations/migrateSonnet1mToSonnet45.js'; // TODO: src/migrations
import { migrateSonnet45ToSonnet46 } from './migrations/migrateSonnet45ToSonnet46.js'; // TODO: src/migrations
import { resetAutoModeOptInForDefaultOffer } from './migrations/resetAutoModeOptInForDefaultOffer.js'; // TODO: src/migrations
import { resetProToOpusDefault } from './migrations/resetProToOpusDefault.js'; // TODO: src/migrations
import { createRemoteSessionConfig } from './remote/RemoteSessionManager.js'; // TODO: src/remote
import { createDirectConnectSession, DirectConnectError } from './server/createDirectConnectSession.js'; // TODO: src/server
import { initializeLspServerManager } from './services/lsp/manager.js'; // TODO: src/services/lsp
import { shouldEnablePromptSuggestion } from './services/PromptSuggestion/promptSuggestion.js'; // TODO: src/services
import { type AppState, getDefaultAppState, IDLE_SPECULATION_STATE } from './state/AppStateStore.js'; // TODO: src/state
import { onChangeAppState } from './state/onChangeAppState.js'; // TODO: src/state
import { createStore } from './state/store.js'; // TODO: src/state
import { asSessionId } from './types/ids.js'; // TODO: src/types
import { filterAllowedSdkBetas } from './utils/betas.js'; // TODO: src/utils
import { isInBundledMode, isRunningWithBun } from './utils/bundledMode.js'; // TODO: src/utils
import { logForDiagnosticsNoPII } from './utils/diagLogs.js'; // TODO: src/utils
import { filterExistingPaths, getKnownPathsForRepo } from './utils/githubRepoPathMapping.js'; // TODO: src/utils
import { clearPluginCache, loadAllPluginsCacheOnly } from './utils/plugins/pluginLoader.js'; // TODO: src/utils
import { migrateChangelogFromConfig } from './utils/releaseNotes.js'; // TODO: src/utils
import { SandboxManager } from './utils/sandbox/sandbox-adapter.js'; // TODO: src/utils
import { fetchSession, prepareApiRequest } from './utils/teleport/api.js'; // TODO: src/utils
import { checkOutTeleportedSessionBranch, processMessagesForTeleportResume, teleportToRemoteWithErrorHandling, validateGitState, validateSessionRepository } from './utils/teleport.js'; // TODO: src/utils
import { shouldEnableThinkingByDefault, type ThinkingConfig } from './utils/thinking.js'; // TODO: src/utils
import { initUser, resetUserCache } from './utils/user.js'; // TODO: src/utils
import { getTmuxInstallInstructions, isTmuxAvailable, parsePRReference } from './utils/worktree.js'; // TODO: src/utils
profileCheckpoint('main_tsx_imports_loaded');


// 这是用来记录管理设置的函数， 用于数据分析
function logManagedSettings(): void {
  try {
    const policySettings = getSettingsForSource('policySettings');
    if (policySettings) {
      const allKeys = getManagedSettingsKeysForLogging(policySettings);
      logEvent('tengu_managed_settings_loaded', {
        keyCount: allKeys.length,
        keys: allKeys.join(',') as unknown as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      });
    }
  } catch {
    // Silently ignore errors - this is just for analytics
  }
}

// 检查是否以调试模式运行
function isBeingDebugged() {
  const isBun = isRunningWithBun();
  const hasInspectArg = process.execArgv.some(arg => {
    if (isBun) {
      return /--inspect(-brk)?/.test(arg);
    } else {
      return /--inspect(-brk)?|--debug(-brk)?/.test(arg);
    }
  });
  const hasInspectEnv = process.env.NODE_OPTIONS && /--inspect(-brk)?|--debug(-brk)?/.test(process.env.NODE_OPTIONS);
  try {
    const inspector = (global as any).require('inspector');
    const hasInspectorUrl = !!inspector.url();
    return hasInspectorUrl || hasInspectArg || hasInspectEnv;
  } catch {
    return hasInspectArg || hasInspectEnv;
  }
}

// Exit if we detect node debugging or inspection
if ("external" !== 'ant' && isBeingDebugged()) {
  // Use process.exit directly here since we're in the top-level code before imports
  // and gracefulShutdown is not yet available
  // eslint-disable-next-line custom-rules/no-top-level-side-effects
  process.exit(1);
}

/**
 * 每个会话的技能/插件遥测统计。从交互模式和无头 -p 模式（runHeadless 之前）都会调用。
 * 两者都走 main.tsx 逻辑，但在交互启动流程前就已分支，因此需要在此处写两个调用点，
 * 而不是一个在这里、另一个在 QueryEngine 里。
 */
function logSessionTelemetry(): void {
    const model = parseUserSpecifiedModel(
        getInitialMainLoopModel() ?? getDefaultMainLoopModel()
    );
    void logSkillsLoaded(
        getCwd(), 
        getContextWindowForModel(model, getSdkBetas())
    );
    void loadAllPluginsCacheOnly().then(({
        enabled,
        errors
    }) => {
        const managedNames = getManagedPluginNames();
        logPluginsEnabledForSession(enabled, managedNames, getPluginSeedDirs());
        logPluginLoadErrors(errors, managedNames);
    }).catch(err => logError(err));   
}

async function logStartupTelemetry(): Promise<void> {
  if (isAnalyticsDisabled()) return;
  const [isGit, worktreeCount, ghAuthStatus] = await Promise.all([getIsGit(), getWorktreeCount(), getGhAuthStatus()]);
  logEvent('tengu_startup_telemetry', {
    is_git: isGit,
    worktree_count: worktreeCount,
    gh_auth_status: ghAuthStatus as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
    sandbox_enabled: SandboxManager.isSandboxingEnabled(),
    are_unsandboxed_commands_allowed: SandboxManager.areUnsandboxedCommandsAllowed(),
    is_auto_bash_allowed_if_sandbox_enabled: SandboxManager.isAutoAllowBashIfSandboxedEnabled(),
    auto_updater_disabled: isAutoUpdaterDisabled(),
    prefers_reduced_motion: getInitialSettings().prefersReducedMotion ?? false,
    ...getCertEnvVarTelemetry()
  });
}

function getCertEnvVarTelemetry(): Record<string, boolean> {
    const result: Record<string, boolean> = {}; 
    if (process.env.NODE_EXTRA_CA_CERTS) {
        result.has_node_extra_ca_certs = true; 
    }
    if (process.env.MICROCODE_CLIENT_CERT) {
        result.has_client_cert = true; 
    }
    if (hasNodeOption('--use-system-ca')) {
        result.has_use_system_ca = true;
    }
    if (hasNodeOption('--use-openssl-ca')) {
        result.has_use_openssl_ca = true; 
    }
    return result;
}

// @[模型发布]：新增模型时记得添加对应的迁移脚本，参考 migrateSonnet1mToSonnet45.ts
// 新增同步迁移时需要 bump 该版本，让老用户重新执行迁移集
const CURRENT_MIGRATION_VERSION = 11;

function runMigrations(): void {
  // 如果本地配置版本低于当前迁移版本 → 执行全部升级
  if (getGlobalConfig().migrationVersion !== CURRENT_MIGRATION_VERSION) {
    
    // 各种配置/模型/功能的迁移逻辑
    migrateAutoUpdatesToSettings();
    migrateBypassPermissionsAcceptedToSettings();
    migrateEnableAllProjectMcpServersToSettings();
    resetProToOpusDefault();
    migrateSonnet1mToSonnet45();
    migrateLegacyOpusToCurrent();
    migrateSonnet45ToSonnet46();
    migrateOpusToOpus1m();
    migrateReplBridgeEnabledToRemoteControlAtStartup();

    // 特性开关控制的可选迁移
    if (feature('TRANSCRIPT_CLASSIFIER')) {
      resetAutoModeOptInForDefaultOffer();
    }
    if ("external" === 'ant') {
      migrateFennecToOpus();
    }

    // 保存最新版本号，避免重复执行
    saveGlobalConfig(prev => prev.migrationVersion === CURRENT_MIGRATION_VERSION ? prev : {
      ...prev,
      migrationVersion: CURRENT_MIGRATION_VERSION
    });
  }

  // 异步迁移 - 后台执行，不阻塞启动
  migrateChangelogFromConfig().catch(() => {
    // 静默失败，下次启动重试
  });
}

/**
 * 仅在安全的前提下预加载系统上下文（包括 Git 状态）。
 * Git 命令可能通过钩子和配置执行任意代码（例如 core.fsmonitor、diff.external），
 * 因此必须在建立信任之后，或在信任关系隐式成立的非交互模式下，才能执行这类操作。
 */
function prefetchSystemContextIfSafe(): void {
    const isNonInteractiveSession = getIsNonInteractiveSession(); 
    if (isNonInteractiveSession) {
        logForDiagnosticsNoPII('info', 'prefetch_system_context_non_interactive'); 
        void getSystemContext();
        return; 
    }
    const hasTrust = checkHasTrustDialogAccepted(); 
    if (hasTrust) {
        logForDiagnosticsNoPII('info', 'prefetch_system_context_has_trust');
        void getSystemContext();
    } else {
        logForDiagnosticsNoPII('info', 'prefetch_system_context_skipped_no_trust');
    }
}

/**
 * 启动【首次渲染前不需要】的后台预加载与资源清理任务。
 * 这些任务从 setup() 中延迟执行，以减少关键启动路径中的事件循环竞争
 * 和子进程创建压力。
 * 请在 REPL 渲染完成后调用此函数。
 */
export function startDeferredPrefetches(): void {
    if (isEnvTruthy(process.env.MICROCODE_EXIT_AFTER_FIRST_RENDER) ||
        isBareMode()) {
        return;
    }
    void initUser();
    void getUserContext();
    prefetchSystemContextIfSafe();
    void getRelevantTips();
    if (isEnvTruthy(process.env.MICROCODE_USE_BEDROCK) && !isEnvTruthy(process.env.MICROCODE_SKIP_BEDROCK_AUTH)) {
        void prefetchAwsCredentialsAndBedRockInfoIfSafe();
    }
    if (isEnvTruthy(process.env.MICROCODE_USE_VERTEX) && !isEnvTruthy(process.env.MICROCODE_SKIP_VERTEX_AUTH)) {
        void prefetchGcpCredentialsIfSafe();
    }
    void countFilesRoundedRg(getCwd(), AbortSignal.timeout(3000), []);
    void initializeAnalyticsGates();
    void prefetchOfficialMcpUrls();
    void refreshModelCapabilities();
    void settingsChangeDetector.initialize();
    if (!isBareMode()) {
        void skillChangeDetector.initialize();
    }
    if ("external" === 'ant') {
        void import('./utils/eventLoopStallDetector.js').then(m => m.startEventLoopStallDetector()); // TODO: src/utils
    }
}

function loadSettingsFromFlag(settingsFile: string): void {
  try {
    const trimmedSettings = settingsFile.trim();
    const looksLikeJson = trimmedSettings.startsWith('{') && trimmedSettings.endsWith('}');
    let settingsPath: string;
    if (looksLikeJson) {
      // 传入的是 JSON 字符串 - 验证格式并创建临时文件
      const parsedJson = safeParseJSON(trimmedSettings);
      if (!parsedJson) {
        process.stderr.write(chalk.red('Error: Invalid JSON provided to --settings\n'));
        process.exit(1);
      }
      // 创建临时文件并将 JSON 写入其中
      // 使用基于内容哈希的路径而非随机 UUID，避免破坏 Anthropic API 的提示词缓存
      // 配置路径最终会进入 Bash 工具的沙箱限制列表，成为发送给 API 的工具描述的一部分
      // 每个子进程使用随机 UUID 会导致每次 query() 调用都改变工具描述
      // 使缓存前缀失效，造成 12 倍的输入 Token 成本增加
      // 内容哈希可确保相同配置在跨进程时生成相同路径（每个 SDK query() 都会生成新进程）
      settingsPath = generateTempFilePath('microcode-settings', '.json', {
        contentHash: trimmedSettings
      });
      writeFileSync_DEPRECATED(settingsPath, trimmedSettings, 'utf8');
    } else {
      // 传入的是文件路径 - 解析并尝试读取以验证有效性
      const {
        resolvedPath: resolvedSettingsPath
      } = safeResolvePath(getFsImplementation(), settingsFile);
      try {
        readFileSync(resolvedSettingsPath, 'utf8');
      } catch (e) {
        if (isENOENT(e)) {
          process.stderr.write(chalk.red(`Error: Settings file not found: ${resolvedSettingsPath}\n`));
          process.exit(1);
        }
        throw e;
      }
      settingsPath = resolvedSettingsPath;
    }
    setFlagSettingsPath(settingsPath);
    resetSettingsCache();
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }
    process.stderr.write(chalk.red(`Error processing settings: ${errorMessage(error)}\n`));
    process.exit(1);
  }
}

function loadSettingSourcesFromFlag(settingSourcesArg: string): void {
  try {
    const sources = parseSettingSourcesFlag(settingSourcesArg);
    setAllowedSettingSources(sources);
    resetSettingsCache();
  } catch (error) {
    if (error instanceof Error) {
      logError(error);
    }
    process.stderr.write(chalk.red(`Error processing --setting-sources: ${errorMessage(error)}\n`));
    process.exit(1);
  }
}

/**
 * 在 init() 之前提前解析并加载配置标志
 * 确保从初始化一开始就正确过滤和应用配置
 */
function eagerLoadSettings(): void {
  profileCheckpoint('eagerLoadSettings_start');
  const settingsFile = eagerParseCliFlag('--settings');
  if (settingsFile) {
    loadSettingsFromFlag(settingsFile);
  }
  const settingSourcesArg = eagerParseCliFlag('--setting-sources');
  if (settingSourcesArg !== undefined) {
    loadSettingSourcesFromFlag(settingSourcesArg);
  }
  profileCheckpoint('eagerLoadSettings_end');
}

function initializeEntrypoint(isNonInteractive: boolean): void {
  if (process.env.MICROCODE_ENTRYPOINT) {
    return;
  }
  const cliArgs = process.argv.slice(2);
  const mcpIndex = cliArgs.indexOf('mcp');
  if (mcpIndex !== -1 && cliArgs[mcpIndex + 1] === 'serve') {
    process.env.MICROCODE_ENTRYPOINT = 'mcp';
    return;
  }
  if (isEnvTruthy(process.env.MICROCODE_ACTION)) {
    process.env.MICROCODE_ENTRYPOINT = 'microcode-github-action';
    return;
  }
  process.env.MICROCODE_ENTRYPOINT = isNonInteractive ? 'sdk-cli' : 'cli';
}

// 当检测到执行 `microcode open <url>` 时，由早期 argv 处理设置（仅适用于交互模式）
type PendingConnect = {
    url: string | undefined;
    authToken: string | undefined;
    dangerouslySkipPermissions: boolean;
};

const _pendingConnect: PendingConnect | undefined = feature('DIRECT_CONNECT') ? {url: undefined,
    authToken: undefined,
    dangerouslySkipPermissions: false
} : undefined;

type PendingAssistantChat = {
    sessionId?: string; 
    discover: boolean;
}; 

const _pendingAssistantChat: PendingAssistantChat | undefined = feature('KAIROS') ? {
    sessionId: undefined, 
    discover: false 
} : undefined; 


// `microcode ssh <host> [dir]` — 从 argv 提前解析（与上面 DIRECT_CONNECT 相同模式）
// 让主命令流程可以识别并为 REPL 提供一个基于 SSH 的远程会话，而非本地会话。
type PendingSSH = {
  host: string | undefined;
  cwd: string | undefined;
  permissionMode: string | undefined;
  dangerouslySkipPermissions: boolean;
  local: boolean;
  extraCliArgs: string[];
};

const _pendingSSH: PendingSSH | undefined = feature('SSH_REMOTE') ? {
    host: undefined, 
    cwd: undefined, 
    permissionMode: undefined, 
    dangerouslySkipPermissions: false, 
    local: false, 
    extraCliArgs: [] 
} : undefined; 

export async function main() {
    /* ============== 警告处理器开始初始化 ============== */ 
    profileCheckpoint('main_function_start'); 

    // 保留修复后的 debug 别名，又不会在 Commander 里注册非法的多字符短标志
    if (process.argv.includes('-d2e')) {
        process.argv = process.argv.map(arg => arg === '-d2e' ? '--debug-to-stderr' : arg);
    }

    // 在 Windows 上，禁止系统从当前文件夹自动运行可执行文件，防止病毒，恶意程序偷偷运行。
    process.env.NoDefaultCurrentDirectoryInExePath = '1';

    // 尽早初始化警告处理器，捕获所有警告
    initializeWarningHandler();

    // 程序退出时，重置光标状态
    process.on('exit', () => { resetCursor(); });

    // 监听 Ctrl+C 中断信号
    process.on('SIGINT', () => {
        if (process.argv.includes('-p') || process.argv.includes('--print')) {
            return;
        }
        process.exit(0);
    });

    profileCheckpoint('main_warning_handler_initialized');
    /* ============== 警告处理器初始化完成 ============== */ 

    // 检查命令参数中是否包含 mc:// 或 mc+unix:// 地址并进行处理
    if (feature('DIRECT_CONNECT')) {
        const rawCliArgs = process.argv.slice(2);
        const ccIdx = rawCliArgs.findIndex(a => a.startsWith('mc://') || a.startsWith('mc+unix://'));
        if (ccIdx !== -1 && _pendingConnect) {
        const ccUrl = rawCliArgs[ccIdx]!;
        const {
            parseConnectUrl
        } = await import('./server/parseConnectUrl.js'); // TODO: src/server
        const parsed = parseConnectUrl(ccUrl);
        _pendingConnect.dangerouslySkipPermissions = rawCliArgs.includes('--dangerously-skip-permissions');
        if (rawCliArgs.includes('-p') || rawCliArgs.includes('--print')) {
            const stripped = rawCliArgs.filter((_, i) => i !== ccIdx);
            const dspIdx = stripped.indexOf('--dangerously-skip-permissions');
            if (dspIdx !== -1) {
            stripped.splice(dspIdx, 1);
            }
            process.argv = [process.argv[0]!, process.argv[1]!, 'open', ccUrl, ...stripped];
        } else {
            _pendingConnect.url = parsed.serverUrl;
            _pendingConnect.authToken = parsed.authToken;
            const stripped = rawCliArgs.filter((_, i) => i !== ccIdx);
            const dspIdx = stripped.indexOf('--dangerously-skip-permissions');
            if (dspIdx !== -1) {
            stripped.splice(dspIdx, 1);
            }
            process.argv = [process.argv[0]!, process.argv[1]!, ...stripped];
        }
        }
    }

    // 早期处理深层链接 URI，由操作系统协议处理器调用
    if (feature('LODESTONE')) {
        const handleUriIdx = process.argv.indexOf('--handle-uri');
        if (handleUriIdx !== -1 && process.argv[handleUriIdx + 1]) {
            const { enableConfigs } = await import('./utils/config.js'); // TODO: src/utils
            enableConfigs();
            const uri = process.argv[handleUriIdx + 1]!;
            const { handleDeepLinkUri } = await import('./utils/deepLink/protocolHandler.js'); // TODO: src/utils
            const exitCode = await handleDeepLinkUri(uri);
            process.exit(exitCode);
        }

        // macOS URL handler
        if (
              process.platform === 'darwin' && 
              process.env.__CFBundleIdentifier === 'com.anthropic.microcode-url-handler' // this url is fake
        ) {
            const { enableConfigs } = await import('./utils/config.js'); // TODO: src/utils
            enableConfigs();
            const { handleUrlSchemeLaunch } = await import('./utils/deepLink/protocolHandler.js'); // TODO: src/utils
            const urlSchemeResult = await handleUrlSchemeLaunch();
            process.exit(urlSchemeResult ?? 1);
        }
    }

    // 检查是否需要处理 assistant 命令
    if (feature('KAIROS') && _pendingAssistantChat) {
        const rawArgs = process.argv.slice(2);
        if (rawArgs[0] === 'assistant') {
            const nextArg = rawArgs[1];
            if (nextArg && !nextArg.startsWith('-')) {
                _pendingAssistantChat.sessionId = nextArg;
                rawArgs.splice(0, 2); // drop 'assistant' and sessionId
                process.argv = [process.argv[0]!, process.argv[1]!, ...rawArgs];
            } else if (!nextArg) {
                _pendingAssistantChat.discover = true;
                rawArgs.splice(0, 1); // drop 'assistant'
                process.argv = [process.argv[0]!, process.argv[1]!, ...rawArgs];
            }
        }
    }

    // 命令: microcode ssh <host> [dir] 
    if (feature('SSH_REMOTE') && _pendingSSH) {
        const rawCliArgs = process.argv.slice(2);
        if (rawCliArgs[0] === 'ssh') {
            const localIdx = rawCliArgs.indexOf('--local');
            if (localIdx !== -1) {
                _pendingSSH.local = true;
                rawCliArgs.splice(localIdx, 1);
            }
            const dspIdx = rawCliArgs.indexOf('--dangerously-skip-permissions');
            if (dspIdx !== -1) {
                _pendingSSH.dangerouslySkipPermissions = true;
                rawCliArgs.splice(dspIdx, 1);
            }
            const pmIdx = rawCliArgs.indexOf('--permission-mode');
            if (pmIdx !== -1 && rawCliArgs[pmIdx + 1] && !rawCliArgs[pmIdx + 1]!.startsWith('-')) {
                _pendingSSH.permissionMode = rawCliArgs[pmIdx + 1];
                rawCliArgs.splice(pmIdx, 2);
            }
            const pmEqIdx = rawCliArgs.findIndex(a => a.startsWith('--permission-mode='));
            if (pmEqIdx !== -1) {
                _pendingSSH.permissionMode = rawCliArgs[pmEqIdx]!.split('=')[1];
                rawCliArgs.splice(pmEqIdx, 1);
            }
            const extractFlag = (flag: string, opts: {
                hasValue?: boolean;
                as?: string;
            } = {}) => {
                const i = rawCliArgs.indexOf(flag);
                if (i !== -1) {
                    _pendingSSH.extraCliArgs.push(opts.as ?? flag);
                    const val = rawCliArgs[i + 1];
                    if (opts.hasValue && val && !val.startsWith('-')) {
                        _pendingSSH.extraCliArgs.push(val);
                        rawCliArgs.splice(i, 2);
                    } else {
                        rawCliArgs.splice(i, 1);
                    }
                }
                const eqI = rawCliArgs.findIndex(a => a.startsWith(`${flag}=`));
                if (eqI !== -1) {
                    _pendingSSH.extraCliArgs.push(opts.as ?? flag, rawCliArgs[eqI]!.slice(flag.length + 1));
                    rawCliArgs.splice(eqI, 1);
                }
            };
            extractFlag('-c', { as: '--continue'});
            extractFlag('--continue');
            extractFlag('--resume', { hasValue: true });
            extractFlag('--model', { hasValue: true });
        }
        if (rawCliArgs[0] === 'ssh' && rawCliArgs[1] && !rawCliArgs[1].startsWith('-')) {
            _pendingSSH.host = rawCliArgs[1];
            let consumed = 2;
            if (rawCliArgs[2] && !rawCliArgs[2].startsWith('-')) {
                _pendingSSH.cwd = rawCliArgs[2];
                consumed = 3;
            }
            const rest = rawCliArgs.slice(consumed);
            if (rest.includes('-p') || rest.includes('--print')) {
                process.stderr.write('Error: headless (-p/--print) mode is not supported with microcode ssh\n');
                gracefulShutdownSync(1);
                return;
            }

            // Rewrite argv so the main command sees remaining flags but not `ssh`.
            process.argv = [process.argv[0]!, process.argv[1]!, ...rest];
        }
    }

    // 提前检查 -p/--print 和 --init-only 标志，在 init() 之前设置 isInteractiveSession
    const cliArgs = process.argv.slice(2); 
    const hasPrintFlag = cliArgs.includes('-p') || cliArgs.includes('--print');
    const hasInitOnlyFlag = cliArgs.includes('--init-only');
    const hasSdkUrl = cliArgs.some(arg => arg.startsWith('--sdk-url'));
    const isNonInteractive = hasPrintFlag || hasInitOnlyFlag || hasSdkUrl || !process.stdout.isTTY;

    // 对于非交互模式，停止捕获早期输入
    if (isNonInteractive) {
        stopCapturingEarlyInput();
    }

    // 设置简化的跟踪字段
    const isInteractive = !isNonInteractive;
    setIsInteractive(isInteractive);

    // 根据模式初始化入口点 - 必须在记录任何事件之前设置
    initializeEntrypoint(isNonInteractive);

    // 定义客户端类型，用于区分不同运行环境和接入方式
    const clientType = (() => {
        if (isEnvTruthy(process.env.GITHUB_ACTIONS)) return 'github-action';
        if (process.env.MICROCODE_ENTRYPOINT === 'sdk-ts') return 'sdk-typescript';
        if (process.env.MICROCODE_ENTRYPOINT === 'sdk-py') return 'sdk-python';
        if (process.env.MICROCODE_ENTRYPOINT === 'sdk-cli') return 'sdk-cli';
        if (process.env.MICROCODE_ENTRYPOINT === 'microcode-vscode') return 'microcode-vscode';
        if (process.env.MICROCODE_ENTRYPOINT === 'local-agent') return 'local-agent';
        if (process.env.MICROCODE_ENTRYPOINT === 'microcode-desktop') return 'microcode-desktop';

        // 判断是否为远程连接（存在会话令牌）
        const hasSessionIngressToken = process.env.MICROCODE_SESSION_ACCESS_TOKEN || process.env.MICROCODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
        if (process.env.MICROCODE_ENTRYPOINT === 'remote' || hasSessionIngressToken) {
            return 'remote';
        }
        return 'cli';
    })();

    // 设置客户端类型和相关配置
    setClientType(clientType); 
    const previewFormat = process.env.MICROCODE_QUESTION_PREVIEW_FORMAT;
    if (previewFormat === 'markdown' || previewFormat === 'html') {
        setQuestionPreviewFormat(previewFormat);
    } else if (
        !clientType.startsWith('sdk-') &&
        clientType !== 'microcode-desktop' && // fake
        clientType !== 'local-agent' && 
        clientType !== 'remote'
    ) {
       setQuestionPreviewFormat('markdown');
    }
    profileCheckpoint('main_client_type_determined');
    eagerLoadSettings();
    profileCheckpoint('main_before_run');

    // 这里才开始执行主程序
    await run();
    profileCheckpoint('main_after_run');
}

async function getInputPrompt(
    prompt: string, 
    inputFormat: 'text' | 'stream-json'
): Promise<string | AsyncIterable<string>> {
    // 输入劫持会破坏 MCP 功能。
    if (!process.stdin.isTTY && !process.argv.includes('mcp')) {
        if (inputFormat === 'stream-json') {
            return process.stdin; 
        }
    
        process.stdin.setEncoding('utf8'); 
        let data = ''; 
        const onData = (chunk: string) => { data += chunk; }; 
        process.stdin.on('data', onData); 
        // 如果 3 秒内没有数据到达，停止等待并发出警告。
        // 标准输入很可能是继承自父进程的管道，但父进程并未写入数据
        //（子进程在未显式处理标准输入的情况下被启动）。
        // 3 秒可以覆盖较慢的场景，比如 curl、处理大文件的 jq、有导入开销的 Python 等。
        // 对于极少数速度更慢的程序，该警告能让静默的数据丢失问题暴露出来。
        const timedOut = await peekForStdinData(process.stdin, 3000); 
        process.stdin.off('data', onData); 
        if (timedOut) {
            process.stderr.write('Warning: no stdin data received in 3s, proceeding without it. ' + 'If piping from a slow command, redirect stdin explicitly: < /dev/null to skip, or wait longer.\n');
        }
        return [prompt, data].filter(Boolean).join('\n'); 
    }
    return prompt; 
}

async function run(): Promise<CommanderCommand> {
  profileCheckpoint('run_function_start');

  // 创建帮助配置：按选项名称排序（Object.assign 绕过类型限制）
  function createSortedHelpConfig(): {
    sortSubcommands: true;
    sortOptions: true;
  } 
  {
    const getOptionSortKey = (opt: Option): string => opt.long?.replace(/^--/, '') ?? opt.short?.replace(/^-/, '') ?? '';
    return Object.assign({
      sortSubcommands: true,
      sortOptions: true
    } as const, {
      compareOptions: (a: Option, b: Option) => getOptionSortKey(a).localeCompare(getOptionSortKey(b))
    });
  }
  const program = new CommanderCommand().configureHelp(createSortedHelpConfig()).enablePositionalOptions();
  profileCheckpoint('run_commander_initialized');

  // preAction 钩子：仅在执行命令时初始化（显示帮助时不触发）
  program.hook('preAction', async thisCommand => {
    profileCheckpoint('preAction_start');

    // 等待模块加载阶段启动的异步子进程完成（MDM 设置和 Keychain 预取）
    await Promise.all([ensureMdmSettingsLoaded(), ensureKeychainPrefetchCompleted()]);
    profileCheckpoint('preAction_after_mdm');
    await init();
    profileCheckpoint('preAction_after_init');

    // 设置终端标题（可通过环境变量禁用）
    if (!isEnvTruthy(process.env.MICROCODE_DISABLE_TERMINAL_TITLE)) {
      process.title = 'microcode';
    }

    // 初始化日志 sink，使子命令也能使用 logEvent/logError
    const { initSinks } = await import('./utils/sinks.js'); // TODO: src/utils 
    initSinks();
    profileCheckpoint('preAction_after_sinks');

    // 将 --plugin-dir 选项传递给插件系统（子命令无法直接读取顶层选项）
    const pluginDir = thisCommand.getOptionValue('pluginDir');
    if (
      Array.isArray(pluginDir) && 
      pluginDir.length > 0 && 
      pluginDir.every(p => typeof p === 'string')
    ) {
      setInlinePlugins(pluginDir);
      clearPluginCache('preAction: --plugin-dir inline plugins');
    }
    runMigrations();
    profileCheckpoint('preAction_after_migrations');

    // 异步加载企业远程管理设置和策略限制（失败不阻塞）
    void loadRemoteManagedSettings();
    void loadPolicyLimits();
    profileCheckpoint('preAction_after_remote_settings');

    // 异步上传本地设置到远程（设置同步功能）
    if (feature('UPLOAD_USER_SETTINGS')) {
      void import('./services/settingsSync/index.js').then(m => m.uploadUserSettingsInBackground());
    }
    profileCheckpoint('preAction_after_settings_sync');
  });
  program
  .name('microcode')
  .description(`Microcode - starts an interactive session by default, use -p/--print for non-interactive output`)
  .argument('[prompt]', 'Your prompt', String)
  // 子命令通过 commander 的 copyInheritedSettings 继承 helpOption
  .helpOption('-h, --help', 'Display help for command')
  .option('-d, --debug [filter]', 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (_value: string | true) => {
    // 提供值时作为过滤字符串，仅提供标志时为 true
    // 实际过滤在 debug.ts 中通过解析 process.argv 处理
    return true;
  }).addOption(
    new Option('--debug-to-stderr', 'Enable debug mode (to stderr)')
    .argParser(Boolean)
    .hideHelp())
    .option('--debug-file <path>', 'Write debug logs to a specific file path (implicitly enables debug mode)', () => true)
    .option('--verbose', 'Override verbose mode setting from config', () => true)
    .option('-p, --print', 'Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Microcode is run with the -p mode. Only use this flag in directories you trust.', () => true)
    .option('--bare', 'Minimal mode: skip hooks, LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and MICROCODE.md auto-discovery. Sets MICROCODE_SIMPLE=1. Anthropic auth is strictly ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain are never read). 3P providers (Bedrock/Vertex/Foundry) use their own credentials. Skills still resolve via /skill-name. Explicitly provide context via: --system-prompt[-file], --append-system-prompt[-file], --add-dir (MICROCODE.md dirs), --mcp-config, --settings, --agents, --plugin-dir.', () => true)
    .addOption(new Option('--init', 'Run Setup hooks with init trigger, then continue')
    .hideHelp())
    .addOption(new Option('--init-only', 'Run Setup and SessionStart:startup hooks, then exit')
    .hideHelp())
    .addOption(new Option('--maintenance', 'Run Setup hooks with maintenance trigger, then continue')
    .hideHelp())
    .addOption(new Option('--output-format <format>', 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)')
    .choices(['text', 'json', 'stream-json']))
    .addOption(new Option('--json-schema <schema>', 'JSON Schema for structured output validation. ' + 'Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}')
    .argParser(String))
    .option('--include-hook-events', 'Include all hook lifecycle events in the output stream (only works with --output-format=stream-json)', () => true)
    .option('--include-partial-messages', 'Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)', () => true)
    .addOption(new Option('--input-format <format>', 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)')
    .choices(['text', 'stream-json']))
    .option('--mcp-debug', '[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)', () => true)
    .option('--dangerously-skip-permissions', 'Bypass all permission checks. Recommended only for sandboxes with no internet access.', () => true)
    .option('--allow-dangerously-skip-permissions', 'Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.', () => true)
    .addOption(new Option('--thinking <mode>', 'Thinking mode: enabled (equivalent to adaptive), disabled')
    .choices(['enabled', 'adaptive', 'disabled'])
    .hideHelp())
    .addOption(new Option('--max-thinking-tokens <tokens>', '[DEPRECATED. Use --thinking instead for newer models] Maximum number of thinking tokens (only works with --print)')
    .argParser(Number)
    .hideHelp())
    .addOption(new Option('--max-turns <turns>', 'Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)')
    .argParser(Number).hideHelp())
    .addOption(new Option('--max-budget-usd <amount>', 'Maximum dollar amount to spend on API calls (only works with --print)')
    .argParser(value => { 
        const amount = Number(value);
        if (isNaN(amount) || amount <= 0) {
        throw new Error('--max-budget-usd must be a positive number greater than 0');
      }
      return amount;
    }))
    .addOption(new Option('--task-budget <tokens>', 'API-side task budget in tokens (output_config.task_budget)')
    .argParser(value => {
        const tokens = Number(value);
        if (isNaN(tokens) || tokens <= 0 || !Number.isInteger(tokens)) {
        throw new Error('--task-budget must be a positive integer');
      }
      return tokens;
    })
    .hideHelp())
    .option('--replay-user-messages', 'Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)', () => true)
    .addOption(new Option('--enable-auth-status', 'Enable auth status messages in SDK mode')
    .default(false)
    .hideHelp())
    .option('--allowedTools, --allowed-tools <tools...>', 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
    .option('--tools <tools...>', 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").')
    .option('--disallowedTools, --disallowed-tools <tools...>', 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
    .option('--mcp-config <configs...>', 'Load MCP servers from JSON files or strings (space-separated)')
    .addOption(new Option('--permission-prompt-tool <tool>', 'MCP tool to use for permission prompts (only works with --print)')
    .argParser(String)
    .hideHelp())
    .addOption(new Option('--system-prompt <prompt>', 'System prompt to use for the session')
    .argParser(String))
    .addOption(new Option('--system-prompt-file <file>', 'Read system prompt from a file')
    .argParser(String)
    .hideHelp())
    .addOption(new Option('--append-system-prompt <prompt>', 'Append a system prompt to the default system prompt')
    .argParser(String))
    .addOption(new Option('--append-system-prompt-file <file>', 'Read system prompt from a file and append to the default system prompt')
    .argParser(String)
    .hideHelp())
    .addOption(new Option('--permission-mode <mode>', 'Permission mode to use for the session')
    .argParser(String).choices(PERMISSION_MODES))
    .option('-c, --continue', 'Continue the most recent conversation in the current directory', () => true)
    .option('-r, --resume [value]', 'Resume a conversation by session ID, or open interactive picker with optional search term', value => value || true)
    .option('--fork-session', 'When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)', () => true)
    .addOption(new Option('--prefill <text>', 'Pre-fill the prompt input with text without submitting it')
    .hideHelp())
    .addOption(new Option('--deep-link-origin', 'Signal that this session was launched from a deep link')
    .hideHelp())
    .addOption(new Option('--deep-link-repo <slug>', 'Repo slug the deep link ?repo= parameter resolved to the current cwd')
    .hideHelp())
    .addOption(new Option('--deep-link-last-fetch <ms>', 'FETCH_HEAD mtime in epoch ms, precomputed by the deep link trampoline')
    .argParser(v => {
        const n = Number(v);
        return Number.isFinite(n) ? n : undefined;
    }).hideHelp()).option('--from-pr [value]', 'Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term', value => value || true).option('--no-session-persistence', 'Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)').addOption(new Option('--resume-session-at <message id>', 'When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)').argParser(String).hideHelp()).addOption(new Option('--rewind-files <user-message-id>', 'Restore files to state at the specified user message and exit (requires --resume)').hideHelp())
    .option('--model <model>', `Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-6').`)
    .addOption(new Option('--effort <level>', `Effort level for the current session (low, medium, high, max)`)
    .argParser((rawValue: string) => {
        const value = rawValue.toLowerCase();
        const allowed = ['low', 'medium', 'high', 'max'];
        if (!allowed.includes(value)) {
          throw new InvalidArgumentError(`It must be one of: ${allowed.join(', ')}`);
        }
    return value;
    }))
    .option('--agent <agent>', `Agent for the current session. Overrides the 'agent' setting.`)
    .option('--betas <betas...>', 'Beta headers to include in API requests (API key users only)')
    .option('--fallback-model <model>', 'Enable automatic fallback to specified model when default model is overloaded (only works with --print)')
    .addOption(new Option('--workload <tag>', 'Workload tag for billing-header attribution (cc_workload). Process-scoped; set by SDK daemon callers that spawn subprocesses for cron work. (only works with --print)').hideHelp())
    .option('--settings <file-or-json>', 'Path to a settings JSON file or a JSON string to load additional settings from')
    .option('--add-dir <directories...>', 'Additional directories to allow tool access to')
    .option('--ide', 'Automatically connect to IDE on startup if exactly one valid IDE is available', () => true)
    .option('--strict-mcp-config', 'Only use MCP servers from --mcp-config, ignoring all other MCP configurations', () => true)
    .option('--session-id <uuid>', 'Use a specific session ID for the conversation (must be a valid UUID)')
    .option('-n, --name <name>', 'Set a display name for this session (shown in /resume and terminal title)')
    .option('--agents <json>', 'JSON object defining custom agents (e.g. \'{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}\')')
    .option('--setting-sources <sources>', 'Comma-separated list of setting sources to load (user, project, local).')
    
    // --plugin-dir 使用单值累加器（可重复指定多次）
    .option('--plugin-dir <path>', 'Load plugins from a directory for this session only (repeatable: --plugin-dir A --plugin-dir B)', (val: string, prev: string[]) => [...prev, val], [] as string[])
    .option('--disable-slash-commands', 'Disable all skills', () => true)
    .option('--chrome', 'Enable Microcode in Chrome integration')
    .option('--no-chrome', 'Disable Microcode in Chrome integration')
    .option('--file <specs...>', 'File resources to download at startup. Format: file_id:relative_path (e.g., --file file_abc:doc.txt file_def:img.png)')
    
    // action
    .action(async (prompt, options) => {
        profileCheckpoint('action_handler_start');

        // --bare 最小化模式：跳过 hooks、LSP、插件同步等，用于脚本化调用
        if ((options as { bare?: boolean;}).bare) {
          process.env.MICROCODE_SIMPLE = '1';
        }

        // 忽略 "code" 作为 prompt（等同于无 prompt）
        if (prompt === 'code') {
          logEvent('tengu_code_prompt_ignored', {});
          // biome-ignore lint/suspicious/noConsole:: intentional console output
          console.warn(chalk.yellow('Tip: You can launch Microcode with just `microcode`'));
          prompt = undefined;
        }

        // 记录单单词 prompt 的遥测事件
        if (prompt && typeof prompt === 'string' && !/\s/.test(prompt) && prompt.length > 0) {
            logEvent('tengu_single_word_prompt', {
            length: prompt.length
          });
        }

      // Assistant 模式（Kairos）：需要目录已受信任才激活
      let kairosEnabled = false;
      let assistantTeamContext: Awaited<ReturnType<NonNullable<typeof assistantModule>['initializeAssistantTeam']>> | undefined;
      if (feature('KAIROS') && (options as {
        assistant?: boolean;
      }).assistant && assistantModule) {
        // --assistant 标记：Agent SDK daemon 模式，跳过权限检查
        assistantModule.markAssistantForced();
      }
      // 跳过已生成的 teammate（通过 --agent-id 判断），避免重复初始化
      if (feature('KAIROS') && assistantModule?.isAssistantMode() &&
      !(options as {
        agentId?: unknown;
      }).agentId && kairosGate) {
        if (!checkHasTrustDialogAccepted()) {
          // biome-ignore lint/suspicious/noConsole:: intentional console output
          console.warn(chalk.yellow('Assistant mode disabled: directory is not trusted. Accept the trust dialog and restart.'));
        } else {
          // 检查 Kairos 功能开关（--assistant 跳过检查）
          kairosEnabled = assistantModule.isAssistantForced() || (await kairosGate.isKairosEnabled());
          if (kairosEnabled) {
            const opts = options as {
              brief?: boolean;
            };
            opts.brief = true;
            setKairosActive(true);
            // 预初始化进程内团队（必须在 setup() 之前执行）
            assistantTeamContext = await assistantModule.initializeAssistantTeam();
          }
        }
      }
      const {
        debug = false,
        debugToStderr = false,
        dangerouslySkipPermissions,
        allowDangerouslySkipPermissions = false,
        tools: baseTools = [],
        allowedTools = [],
        disallowedTools = [],
        mcpConfig = [],
        permissionMode: permissionModeCli,
        addDir = [],
        fallbackModel,
        betas = [],
        ide = false,
        sessionId,
        includeHookEvents,
        includePartialMessages
      } = options;
      if (options.prefill) {
        seedEarlyInput(options.prefill);
      }

      // 文件下载 Promise（提前启动，REPL 渲染前等待完成）
      let fileDownloadPromise: Promise<DownloadResult[]> | undefined;
      const agentsJson = options.agents;
      const agentCli = options.agent;
      if (feature('BG_SESSIONS') && agentCli) {
        process.env.MICROCODE_AGENT = agentCli;
      }

      // 注意：LSP 管理器延迟到信任对话框确认后才初始化

      // 提取可变的 CLI 选项
      let outputFormat = options.outputFormat;
      let inputFormat = options.inputFormat;
      let verbose = options.verbose ?? getGlobalConfig().verbose;
      let print = options.print;
      const init = options.init ?? false;
      const initOnly = options.initOnly ?? false;
      const maintenance = options.maintenance ?? false;

      const disableSlashCommands = options.disableSlashCommands || false;

      // 任务模式选项（ant-only）
      const tasksOption = "external" === 'ant' && (options as {
        tasks?: boolean | string;
      }).tasks;
      const taskListId = tasksOption ? typeof tasksOption === 'string' ? tasksOption : DEFAULT_TASKS_MODE_TASK_LIST_ID : undefined;
      if ("external" === 'ant' && taskListId) {
        process.env.MICROCODE_TASK_LIST_ID = taskListId;
      }

      // worktree 选项（可为 true 或字符串：自定义名称/PR 引用）
      const worktreeOption = isWorktreeModeEnabled() ? (options as {
        worktree?: boolean | string;
      }).worktree : undefined;
      let worktreeName = typeof worktreeOption === 'string' ? worktreeOption : undefined;
      const worktreeEnabled = worktreeOption !== undefined;

      // 检查 worktree 名称是否为 PR 引用（#N 或 GitHub PR URL）
      let worktreePRNumber: number | undefined;
      if (worktreeName) {
        const prNum = parsePRReference(worktreeName);
        if (prNum !== null) {
          worktreePRNumber = prNum;
          worktreeName = undefined; // slug will be generated in setup()
        }
      }

      // tmux 选项（需要 --worktree）
      const tmuxEnabled = isWorktreeModeEnabled() && (options as {
        tmux?: boolean;
      }).tmux === true;

      // 校验 tmux 选项
      if (tmuxEnabled) {
        if (!worktreeEnabled) {
          process.stderr.write(chalk.red('Error: --tmux requires --worktree\n'));
          process.exit(1);
        }
        if (getPlatform() === 'windows') {
          process.stderr.write(chalk.red('Error: --tmux is not supported on Windows\n'));
          process.exit(1);
        }
        if (!(await isTmuxAvailable())) {
          process.stderr.write(chalk.red(`Error: tmux is not installed.\n${getTmuxInstallInstructions()}\n`));
          process.exit(1);
        }
      }

      // 提取 teammate 选项（用于 tmux 生成的 agent）
      let storedTeammateOpts: TeammateOptions | undefined;
      if (isAgentSwarmsEnabled()) {
        // 提取 agent 身份选项（替代 MICROCODE_* 环境变量）
        const teammateOpts = extractTeammateOptions(options);
        storedTeammateOpts = teammateOpts;

        // 校验：三个身份选项必须同时提供
        const hasAnyTeammateOpt = teammateOpts.agentId || teammateOpts.agentName || teammateOpts.teamName;
        const hasAllRequiredTeammateOpts = teammateOpts.agentId && teammateOpts.agentName && teammateOpts.teamName;
        if (hasAnyTeammateOpt && !hasAllRequiredTeammateOpts) {
          process.stderr.write(chalk.red('Error: --agent-id, --agent-name, and --team-name must all be provided together\n'));
          process.exit(1);
        }

        // 设置动态团队上下文
        if (teammateOpts.agentId && teammateOpts.agentName && teammateOpts.teamName) {
          getTeammateUtils().setDynamicTeamContext?.({
            agentId: teammateOpts.agentId,
            agentName: teammateOpts.agentName,
            teamName: teammateOpts.teamName,
            color: teammateOpts.agentColor,
            planModeRequired: teammateOpts.planModeRequired ?? false,
            parentSessionId: teammateOpts.parentSessionId
          });
        }

        // 设置 teammate 模式覆盖（必须在 setup() 之前）
        if (teammateOpts.teammateMode) {
          getTeammateModeSnapshot().setCliTeammateModeOverride?.(teammateOpts.teammateMode);
        }
      }

      // 远程 SDK 选项
      const sdkUrl = (options as {
        sdkUrl?: string;
      }).sdkUrl ?? undefined;

      // 启用部分消息（环境变量或 CLI 选项）
      const effectiveIncludePartialMessages = includePartialMessages || isEnvTruthy(process.env.MICROCODE_INCLUDE_PARTIAL_MESSAGES);

      // 启用所有 hook 事件类型（SDK 或远程模式需要）
      if (includeHookEvents || isEnvTruthy(process.env.MICROCODE_REMOTE)) {
        setAllHookEventsEnabled(true);
      }

      // SDK URL 模式：自动设置 stream-json 格式和 verbose/print 模式
      if (sdkUrl) {
        if (!inputFormat) {
          inputFormat = 'stream-json';
        }
        if (!outputFormat) {
          outputFormat = 'stream-json';
        }
        if (options.verbose === undefined) {
          verbose = true;
        }
        if (!options.print) {
          print = true;
        }
      }

      // teleport 选项
      const teleport = (options as {
        teleport?: string | true;
      }).teleport ?? null;

      // remote 选项（true 或字符串描述）
      const remoteOption = (options as {
        remote?: string | true;
      }).remote;
      const remote = remoteOption === true ? '' : remoteOption ?? null;

      // --remote-control / --rc 选项（启用交互会话中的 bridge）
      const remoteControlOption = (options as {
        remoteControl?: string | true;
      }).remoteControl ?? (options as {
        rc?: string | true;
      }).rc;
      // bridge 检查延迟到 showSetupScreens() 之后（需要信任和 auth）
      let remoteControl = false;
      const remoteControlName = typeof remoteControlOption === 'string' && remoteControlOption.length > 0 ? remoteControlOption : undefined;

      // 校验 session ID
      if (sessionId) {
        // --session-id 与 --continue/--resume 冲突（除非同时指定 --fork-session）
        if ((options.continue || options.resume) && !options.forkSession) {
          process.stderr.write(chalk.red('Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.\n'));
          process.exit(1);
        }

        // SDK URL 模式下跳过 UUID 校验（使用服务器分配的 ID）
        if (!sdkUrl) {
          const validatedSessionId = validateUuid(sessionId);
          if (!validatedSessionId) {
            process.stderr.write(chalk.red('Error: Invalid session ID. Must be a valid UUID.\n'));
            process.exit(1);
          }

          // 检查 session ID 是否已存在
          if (sessionIdExists(validatedSessionId)) {
            process.stderr.write(chalk.red(`Error: Session ID ${validatedSessionId} is already in use.\n`));
            process.exit(1);
          }
        }
      }

      // 下载 --file 指定的文件资源
      const fileSpecs = (options as {
        file?: string[];
      }).file;
      if (fileSpecs && fileSpecs.length > 0) {
        // 获取 session ingress token
        const sessionToken = getSessionIngressAuthToken();
        if (!sessionToken) {
          process.stderr.write(chalk.red('Error: Session token required for file downloads. MICROCODE_SESSION_ACCESS_TOKEN must be set.\n'));
          process.exit(1);
        }

        // 解析 session ID（优先远程，回退到本地）
        const fileSessionId = process.env.MICROCODE_REMOTE_SESSION_ID || getSessionId();
        const files = parseFileSpecs(fileSpecs);
        if (files.length > 0) {
          // 文件下载 API 配置
          const config: FilesApiConfig = {
            baseUrl: process.env.ANTHROPIC_BASE_URL || getOauthConfig().BASE_API_URL,
            oauthToken: sessionToken,
            sessionId: fileSessionId
          };

          // 异步启动下载（不阻塞启动）
          fileDownloadPromise = downloadSessionFiles(files, config);
        }
      }

      // 获取非交互模式标志（在 init() 之前已设置）
      const isNonInteractiveSession = getIsNonInteractiveSession();

      // 校验 fallback model 不能与主模型相同
      if (fallbackModel && options.model && fallbackModel === options.model) {
        process.stderr.write(chalk.red('Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.\n'));
        process.exit(1);
      }

      // 处理系统提示词选项
      let systemPrompt = options.systemPrompt;
      if (options.systemPromptFile) {
        if (options.systemPrompt) {
          process.stderr.write(chalk.red('Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.\n'));
          process.exit(1);
        }
        try {
          const filePath = resolve(options.systemPromptFile);
          systemPrompt = readFileSync(filePath, 'utf8');
        } catch (error) {
          const code = getErrnoCode(error);
          if (code === 'ENOENT') {
            process.stderr.write(chalk.red(`Error: System prompt file not found: ${resolve(options.systemPromptFile)}\n`));
            process.exit(1);
          }
          process.stderr.write(chalk.red(`Error reading system prompt file: ${errorMessage(error)}\n`));
          process.exit(1);
        }
      }

      // 处理追加系统提示词选项
      let appendSystemPrompt = options.appendSystemPrompt;
      if (options.appendSystemPromptFile) {
        if (options.appendSystemPrompt) {
          process.stderr.write(chalk.red('Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.\n'));
          process.exit(1);
        }
        try {
          const filePath = resolve(options.appendSystemPromptFile);
          appendSystemPrompt = readFileSync(filePath, 'utf8');
        } catch (error) {
          const code = getErrnoCode(error);
          if (code === 'ENOENT') {
            process.stderr.write(chalk.red(`Error: Append system prompt file not found: ${resolve(options.appendSystemPromptFile)}\n`));
            process.exit(1);
          }
          process.stderr.write(chalk.red(`Error reading append system prompt file: ${errorMessage(error)}\n`));
          process.exit(1);
        }
      }

      // 为 tmux teammate 添加系统提示词附录
      if (isAgentSwarmsEnabled() && storedTeammateOpts?.agentId && storedTeammateOpts?.agentName && storedTeammateOpts?.teamName) {
        const addendum = getTeammatePromptAddendum().TEAMMATE_SYSTEM_PROMPT_ADDENDUM;
        appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}\n\n${addendum}` : addendum;
      }
      const {
        mode: permissionMode,
        notification: permissionModeNotification
      } = initialPermissionModeFromCLI({
        permissionModeCli,
        dangerouslySkipPermissions
      });

      // 存储 bypass 权限模式标志
      setSessionBypassPermissionsMode(permissionMode === 'bypassPermissions');
      if (feature('TRANSCRIPT_CLASSIFIER')) {
        // 设置 auto mode CLI 标志（用于权限门控和 opt-in 轮播）
        if ((options as {
          enableAutoMode?: boolean;
        }).enableAutoMode || permissionModeCli === 'auto' || permissionMode === 'auto' || !permissionModeCli && isDefaultPermissionModeAuto()) {
          autoModeStateModule?.setAutoModeFlagCli(true);
        }
      }

      // 解析 MCP 配置（JSON 字符串或文件路径）
      let dynamicMcpConfig: Record<string, ScopedMcpServerConfig> = {};
      if (mcpConfig && mcpConfig.length > 0) {
        const processedConfigs = mcpConfig.map(config => config.trim()).filter(config => config.length > 0);
        let allConfigs: Record<string, McpServerConfig> = {};
        const allErrors: ValidationError[] = [];
        for (const configItem of processedConfigs) {
          let configs: Record<string, McpServerConfig> | null = null;
          let errors: ValidationError[] = [];

          // 先尝试解析为 JSON 字符串
          const parsedJson = safeParseJSON(configItem);
          if (parsedJson) {
            const result = parseMcpConfig({
              configObject: parsedJson,
              filePath: 'command line',
              expandVars: true,
              scope: 'dynamic'
            });
            if (result.config) {
              configs = result.config.mcpServers;
            } else {
              errors = result.errors;
            }
          } else {
            // 回退为文件路径
            const configPath = resolve(configItem);
            const result = parseMcpConfigFromFilePath({
              filePath: configPath,
              expandVars: true,
              scope: 'dynamic'
            });
            if (result.config) {
              configs = result.config.mcpServers;
            } else {
              errors = result.errors;
            }
          }
          if (errors.length > 0) {
            allErrors.push(...errors);
          } else if (configs) {
            // 合并配置，后面的覆盖前面的
            allConfigs = {
              ...allConfigs,
              ...configs
            };
          }
        }
        if (allErrors.length > 0) {
          const formattedErrors = allErrors.map(err => `${err.path ? err.path + ': ' : ''}${err.message}`).join('\n');
          logForDebugging(`--mcp-config validation failed (${allErrors.length} errors): ${formattedErrors}`, {
            level: 'error'
          });
          process.stderr.write(`Error: Invalid MCP configuration:\n${formattedErrors}\n`);
          process.exit(1);
        }
        if (Object.keys(allConfigs).length > 0) {
          // SDK 类型跳过保留名称检查
          const nonSdkConfigNames = Object.entries(allConfigs).filter(([, config]) => config.type !== 'sdk').map(([name]) => name);
          let reservedNameError: string | null = null;
          if (nonSdkConfigNames.some(isMicrocodeInChromeMCPServer)) {
            reservedNameError = `Invalid MCP configuration: "${MICROCODE_IN_CHROME_MCP_SERVER_NAME}" is a reserved MCP name.`;
          } else if (feature('CHICAGO_MCP')) {
            const {
              isComputerUseMCPServer,
              COMPUTER_USE_MCP_SERVER_NAME
            } = await import('src/utils/computerUse/common.js');
            if (nonSdkConfigNames.some(isComputerUseMCPServer)) {
              reservedNameError = `Invalid MCP configuration: "${COMPUTER_USE_MCP_SERVER_NAME}" is a reserved MCP name.`;
            }
          }
          if (reservedNameError) {
            process.stderr.write(`Error: ${reservedNameError}\n`);
            process.exit(1);
          }

          // 为所有配置添加 dynamic scope（SDK 类型保持不变）
          const scopedConfigs = mapValues(allConfigs, config => ({
            ...config,
            scope: 'dynamic' as const
          }));

          // 应用企业策略过滤（allowedMcpServers / deniedMcpServers）
          const {
            allowed,
            blocked
          } = filterMcpServersByPolicy(scopedConfigs);
          if (blocked.length > 0) {
            process.stderr.write(`Warning: MCP ${plural(blocked.length, 'server')} blocked by enterprise policy: ${blocked.join(', ')}\n`);
          }
          dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...allowed
          };
        }
      }

      // Chrome 集成选项（需要 claude.ai 订阅者身份）
      const chromeOpts = options as {
        chrome?: boolean;
      };
      // 存储 Chrome 标志供 teammate 继承
      setChromeFlagOverride(chromeOpts.chrome);
      const enableMicrocodeInChrome = shouldEnableMicrocodeInChrome(chromeOpts.chrome) && ("external" === 'ant' || isMicrocodeAISubscriber());
      const autoEnableMicrocodeInChrome = !enableMicrocodeInChrome && shouldAutoEnableMicrocodeInChrome();
      if (enableMicrocodeInChrome) {
        const platform = getPlatform();
        try {
          logEvent('tengu_claude_in_chrome_setup', {
            platform: platform as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });
          const {
            mcpConfig: chromeMcpConfig,
            allowedTools: chromeMcpTools,
            systemPrompt: chromeSystemPrompt
          } = setupMicrocodeInChrome();
          dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...chromeMcpConfig
          };
          allowedTools.push(...chromeMcpTools);
          if (chromeSystemPrompt) {
            appendSystemPrompt = appendSystemPrompt ? `${chromeSystemPrompt}\n\n${appendSystemPrompt}` : chromeSystemPrompt;
          }
        } catch (error) {
          logEvent('tengu_claude_in_chrome_setup_failed', {
            platform: platform as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });
          logForDebugging(`[Microcode in Chrome] Error: ${error}`);
          logError(error);
          // biome-ignore lint/suspicious/noConsole:: intentional console output
          console.error(`Error: Failed to run with Microcode in Chrome.`);
          process.exit(1);
        }
      } else if (autoEnableMicrocodeInChrome) {
        try {
          const {
            mcpConfig: chromeMcpConfig
          } = setupMicrocodeInChrome();
          dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...chromeMcpConfig
          };
          const hint = feature('WEB_BROWSER_TOOL') && typeof Bun !== 'undefined' && 'WebView' in Bun ? MICROCODE_IN_CHROME_SKILL_HINT_WITH_WEBBROWSER : MICROCODE_IN_CHROME_SKILL_HINT;
          appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}\n\n${hint}` : hint;
        } catch (error) {
          // 自动启用失败时静默跳过
          logForDebugging(`[Microcode in Chrome] Error (auto-enable): ${error}`);
        }
      }

      // strict MCP 配置标志
      const strictMcpConfig = options.strictMcpConfig || false;

      // 企业 MCP 配置检查（存在时只允许 SDK 类型的动态配置）
      if (doesEnterpriseMcpConfigExist()) {
        if (strictMcpConfig) {
          process.stderr.write(chalk.red('You cannot use --strict-mcp-config when an enterprise MCP config is present'));
          process.exit(1);
        }

        // 检查动态 MCP 配置是否全部为 SDK 类型
        if (dynamicMcpConfig && !areMcpConfigsAllowedWithEnterpriseMcpConfig(dynamicMcpConfig)) {
          process.stderr.write(chalk.red('You cannot dynamically configure MCP servers when an enterprise MCP config is present'));
          process.exit(1);
        }
      }

      // Computer Use MCP（ant-only，macOS，仅交互模式）
      if (feature('CHICAGO_MCP') && getPlatform() === 'macos' && !getIsNonInteractiveSession()) {
        try {
          const {
            getChicagoEnabled
          } = await import('src/utils/computerUse/gates.js');
          if (getChicagoEnabled()) {
            const {
              setupComputerUseMCP
            } = await import('src/utils/computerUse/setup.js');
            const {
              mcpConfig,
              allowedTools: cuTools
            } = setupComputerUseMCP();
            dynamicMcpConfig = {
              ...dynamicMcpConfig,
              ...mcpConfig
            };
            allowedTools.push(...cuTools);
          }
        } catch (error) {
          logForDebugging(`[Computer Use MCP] Setup failed: ${errorMessage(error)}`);
        }
      }

      // 存储额外目录用于 MICROCODE.md 加载
      setAdditionalDirectoriesForMicrocodeMd(addDir);

      // Channel 服务器白名单（--channels 标志）
      let devChannels: ChannelEntry[] | undefined;
      if (feature('KAIROS') || feature('KAIROS_CHANNELS')) {
        // 解析 plugin:name@marketplace / server:Y 标签为类型化条目
        // 标签决定下游信任模型：plugin 类型走市场验证 + GrowthBook 白名单
        // server 类型始终不通过白名单（schema 仅支持 plugin）
        // 未标记或缺少市场的 plugin 条目为硬错误
        const parseChannelEntries = (raw: string[], flag: string): ChannelEntry[] => {
          const entries: ChannelEntry[] = [];
          const bad: string[] = [];
          for (const c of raw) {
            if (c.startsWith('plugin:')) {
              const rest = c.slice(7);
              const at = rest.indexOf('@');
              if (at <= 0 || at === rest.length - 1) {
                bad.push(c);
              } else {
                entries.push({
                  kind: 'plugin',
                  name: rest.slice(0, at),
                  marketplace: rest.slice(at + 1)
                });
              }
            } else if (c.startsWith('server:') && c.length > 7) {
              entries.push({
                kind: 'server',
                name: c.slice(7)
              });
            } else {
              bad.push(c);
            }
          }
          if (bad.length > 0) {
            process.stderr.write(chalk.red(`${flag} entries must be tagged: ${bad.join(', ')}\n` + `  plugin:<name>@<marketplace>  — plugin-provided channel (allowlist enforced)\n` + `  server:<name>                — manually configured MCP server\n`));
            process.exit(1);
          }
          return entries;
        };
        const channelOpts = options as {
          channels?: string[];
          dangerouslyLoadDevelopmentChannels?: string[];
        };
        const rawChannels = channelOpts.channels;
        const rawDev = channelOpts.dangerouslyLoadDevelopmentChannels;
        // 解析并设置 channel 白名单
        let channelEntries: ChannelEntry[] = [];
        if (rawChannels && rawChannels.length > 0) {
          channelEntries = parseChannelEntries(rawChannels, '--channels');
          setAllowedChannels(channelEntries);
        }
        if (!isNonInteractiveSession) {
          if (rawDev && rawDev.length > 0) {
            devChannels = parseChannelEntries(rawDev, '--dangerously-load-development-channels');
          }
        }
        // 记录 channel 标志使用遥测
        if (channelEntries.length > 0 || (devChannels?.length ?? 0) > 0) {
          const joinPluginIds = (entries: ChannelEntry[]) => {
            const ids = entries.flatMap(e => e.kind === 'plugin' ? [`${e.name}@${e.marketplace}`] : []);
            return ids.length > 0 ? ids.sort().join(',') as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS : undefined;
          };
          logEvent('tengu_mcp_channel_flags', {
            channels_count: channelEntries.length,
            dev_count: devChannels?.length ?? 0,
            plugins: joinPluginIds(channelEntries),
            dev_plugins: joinPluginIds(devChannels ?? [])
          });
        }
      }

      // SendUserMessage (BriefTool) 的 SDK opt-in（通过 --tools 选项）
      if ((feature('KAIROS') || feature('KAIROS_BRIEF')) && baseTools.length > 0) {
        /* eslint-disable @typescript-eslint/no-require-imports */
        const {
          BRIEF_TOOL_NAME,
          LEGACY_BRIEF_TOOL_NAME
        } = require('./tools/BriefTool/prompt.js') as typeof import('./tools/BriefTool/prompt.js');
        const {
          isBriefEntitled
        } = require('./tools/BriefTool/BriefTool.js') as typeof import('./tools/BriefTool/BriefTool.js');
        /* eslint-enable @typescript-eslint/no-require-imports */
        const parsed = parseToolListFromCLI(baseTools);
        if ((parsed.includes(BRIEF_TOOL_NAME) || parsed.includes(LEGACY_BRIEF_TOOL_NAME)) && isBriefEntitled()) {
          setUserMsgOptIn(true);
        }
      }

      // await 替换原有的阻塞 existsSync/statSync 调用
      // 总耗时不变，但 fs I/O 期间让出事件循环
      const initResult = await initializeToolPermissionContext({
        allowedToolsCli: allowedTools,
        disallowedToolsCli: disallowedTools,
        baseToolsCli: baseTools,
        permissionMode,
        allowDangerouslySkipPermissions,
        addDirs: addDir
      });
      let toolPermissionContext = initResult.toolPermissionContext;
      const {
        warnings,
        dangerousPermissions,
        overlyBroadBashPermissions
      } = initResult;

      // 处理过度宽泛的 shell 权限规则（ant 用户）
      if ("external" === 'ant' && overlyBroadBashPermissions.length > 0) {
        for (const permission of overlyBroadBashPermissions) {
          logForDebugging(`Ignoring overly broad shell permission ${permission.ruleDisplay} from ${permission.sourceDisplay}`);
        }
        toolPermissionContext = removeDangerousPermissions(toolPermissionContext, overlyBroadBashPermissions);
      }
      if (feature('TRANSCRIPT_CLASSIFIER') && dangerousPermissions.length > 0) {
        toolPermissionContext = stripDangerousPermissionsForAutoMode(toolPermissionContext);
      }

      // 输出初始化警告
      warnings.forEach(warning => {
        // biome-ignore lint/suspicious/noConsole:: intentional console output
        console.error(warning);
      });
      void assertMinVersion();

      // claude.ai MCP 配置获取（仅非交互模式，跳过 bare/企业/strict 模式）
      const claudeaiConfigPromise: Promise<Record<string, ScopedMcpServerConfig>> = isNonInteractiveSession && !strictMcpConfig && !doesEnterpriseMcpConfigExist() &&
      !isBareMode() ? fetchMicrocodeAIMcpConfigsIfEligible().then(configs => {
        const {
          allowed,
          blocked
        } = filterMcpServersByPolicy(configs);
        if (blocked.length > 0) {
          process.stderr.write(`Warning: claude.ai MCP ${plural(blocked.length, 'server')} blocked by enterprise policy: ${blocked.join(', ')}\n`);
        }
        return allowed;
      }) : Promise.resolve({});

      // 提前启动 MCP 配置加载（与 setup() 并行）
      logForDebugging('[STARTUP] Loading MCP configs...');
      const mcpConfigStart = Date.now();
      let mcpConfigResolvedMs: number | undefined;
      // --bare 跳过自动发现的 MCP 配置
      const mcpConfigPromise = (strictMcpConfig || isBareMode() ? Promise.resolve({
        servers: {} as Record<string, ScopedMcpServerConfig>
      }) : getMicroCodeMcpConfigs(dynamicMcpConfig)).then(result => {
        mcpConfigResolvedMs = Date.now() - mcpConfigStart;
        return result;
      });

      // 注意：MCP 资源预取延迟到信任对话框之后

      if (inputFormat && inputFormat !== 'text' && inputFormat !== 'stream-json') {
        // biome-ignore lint/suspicious/noConsole:: intentional console output
        console.error(`Error: Invalid input format "${inputFormat}".`);
        process.exit(1);
      }
      if (inputFormat === 'stream-json' && outputFormat !== 'stream-json') {
        // biome-ignore lint/suspicious/noConsole:: intentional console output
        console.error(`Error: --input-format=stream-json requires output-format=stream-json.`);
        process.exit(1);
      }

      // 校验 sdkUrl 格式兼容性
      if (sdkUrl) {
        if (inputFormat !== 'stream-json' || outputFormat !== 'stream-json') {
          // biome-ignore lint/suspicious/noConsole:: intentional console output
          console.error(`Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json.`);
          process.exit(1);
        }
      }

      // 校验 --replay-user-messages 仅用于 stream-json 格式
      if (options.replayUserMessages) {
        if (inputFormat !== 'stream-json' || outputFormat !== 'stream-json') {
          // biome-ignore lint/suspicious/noConsole:: intentional console output
          console.error(`Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json.`);
          process.exit(1);
        }
      }

      // 校验 --include-partial-messages 仅用于 print 模式
      if (effectiveIncludePartialMessages) {
        if (!isNonInteractiveSession || outputFormat !== 'stream-json') {
          writeToStderr(`Error: --include-partial-messages requires --print and --output-format=stream-json.`);
          process.exit(1);
        }
      }

      // 校验 --no-session-persistence 仅用于 print 模式
      if (options.sessionPersistence === false && !isNonInteractiveSession) {
        writeToStderr(`Error: --no-session-persistence can only be used with --print mode.`);
        process.exit(1);
      }
      const effectivePrompt = prompt || '';
      let inputPrompt = await getInputPrompt(effectivePrompt, (inputFormat ?? 'text') as 'text' | 'stream-json');
      profileCheckpoint('action_after_input_prompt');

      // 激活 proactive 模式（必须在 getTools() 之前）
      maybeActivateProactive(options);
      let tools = getTools(toolPermissionContext);

      // 应用 coordinator 模式工具过滤
      if (feature('COORDINATOR_MODE') && isEnvTruthy(process.env.MICROCODE_COORDINATOR_MODE)) {
        const {
          applyCoordinatorToolFilter
        } = await import('./utils/toolPool.js');
        tools = applyCoordinatorToolFilter(tools);
      }
      profileCheckpoint('action_tools_loaded');
      let jsonSchema: ToolInputJSONSchema | undefined;
      if (isSyntheticOutputToolEnabled({
        isNonInteractiveSession
      }) && options.jsonSchema) {
        jsonSchema = jsonParse(options.jsonSchema) as ToolInputJSONSchema;
      }
      if (jsonSchema) {
        const syntheticOutputResult = createSyntheticOutputTool(jsonSchema);
        if ('tool' in syntheticOutputResult) {
          // 添加结构化输出工具（在 getTools() 过滤之后）
          tools = [...tools, syntheticOutputResult.tool];
          logEvent('tengu_structured_output_enabled', {
            schema_property_count: Object.keys(jsonSchema.properties as Record<string, unknown> || {}).length as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
            has_required_fields: Boolean(jsonSchema.required) as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });
        } else {
          logEvent('tengu_structured_output_failure', {
            error: 'Invalid JSON schema' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });
        }
      }

      // setup() 必须在依赖 cwd/worktree 的代码之前调用
      profileCheckpoint('action_before_setup');
      logForDebugging('[STARTUP] Running setup()...');
      const setupStart = Date.now();
      const {
        setup
      } = await import('./setup.js');
      const messagingSocketPath = feature('UDS_INBOX') ? (options as {
        messagingSocketPath?: string;
      }).messagingSocketPath : undefined;
      // setup() 与命令/Agent 加载并行执行
      const preSetupCwd = getCwd();
      // 注册内置技能/插件（内存操作，<1ms）
      // 此前在 setup() 内部运行（延迟 ~20ms），导致并行的 getCommands() 缓存了空列表
      if (process.env.MICROCODE_ENTRYPOINT !== 'local-agent') {
        initBuiltinPlugins();
        initBundledSkills();
      }
      const setupPromise = setup(preSetupCwd, permissionMode, allowDangerouslySkipPermissions, worktreeEnabled, worktreeName, tmuxEnabled, sessionId ? validateUuid(sessionId) : undefined, worktreePRNumber, messagingSocketPath);
      const commandsPromise = worktreeEnabled ? null : getCommands(preSetupCwd);
      const agentDefsPromise = worktreeEnabled ? null : getAgentDefinitionsWithOverrides(preSetupCwd);
      // 抑制 setupPromise 等待期间（~28ms）的瞬态 unhandledRejection
      commandsPromise?.catch(() => {});
      agentDefsPromise?.catch(() => {});
      await setupPromise;
      logForDebugging(`[STARTUP] setup() completed in ${Date.now() - setupStart}ms`);
      profileCheckpoint('action_after_setup');

      // 用户消息回放（仅在显式请求时启用）
      let effectiveReplayUserMessages = !!options.replayUserMessages;
      if (feature('UDS_INBOX')) {
        if (!effectiveReplayUserMessages && outputFormat === 'stream-json') {
          effectiveReplayUserMessages = !!(options as {
            messagingSocketPath?: string;
          }).messagingSocketPath;
        }
      }
      if (getIsNonInteractiveSession()) {
        // 应用完整环境变量配置（非交互模式隐式信任）
        applyConfigEnvironmentVariables();

        // 异步启动 git 上下文获取（与后续加载并行）
        void getSystemContext();
        // 异步启动用户上下文获取
        void getUserContext();
        // 异步初始化模型字符串（Bedrock 需要 100-200ms）
        void ensureModelStringsInitialized();
      }

      // 缓存 session 名称（延迟持久化到第一条用户消息）
      const sessionNameArg = options.name?.trim();
      if (sessionNameArg) {
        cacheSessionTitle(sessionNameArg);
      }

      // ant 模型别名解析（需要等待 GrowthBook 初始化）
      const explicitModel = options.model || process.env.ANTHROPIC_MODEL;
      if ("external" === 'ant' && explicitModel && explicitModel !== 'default' && !hasGrowthBookEnvOverride('tengu_ant_model_override') && getGlobalConfig().cachedGrowthBookFeatures?.['tengu_ant_model_override'] == null) {
        await initializeGrowthBook();
      }

      // default 关键字特殊处理；模型解析在 setup() 之后以确保信任关系在 AWS 认证前建立
      const userSpecifiedModel = options.model === 'default' ? getDefaultMainLoopModel() : options.model;
      const userSpecifiedFallbackModel = fallbackModel === 'default' ? getDefaultMainLoopModel() : fallbackModel;

      // 复用 preSetupCwd（worktree 模式除外），减少 getCwd() 系统调用
      const currentCwd = worktreeEnabled ? getCwd() : preSetupCwd;
      logForDebugging('[STARTUP] Loading commands and agents...');
      const commandsStart = Date.now();
      // 等待 setup() 前启动的 promise（worktree 模式下重新启动），均按 cwd 缓存
      const [commands, agentDefinitionsResult] = await Promise.all([commandsPromise ?? getCommands(currentCwd), agentDefsPromise ?? getAgentDefinitionsWithOverrides(currentCwd)]);
      logForDebugging(`[STARTUP] Commands and agents loaded in ${Date.now() - commandsStart}ms`);
      profileCheckpoint('action_commands_loaded');

      // 解析 --agents 标志提供的 CLI agent
      let cliAgents: typeof agentDefinitionsResult.activeAgents = [];
      if (agentsJson) {
        try {
          const parsedAgents = safeParseJSON(agentsJson);
          if (parsedAgents) {
            cliAgents = parseAgentsFromJson(parsedAgents, 'flagSettings');
          }
        } catch (error) {
          logError(error);
        }
      }

      // 合并 CLI agent 与已有 agent
      const allAgents = [...agentDefinitionsResult.allAgents, ...cliAgents];
      const agentDefinitions = {
        ...agentDefinitionsResult,
        allAgents,
        activeAgents: getActiveAgentsFromList(allAgents)
      };

      // 查找主线程 agent（CLI 标志或设置）
      const agentSetting = agentCli ?? getInitialSettings().agent;
      let mainThreadAgentDefinition: (typeof agentDefinitions.activeAgents)[number] | undefined;
      if (agentSetting) {
        mainThreadAgentDefinition = agentDefinitions.activeAgents.find(agent => agent.agentType === agentSetting);
        if (!mainThreadAgentDefinition) {
          logForDebugging(`Warning: agent "${agentSetting}" not found. ` + `Available agents: ${agentDefinitions.activeAgents.map(a => a.agentType).join(', ')}. ` + `Using default behavior.`);
        }
      }

      // 存储主线程 agent 类型供 hook 访问
      setMainThreadAgentType(mainThreadAgentDefinition?.agentType);

      // 记录 agent 标志使用遥测
      if (mainThreadAgentDefinition) {
        logEvent('tengu_agent_flag', {
          agentType: isBuiltInAgent(mainThreadAgentDefinition) ? mainThreadAgentDefinition.agentType as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS : 'custom' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          ...(agentCli && {
            source: 'cli' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          })
        });
      }

      // 持久化 agent 设置到会话记录
      if (mainThreadAgentDefinition?.agentType) {
        saveAgentSetting(mainThreadAgentDefinition.agentType);
      }

      // 非交互模式：应用 agent 的系统提示词
      if (isNonInteractiveSession && mainThreadAgentDefinition && !systemPrompt && !isBuiltInAgent(mainThreadAgentDefinition)) {
        const agentSystemPrompt = mainThreadAgentDefinition.getSystemPrompt();
        if (agentSystemPrompt) {
          systemPrompt = agentSystemPrompt;
        }
      }

      // 合并 initialPrompt（斜杠命令优先处理）
      if (mainThreadAgentDefinition?.initialPrompt) {
        if (typeof inputPrompt === 'string') {
          inputPrompt = inputPrompt ? `${mainThreadAgentDefinition.initialPrompt}\n\n${inputPrompt}` : mainThreadAgentDefinition.initialPrompt;
        } else if (!inputPrompt) {
          inputPrompt = mainThreadAgentDefinition.initialPrompt;
        }
      }

      // 计算有效模型（agent 模型作为回退）
      let effectiveModel = userSpecifiedModel;
      if (!effectiveModel && mainThreadAgentDefinition?.model && mainThreadAgentDefinition.model !== 'inherit') {
        effectiveModel = parseUserSpecifiedModel(mainThreadAgentDefinition.model);
      }
      setMainLoopModelOverride(effectiveModel);

      // 计算 hook 使用的解析模型
      setInitialMainLoopModel(getUserSpecifiedModelSetting() || null);
      const initialMainLoopModel = getInitialMainLoopModel();
      const resolvedInitialModel = parseUserSpecifiedModel(initialMainLoopModel ?? getDefaultMainLoopModel());
      let advisorModel: string | undefined;
      if (isAdvisorEnabled()) {
        const advisorOption = canUserConfigureAdvisor() ? (options as {
          advisor?: string;
        }).advisor : undefined;
        if (advisorOption) {
          logForDebugging(`[AdvisorTool] --advisor ${advisorOption}`);
          if (!modelSupportsAdvisor(resolvedInitialModel)) {
            process.stderr.write(chalk.red(`Error: The model "${resolvedInitialModel}" does not support the advisor tool.\n`));
            process.exit(1);
          }
          const normalizedAdvisorModel = normalizeModelStringForAPI(parseUserSpecifiedModel(advisorOption));
          if (!isValidAdvisorModel(normalizedAdvisorModel)) {
            process.stderr.write(chalk.red(`Error: The model "${advisorOption}" cannot be used as an advisor.\n`));
            process.exit(1);
          }
        }
        advisorModel = canUserConfigureAdvisor() ? advisorOption ?? getInitialAdvisorSetting() : advisorOption;
        if (advisorModel) {
          logForDebugging(`[AdvisorTool] Advisor model: ${advisorModel}`);
        }
      }

      // 为 tmux teammate 添加自定义 agent 提示词
      if (isAgentSwarmsEnabled() && storedTeammateOpts?.agentId && storedTeammateOpts?.agentName && storedTeammateOpts?.teamName && storedTeammateOpts?.agentType) {
        const customAgent = agentDefinitions.activeAgents.find(a => a.agentType === storedTeammateOpts.agentType);
        if (customAgent) {
          // 获取 agent 提示词（内置 agent 跳过）
          let customPrompt: string | undefined;
          if (customAgent.source === 'built-in') {
            logForDebugging(`[teammate] Built-in agent ${storedTeammateOpts.agentType} - skipping custom prompt (not supported)`);
          } else {
            customPrompt = customAgent.getSystemPrompt();
          }

          // 记录 agent 内存加载事件
          if (customAgent.memory) {
            logEvent('tengu_agent_memory_loaded', {
              ...("external" === 'ant' && {
                agent_type: customAgent.agentType as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
              }),
              scope: customAgent.memory as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
              source: 'teammate' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
            });
          }
          if (customPrompt) {
            const customInstructions = `\n# Custom Agent Instructions\n${customPrompt}`;
            appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}\n\n${customInstructions}` : customInstructions;
          }
        } else {
          logForDebugging(`[teammate] Custom agent ${storedTeammateOpts.agentType} not found in available agents`);
        }
      }
      maybeActivateBrief(options);
      // defaultView:'chat' 持久化 opt-in（检查权限后激活）
      if ((feature('KAIROS') || feature('KAIROS_BRIEF')) && !getIsNonInteractiveSession() && !getUserMsgOptIn() && getInitialSettings().defaultView === 'chat') {
        /* eslint-disable @typescript-eslint/no-require-imports */
        const {
          isBriefEntitled
        } = require('./tools/BriefTool/BriefTool.js') as typeof import('./tools/BriefTool/BriefTool.js');
        /* eslint-enable @typescript-eslint/no-require-imports */
        if (isBriefEntitled()) {
          setUserMsgOptIn(true);
        }
      }
      // Proactive 模式提示词（coordinator 模式跳过）
      if ((feature('PROACTIVE') || feature('KAIROS')) && ((options as {
        proactive?: boolean;
      }).proactive || isEnvTruthy(process.env.MICROCODE_PROACTIVE)) && !coordinatorModeModule?.isCoordinatorMode()) {
        /* eslint-disable @typescript-eslint/no-require-imports */
        const briefVisibility = feature('KAIROS') || feature('KAIROS_BRIEF') ? (require('./tools/BriefTool/BriefTool.js') as typeof import('./tools/BriefTool/BriefTool.js')).isBriefEnabled() ? 'Call SendUserMessage at checkpoints to mark where things stand.' : 'The user will see any text you output.' : 'The user will see any text you output.';
        /* eslint-enable @typescript-eslint/no-require-imports */
        const proactivePrompt = `\n# Proactive Mode\n\nYou are in proactive mode. Take initiative — explore, act, and make progress without waiting for instructions.\n\nStart by briefly greeting the user.\n\nYou will receive periodic <tick> prompts. These are check-ins. Do whatever seems most useful, or call Sleep if there's nothing to do. ${briefVisibility}`;
        appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}\n\n${proactivePrompt}` : proactivePrompt;
      }
      if (feature('KAIROS') && kairosEnabled && assistantModule) {
        const assistantAddendum = assistantModule.getAssistantSystemPromptAddendum();
        appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}\n\n${assistantAddendum}` : assistantAddendum;
      }

      // Ink root（仅交互模式需要）
      let root!: Root;
      let getFpsMetrics!: () => FpsMetrics | undefined;
      let stats!: StatsStore;

      // 命令加载后显示设置屏幕
      if (!isNonInteractiveSession) {
        const ctx = getRenderContext(false);
        getFpsMetrics = ctx.getFpsMetrics;
        stats = ctx.stats;
        // 安装 asciicast 录制器（ant-only，通过 MICROCODE_TERMINAL_RECORDING=1 启用）
        if ("external" === 'ant') {
          installAsciicastRecorder();
        }
        const {
          createRoot
        } = await import('./ink.js');
        root = await createRoot(ctx.renderOptions);

        // 记录启动时间（在阻塞对话框之前）
        logEvent('tengu_timer', {
          event: 'startup' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
          durationMs: Math.round(process.uptime() * 1000)
        });
        logForDebugging('[STARTUP] Running showSetupScreens()...');
        const setupScreensStart = Date.now();
        const onboardingShown = await showSetupScreens(root, permissionMode, allowDangerouslySkipPermissions, commands, enableMicrocodeInChrome, devChannels);
        logForDebugging(`[STARTUP] showSetupScreens() completed in ${Date.now() - setupScreensStart}ms`);

        // 信任建立后解析 --remote-control 权限门控
        if (feature('BRIDGE_MODE') && remoteControlOption !== undefined) {
          const {
            getBridgeDisabledReason
          } = await import('./bridge/bridgeEnabled.js');
          const disabledReason = await getBridgeDisabledReason();
          remoteControl = disabledReason === null;
          if (disabledReason) {
            process.stderr.write(chalk.yellow(`${disabledReason}\n--rc flag ignored.\n`));
          }
        }

        // 检查 agent 内存快照更新（ant-only）
        if (feature('AGENT_MEMORY_SNAPSHOT') && mainThreadAgentDefinition && isCustomAgent(mainThreadAgentDefinition) && mainThreadAgentDefinition.memory && mainThreadAgentDefinition.pendingSnapshotUpdate) {
          const agentDef = mainThreadAgentDefinition;
          const choice = await launchSnapshotUpdateDialog(root, {
            agentType: agentDef.agentType,
            scope: agentDef.memory!,
            snapshotTimestamp: agentDef.pendingSnapshotUpdate!.snapshotTimestamp
          });
          if (choice === 'merge') {
            const {
              buildMergePrompt
            } = await import('./components/agents/SnapshotUpdateDialog.js');
            const mergePrompt = buildMergePrompt(agentDef.agentType, agentDef.memory!);
            inputPrompt = inputPrompt ? `${mergePrompt}\n\n${inputPrompt}` : mergePrompt;
          }
          agentDef.pendingSnapshotUpdate = undefined;
        }

        // 跳过重复的 /login（onboarding 已完成）
        if (onboardingShown && prompt?.trim().toLowerCase() === '/login') {
          prompt = '';
        }
        if (onboardingShown) {
          // onboarding 完成后刷新认证相关服务
          void refreshRemoteManagedSettings();
          void refreshPolicyLimits();
          resetUserCache();
          refreshGrowthBookAfterAuthChange();
          // 清除旧的 trusted device token 并重新注册
          void import('./bridge/trustedDevice.js').then(m => {
            m.clearTrustedDeviceToken();
            return m.enrollTrustedDevice();
          });
        }

        // 校验组织限制
        const orgValidation = await validateForceLoginOrg();
        if (!orgValidation.valid) {
          await exitWithError(root, orgValidation.message);
        }
      }

      // 如果已触发优雅关闭（如用户拒绝信任对话框），跳过后续操作
      // trigger code execution before the process exits (e.g. we don't want apiKeyHelper
      // to run if trust was not established).
      if (process.exitCode !== undefined) {
        logForDebugging('Graceful shutdown initiated, skipping further initialization');
        return;
      }

      // 初始化 LSP 管理器（信任建立后）
      initializeLspServerManager();

      // 显示设置验证错误（信任建立后）
      if (!isNonInteractiveSession) {
        const {
          errors
        } = getSettingsWithErrors();
        const nonMcpErrors = errors.filter(e => !e.mcpErrorMetadata);
        if (nonMcpErrors.length > 0) {
          await launchInvalidSettingsDialog(root, {
            settingsErrors: nonMcpErrors,
            onExit: () => gracefulShutdownSync(1)
          });
        }
      }

      // 后台预取：配额、fast mode、passes 等（bare 模式跳过）
      const bgRefreshThrottleMs = getFeatureValue_CACHED_MAY_BE_STALE('tengu_cicada_nap_ms', 0);
      const lastPrefetched = getGlobalConfig().startupPrefetchedAt ?? 0;
      const skipStartupPrefetches = isBareMode() || bgRefreshThrottleMs > 0 && Date.now() - lastPrefetched < bgRefreshThrottleMs;
      if (!skipStartupPrefetches) {
        const lastPrefetchedInfo = lastPrefetched > 0 ? ` last ran ${Math.round((Date.now() - lastPrefetched) / 1000)}s ago` : '';
        logForDebugging(`Starting background startup prefetches${lastPrefetchedInfo}`);
        checkQuotaStatus().catch(error => logError(error));

        // 获取 bootstrap 数据并更新缓存
        void fetchBootstrapData();

        void prefetchPassesEligibility();
        if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_miraculo_the_bard', false)) {
          void prefetchFastModeStatus();
        } else {
          // 从缓存解析 fast mode 状态
          resolveFastModeStatusFromCache();
        }
        if (bgRefreshThrottleMs > 0) {
          saveGlobalConfig(current => ({
            ...current,
            startupPrefetchedAt: Date.now()
          }));
        }
      } else {
        logForDebugging(`Skipping startup prefetches, last ran ${Math.round((Date.now() - lastPrefetched) / 1000)}s ago`);
        resolveFastModeStatusFromCache();
      }
      if (!isNonInteractiveSession) {
        void refreshExampleCommands();
      }

      // 解析 MCP 配置（提前启动，与 setup 并行）
      const {
        servers: existingMcpConfigs
      } = await mcpConfigPromise;
      logForDebugging(`[STARTUP] MCP configs resolved in ${mcpConfigResolvedMs}ms (awaited at +${Date.now() - mcpConfigStart}ms)`);
      // CLI 标志覆盖文件配置
      const allMcpConfigs = {
        ...existingMcpConfigs,
        ...dynamicMcpConfig
      };

      // 分离 SDK 配置和普通 MCP 配置
      const sdkMcpConfigs: Record<string, McpSdkServerConfig> = {};
      const regularMcpConfigs: Record<string, ScopedMcpServerConfig> = {};
      for (const [name, config] of Object.entries(allMcpConfigs)) {
        const typedConfig = config as ScopedMcpServerConfig | McpSdkServerConfig;
        if (typedConfig.type === 'sdk') {
          sdkMcpConfigs[name] = typedConfig as McpSdkServerConfig;
        } else {
          regularMcpConfigs[name] = typedConfig as ScopedMcpServerConfig;
        }
      }
      profileCheckpoint('action_mcp_configs_loaded');

      // 信任对话框后预取 MCP 资源（仅交互模式）
      // print 模式延迟连接到 headlessStore 创建后逐服务器推送
      const localMcpPromise = isNonInteractiveSession ? Promise.resolve({
        clients: [],
        tools: [],
        commands: []
      }) : prefetchAllMcpResources(regularMcpConfigs);
      const claudeaiMcpPromise = isNonInteractiveSession ? Promise.resolve({
        clients: [],
        tools: [],
        commands: []
      }) : claudeaiConfigPromise.then(configs => Object.keys(configs).length > 0 ? prefetchAllMcpResources(configs) : {
        clients: [],
        tools: [],
        commands: []
      });
      // 合并 MCP 资源（按名称去重）
      const mcpPromise = Promise.all([localMcpPromise, claudeaiMcpPromise]).then(([local, claudeai]) => ({
        clients: [...local.clients, ...claudeai.clients],
        tools: uniqBy([...local.tools, ...claudeai.tools], 'name'),
        commands: uniqBy([...local.commands, ...claudeai.commands], 'name')
      }));

      // 启动 session hooks（与 MCP 连接并行）
      const hooksPromise = initOnly || init || maintenance || isNonInteractiveSession || options.continue || options.resume ? null : processSessionStartHooks('startup', {
        agentType: mainThreadAgentDefinition?.agentType,
        model: resolvedInitialModel
      });

      // MCP 不阻塞 REPL 渲染（异步连接）
      const hookMessages: Awaited<NonNullable<typeof hooksPromise>> = [];
      mcpPromise.catch(() => {});
      const mcpClients: Awaited<typeof mcpPromise>['clients'] = [];
      const mcpTools: Awaited<typeof mcpPromise>['tools'] = [];
      const mcpCommands: Awaited<typeof mcpPromise>['commands'] = [];
      let thinkingEnabled = shouldEnableThinkingByDefault();
      let thinkingConfig: ThinkingConfig = thinkingEnabled !== false ? {
        type: 'adaptive'
      } : {
        type: 'disabled'
      };
      if (options.thinking === 'adaptive' || options.thinking === 'enabled') {
        thinkingEnabled = true;
        thinkingConfig = {
          type: 'adaptive'
        };
      } else if (options.thinking === 'disabled') {
        thinkingEnabled = false;
        thinkingConfig = {
          type: 'disabled'
        };
      } else {
        const maxThinkingTokens = process.env.MAX_THINKING_TOKENS ? parseInt(process.env.MAX_THINKING_TOKENS, 10) : options.maxThinkingTokens;
        if (maxThinkingTokens !== undefined) {
          if (maxThinkingTokens > 0) {
            thinkingEnabled = true;
            thinkingConfig = {
              type: 'enabled',
              budgetTokens: maxThinkingTokens
            };
          } else if (maxThinkingTokens === 0) {
            thinkingEnabled = false;
            thinkingConfig = {
              type: 'disabled'
            };
          }
        }
      }
      logForDiagnosticsNoPII('info', 'started', {
        version: MACRO.VERSION,
        is_native_binary: isInBundledMode()
      });
      registerCleanup(async () => {
        logForDiagnosticsNoPII('info', 'exited');
      });
      void logTenguInit({
        hasInitialPrompt: Boolean(prompt),
        hasStdin: Boolean(inputPrompt),
        verbose,
        debug,
        debugToStderr,
        print: print ?? false,
        outputFormat: outputFormat ?? 'text',
        inputFormat: inputFormat ?? 'text',
        numAllowedTools: allowedTools.length,
        numDisallowedTools: disallowedTools.length,
        mcpClientCount: Object.keys(allMcpConfigs).length,
        worktreeEnabled,
        skipWebFetchPreflight: getInitialSettings().skipWebFetchPreflight,
        githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
        dangerouslySkipPermissionsPassed: dangerouslySkipPermissions ?? false,
        permissionMode,
        modeIsBypass: permissionMode === 'bypassPermissions',
        allowDangerouslySkipPermissionsPassed: allowDangerouslySkipPermissions,
        systemPromptFlag: systemPrompt ? options.systemPromptFile ? 'file' : 'flag' : undefined,
        appendSystemPromptFlag: appendSystemPrompt ? options.appendSystemPromptFile ? 'file' : 'flag' : undefined,
        thinkingConfig,
        assistantActivationPath: feature('KAIROS') && kairosEnabled ? assistantModule?.getAssistantActivationPath() : undefined
      });

      // 记录上下文指标
      void logContextMetrics(regularMcpConfigs, toolPermissionContext);
      void logPermissionContextForAnts(null, 'initialization');
      logManagedSettings();

      // 注册 PID 文件用于并发会话检测
      void registerSession().then(registered => {
        if (!registered) return;
        if (sessionNameArg) {
          void updateSessionName(sessionNameArg);
        }
        void countConcurrentSessions().then(count => {
          if (count >= 2) {
            logEvent('tengu_concurrent_sessions', {
              num_sessions: count
            });
          }
        });
      });

      // 初始化版本化插件系统（bare 模式跳过）
      if (isBareMode()) {
        // 跳过
      } else if (isNonInteractiveSession) {
        // 非交互模式：等待插件同步完成
        await initializeVersionedPlugins();
        profileCheckpoint('action_after_plugins_init');
        void cleanupOrphanedPluginVersionsInBackground().then(() => getGlobExclusionsForPluginCache());
      } else {
        // 交互模式：异步执行（不影响当前会话）
        void initializeVersionedPlugins().then(async () => {
          profileCheckpoint('action_after_plugins_init');
          await cleanupOrphanedPluginVersionsInBackground();
          void getGlobExclusionsForPluginCache();
        });
      }
      const setupTrigger = initOnly || init ? 'init' : maintenance ? 'maintenance' : null;
      if (initOnly) {
        applyConfigEnvironmentVariables();
        await processSetupHooks('init', {
          forceSyncExecution: true
        });
        await processSessionStartHooks('startup', {
          forceSyncExecution: true
        });
        gracefulShutdownSync(0);
        return;
      }

      // --print mode
      if (isNonInteractiveSession) {
        if (outputFormat === 'stream-json' || outputFormat === 'json') {
          setHasFormattedOutput(true);
        }

        // print 模式下应用完整环境变量（信任对话框已绕过）
        // 注意：这包含来自不可信源的潜在危险环境变量
        // but print mode is considered trusted (as documented in help text)
        applyConfigEnvironmentVariables();

        // 环境变量应用后初始化遥测（确保 OTEL 端点环境变量已设置）
        initializeTelemetryAfterTrust();

        // 启动 SessionStart hooks（与 MCP 连接并行）
        const sessionStartHooksPromise = options.continue || options.resume || teleport || setupTrigger ? undefined : processSessionStartHooks('startup');
        sessionStartHooksPromise?.catch(() => {});
        profileCheckpoint('before_validateForceLoginOrg');
        // 校验组织限制
        const orgValidation = await validateForceLoginOrg();
        if (!orgValidation.valid) {
          process.stderr.write(orgValidation.message + '\n');
          process.exit(1);
        }

        // 获取 headless 模式支持的命令
        const commandsHeadless = disableSlashCommands ? [] : commands.filter(command => command.type === 'prompt' && !command.disableNonInteractive || command.type === 'local' && command.supportsNonInteractive);
        const defaultState = getDefaultAppState();
        const headlessInitialState: AppState = {
          ...defaultState,
          mcp: {
            ...defaultState.mcp,
            clients: mcpClients,
            commands: mcpCommands,
            tools: mcpTools
          },
          toolPermissionContext,
          effortValue: parseEffortValue(options.effort) ?? getInitialEffortSetting(),
          ...(isFastModeEnabled() && {
            fastMode: getInitialFastModeSetting(effectiveModel ?? null)
          }),
          ...(isAdvisorEnabled() && advisorModel && {
            advisorModel
          }),
          // kairosEnabled 控制异步执行路径
          ...(feature('KAIROS') ? {
            kairosEnabled
          } : {})
        };

        // 初始化 headless 应用状态
        const headlessStore = createStore(headlessInitialState, onChangeAppState);

        // 异步检查 bypass 权限是否应禁用
        if (toolPermissionContext.mode === 'bypassPermissions' || allowDangerouslySkipPermissions) {
          void checkAndDisableBypassPermissions(toolPermissionContext);
        }

        // 异步检查 auto mode 门控
        if (feature('TRANSCRIPT_CLASSIFIER')) {
          void verifyAutoModeGateAccess(toolPermissionContext, headlessStore.getState().fastMode).then(({
            updateContext
          }) => {
            headlessStore.setState(prev => {
              const nextCtx = updateContext(prev.toolPermissionContext);
              if (nextCtx === prev.toolPermissionContext) return prev;
              return {
                ...prev,
                toolPermissionContext: nextCtx
              };
            });
          });
        }

        // 设置全局状态（session 持久化）
        if (options.sessionPersistence === false) {
          setSessionPersistenceDisabled(true);
        }

        // 存储 SDK betas 到全局状态（用于上下文窗口计算）
        // 仅存储允许的 betas（按白名单和订阅状态过滤）
        setSdkBetas(filterAllowedSdkBetas(betas));

        // print 模式 MCP：逐服务器增量推送到 headlessStore
        // 与 useManageMCPConnections 逻辑一致：先推送 pending 状态
        // 再逐服务器替换为 connected/failed 状态
        const connectMcpBatch = (configs: Record<string, ScopedMcpServerConfig>, label: string): Promise<void> => {
          if (Object.keys(configs).length === 0) return Promise.resolve();
          headlessStore.setState(prev => ({
            ...prev,
            mcp: {
              ...prev.mcp,
              clients: [...prev.mcp.clients, ...Object.entries(configs).map(([name, config]) => ({
                name,
                type: 'pending' as const,
                config
              }))]
            }
          }));
          return getMcpToolsCommandsAndResources(({
            client,
            tools,
            commands
          }) => {
            headlessStore.setState(prev => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.some(c => c.name === client.name) ? prev.mcp.clients.map(c => c.name === client.name ? client : c) : [...prev.mcp.clients, client],
                tools: uniqBy([...prev.mcp.tools, ...tools], 'name'),
                commands: uniqBy([...prev.mcp.commands, ...commands], 'name')
              }
            }));
          }, configs).catch(err => logForDebugging(`[MCP] ${label} connect error: ${err}`));
        };
        // 等待所有 MCP 配置连接完成（print 模式需要同步）
        profileCheckpoint('before_connectMcp');
        await connectMcpBatch(regularMcpConfigs, 'regular');
        profileCheckpoint('after_connectMcp');
        // 去重：抑制与 claude.ai connector 重复的插件 MCP 服务器
        const MICROCODE_AI_MCP_TIMEOUT_MS = 5_000;
        const microcodeaiConnect = claudeaiConfigPromise.then(microcodeaiConfigs => {
          if (Object.keys(microcodeaiConfigs).length > 0) {
            const microcodeaiSigs = new Set<string>();
            for (const config of Object.values(microcodeaiConfigs)) {
              const sig = getMcpServerSignature(config);
              if (sig) microcodeaiSigs.add(sig);
            }
            const suppressed = new Set<string>();
            for (const [name, config] of Object.entries(regularMcpConfigs)) {
              if (!name.startsWith('plugin:')) continue;
              const sig = getMcpServerSignature(config);
              if (sig && microcodeaiSigs.has(sig)) suppressed.add(name);
            }
            if (suppressed.size > 0) {
              logForDebugging(`[MCP] Lazy dedup: suppressing ${suppressed.size} plugin server(s) that duplicate claude.ai connectors: ${[...suppressed].join(', ')}`);
              // 断开已连接的重复服务器
              for (const c of headlessStore.getState().mcp.clients) {
                if (!suppressed.has(c.name) || c.type !== 'connected') continue;
                c.client.onclose = undefined;
                void clearServerCache(c.name, c.config).catch(() => {});
              }
              headlessStore.setState(prev => {
                let {
                  clients,
                  tools,
                  commands,
                  resources
                } = prev.mcp;
                clients = clients.filter(c => !suppressed.has(c.name));
                tools = tools.filter(t => !t.mcpInfo || !suppressed.has(t.mcpInfo.serverName));
                for (const name of suppressed) {
                  commands = excludeCommandsByServer(commands, name);
                  resources = excludeResourcesByServer(resources, name);
                }
                return {
                  ...prev,
                  mcp: {
                    ...prev.mcp,
                    clients,
                    tools,
                    commands,
                    resources
                  }
                };
              });
            }
          }
          // 抑制与已启用的 MCP 服务器重复的 claude.ai connector
          // manual server (URL-signature match). Plugin dedup above only
          // handles `plugin:*` keys; this catches manual `.mcp.json` entries.
          // 排除 plugin:* 配置（已在步骤 1 中抑制）
          const nonPluginConfigs = pickBy(regularMcpConfigs, (_, n) => !n.startsWith('plugin:'));
          const {
            servers: dedupedMicrocodeAi
          } = dedupMicrocodeAiMcpServers(microcodeaiConfigs, nonPluginConfigs);
          return connectMcpBatch(dedupedMicrocodeAi, 'microcodeai');
        });
        let microcodeaiTimer: ReturnType<typeof setTimeout> | undefined;
        const microcodeaiTimedOut = await Promise.race([microcodeaiConnect.then(() => false), new Promise<boolean>(resolve => {
          microcodeaiTimer = setTimeout(r => r(true), MICROCODE_AI_MCP_TIMEOUT_MS, resolve);
        })]);
        if (microcodeaiTimer) clearTimeout(microcodeaiTimer);
        if (microcodeaiTimedOut) {
          logForDebugging(`[MCP] claude.ai connectors not ready after ${MICROCODE_AI_MCP_TIMEOUT_MS}ms — proceeding; background connection continues`);
        }
        profileCheckpoint('after_connectMcp_claudeai');

        // 启动后台预取和清理任务（bare 模式跳过）
        if (!isBareMode()) {
          startDeferredPrefetches();
          void import('./utils/backgroundHousekeeping.js').then(m => m.startBackgroundHousekeeping());
          if ("external" === 'ant') {
            void import('./utils/sdkHeapDumpMonitor.js').then(m => m.startSdkMemoryMonitor());
          }
        }
        logSessionTelemetry();
        profileCheckpoint('before_print_import');
        const {
          runHeadless
        } = await import('src/cli/print.js');
        profileCheckpoint('after_print_import');
        void runHeadless(inputPrompt, () => headlessStore.getState(), headlessStore.setState, commandsHeadless, tools, sdkMcpConfigs, agentDefinitions.activeAgents, {
          continue: options.continue,
          resume: options.resume,
          verbose: verbose,
          outputFormat: outputFormat,
          jsonSchema,
          permissionPromptToolName: options.permissionPromptTool,
          allowedTools,
          thinkingConfig,
          maxTurns: options.maxTurns,
          maxBudgetUsd: options.maxBudgetUsd,
          taskBudget: options.taskBudget ? {
            total: options.taskBudget
          } : undefined,
          systemPrompt,
          appendSystemPrompt,
          userSpecifiedModel: effectiveModel,
          fallbackModel: userSpecifiedFallbackModel,
          teleport,
          sdkUrl,
          replayUserMessages: effectiveReplayUserMessages,
          includePartialMessages: effectiveIncludePartialMessages,
          forkSession: options.forkSession || false,
          resumeSessionAt: options.resumeSessionAt || undefined,
          rewindFiles: options.rewindFiles,
          enableAuthStatus: options.enableAuthStatus,
          agent: agentCli,
          workload: options.workload,
          setupTrigger: setupTrigger ?? undefined,
          sessionStartHooksPromise
        });
        return;
      }

      // 记录模型配置遥测
      logEvent('tengu_startup_manual_model_config', {
        cli_flag: options.model as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        env_var: process.env.ANTHROPIC_MODEL as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        settings_file: (getInitialSettings() || {}).model as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        subscriptionType: getSubscriptionType() as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
        agent: agentSetting as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      });

      // 获取初始模型的弃用警告（resolvedInitialModel 在 hooks 并行化时已计算）
      const deprecationWarning = getModelDeprecationWarning(resolvedInitialModel);

      // 构建初始通知队列
      const initialNotifications: Array<{
        key: string;
        text: string;
        color?: 'warning';
        priority: 'high';
      }> = [];
      if (permissionModeNotification) {
        initialNotifications.push({
          key: 'permission-mode-notification',
          text: permissionModeNotification,
          priority: 'high'
        });
      }
      if (deprecationWarning) {
        initialNotifications.push({
          key: 'model-deprecation-warning',
          text: deprecationWarning,
          color: 'warning',
          priority: 'high'
        });
      }
      if (overlyBroadBashPermissions.length > 0) {
        const displayList = uniq(overlyBroadBashPermissions.map(p => p.ruleDisplay));
        const displays = displayList.join(', ');
        const sources = uniq(overlyBroadBashPermissions.map(p => p.sourceDisplay)).join(', ');
        const n = displayList.length;
        initialNotifications.push({
          key: 'overly-broad-bash-notification',
          text: `${displays} allow ${plural(n, 'rule')} from ${sources} ${plural(n, 'was', 'were')} ignored \u2014 not available for Ants, please use auto-mode instead`,
          color: 'warning',
          priority: 'high'
        });
      }
      const effectiveToolPermissionContext = {
        ...toolPermissionContext,
        mode: isAgentSwarmsEnabled() && getTeammateUtils().isPlanModeRequired() ? 'plan' as const : toolPermissionContext.mode
      };
      // 读取 brief 模式 opt-in 状态
      const initialIsBriefOnly = feature('KAIROS') || feature('KAIROS_BRIEF') ? getUserMsgOptIn() : false;
      const fullRemoteControl = remoteControl || getRemoteControlAtStartup() || kairosEnabled;
      let ccrMirrorEnabled = false;
      if (feature('CCR_MIRROR') && !fullRemoteControl) {
        /* eslint-disable @typescript-eslint/no-require-imports */
        const {
          isCcrMirrorEnabled
        } = require('./bridge/bridgeEnabled.js') as typeof import('./bridge/bridgeEnabled.js');
        /* eslint-enable @typescript-eslint/no-require-imports */
        ccrMirrorEnabled = isCcrMirrorEnabled();
      }
      const initialState: AppState = {
        settings: getInitialSettings(),
        tasks: {},
        agentNameRegistry: new Map(),
        verbose: verbose ?? getGlobalConfig().verbose ?? false,
        mainLoopModel: initialMainLoopModel,
        mainLoopModelForSession: null,
        isBriefOnly: initialIsBriefOnly,
        expandedView: getGlobalConfig().showSpinnerTree ? 'teammates' : getGlobalConfig().showExpandedTodos ? 'tasks' : 'none',
        showTeammateMessagePreview: isAgentSwarmsEnabled() ? false : undefined,
        selectedIPAgentIndex: -1,
        coordinatorTaskIndex: -1,
        viewSelectionMode: 'none',
        footerSelection: null,
        toolPermissionContext: effectiveToolPermissionContext,
        agent: mainThreadAgentDefinition?.agentType,
        agentDefinitions,
        mcp: {
          clients: [],
          tools: [],
          commands: [],
          resources: {},
          pluginReconnectKey: 0
        },
        plugins: {
          enabled: [],
          disabled: [],
          commands: [],
          errors: [],
          installationStatus: {
            marketplaces: [],
            plugins: []
          },
          needsRefresh: false
        },
        statusLineText: undefined,
        kairosEnabled,
        remoteSessionUrl: undefined,
        remoteConnectionStatus: 'connecting',
        remoteBackgroundTaskCount: 0,
        replBridgeEnabled: fullRemoteControl || ccrMirrorEnabled,
        replBridgeExplicit: remoteControl,
        replBridgeOutboundOnly: ccrMirrorEnabled,
        replBridgeConnected: false,
        replBridgeSessionActive: false,
        replBridgeReconnecting: false,
        replBridgeConnectUrl: undefined,
        replBridgeSessionUrl: undefined,
        replBridgeEnvironmentId: undefined,
        replBridgeSessionId: undefined,
        replBridgeError: undefined,
        replBridgeInitialName: remoteControlName,
        showRemoteCallout: false,
        notifications: {
          current: null,
          queue: initialNotifications
        },
        elicitation: {
          queue: []
        },
        todos: {},
        remoteAgentTaskSuggestions: [],
        fileHistory: {
          snapshots: [],
          trackedFiles: new Set(),
          snapshotSequence: 0
        },
        attribution: createEmptyAttributionState(),
        thinkingEnabled,
        promptSuggestionEnabled: shouldEnablePromptSuggestion(),
        sessionHooks: new Map(),
        inbox: {
          messages: []
        },
        promptSuggestion: {
          text: null,
          promptId: null,
          shownAt: 0,
          acceptedAt: 0,
          generationRequestId: null
        },
        speculation: IDLE_SPECULATION_STATE,
        speculationSessionTimeSavedMs: 0,
        skillImprovement: {
          suggestion: null
        },
        workerSandboxPermissions: {
          queue: [],
          selectedIndex: 0
        },
        pendingWorkerRequest: null,
        pendingSandboxRequest: null,
        authVersion: 0,
        initialMessage: inputPrompt ? {
          message: createUserMessage({
            content: String(inputPrompt)
          })
        } : null,
        effortValue: parseEffortValue(options.effort) ?? getInitialEffortSetting(),
        activeOverlays: new Set<string>(),
        fastMode: getInitialFastModeSetting(resolvedInitialModel),
        ...(isAdvisorEnabled() && advisorModel && {
          advisorModel
        }),
        // 同步计算团队上下文（避免渲染时 setState）
        teamContext: feature('KAIROS') ? assistantTeamContext ?? computeInitialTeamContext?.() : computeInitialTeamContext?.()
      };

      // 添加 CLI 初始 prompt 到历史记录
      if (inputPrompt) {
        addToHistory(String(inputPrompt));
      }
      const initialTools = mcpTools;

      // 同步递增启动计数（渲染器需要最新值）
      saveGlobalConfig(current => ({
        ...current,
        numStartups: (current.numStartups ?? 0) + 1
      }));
      setImmediate(() => {
        void logStartupTelemetry();
        logSessionTelemetry();
      });

      // 会话数据上传器（ant-only，异步加载）
      const sessionUploaderPromise = "external" === 'ant' ? import('./utils/sessionDataUploader.js') : null;

      // 延迟解析上传器到 onTurnComplete 回调
      const uploaderReady = sessionUploaderPromise ? sessionUploaderPromise.then(mod => mod.createSessionTurnUploader()).catch(() => null) : null;
      const sessionConfig = {
        debug: debug || debugToStderr,
        commands: [...commands, ...mcpCommands],
        initialTools,
        mcpClients,
        autoConnectIdeFlag: ide,
        mainThreadAgentDefinition,
        disableSlashCommands,
        dynamicMcpConfig,
        strictMcpConfig,
        systemPrompt,
        appendSystemPrompt,
        taskListId,
        thinkingConfig,
        ...(uploaderReady && {
          onTurnComplete: (messages: MessageType[]) => {
            void uploaderReady.then(uploader => uploader?.(messages));
          }
        })
      };

      // 恢复会话的共享上下文
      const resumeContext = {
        modeApi: coordinatorModeModule,
        mainThreadAgentDefinition,
        agentDefinitions,
        currentCwd,
        cliAgents,
        initialState
      };
      if (options.continue) {
        // 恢复最近的会话
        let resumeSucceeded = false;
        try {
          const resumeStart = performance.now();

          // 清除过期缓存
          const {
            clearSessionCaches
          } = await import('./commands/clear/caches.js');
          clearSessionCaches();
          const result = await loadConversationForResume(undefined /* sessionId */, undefined /* sourceFile */);
          if (!result) {
            logEvent('tengu_continue', {
              success: false
            });
            return await exitWithError(root, 'No conversation found to continue');
          }
          const loaded = await processResumedConversation(result, {
            forkSession: !!options.forkSession,
            includeAttribution: true,
            transcriptPath: result.fullPath
          }, resumeContext);
          if (loaded.restoredAgentDef) {
            mainThreadAgentDefinition = loaded.restoredAgentDef;
          }
          maybeActivateProactive(options);
          maybeActivateBrief(options);
          logEvent('tengu_continue', {
            success: true,
            resume_duration_ms: Math.round(performance.now() - resumeStart)
          });
          resumeSucceeded = true;
          await launchRepl(root, {
            getFpsMetrics,
            stats,
            initialState: loaded.initialState
          }, {
            ...sessionConfig,
            mainThreadAgentDefinition: loaded.restoredAgentDef ?? mainThreadAgentDefinition,
            initialMessages: loaded.messages,
            initialFileHistorySnapshots: loaded.fileHistorySnapshots,
            initialContentReplacements: loaded.contentReplacements,
            initialAgentName: loaded.agentName,
            initialAgentColor: loaded.agentColor
          }, renderAndRun);
        } catch (error) {
          if (!resumeSucceeded) {
            logEvent('tengu_continue', {
              success: false
            });
          }
          logError(error);
          process.exit(1);
        }
      } else if (feature('DIRECT_CONNECT') && _pendingConnect?.url) {
        // 直接连接远程服务器
        let directConnectConfig;
        try {
          const session = await createDirectConnectSession({
            serverUrl: _pendingConnect.url,
            authToken: _pendingConnect.authToken,
            cwd: getOriginalCwd(),
            dangerouslySkipPermissions: _pendingConnect.dangerouslySkipPermissions
          });
          if (session.workDir) {
            setOriginalCwd(session.workDir);
            setCwdState(session.workDir);
          }
          setDirectConnectServerUrl(_pendingConnect.url);
          directConnectConfig = session.config;
        } catch (err) {
          return await exitWithError(root, err instanceof DirectConnectError ? err.message : String(err), () => gracefulShutdown(1));
        }
        const connectInfoMessage = createSystemMessage(`Connected to server at ${_pendingConnect.url}\nSession: ${directConnectConfig.sessionId}`, 'info');
        await launchRepl(root, {
          getFpsMetrics,
          stats,
          initialState
        }, {
          debug: debug || debugToStderr,
          commands,
          initialTools: [],
          initialMessages: [connectInfoMessage],
          mcpClients: [],
          autoConnectIdeFlag: ide,
          mainThreadAgentDefinition,
          disableSlashCommands,
          directConnectConfig,
          thinkingConfig
        }, renderAndRun);
        return;
      } else if (feature('SSH_REMOTE') && _pendingSSH?.host) {
        // SSH 远程会话（工具远程运行，UI 本地渲染）
        const {
          createSSHSession,
          createLocalSSHSession,
          SSHSessionError
        } = await import('./ssh/createSSHSession.js');
        let sshSession;
        try {
          if (_pendingSSH.local) {
            process.stderr.write('Starting local ssh-proxy test session...\n');
            sshSession = createLocalSSHSession({
              cwd: _pendingSSH.cwd,
              permissionMode: _pendingSSH.permissionMode,
              dangerouslySkipPermissions: _pendingSSH.dangerouslySkipPermissions
            });
          } else {
            process.stderr.write(`Connecting to ${_pendingSSH.host}…\n`);
            // 连接进度显示
            const isTTY = process.stderr.isTTY;
            let hadProgress = false;
            sshSession = await createSSHSession({
              host: _pendingSSH.host,
              cwd: _pendingSSH.cwd,
              localVersion: MACRO.VERSION,
              permissionMode: _pendingSSH.permissionMode,
              dangerouslySkipPermissions: _pendingSSH.dangerouslySkipPermissions,
              extraCliArgs: _pendingSSH.extraCliArgs
            }, isTTY ? {
              onProgress: msg => {
                hadProgress = true;
                process.stderr.write(`\r  ${msg}\x1b[K`);
              }
            } : {});
            if (hadProgress) process.stderr.write('\n');
          }
          setOriginalCwd(sshSession.remoteCwd);
          setCwdState(sshSession.remoteCwd);
          setDirectConnectServerUrl(_pendingSSH.local ? 'local' : _pendingSSH.host);
        } catch (err) {
          return await exitWithError(root, err instanceof SSHSessionError ? err.message : String(err), () => gracefulShutdown(1));
        }
        const sshInfoMessage = createSystemMessage(_pendingSSH.local ? `Local ssh-proxy test session\ncwd: ${sshSession.remoteCwd}\nAuth: unix socket → local proxy` : `SSH session to ${_pendingSSH.host}\nRemote cwd: ${sshSession.remoteCwd}\nAuth: unix socket -R → local proxy`, 'info');
        await launchRepl(root, {
          getFpsMetrics,
          stats,
          initialState
        }, {
          debug: debug || debugToStderr,
          commands,
          initialTools: [],
          initialMessages: [sshInfoMessage],
          mcpClients: [],
          autoConnectIdeFlag: ide,
          mainThreadAgentDefinition,
          disableSlashCommands,
          sshSession,
          thinkingConfig
        }, renderAndRun);
        return;
      } else if (feature('KAIROS') && _pendingAssistantChat && (_pendingAssistantChat.sessionId || _pendingAssistantChat.discover)) {
        // Assistant 会话查看器（远程 agentic 循环）
        const {
          discoverAssistantSessions
        } = await import('./assistant/sessionDiscovery.js');
        let targetSessionId = _pendingAssistantChat.sessionId;

        // 发现 assistant 会话
        if (!targetSessionId) {
          let sessions;
          try {
            sessions = await discoverAssistantSessions();
          } catch (e) {
            return await exitWithError(root, `Failed to discover sessions: ${e instanceof Error ? e.message : e}`, () => gracefulShutdown(1));
          }
          if (sessions.length === 0) {
            let installedDir: string | null;
            try {
              installedDir = await launchAssistantInstallWizard(root);
            } catch (e) {
              return await exitWithError(root, `Assistant installation failed: ${e instanceof Error ? e.message : e}`, () => gracefulShutdown(1));
            }
            if (installedDir === null) {
              await gracefulShutdown(0);
              process.exit(0);
            }
            // daemon 需要几秒启动
            return await exitWithMessage(root, `Assistant installed in ${installedDir}. The daemon is starting up — run \`microcode assistant\` again in a few seconds to connect.`, {
              exitCode: 0,
              beforeExit: () => gracefulShutdown(0)
            });
          }
          if (sessions.length === 1) {
            targetSessionId = sessions[0]!.id;
          } else {
            const picked = await launchAssistantSessionChooser(root, {
              sessions
            });
            if (!picked) {
              await gracefulShutdown(0);
              process.exit(0);
            }
            targetSessionId = picked;
          }
        }

        // 认证（获取 orgUUID 和 access token）
        const {
          checkAndRefreshOAuthTokenIfNeeded,
          getMicrocodeAIOAuthTokens
        } = await import('./utils/auth.js');
        await checkAndRefreshOAuthTokenIfNeeded();
        let apiCreds;
        try {
          apiCreds = await prepareApiRequest();
        } catch (e) {
          return await exitWithError(root, `Error: ${e instanceof Error ? e.message : 'Failed to authenticate'}`, () => gracefulShutdown(1));
        }
        const getAccessToken = (): string => getMicrocodeAIOAuthTokens()?.accessToken ?? apiCreds.accessToken;

        // Brief 模式激活：setKairosActive(true) 同时满足 opt-in
        // and entitlement for isBriefEnabled() (BriefTool.ts:124-132).
        setKairosActive(true);
        setUserMsgOptIn(true);
        setIsRemoteMode(true);
        const remoteSessionConfig = createRemoteSessionConfig(targetSessionId, getAccessToken, apiCreds.orgUUID, /* hasInitialPrompt */false, /* viewerOnly */true);
        const infoMessage = createSystemMessage(`Attached to assistant session ${targetSessionId.slice(0, 8)}…`, 'info');
        const assistantInitialState: AppState = {
          ...initialState,
          isBriefOnly: true,
          kairosEnabled: false,
          replBridgeEnabled: false
        };
        const remoteCommands = filterCommandsForRemoteMode(commands);
        await launchRepl(root, {
          getFpsMetrics,
          stats,
          initialState: assistantInitialState
        }, {
          debug: debug || debugToStderr,
          commands: remoteCommands,
          initialTools: [],
          initialMessages: [infoMessage],
          mcpClients: [],
          autoConnectIdeFlag: ide,
          mainThreadAgentDefinition,
          disableSlashCommands,
          remoteSessionConfig,
          thinkingConfig
        }, renderAndRun);
        return;
      } else if (options.resume || options.fromPr || teleport || remote !== null) {
        // 处理恢复流程（文件/会话 ID/交互选择器）

        // 清除过期缓存
        const {
          clearSessionCaches
        } = await import('./commands/clear/caches.js');
        clearSessionCaches();
        let messages: MessageType[] | null = null;
        let processedResume: ProcessedResume | undefined = undefined;
        let maybeSessionId = validateUuid(options.resume);
        let searchTerm: string | undefined = undefined;
        // 按自定义标题匹配的会话
        let matchedLog: LogOption | null = null;
        // PR 过滤器
        let filterByPr: boolean | number | string | undefined = undefined;

        // 处理 --from-pr 标志
        if (options.fromPr) {
          if (options.fromPr === true) {
            filterByPr = true;
          } else if (typeof options.fromPr === 'string') {
            filterByPr = options.fromPr;
          }
        }

        // 尝试按自定义标题精确匹配
        if (options.resume && typeof options.resume === 'string' && !maybeSessionId) {
          const trimmedValue = options.resume.trim();
          if (trimmedValue) {
            const matches = await searchSessionsByCustomTitle(trimmedValue, {
              exact: true
            });
            if (matches.length === 1) {
              // 精确匹配成功
              matchedLog = matches[0]!;
              maybeSessionId = getSessionIdFromLog(matchedLog) ?? null;
            } else {
              // 无匹配或多匹配 - 用作搜索词
              searchTerm = trimmedValue;
            }
          }
        }

        // --remote 和 --teleport 创建/恢复 CCR 会话
        if (remote !== null || teleport) {
          await waitForPolicyLimitsToLoad();
          if (!isPolicyAllowed('allow_remote_sessions')) {
            return await exitWithError(root, "Error: Remote sessions are disabled by your organization's policy.", () => gracefulShutdown(1));
          }
        }
        if (remote !== null) {
          // 创建远程会话
          const hasInitialPrompt = remote.length > 0;

          // 检查 TUI 模式是否启用
          const isRemoteTuiEnabled = getFeatureValue_CACHED_MAY_BE_STALE('tengu_remote_backend', false);
          if (!isRemoteTuiEnabled && !hasInitialPrompt) {
            return await exitWithError(root, 'Error: --remote requires a description.\nUsage: microcode --remote "your task description"', () => gracefulShutdown(1));
          }
          logEvent('tengu_remote_create_session', {
            has_initial_prompt: String(hasInitialPrompt) as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });

          // 传递当前分支供 CCR 克隆正确版本
          const currentBranch = await getBranch();
          const createdSession = await teleportToRemoteWithErrorHandling(root, hasInitialPrompt ? remote : null, new AbortController().signal, currentBranch || undefined);
          if (!createdSession) {
            logEvent('tengu_remote_create_session_error', {
              error: 'unable_to_create_session' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
            });
            return await exitWithError(root, 'Error: Unable to create remote session', () => gracefulShutdown(1));
          }
          logEvent('tengu_remote_create_session_success', {
            session_id: createdSession.id as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
          });

          // 非 TUI 模式：打印会话信息并退出
          if (!isRemoteTuiEnabled) {
            process.stdout.write(`Created remote session: ${createdSession.title}\n`);
            process.stdout.write(`View: ${getRemoteSessionUrl(createdSession.id)}?m=0\n`);
            process.stdout.write(`Resume with: microcode --teleport ${createdSession.id}\n`);
            await gracefulShutdown(0);
            process.exit(0);
          }

          // TUI 模式：启动本地 TUI 连接 CCR 引擎
          setIsRemoteMode(true);
          switchSession(asSessionId(createdSession.id));

          // 获取远程会话的 OAuth 凭据
          let apiCreds: {
            accessToken: string;
            orgUUID: string;
          };
          try {
            apiCreds = await prepareApiRequest();
          } catch (error) {
            logError(toError(error));
            return await exitWithError(root, `Error: ${errorMessage(error) || 'Failed to authenticate'}`, () => gracefulShutdown(1));
          }

          // 创建远程会话配置
          const {
            getMicrocodeAIOAuthTokens: getTokensForRemote
          } = await import('./utils/auth.js');
          const getAccessTokenForRemote = (): string => getTokensForRemote()?.accessToken ?? apiCreds.accessToken;
          const remoteSessionConfig = createRemoteSessionConfig(createdSession.id, getAccessTokenForRemote, apiCreds.orgUUID, hasInitialPrompt);

          // 添加远程会话信息作为初始系统消息
          const remoteSessionUrl = `${getRemoteSessionUrl(createdSession.id)}?m=0`;
          const remoteInfoMessage = createSystemMessage(`/remote-control is active. Code in CLI or at ${remoteSessionUrl}`, 'info');

          // 创建初始用户消息
          const initialUserMessage = hasInitialPrompt ? createUserMessage({
            content: remote
          }) : null;

          // 设置远程会话 URL 到应用状态
          const remoteInitialState = {
            ...initialState,
            remoteSessionUrl
          };

          // 过滤远程安全的命令
          const remoteCommands = filterCommandsForRemoteMode(commands);
          await launchRepl(root, {
            getFpsMetrics,
            stats,
            initialState: remoteInitialState
          }, {
            debug: debug || debugToStderr,
            commands: remoteCommands,
            initialTools: [],
            initialMessages: initialUserMessage ? [remoteInfoMessage, initialUserMessage] : [remoteInfoMessage],
            mcpClients: [],
            autoConnectIdeFlag: ide,
            mainThreadAgentDefinition,
            disableSlashCommands,
            remoteSessionConfig,
            thinkingConfig
          }, renderAndRun);
          return;
        } else if (teleport) {
          if (teleport === true || teleport === '') {
            // 交互模式：显示任务选择器
            logEvent('tengu_teleport_interactive_mode', {});
            logForDebugging('selectAndResumeTeleportTask: Starting teleport flow...');
            const teleportResult = await launchTeleportResumeWrapper(root);
            if (!teleportResult) {
              // 用户取消
              await gracefulShutdown(0);
              process.exit(0);
            }
            const {
              branchError
            } = await checkOutTeleportedSessionBranch(teleportResult.branch);
            messages = processMessagesForTeleportResume(teleportResult.log, branchError);
          } else if (typeof teleport === 'string') {
            logEvent('tengu_teleport_resume_session', {
              mode: 'direct' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
            });
            try {
              // 获取会话并验证仓库
              const sessionData = await fetchSession(teleport);
              const repoValidation = await validateSessionRepository(sessionData);

              // 处理仓库不匹配情况
              if (repoValidation.status === 'mismatch' || repoValidation.status === 'not_in_repo') {
                const sessionRepo = repoValidation.sessionRepo;
                if (sessionRepo) {
                  // 检查已知路径
                  const knownPaths = getKnownPathsForRepo(sessionRepo);
                  const existingPaths = await filterExistingPaths(knownPaths);
                  if (existingPaths.length > 0) {
                    // 显示目录切换对话框
                    const selectedPath = await launchTeleportRepoMismatchDialog(root, {
                      targetRepo: sessionRepo,
                      initialPaths: existingPaths
                    });
                    if (selectedPath) {
                      // 切换到选定目录
                      process.chdir(selectedPath);
                      setCwd(selectedPath);
                      setOriginalCwd(selectedPath);
                    } else {
                      // 用户取消
                      await gracefulShutdown(0);
                    }
                  } else {
                    // 无已知路径 - 显示错误
                    throw new TeleportOperationError(`You must run microcode --teleport ${teleport} from a checkout of ${sessionRepo}.`, chalk.red(`You must run microcode --teleport ${teleport} from a checkout of ${chalk.bold(sessionRepo)}.\n`));
                  }
                }
              } else if (repoValidation.status === 'error') {
                throw new TeleportOperationError(repoValidation.errorMessage || 'Failed to validate session', chalk.red(`Error: ${repoValidation.errorMessage || 'Failed to validate session'}\n`));
              }
              await validateGitState();

              // 使用进度 UI 进行 teleport
              const {
                teleportWithProgress
              } = await import('./components/TeleportProgress.js');
              const result = await teleportWithProgress(root, teleport);
              // 跟踪 teleported 会话
              setTeleportedSessionInfo({
                sessionId: teleport
              });
              messages = result.messages;
            } catch (error) {
              if (error instanceof TeleportOperationError) {
                process.stderr.write(error.formattedMessage + '\n');
              } else {
                logError(error);
                process.stderr.write(chalk.red(`Error: ${errorMessage(error)}\n`));
              }
              await gracefulShutdown(1);
            }
          }
        }
        if ("external" === 'ant') {
          if (options.resume && typeof options.resume === 'string' && !maybeSessionId) {
            // 检查 ccshare URL
            const {
              parseCcshareId,
              loadCcshare
            } = await import('./utils/ccshareResume.js');
            const ccshareId = parseCcshareId(options.resume);
            if (ccshareId) {
              try {
                const resumeStart = performance.now();
                const logOption = await loadCcshare(ccshareId);
                const result = await loadConversationForResume(logOption, undefined);
                if (result) {
                  processedResume = await processResumedConversation(result, {
                    forkSession: true,
                    transcriptPath: result.fullPath
                  }, resumeContext);
                  if (processedResume.restoredAgentDef) {
                    mainThreadAgentDefinition = processedResume.restoredAgentDef;
                  }
                  logEvent('tengu_session_resumed', {
                    entrypoint: 'ccshare' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                    success: true,
                    resume_duration_ms: Math.round(performance.now() - resumeStart)
                  });
                } else {
                  logEvent('tengu_session_resumed', {
                    entrypoint: 'ccshare' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                    success: false
                  });
                }
              } catch (error) {
                logEvent('tengu_session_resumed', {
                  entrypoint: 'ccshare' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                  success: false
                });
                logError(error);
                await exitWithError(root, `Unable to resume from ccshare: ${errorMessage(error)}`, () => gracefulShutdown(1));
              }
            } else {
              const resolvedPath = resolve(options.resume);
              try {
                const resumeStart = performance.now();
                let logOption;
                try {
                  // 尝试加载为转录文件
                  logOption = await loadTranscriptFromFile(resolvedPath);
                } catch (error) {
                  if (!isENOENT(error)) throw error;
                  // ENOENT: 非文件路径，回退到 session-ID 处理
                }
                if (logOption) {
                  const result = await loadConversationForResume(logOption, undefined /* sourceFile */);
                  if (result) {
                    processedResume = await processResumedConversation(result, {
                      forkSession: !!options.forkSession,
                      transcriptPath: result.fullPath
                    }, resumeContext);
                    if (processedResume.restoredAgentDef) {
                      mainThreadAgentDefinition = processedResume.restoredAgentDef;
                    }
                    logEvent('tengu_session_resumed', {
                      entrypoint: 'file' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                      success: true,
                      resume_duration_ms: Math.round(performance.now() - resumeStart)
                    });
                  } else {
                    logEvent('tengu_session_resumed', {
                      entrypoint: 'file' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                      success: false
                    });
                  }
                }
              } catch (error) {
                logEvent('tengu_session_resumed', {
                  entrypoint: 'file' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                  success: false
                });
                logError(error);
                await exitWithError(root, `Unable to load transcript from file: ${options.resume}`, () => gracefulShutdown(1));
              }
            }
          }
        }

        // 尝试作为 session ID 恢复
        if (maybeSessionId) {
          // 按 session ID 恢复
          const sessionId = maybeSessionId;
          try {
            const resumeStart = performance.now();
            // 使用匹配的日志或 session ID 加载会话
            const result = await loadConversationForResume(matchedLog ?? sessionId, undefined);
            if (!result) {
              logEvent('tengu_session_resumed', {
                entrypoint: 'cli_flag' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
                success: false
              });
              return await exitWithError(root, `No conversation found with session ID: ${sessionId}`);
            }
            const fullPath = matchedLog?.fullPath ?? result.fullPath;
            processedResume = await processResumedConversation(result, {
              forkSession: !!options.forkSession,
              sessionIdOverride: sessionId,
              transcriptPath: fullPath
            }, resumeContext);
            if (processedResume.restoredAgentDef) {
              mainThreadAgentDefinition = processedResume.restoredAgentDef;
            }
            logEvent('tengu_session_resumed', {
              entrypoint: 'cli_flag' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
              success: true,
              resume_duration_ms: Math.round(performance.now() - resumeStart)
            });
          } catch (error) {
            logEvent('tengu_session_resumed', {
              entrypoint: 'cli_flag' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
              success: false
            });
            logError(error);
            await exitWithError(root, `Failed to resume session ${sessionId}`);
          }
        }

        // 等待文件下载完成（REPL 渲染前）
        if (fileDownloadPromise) {
          try {
            const results = await fileDownloadPromise;
            const failedCount = count(results, r => !r.success);
            if (failedCount > 0) {
              process.stderr.write(chalk.yellow(`Warning: ${failedCount}/${results.length} file(s) failed to download.\n`));
            }
          } catch (error) {
            return await exitWithError(root, `Error downloading files: ${errorMessage(error)}`);
          }
        }

        // 渲染恢复的 REPL
        const resumeData = processedResume ?? (Array.isArray(messages) ? {
          messages,
          fileHistorySnapshots: undefined,
          agentName: undefined,
          agentColor: undefined as AgentColorName | undefined,
          restoredAgentDef: mainThreadAgentDefinition,
          initialState,
          contentReplacements: undefined
        } : undefined);
        if (resumeData) {
          maybeActivateProactive(options);
          maybeActivateBrief(options);
          await launchRepl(root, {
            getFpsMetrics,
            stats,
            initialState: resumeData.initialState
          }, {
            ...sessionConfig,
            mainThreadAgentDefinition: resumeData.restoredAgentDef ?? mainThreadAgentDefinition,
            initialMessages: resumeData.messages,
            initialFileHistorySnapshots: resumeData.fileHistorySnapshots,
            initialContentReplacements: resumeData.contentReplacements,
            initialAgentName: resumeData.agentName,
            initialAgentColor: resumeData.agentColor
          }, renderAndRun);
        } else {
          // 显示交互式会话选择器
          await launchResumeChooser(root, {
            getFpsMetrics,
            stats,
            initialState
          }, getWorktreePaths(getOriginalCwd()), {
            ...sessionConfig,
            initialSearchQuery: searchTerm,
            forkSession: options.forkSession,
            filterByPr
          });
        }
      } else {
        // 默认启动 REPL（传递未解析的 hooks promise）
        const pendingHookMessages = hooksPromise && hookMessages.length === 0 ? hooksPromise : undefined;
        profileCheckpoint('action_after_hooks');
        maybeActivateProactive(options);
        maybeActivateBrief(options);
        // 持久化当前模式
        if (feature('COORDINATOR_MODE')) {
          saveMode(coordinatorModeModule?.isCoordinatorMode() ? 'coordinator' : 'normal');
        }

        // 深度链接来源提示
        let deepLinkBanner: ReturnType<typeof createSystemMessage> | null = null;
        if (feature('LODESTONE')) {
          if (options.deepLinkOrigin) {
            logEvent('tengu_deep_link_opened', {
              has_prefill: Boolean(options.prefill),
              has_repo: Boolean(options.deepLinkRepo)
            });
            deepLinkBanner = createSystemMessage(buildDeepLinkBanner({
              cwd: getCwd(),
              prefillLength: options.prefill?.length,
              repo: options.deepLinkRepo,
              lastFetch: options.deepLinkLastFetch !== undefined ? new Date(options.deepLinkLastFetch) : undefined
            }), 'warning');
          } else if (options.prefill) {
            deepLinkBanner = createSystemMessage('Launched with a pre-filled prompt — review it before pressing Enter.', 'warning');
          }
        }
        const initialMessages = deepLinkBanner ? [deepLinkBanner, ...hookMessages] : hookMessages.length > 0 ? hookMessages : undefined;
        await launchRepl(root, {
          getFpsMetrics,
          stats,
          initialState
        }, {
          ...sessionConfig,
          initialMessages,
          pendingHookMessages
        }, renderAndRun);
      }
    }).version(`${MACRO.VERSION} (Microcode)`, '-v, --version', 'Output the version number');

  // Worktree 标志
  program.option('-w, --worktree [name]', 'Create a new git worktree for this session (optionally specify a name)');
  program.option('--tmux', 'Create a tmux session for the worktree (requires --worktree). Uses iTerm2 native panes when available; use --tmux=classic for traditional tmux.');
  if (canUserConfigureAdvisor()) {
    program.addOption(new Option('--advisor <model>', 'Enable the server-side advisor tool with the specified model (alias or full ID).').hideHelp());
  }
  if ("external" === 'ant') {
    program.addOption(new Option('--delegate-permissions', '[ANT-ONLY] Alias for --permission-mode auto.').implies({
      permissionMode: 'auto'
    }));
    program.addOption(new Option('--dangerously-skip-permissions-with-classifiers', '[ANT-ONLY] Deprecated alias for --permission-mode auto.').hideHelp().implies({
      permissionMode: 'auto'
    }));
    program.addOption(new Option('--afk', '[ANT-ONLY] Deprecated alias for --permission-mode auto.').hideHelp().implies({
      permissionMode: 'auto'
    }));
    program.addOption(new Option('--tasks [id]', '[ANT-ONLY] Tasks mode: watch for tasks and auto-process them. Optional id is used as both the task list ID and agent ID (defaults to "tasklist").').argParser(String).hideHelp());
    program.option('--agent-teams', '[ANT-ONLY] Force Microcode to use multi-agent mode for solving problems', () => true);
  }
  if (feature('TRANSCRIPT_CLASSIFIER')) {
    program.addOption(new Option('--enable-auto-mode', 'Opt in to auto mode').hideHelp());
  }
  if (feature('PROACTIVE') || feature('KAIROS')) {
    program.addOption(new Option('--proactive', 'Start in proactive autonomous mode'));
  }
  if (feature('UDS_INBOX')) {
    program.addOption(new Option('--messaging-socket-path <path>', 'Unix domain socket path for the UDS messaging server (defaults to a tmp path)'));
  }
  if (feature('KAIROS') || feature('KAIROS_BRIEF')) {
    program.addOption(new Option('--brief', 'Enable SendUserMessage tool for agent-to-user communication'));
  }
  if (feature('KAIROS')) {
    program.addOption(new Option('--assistant', 'Force assistant mode (Agent SDK daemon use)').hideHelp());
  }
  if (feature('KAIROS') || feature('KAIROS_CHANNELS')) {
    program.addOption(new Option('--channels <servers...>', 'MCP servers whose channel notifications (inbound push) should register this session. Space-separated server names.').hideHelp());
    program.addOption(new Option('--dangerously-load-development-channels <servers...>', 'Load channel servers not on the approved allowlist. For local channel development only. Shows a confirmation dialog at startup.').hideHelp());
  }

  // Teammate 身份选项（替代 MICROCODE_* 环境变量）
  program.addOption(new Option('--agent-id <id>', 'Teammate agent ID').hideHelp());
  program.addOption(new Option('--agent-name <name>', 'Teammate display name').hideHelp());
  program.addOption(new Option('--team-name <name>', 'Team name for swarm coordination').hideHelp());
  program.addOption(new Option('--agent-color <color>', 'Teammate UI color').hideHelp());
  program.addOption(new Option('--plan-mode-required', 'Require plan mode before implementation').hideHelp());
  program.addOption(new Option('--parent-session-id <id>', 'Parent session ID for analytics correlation').hideHelp());
  program.addOption(new Option('--teammate-mode <mode>', 'How to spawn teammates: "tmux", "in-process", or "auto"').choices(['auto', 'tmux', 'in-process']).hideHelp());
  program.addOption(new Option('--agent-type <type>', 'Custom agent type for this teammate').hideHelp());

  // SDK WebSocket 端点（隐藏选项，仅供 -p + stream-json 格式使用）
  program.addOption(new Option('--sdk-url <url>', 'Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)').hideHelp());

  // teleport/remote 标志（GA 前隐藏）
  program.addOption(new Option('--teleport [session]', 'Resume a teleport session, optionally specify session ID').hideHelp());
  program.addOption(new Option('--remote [description]', 'Create a remote session with the given description').hideHelp());
  if (feature('BRIDGE_MODE')) {
    program.addOption(new Option('--remote-control [name]', 'Start an interactive session with Remote Control enabled (optionally named)').argParser(value => value || true).hideHelp());
    program.addOption(new Option('--rc [name]', 'Alias for --remote-control').argParser(value => value || true).hideHelp());
  }
  if (feature('HARD_FAIL')) {
    program.addOption(new Option('--hard-fail', 'Crash on logError calls instead of silently logging').hideHelp());
  }
  profileCheckpoint('run_main_options_built');

  // -p/--print 模式：跳过子命令注册以加速启动
  // print 模式下不会分发子命令（mcp、auth、plugin 等），直接走默认 action
  // 子命令注册路径约 65ms（isBridgeEnabled 的 Zod 解析 + keychain 子进程）
  // cc:// URL 在 main() 入口已被改写为 `open`，此处 argv 检查安全
  const isPrintMode = process.argv.includes('-p') || process.argv.includes('--print');
  const isCcUrl = process.argv.some(a => a.startsWith('cc://') || a.startsWith('cc+unix://'));
  if (isPrintMode && !isCcUrl) {
    profileCheckpoint('run_before_parse');
    await program.parseAsync(process.argv);
    profileCheckpoint('run_after_parse');
    return program;
  }

  // microcode mcp

  const mcp = program.command('mcp').description('Configure and manage MCP servers').configureHelp(createSortedHelpConfig()).enablePositionalOptions();
  mcp.command('serve').description(`Start the Microcode MCP server`).option('-d, --debug', 'Enable debug mode', () => true).option('--verbose', 'Override verbose mode setting from config', () => true).action(async ({
    debug,
    verbose
  }: {
    debug?: boolean;
    verbose?: boolean;
  }) => {
    const {
      mcpServeHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpServeHandler({
      debug,
      verbose
    });
  });

  // 注册 mcp add 子命令（抽取为独立函数便于测试）
  registerMcpAddCommand(mcp);
  if (isXaaEnabled()) {
    registerMcpXaaIdpCommand(mcp);
  }
  mcp.command('remove <name>').description('Remove an MCP server').option('-s, --scope <scope>', 'Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in').action(async (name: string, options: {
    scope?: string;
  }) => {
    const {
      mcpRemoveHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpRemoveHandler(name, options);
  });
  mcp.command('list').description('List configured MCP servers. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.').action(async () => {
    const {
      mcpListHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpListHandler();
  });
  mcp.command('get <name>').description('Get details about an MCP server. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.').action(async (name: string) => {
    const {
      mcpGetHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpGetHandler(name);
  });
  mcp.command('add-json <name> <json>').description('Add an MCP server (stdio or SSE) with a JSON string').option('-s, --scope <scope>', 'Configuration scope (local, user, or project)', 'local').option('--client-secret', 'Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)').action(async (name: string, json: string, options: {
    scope?: string;
    clientSecret?: true;
  }) => {
    const {
      mcpAddJsonHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpAddJsonHandler(name, json, options);
  });
  mcp.command('add-from-microcode-desktop').description('Import MCP servers from Microcode Desktop (Mac and WSL only)').option('-s, --scope <scope>', 'Configuration scope (local, user, or project)', 'local').action(async (options: {
    scope?: string;
  }) => {
    const {
      mcpAddFromDesktopHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpAddFromDesktopHandler(options);
  });
  mcp.command('reset-project-choices').description('Reset all approved and rejected project-scoped (.mcp.json) servers within this project').action(async () => {
    const {
      mcpResetChoicesHandler
    } = await import('./cli/handlers/mcp.js');
    await mcpResetChoicesHandler();
  });

  // microcode server
  if (feature('DIRECT_CONNECT')) {
    program.command('server').description('Start a Microcode session server').option('--port <number>', 'HTTP port', '0').option('--host <string>', 'Bind address', '0.0.0.0').option('--auth-token <token>', 'Bearer token for auth').option('--unix <path>', 'Listen on a unix domain socket').option('--workspace <dir>', 'Default working directory for sessions that do not specify cwd').option('--idle-timeout <ms>', 'Idle timeout for detached sessions in ms (0 = never expire)', '600000').option('--max-sessions <n>', 'Maximum concurrent sessions (0 = unlimited)', '32').action(async (opts: {
      port: string;
      host: string;
      authToken?: string;
      unix?: string;
      workspace?: string;
      idleTimeout: string;
      maxSessions: string;
    }) => {
      const {
        randomBytes
      } = await import('crypto');
      const {
        startServer
      } = await import('./server/server.js');
      const {
        SessionManager
      } = await import('./server/sessionManager.js');
      const {
        DangerousBackend
      } = await import('./server/backends/dangerousBackend.js');
      const {
        printBanner
      } = await import('./server/serverBanner.js');
      const {
        createServerLogger
      } = await import('./server/serverLog.js');
      const {
        writeServerLock,
        removeServerLock,
        probeRunningServer
      } = await import('./server/lockfile.js');
      const existing = await probeRunningServer();
      if (existing) {
        process.stderr.write(`A microcode server is already running (pid ${existing.pid}) at ${existing.httpUrl}\n`);
        process.exit(1);
      }
      const authToken = opts.authToken ?? `sk-ant-cc-${randomBytes(16).toString('base64url')}`;
      const config = {
        port: parseInt(opts.port, 10),
        host: opts.host,
        authToken,
        unix: opts.unix,
        workspace: opts.workspace,
        idleTimeoutMs: parseInt(opts.idleTimeout, 10),
        maxSessions: parseInt(opts.maxSessions, 10)
      };
      const backend = new DangerousBackend();
      const sessionManager = new SessionManager(backend, {
        idleTimeoutMs: config.idleTimeoutMs,
        maxSessions: config.maxSessions
      });
      const logger = createServerLogger();
      const server = startServer(config, sessionManager, logger);
      const actualPort = server.port ?? config.port;
      printBanner(config, authToken, actualPort);
      await writeServerLock({
        pid: process.pid,
        port: actualPort,
        host: config.host,
        httpUrl: config.unix ? `unix:${config.unix}` : `http://${config.host}:${actualPort}`,
        startedAt: Date.now()
      });
      let shuttingDown = false;
      const shutdown = async () => {
        if (shuttingDown) return;
        shuttingDown = true;
        // 先停止接受新连接，再销毁会话
        server.stop(true);
        await sessionManager.destroyAll();
        await removeServerLock();
        process.exit(0);
      };
      process.once('SIGINT', () => void shutdown());
      process.once('SIGTERM', () => void shutdown());
    });
  }

  // `microcode ssh` 子命令：仅注册用于 --help 显示
  // 实际交互流程由 main() 入口的 argv 改写处理（类似 DIRECT_CONNECT/cc:// 模式）
  // 如果执行到这里说明缺少 host 参数或改写未触发，打印用法
  if (feature('SSH_REMOTE')) {
    program.command('ssh <host> [dir]').description('Run Microcode on a remote host over SSH. Deploys the binary and ' + 'tunnels API auth back through your local machine — no remote setup needed.').option('--permission-mode <mode>', 'Permission mode for the remote session').option('--dangerously-skip-permissions', 'Skip all permission prompts on the remote (dangerous)').option('--local', 'e2e test mode — spawn the child CLI locally (skip ssh/deploy). ' + 'Exercises the auth proxy and unix-socket plumbing without a remote host.').action(async () => {
      // main() 入口的 argv 改写应该已处理 `ssh <host>`，到达此处说明缺少 host
      process.stderr.write('Usage: microcode ssh <user@host | ssh-config-alias> [dir]\n\n' + "Runs Microcode on a remote Linux host. You don't need to install\n" + 'anything on the remote or run `microcode auth login` there — the binary is\n' + 'deployed over SSH and API auth tunnels back through your local machine.\n');
      process.exit(1);
    });
  }

  // microcode open 子命令：仅处理 -p（无头）模式
  // 交互模式（不带 -p）由 main() 入口的 argv 改写重定向到主命令的 TUI
  if (feature('DIRECT_CONNECT')) {
    program.command('open <cc-url>').description('Connect to a Microcode server (internal — use cc:// URLs)').option('-p, --print [prompt]', 'Print mode (headless)').option('--output-format <format>', 'Output format: text, json, stream-json', 'text').action(async (ccUrl: string, opts: {
      print?: string | boolean;
      outputFormat: string;
    }) => {
      const {
        parseConnectUrl
      } = await import('./server/parseConnectUrl.js');
      const {
        serverUrl,
        authToken
      } = parseConnectUrl(ccUrl);
      let connectConfig;
      try {
        const session = await createDirectConnectSession({
          serverUrl,
          authToken,
          cwd: getOriginalCwd(),
          dangerouslySkipPermissions: _pendingConnect?.dangerouslySkipPermissions
        });
        if (session.workDir) {
          setOriginalCwd(session.workDir);
          setCwdState(session.workDir);
        }
        setDirectConnectServerUrl(serverUrl);
        connectConfig = session.config;
      } catch (err) {
        // biome-ignore lint/suspicious/noConsole: intentional error output
        console.error(err instanceof DirectConnectError ? err.message : String(err));
        process.exit(1);
      }
      const {
        runConnectHeadless
      } = await import('./server/connectHeadless.js');
      const prompt = typeof opts.print === 'string' ? opts.print : '';
      const interactive = opts.print === true;
      await runConnectHeadless(connectConfig, prompt, opts.outputFormat, interactive);
    });
  }

  // microcode auth

  const auth = program.command('auth').description('Manage authentication').configureHelp(createSortedHelpConfig());
  auth.command('login').description('Sign in to your Anthropic account').option('--email <email>', 'Pre-populate email address on the login page').option('--sso', 'Force SSO login flow').option('--console', 'Use Anthropic Console (API usage billing) instead of Microcode subscription').option('--claudeai', 'Use Microcode subscription (default)').action(async ({
    email,
    sso,
    console: useConsole,
    claudeai
  }: {
    email?: string;
    sso?: boolean;
    console?: boolean;
    claudeai?: boolean;
  }) => {
    const {
      authLogin
    } = await import('./cli/handlers/auth.js');
    await authLogin({
      email,
      sso,
      console: useConsole,
      claudeai
    });
  });
  auth.command('status').description('Show authentication status').option('--json', 'Output as JSON (default)').option('--text', 'Output as human-readable text').action(async (opts: {
    json?: boolean;
    text?: boolean;
  }) => {
    const {
      authStatus
    } = await import('./cli/handlers/auth.js');
    await authStatus(opts);
  });
  auth.command('logout').description('Log out from your Anthropic account').action(async () => {
    const {
      authLogout
    } = await import('./cli/handlers/auth.js');
    await authLogout();
  });

  // plugin/marketplace 子命令的隐藏标志：用于 cowork_plugins 目录
  const coworkOption = () => new Option('--cowork', 'Use cowork_plugins directory').hideHelp();

  // plugin 子命令
  const pluginCmd = program.command('plugin').alias('plugins').description('Manage Microcode plugins').configureHelp(createSortedHelpConfig());
  pluginCmd.command('validate <path>').description('Validate a plugin or marketplace manifest').addOption(coworkOption()).action(async (manifestPath: string, options: {
    cowork?: boolean;
  }) => {
    const {
      pluginValidateHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginValidateHandler(manifestPath, options);
  });

  pluginCmd.command('list').description('List installed plugins').option('--json', 'Output as JSON').option('--available', 'Include available plugins from marketplaces (requires --json)').addOption(coworkOption()).action(async (options: {
    json?: boolean;
    available?: boolean;
    cowork?: boolean;
  }) => {
    const {
      pluginListHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginListHandler(options);
  });

  // marketplace 子命令
  const marketplaceCmd = pluginCmd.command('marketplace').description('Manage Microcode marketplaces').configureHelp(createSortedHelpConfig());
  marketplaceCmd.command('add <source>').description('Add a marketplace from a URL, path, or GitHub repo').addOption(coworkOption()).option('--sparse <paths...>', 'Limit checkout to specific directories via git sparse-checkout (for monorepos). Example: --sparse .microcode-plugin plugins').option('--scope <scope>', 'Where to declare the marketplace: user (default), project, or local').action(async (source: string, options: {
    cowork?: boolean;
    sparse?: string[];
    scope?: string;
  }) => {
    const {
      marketplaceAddHandler
    } = await import('./cli/handlers/plugins.js');
    await marketplaceAddHandler(source, options);
  });
  marketplaceCmd.command('list').description('List all configured marketplaces').option('--json', 'Output as JSON').addOption(coworkOption()).action(async (options: {
    json?: boolean;
    cowork?: boolean;
  }) => {
    const {
      marketplaceListHandler
    } = await import('./cli/handlers/plugins.js');
    await marketplaceListHandler(options);
  });
  marketplaceCmd.command('remove <name>').alias('rm').description('Remove a configured marketplace').addOption(coworkOption()).action(async (name: string, options: {
    cowork?: boolean;
  }) => {
    const {
      marketplaceRemoveHandler
    } = await import('./cli/handlers/plugins.js');
    await marketplaceRemoveHandler(name, options);
  });
  marketplaceCmd.command('update [name]').description('Update marketplace(s) from their source - updates all if no name specified').addOption(coworkOption()).action(async (name: string | undefined, options: {
    cowork?: boolean;
  }) => {
    const {
      marketplaceUpdateHandler
    } = await import('./cli/handlers/plugins.js');
    await marketplaceUpdateHandler(name, options);
  });

  pluginCmd.command('install <plugin>').alias('i').description('Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)').option('-s, --scope <scope>', 'Installation scope: user, project, or local', 'user').addOption(coworkOption()).action(async (plugin: string, options: {
    scope?: string;
    cowork?: boolean;
  }) => {
    const {
      pluginInstallHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginInstallHandler(plugin, options);
  });

  pluginCmd.command('uninstall <plugin>').alias('remove').alias('rm').description('Uninstall an installed plugin').option('-s, --scope <scope>', 'Uninstall from scope: user, project, or local', 'user').option('--keep-data', "Preserve the plugin's persistent data directory (~/.microcode/plugins/data/{id}/)").addOption(coworkOption()).action(async (plugin: string, options: {
    scope?: string;
    cowork?: boolean;
    keepData?: boolean;
  }) => {
    const {
      pluginUninstallHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginUninstallHandler(plugin, options);
  });

  pluginCmd.command('enable <plugin>').description('Enable a disabled plugin').option('-s, --scope <scope>', `Installation scope: ${VALID_INSTALLABLE_SCOPES.join(', ')} (default: auto-detect)`).addOption(coworkOption()).action(async (plugin: string, options: {
    scope?: string;
    cowork?: boolean;
  }) => {
    const {
      pluginEnableHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginEnableHandler(plugin, options);
  });

  pluginCmd.command('disable [plugin]').description('Disable an enabled plugin').option('-a, --all', 'Disable all enabled plugins').option('-s, --scope <scope>', `Installation scope: ${VALID_INSTALLABLE_SCOPES.join(', ')} (default: auto-detect)`).addOption(coworkOption()).action(async (plugin: string | undefined, options: {
    scope?: string;
    cowork?: boolean;
    all?: boolean;
  }) => {
    const {
      pluginDisableHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginDisableHandler(plugin, options);
  });

  pluginCmd.command('update <plugin>').description('Update a plugin to the latest version (restart required to apply)').option('-s, --scope <scope>', `Installation scope: ${VALID_UPDATE_SCOPES.join(', ')} (default: user)`).addOption(coworkOption()).action(async (plugin: string, options: {
    scope?: string;
    cowork?: boolean;
  }) => {
    const {
      pluginUpdateHandler
    } = await import('./cli/handlers/plugins.js');
    await pluginUpdateHandler(plugin, options);
  });
  program.command('setup-token').description('Set up a long-lived authentication token (requires Microcode subscription)').action(async () => {
    const [{
      setupTokenHandler
    }, {
      createRoot
    }] = await Promise.all([import('./cli/handlers/util.js'), import('./ink.js')]);
    const root = await createRoot(getBaseRenderOptions(false));
    await setupTokenHandler(root);
  });

  // agents 子命令
  program.command('agents').description('List configured agents').option('--setting-sources <sources>', 'Comma-separated list of setting sources to load (user, project, local).').action(async () => {
    const {
      agentsHandler
    } = await import('./cli/handlers/agents.js');
    await agentsHandler();
    process.exit(0);
  });
  if (feature('TRANSCRIPT_CLASSIFIER')) {
    // 跳过 disabled 状态（断路器）；从磁盘缓存读取，注册时 GrowthBook 尚未初始化
    if (getAutoModeEnabledStateIfCached() !== 'disabled') {
      const autoModeCmd = program.command('auto-mode').description('Inspect auto mode classifier configuration');
      autoModeCmd.command('defaults').description('Print the default auto mode environment, allow, and deny rules as JSON').action(async () => {
        const {
          autoModeDefaultsHandler
        } = await import('./cli/handlers/autoMode.js');
        autoModeDefaultsHandler();
        process.exit(0);
      });
      autoModeCmd.command('config').description('Print the effective auto mode config as JSON: your settings where set, defaults otherwise').action(async () => {
        const {
          autoModeConfigHandler
        } = await import('./cli/handlers/autoMode.js');
        autoModeConfigHandler();
        process.exit(0);
      });
      autoModeCmd.command('critique').description('Get AI feedback on your custom auto mode rules').option('--model <model>', 'Override which model is used').action(async options => {
        const {
          autoModeCritiqueHandler
        } = await import('./cli/handlers/autoMode.js');
        await autoModeCritiqueHandler(options);
        process.exit();
      });
    }
  }

  // remote-control 子命令：连接本地环境到 claude.ai/code
  // 实际命令在 cli.tsx 快速路径中拦截，此处仅注册用于 help 显示
  // 始终隐藏：isBridgeEnabled() 在注册阶段有 ~65ms 的副作用开销
  if (feature('BRIDGE_MODE')) {
    program.command('remote-control', {
      hidden: true
    }).alias('rc').description('Connect your local environment for remote-control sessions via claude.ai/code').action(async () => {
      // 不可达：cli.tsx 快速路径在 main.tsx 加载前已处理
      const {
        bridgeMain
      } = await import('./bridge/bridgeMain.js');
      await bridgeMain(process.argv.slice(3));
    });
  }
  if (feature('KAIROS')) {
    program.command('assistant [sessionId]').description('Attach the REPL as a client to a running bridge session. Discovers sessions via API if no sessionId given.').action(() => {
      // 上方的 argv 改写应已处理 `assistant [id]`，到达此处说明根标志在前
      process.stderr.write('Usage: microcode assistant [sessionId]\n\n' + 'Attach the REPL as a viewer client to a running bridge session.\n' + 'Omit sessionId to discover and pick from available sessions.\n');
      process.exit(1);
    });
  }

  // doctor 子命令
  program.command('doctor').description('Check the health of your Microcode auto-updater. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.').action(async () => {
    const [{
      doctorHandler
    }, {
      createRoot
    }] = await Promise.all([import('./cli/handlers/util.js'), import('./ink.js')]);
    const root = await createRoot(getBaseRenderOptions(false));
    await doctorHandler(root);
  });

  // update 子命令：SemVer 版本比较（含 SHA 构建元数据）
  program.command('update').alias('upgrade').description('Check for updates and install if available').action(async () => {
    const {
      update
    } = await import('src/cli/update.js');
    await update();
  });

  // up 子命令：运行 MICROCODE.md 中 "# claude up" 部分的初始化指令
  if ("external" === 'ant') {
    program.command('up').description('[ANT-ONLY] Initialize or upgrade the local dev environment using the "# claude up" section of the nearest MICROCODE.md').action(async () => {
      const {
        up
      } = await import('src/cli/up.js');
      await up();
    });
  }

  // rollback 子命令（ant-only）：回滚到之前的版本
  if ("external" === 'ant') {
    program.command('rollback [target]').description('[ANT-ONLY] Roll back to a previous release\n\nExamples:\n  microcode rollback                                    Go 1 version back from current\n  microcode rollback 3                                  Go 3 versions back from current\n  microcode rollback 2.0.73-dev.20251217.t190658        Roll back to a specific version').option('-l, --list', 'List recent published versions with ages').option('--dry-run', 'Show what would be installed without installing').option('--safe', 'Roll back to the server-pinned safe version (set by oncall during incidents)').action(async (target?: string, options?: {
      list?: boolean;
      dryRun?: boolean;
      safe?: boolean;
    }) => {
      const {
        rollback
      } = await import('src/cli/rollback.js');
      await rollback(target, options);
    });
  }

  // microcode install
  program.command('install [target]').description('Install Microcode native build. Use [target] to specify version (stable, latest, or specific version)').option('--force', 'Force installation even if already installed').action(async (target: string | undefined, options: {
    force?: boolean;
  }) => {
    const {
      installHandler
    } = await import('./cli/handlers/util.js');
    await installHandler(target, options);
  });

  // ant-only commands
  if ("external" === 'ant') {
    const validateLogId = (value: string) => {
      const maybeSessionId = validateUuid(value);
      if (maybeSessionId) return maybeSessionId;
      return Number(value);
    };
    // microcode log
    program.command('log').description('[ANT-ONLY] Manage conversation logs.').argument('[number|sessionId]', 'A number (0, 1, 2, etc.) to display a specific log, or the sesssion ID (uuid) of a log', validateLogId).action(async (logId: string | number | undefined) => {
      const {
        logHandler
      } = await import('./cli/handlers/ant.js');
      await logHandler(logId);
    });

    // microcode error
    program.command('error').description('[ANT-ONLY] View error logs. Optionally provide a number (0, -1, -2, etc.) to display a specific log.').argument('[number]', 'A number (0, 1, 2, etc.) to display a specific log', parseInt).action(async (number: number | undefined) => {
      const {
        errorHandler
      } = await import('./cli/handlers/ant.js');
      await errorHandler(number);
    });

    // microcode export
    program.command('export').description('[ANT-ONLY] Export a conversation to a text file.').usage('<source> <outputFile>').argument('<source>', 'Session ID, log index (0, 1, 2...), or path to a .json/.jsonl log file').argument('<outputFile>', 'Output file path for the exported text').addHelpText('after', `
Examples:
  $ microcode export 0 conversation.txt                Export conversation at log index 0
  $ microcode export <uuid> conversation.txt           Export conversation by session ID
  $ microcode export input.json output.txt             Render JSON log file to text
  $ microcode export <uuid>.jsonl output.txt           Render JSONL session file to text`).action(async (source: string, outputFile: string) => {
      const {
        exportHandler
      } = await import('./cli/handlers/ant.js');
      await exportHandler(source, outputFile);
    });
    if ("external" === 'ant') {
      const taskCmd = program.command('task').description('[ANT-ONLY] Manage task list tasks');
      taskCmd.command('create <subject>').description('Create a new task').option('-d, --description <text>', 'Task description').option('-l, --list <id>', 'Task list ID (defaults to "tasklist")').action(async (subject: string, opts: {
        description?: string;
        list?: string;
      }) => {
        const {
          taskCreateHandler
        } = await import('./cli/handlers/ant.js');
        await taskCreateHandler(subject, opts);
      });
      taskCmd.command('list').description('List all tasks').option('-l, --list <id>', 'Task list ID (defaults to "tasklist")').option('--pending', 'Show only pending tasks').option('--json', 'Output as JSON').action(async (opts: {
        list?: string;
        pending?: boolean;
        json?: boolean;
      }) => {
        const {
          taskListHandler
        } = await import('./cli/handlers/ant.js');
        await taskListHandler(opts);
      });
      taskCmd.command('get <id>').description('Get details of a task').option('-l, --list <id>', 'Task list ID (defaults to "tasklist")').action(async (id: string, opts: {
        list?: string;
      }) => {
        const {
          taskGetHandler
        } = await import('./cli/handlers/ant.js');
        await taskGetHandler(id, opts);
      });
      taskCmd.command('update <id>').description('Update a task').option('-l, --list <id>', 'Task list ID (defaults to "tasklist")').option('-s, --status <status>', `Set status (${TASK_STATUSES.join(', ')})`).option('--subject <text>', 'Update subject').option('-d, --description <text>', 'Update description').option('--owner <agentId>', 'Set owner').option('--clear-owner', 'Clear owner').action(async (id: string, opts: {
        list?: string;
        status?: string;
        subject?: string;
        description?: string;
        owner?: string;
        clearOwner?: boolean;
      }) => {
        const {
          taskUpdateHandler
        } = await import('./cli/handlers/ant.js');
        await taskUpdateHandler(id, opts);
      });
      taskCmd.command('dir').description('Show the tasks directory path').option('-l, --list <id>', 'Task list ID (defaults to "tasklist")').action(async (opts: {
        list?: string;
      }) => {
        const {
          taskDirHandler
        } = await import('./cli/handlers/ant.js');
        await taskDirHandler(opts);
      });
    }

    // microcode completion <shell>
    program.command('completion <shell>', {
      hidden: true
    }).description('Generate shell completion script (bash, zsh, or fish)').option('--output <file>', 'Write completion script directly to a file instead of stdout').action(async (shell: string, opts: {
      output?: string;
    }) => {
      const {
        completionHandler
      } = await import('./cli/handlers/ant.js');
      await completionHandler(shell, opts, program);
    });
  }
  profileCheckpoint('run_before_parse');
  await program.parseAsync(process.argv);
  profileCheckpoint('run_after_parse');

  // 记录最终检查点用于 total_time 计算
  profileCheckpoint('main_after_run');

  // 启动性能报告（采样上报 Statsig + 详细报告）
  profileReport();
  return program;
}

async function logTenguInit({
  hasInitialPrompt,
  hasStdin,
  verbose,
  debug,
  debugToStderr,
  print,
  outputFormat,
  inputFormat,
  numAllowedTools,
  numDisallowedTools,
  mcpClientCount,
  worktreeEnabled,
  skipWebFetchPreflight,
  githubActionInputs,
  dangerouslySkipPermissionsPassed,
  permissionMode,
  modeIsBypass,
  allowDangerouslySkipPermissionsPassed,
  systemPromptFlag,
  appendSystemPromptFlag,
  thinkingConfig,
  assistantActivationPath
}: {
  hasInitialPrompt: boolean;
  hasStdin: boolean;
  verbose: boolean;
  debug: boolean;
  debugToStderr: boolean;
  print: boolean;
  outputFormat: string;
  inputFormat: string;
  numAllowedTools: number;
  numDisallowedTools: number;
  mcpClientCount: number;
  worktreeEnabled: boolean;
  skipWebFetchPreflight: boolean | undefined;
  githubActionInputs: string | undefined;
  dangerouslySkipPermissionsPassed: boolean;
  permissionMode: string;
  modeIsBypass: boolean;
  allowDangerouslySkipPermissionsPassed: boolean;
  systemPromptFlag: 'file' | 'flag' | undefined;
  appendSystemPromptFlag: 'file' | 'flag' | undefined;
  thinkingConfig: ThinkingConfig;
  assistantActivationPath: string | undefined;
}): Promise<void> {
  try {
    logEvent('tengu_init', {
      entrypoint: 'microcode' as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      hasInitialPrompt,
      hasStdin,
      verbose,
      debug,
      debugToStderr,
      print,
      outputFormat: outputFormat as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      inputFormat: inputFormat as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      numAllowedTools,
      numDisallowedTools,
      mcpClientCount,
      worktree: worktreeEnabled,
      skipWebFetchPreflight,
      ...(githubActionInputs && {
        githubActionInputs: githubActionInputs as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      }),
      dangerouslySkipPermissionsPassed,
      permissionMode: permissionMode as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      modeIsBypass,
      inProtectedNamespace: isInProtectedNamespace(),
      allowDangerouslySkipPermissionsPassed,
      thinkingType: thinkingConfig.type as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      ...(systemPromptFlag && {
        systemPromptFlag: systemPromptFlag as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      }),
      ...(appendSystemPromptFlag && {
        appendSystemPromptFlag: appendSystemPromptFlag as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      }),
      is_simple: isBareMode() || undefined,
      is_coordinator: feature('COORDINATOR_MODE') && coordinatorModeModule?.isCoordinatorMode() ? true : undefined,
      ...(assistantActivationPath && {
        assistantActivationPath: assistantActivationPath as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
      }),
      autoUpdatesChannel: (getInitialSettings().autoUpdatesChannel ?? 'latest') as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      ...("external" === 'ant' ? (() => {
        const cwd = getCwd();
        const gitRoot = findGitRoot(cwd);
        const rp = gitRoot ? relative(gitRoot, cwd) || '.' : undefined;
        return rp ? {
          relativeProjectPath: rp as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
        } : {};
      })() : {})
    });
  } catch (error) {
    logError(error);
  }
}
function maybeActivateProactive(options: unknown): void {
  if ((feature('PROACTIVE') || feature('KAIROS')) && ((options as {
    proactive?: boolean;
  }).proactive || isEnvTruthy(process.env.MICROCODE_PROACTIVE))) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const proactiveModule = require('./proactive/index.js');
    if (!proactiveModule.isProactiveActive()) {
      proactiveModule.activateProactive('command');
    }
  }
}
function maybeActivateBrief(options: unknown): void {
  if (!(feature('KAIROS') || feature('KAIROS_BRIEF'))) return;
  const briefFlag = (options as {
    brief?: boolean;
  }).brief;
  const briefEnv = isEnvTruthy(process.env.MICROCODE_BRIEF);
  if (!briefFlag && !briefEnv) return;
  // --brief / MICROCODE_BRIEF 显式启用：检查授权，设置 userMsgOptIn 激活工具
  // 环境变量 MICROCODE_BRIEF=1 可绕过 GrowthBook 门控直接启用（开发/测试用）
  // 使用 require 动态导入：静态导入会在外部构建中泄露工具名称字符串
  /* eslint-disable @typescript-eslint/no-require-imports */
  const {
    isBriefEntitled
  } = require('./tools/BriefTool/BriefTool.js') as typeof import('./tools/BriefTool/BriefTool.js');
  /* eslint-enable @typescript-eslint/no-require-imports */
  const entitled = isBriefEntitled();
  if (entitled) {
    setUserMsgOptIn(true);
  }
  // 无论是否授权都记录事件：enabled=false 捕获"用户尝试但被门控"的情况
  logEvent('tengu_brief_mode_enabled', {
    enabled: entitled,
    gated: !entitled,
    source: (briefEnv ? 'env' : 'flag') as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
  });
}
function resetCursor() {
  const terminal = process.stderr.isTTY ? process.stderr : process.stdout.isTTY ? process.stdout : undefined;
  terminal?.write(SHOW_CURSOR);
}
type TeammateOptions = {
  agentId?: string;
  agentName?: string;
  teamName?: string;
  agentColor?: string;
  planModeRequired?: boolean;
  parentSessionId?: string;
  teammateMode?: 'auto' | 'tmux' | 'in-process';
  agentType?: string;
};
function extractTeammateOptions(options: unknown): TeammateOptions {
  if (typeof options !== 'object' || options === null) {
    return {};
  }
  const opts = options as Record<string, unknown>;
  const teammateMode = opts.teammateMode;
  return {
    agentId: typeof opts.agentId === 'string' ? opts.agentId : undefined,
    agentName: typeof opts.agentName === 'string' ? opts.agentName : undefined,
    teamName: typeof opts.teamName === 'string' ? opts.teamName : undefined,
    agentColor: typeof opts.agentColor === 'string' ? opts.agentColor : undefined,
    planModeRequired: typeof opts.planModeRequired === 'boolean' ? opts.planModeRequired : undefined,
    parentSessionId: typeof opts.parentSessionId === 'string' ? opts.parentSessionId : undefined,
    teammateMode: teammateMode === 'auto' || teammateMode === 'tmux' || teammateMode === 'in-process' ? teammateMode : undefined,
    agentType: typeof opts.agentType === 'string' ? opts.agentType : undefined
  };
}