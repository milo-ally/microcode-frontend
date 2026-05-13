# Microcode

An AI-powered coding assistant CLI, inspired by [Claude Code](https://github.com/anthropics/claude-code).

Microcode is a terminal-based AI coding agent that can understand your codebase, edit files, run commands, and help you build software interactively.

## Features

- Interactive CLI interface with streaming responses
- Multi-file code reading, editing, and generation
- Shell command execution with sandboxed environment
- Support for multiple LLM providers (GitHub Models, GitHub Copilot, etc.)
- Extensible tool system (MCP protocol support)
- Session-based conversation with context management

## Requirements

- Bun 1.3.5 or later
- Node.js 24 or later

## Getting Started

Install dependencies:

```bash
bun install
```

Run the CLI in development mode:

```bash
bun run dev
```

Show version:

```bash
bun run version
```

## Provider Configuration

Microcode supports multiple LLM providers. Configure via the `--settings` flag or the interactive `/provider` command.

Available providers:

| Provider | Description |
|---|---|
| `github-models` | OpenAI-compatible GitHub Models API |
| `github-copilot` | GitHub Copilot account-based API (Claude models) |

Authentication lookup order:

1. Provider-specific environment variables
2. `GH_TOKEN`
3. `GITHUB_TOKEN`
4. `gh auth token`

To use GitHub account login instead of a manual token:

```bash
gh auth login
```

### Examples

Run with GitHub Models:

```bash
bun run dev --settings '{"provider":"github-models"}'
```

Run with GitHub Copilot + Claude:

```bash
bun run dev --settings '{"provider":"github-copilot"}' --model "claude-sonnet-4.6"
```

### Interactive Commands

- `/provider` - Open provider selector
- `/provider info` - Show current provider and auth status
- `/provider <name>` - Switch to a specific provider
- `/model` - Switch model (shows models for current provider)

## License

MIT
