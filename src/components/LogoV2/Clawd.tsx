import * as React from 'react'
import { Box, Text } from '../../ink.js'
import { env } from '../../utils/env.js'

// Large cat design. 24 columns wide, 10 rows tall.
// All segments use clawd_body color for a clean, unified look.
const CAT = [
  '         ██       ██',
  '       ████       ████',
  '     ████████████████████',
  '  ███                    ███',
  '████     ██       ██      ████  ',
  ' ███                      ███  ',
  '  ██          █           ██   ',
  '   ██         █           ██ ',
  '    ██       █ █        ██',
  '      ███            ███',
  '        █████████████',
] as const

// Apple Terminal uses bg-fill since it doesn't render vertical space between
// background colors. The middle rows are filled with clawd_body background.
const APPLE_CAT = [
  '       ██       ██',
  '     ████       ████',
  '   ███████████████████',
  ' ███                  ███',
  '███     ██       ██    ████',
  '███                    ███',
  ' ██          █         ██',
  '  ██         █         ██',
  '   ██               ██',
  '     ███          ███',
  '       ████████████',
] as const

export function Clawd() {
  if (env.terminal === 'Apple_Terminal') {
    return <AppleTerminalClawd />
  }
  const [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11] = CAT
  return (
    <Box flexDirection="column">
      <Text color="clawd_body">{row1}</Text>
      <Text color="clawd_body">{row2}</Text>
      <Text color="clawd_body">{row3}</Text>
      <Text color="clawd_body">{row4}</Text>
      <Text color="clawd_body">{row5}</Text>
      <Text color="clawd_body">{row6}</Text>
      <Text color="clawd_body">{row7}</Text>
      <Text color="clawd_body">{row8}</Text>
      <Text color="clawd_body">{row9}</Text>
      <Text color="clawd_body">{row10}</Text>
      <Text color="clawd_body">{row11}</Text>
    </Box>
  )
}

function AppleTerminalClawd() {
  const [row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11] = APPLE_CAT
  return (
    <Box flexDirection="column" alignItems="center">
      <Text color="clawd_body">{row1}</Text>
      <Text backgroundColor="clawd_body">{row2}</Text>
      <Text backgroundColor="clawd_body">{row3}</Text>
      <Text backgroundColor="clawd_body">{row4}</Text>
      <Text backgroundColor="clawd_body">{row5}</Text>
      <Text backgroundColor="clawd_body">{row6}</Text>
      <Text backgroundColor="clawd_body">{row7}</Text>
      <Text color="clawd_body">{row8}</Text>
      <Text color="clawd_body">{row9}</Text>
      <Text color="clawd_body">{row10}</Text>
      <Text color="clawd_body">{row11}</Text>
    </Box>
  )
}


/* 
         ██       ██
       ████       ████
     ████████████████████
  ███                    ███
████     ██       ██      ████  
 ███                      ███  
  ██          █           ██   
   ██         █           ██ 
    ██                  ██
      ███            ███
        █████████████

   */  