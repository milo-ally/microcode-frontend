import * as React from 'react'
import { Box, Text } from '../../ink.js'
import { env } from '../../utils/env.js'

export type ClawdPose = 'default' | 'arms-up' | 'look-left' | 'look-right'

type Props = {
  pose?: ClawdPose
}

// Diamond/geometric design. Each pose is 9 columns wide, 3 rows tall.
// All segments use clawd_body color for a clean, unified look.
const POSES: Record<ClawdPose, [string, string, string]> = {
  default: ['  ▄▀▀▀▄  ', ' ▐█████▌ ', '  ▀▄▄▄▀  '],
  'look-left': ['  ▟▀▀▀▄  ', ' ▐█████▌ ', '  ▀▄▄▄▙  '],
  'look-right': ['  ▄▀▀▀▙  ', ' ▐█████▌ ', '  ▟▄▄▄▀  '],
  'arms-up': ['▗▟▀▀▀▀▀▙▖', '  ▐███▌  ', '  ▀▄▄▄▀  '],
}

// Apple Terminal uses bg-fill since it doesn't render vertical space between
// background colors. The middle row is filled with clawd_body background.
const APPLE_POSES: Record<ClawdPose, [string, string, string]> = {
  default: [' ▄▀▀▀▄ ', '       ', ' ▀▄▄▄▀ '],
  'look-left': [' ▟▀▀▀▄ ', '       ', ' ▀▄▄▄▙ '],
  'look-right': [' ▄▀▀▀▙ ', '       ', ' ▟▄▄▄▀ '],
  'arms-up': ['▗▟▀▀▀▙▖', '  ▐█▌  ', ' ▀▄▄▄▀ '],
}

export function Clawd({ pose = 'default' }: Props = {}) {
  if (env.terminal === 'Apple_Terminal') {
    return <AppleTerminalClawd pose={pose} />
  }
  const [row1, row2, row3] = POSES[pose]
  return (
    <Box flexDirection="column">
      <Text color="clawd_body">{row1}</Text>
      <Text color="clawd_body">{row2}</Text>
      <Text color="clawd_body">{row3}</Text>
    </Box>
  )
}

function AppleTerminalClawd({ pose }: { pose: ClawdPose }) {
  const [top, middle, bottom] = APPLE_POSES[pose]
  return (
    <Box flexDirection="column" alignItems="center">
      <Text color="clawd_body">{top}</Text>
      <Text backgroundColor="clawd_body">{middle}</Text>
      <Text color="clawd_body">{bottom}</Text>
    </Box>
  )
}
