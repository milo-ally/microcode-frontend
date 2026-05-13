function readAssistantModeFlag(): boolean {
  return (
    process.env.MICROCODE_ASSISTANT_MODE === '1' ||
    process.env.MICROCODE_ASSISTANT_MODE === 'true'
  )
}

export function isAssistantMode(): boolean {
  return readAssistantModeFlag()
}

export function isAssistantModeEnabled(): boolean {
  return readAssistantModeFlag()
}
