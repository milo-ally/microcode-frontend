import { c as _c } from "react/compiler-runtime";
import React from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';
import { Clawd } from './Clawd.js';

const WELCOME_V2_WIDTH = 58;
declare const MACRO: { VERSION: string };

export function WelcomeV2() {
  const $ = _c(35);
  const [theme] = useTheme();

  if (env.terminal === "Apple_Terminal") {
    let t0;
    if ($[0] !== theme) {
      t0 = <AppleTerminalWelcomeV2 theme={theme} welcomeMessage="Welcome to Microcode" />;
      $[0] = theme;
      $[1] = t0;
    } else {
      t0 = $[1];
    }
    return t0;
  }

  if (["light", "light-daltonized", "light-ansi"].includes(theme)) {
    let t0, t1, t2, t3, t4, t5, t6, t7, t8;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
      t0 = <Text><Text color="microcode">Welcome to Microcode </Text><Text dimColor>v{MACRO.VERSION} </Text></Text>;
      t1 = <Text>{"…".repeat(58)}</Text>;
      t2 = <Text>{"                                                          "}</Text>;
      t3 = <Text>{"     *                                       ░░░            "}</Text>;
      t4 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
      t5 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
      t6 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
      t7 = <Text>{"   ░░░░░░░░░░░░░░░░░░░                                    "}</Text>;
      t8 = <Text>{"                                                          "}</Text>;
      $[2] = t0; $[3] = t1; $[4] = t2; $[5] = t3; $[6] = t4; $[7] = t5; $[8] = t6; $[9] = t7; $[10] = t8;
    } else {
      t0 = $[2]; t1 = $[3]; t2 = $[4]; t3 = $[5]; t4 = $[6]; t5 = $[7]; t6 = $[8]; t7 = $[9]; t8 = $[10];
    }

    let t9, t10, t11;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
      t9 = <Text dimColor> *                                 ░░░░                   </Text>;
      t10 = <Text dimColor>                                 ░░░░░░                 </Text>;
      t11 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
      $[11] = t9; $[12] = t10; $[13] = t11;
    } else {
      t9 = $[11]; t10 = $[12]; t11 = $[13];
    }

    let t12;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = <Clawd />;
      $[14] = t12;
    } else {
      t12 = $[14];
    }

    let t13;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
      t13 = <Box flexDirection="column">{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}</Box>;
      $[15] = t13;
    } else {
      t13 = $[15];
    }
    return t13;
  }

  // Dark theme
  let t0, t1, t2, t3, t4, t5, t6;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Text><Text color="microcode">Welcome to Microcode </Text><Text dimColor>v{MACRO.VERSION} </Text></Text>;
    t1 = <Text>{"…".repeat(58)}</Text>;
    t2 = <Text>{"                                                          "}</Text>;
    t3 = <Text>{"     *                                       ░░░            "}</Text>;
    t4 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
    t5 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
    t6 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
    $[18] = t0; $[19] = t1; $[20] = t2; $[21] = t3; $[22] = t4; $[23] = t5; $[24] = t6;
  } else {
    t0 = $[18]; t1 = $[19]; t2 = $[20]; t3 = $[21]; t4 = $[22]; t5 = $[23]; t6 = $[24];
  }

  let t7, t8, t9;
  if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = <Text dimColor> *                                 ░░░░                   </Text>;
    t8 = <Text dimColor>                                 ░░░░░░                 </Text>;
    t9 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
    $[25] = t7; $[26] = t8; $[27] = t9;
  } else {
    t7 = $[25]; t8 = $[26]; t9 = $[27];
  }

  let t10;
  if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = <Clawd />;
    $[28] = t10;
  } else {
    t10 = $[28];
  }

  let t11;
  if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = <Box flexDirection="column">{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}</Box>;
    $[29] = t11;
  } else {
    t11 = $[29];
  }
  return t11;
}
type AppleTerminalWelcomeV2Props = {
  theme: string;
  welcomeMessage: string;
};

function AppleTerminalWelcomeV2(t0) {
  const $ = _c(44);
  const { theme, welcomeMessage } = t0;
  const isLightTheme = ["light", "light-daltonized", "light-ansi"].includes(theme);

  let t1, t2, t3;
  if ($[0] !== welcomeMessage) {
    t1 = <Text color="microcode">{welcomeMessage} </Text>;
    t2 = <Text dimColor>v{MACRO.VERSION} </Text>;
    t3 = <Text>{t1}{t2}</Text>;
    $[0] = welcomeMessage; $[1] = t1; $[2] = t2; $[3] = t3; $[4] = t3;
  } else {
    t1 = $[1]; t2 = $[2]; t3 = $[4];
  }

  if (isLightTheme) {
    let t4, t5, t6, t7, t8, t9, t10, t11;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
      t4 = <Text>{"…".repeat(58)}</Text>;
      t5 = <Text>{"                                                          "}</Text>;
      t6 = <Text>{"     *                                       ░░░            "}</Text>;
      t7 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
      t8 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
      t9 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
      t10 = <Text>{"   ░░░░░░░░░░░░░░░░░░░                                    "}</Text>;
      t11 = <Text>{"                                                          "}</Text>;
      $[5] = t10; $[6] = t11; $[7] = t4; $[8] = t5; $[9] = t6; $[10] = t7; $[11] = t8; $[12] = t9;
    } else {
      t10 = $[5]; t11 = $[6]; t4 = $[7]; t5 = $[8]; t6 = $[9]; t7 = $[10]; t8 = $[11]; t9 = $[12];
    }

    let t12, t13, t14;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = <Text dimColor> *                                 ░░░░                   </Text>;
      t13 = <Text dimColor>                                 ░░░░░░                 </Text>;
      t14 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
      $[13] = t12; $[14] = t13; $[15] = t14;
    } else {
      t12 = $[13]; t13 = $[14]; t14 = $[15];
    }

    let t15 = <Clawd />;

    let t16;
    if ($[16] !== t3) {
      t16 = <Box flexDirection="column">{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}</Box>;
      $[16] = t3; $[17] = t16;
    } else {
      t16 = $[17];
    }
    return t16;
  }

  // Apple dark theme
  let t4, t5, t6, t7, t8, t9;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = <Text>{"…".repeat(58)}</Text>;
    t5 = <Text>{"                                                          "}</Text>;
    t6 = <Text>{"     *                                       ░░░            "}</Text>;
    t7 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
    t8 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
    t9 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
    $[18] = t4; $[19] = t5; $[20] = t6; $[21] = t7; $[22] = t8; $[23] = t9;
  } else {
    t4 = $[18]; t5 = $[19]; t6 = $[20]; t7 = $[21]; t8 = $[22]; t9 = $[23];
  }

  let t10, t11, t12;
  if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = <Text dimColor> *                                 ░░░░                   </Text>;
    t11 = <Text dimColor>                                 ░░░░░░                 </Text>;
    t12 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
    $[24] = t10; $[25] = t11; $[26] = t12;
  } else {
    t10 = $[24]; t11 = $[25]; t12 = $[26];
  }

  let t13 = <Clawd />;

  let t14;
  if ($[27] !== t3) {
    t14 = <Box flexDirection="column">{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}</Box>;
    $[27] = t3; $[28] = t14;
  } else {
    t14 = $[28];
  }
  return t14;
}