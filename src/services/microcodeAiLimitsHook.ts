import { useEffect, useState } from 'react'
import {
  type MicrocodeAILimits,
  currentLimits,
  statusListeners,
} from './microcodeAiLimits.js'

export function useClaudeAiLimits(): MicrocodeAILimits {
  const [limits, setLimits] = useState<MicrocodeAILimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: MicrocodeAILimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}
