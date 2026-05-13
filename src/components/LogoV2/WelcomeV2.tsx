import { c as _c } from "react/compiler-runtime";
import React from 'react';
import { Box, Text, useTheme } from 'src/ink.js';
import { env } from '../../utils/env.js';

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
      t3 = <Text>{"                                           ░░░            "}</Text>;
      t4 = <Text>{"                                         ░▒▓█▓▒░          "}</Text>;
      t5 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
      t6 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
      t7 = <Text>{"   ░░░░░░░░░░░░░░░░░░░                                    "}</Text>;
      t8 = <Text>{"                                                          "}</Text>;
      $[2] = t0; $[3] = t1; $[4] = t2; $[5] = t3; $[6] = t4; $[7] = t5; $[8] = t6; $[9] = t7; $[10] = t8;
    } else {
      t0 = $[2]; t1 = $[3]; t2 = $[4]; t3 = $[5]; t4 = $[6]; t5 = $[7]; t6 = $[8]; t7 = $[9]; t8 = $[10];
    }

    let t9;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
      t9 = <Text><Text dimColor>                           ░░░░</Text><Text>                     ██    </Text></Text>;
      $[11] = t9;
    } else {
      t9 = $[11];
    }

    let t10, t11;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
      t10 = <Text><Text dimColor>                         ░░░░░░</Text><Text>               ██▒▒██  </Text></Text>;
      t11 = <Text>{"                                            ▒▒      ██   ▒"}</Text>;
      $[12] = t10; $[13] = t11;
    } else {
      t10 = $[12]; t11 = $[13];
    }

    let t12;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = <Text>      <Text color="clawd_body">   ███████   </Text>                   ▒▒░░▒▒      ▒ ▒▒</Text>;
      $[14] = t12;
    } else {
      t12 = $[14];
    }

    let t13;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
      t13 = <Text>      <Text color="clawd_body">  █▄███▄█  </Text>                     ▒▒         ▒▒ </Text>;
      $[15] = t13;
    } else {
      t13 = $[15];
    }

    let t14;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
      t14 = <Text>      <Text color="clawd_body">  ███████  </Text>                     ░          ▒   </Text>;
      $[16] = t14;
    } else {
      t14 = $[16];
    }

    let t15;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
      t15 = <Box width={WELCOME_V2_WIDTH}><Text>{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}<Text>{"………"}<Text color="clawd_body"> █▀     ▀█ </Text>{"………………………………░…………▒……"}</Text></Text></Box>;
      $[17] = t15;
    } else {
      t15 = $[17];
    }
    return t15;
  }

  // 暗色主题
  let t0, t1, t2, t3, t4, t5, t6;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Text><Text color="microcode">Welcome to Microcode </Text><Text dimColor>v{MACRO.VERSION} </Text></Text>;
    t1 = <Text>{"…".repeat(58)}</Text>;
    t2 = <Text>{"                                                          "}</Text>;
    t3 = <Text>{"     *                                       ░░░            "}</Text>;
    t4 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
    t5 = <Text>{"            ░░░░                       ░▒▓█▓▒░           "}</Text>;
    t6 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
    $[18] = t0; $[19] = t1; $[20] = t2; $[21] = t3; $[22] = t4; $[23] = t5; $[24] = t6;
  } else {
    t0 = $[18]; t1 = $[19]; t2 = $[20]; t3 = $[21]; t4 = $[22]; t5 = $[23]; t6 = $[24];
  }

  let t7, t8, t9, t10, t11;
  if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = <Text><Text>   ░░░░░░░░░░░░░░░░░░░    </Text><Text bold>*</Text><Text>                ▒▒░░      ▒   </Text></Text>;
    t8 = <Text>                                             ░▓▓███▓▓░    </Text>;
    t9 = <Text dimColor> *                                 ░░░░                   </Text>;
    t10 = <Text dimColor>                                 ░░░░░░                 </Text>;
    t11 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
    $[25] = t10; $[26] = t11; $[27] = t7; $[28] = t8; $[29] = t9;
  } else {
    t10 = $[25]; t11 = $[26]; t7 = $[27]; t8 = $[28]; t9 = $[29];
  }

  let t12;
  if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = <Text color="clawd_body">   ███████   </Text>;
    $[30] = t12;
  } else {
    t12 = $[30];
  }

  let t13;
  if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = <Text>      {t12}                                       <Text dimColor>*</Text> </Text>;
    $[31] = t13;
  } else {
    t13 = $[31];
  }

  let t14;
  if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = <Text>      <Text color="clawd_body">  █▄███▄█  </Text>                      <Text bold>*</Text>                </Text>;
    $[32] = t14;
  } else {
    t14 = $[32];
  }

  let t15;
  if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = <Text>      <Text color="clawd_body">  ███████  </Text>     *                                   </Text>;
    $[33] = t15;
  } else {
    t15 = $[33];
  }

  let t16;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = <Box width={WELCOME_V2_WIDTH}><Text>{t0}{t1}{t2}{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t13}{t14}{t15}<Text>{"………"}<Text color="clawd_body"> █▀     ▀█ </Text>{"………………………………………………"}</Text></Text></Box>;
    $[34] = t16;
  } else {
    t16 = $[34];
  }
  return t16;
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
      t6 = <Text>{"                                           ░░░            "}</Text>;
      t7 = <Text>{"                                         ░▒▓█▓▒░          "}</Text>;
      t8 = <Text>{"            ░░░░                       ░▒▓█▓▒░          "}</Text>;
      t9 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
      t10 = <Text>{"   ░░░░░░░░░░░░░░░░░░░                                    "}</Text>;
      t11 = <Text>{"                                                          "}</Text>;
      $[5] = t10; $[6] = t11; $[7] = t4; $[8] = t5; $[9] = t6; $[10] = t7; $[11] = t8; $[12] = t9;
    } else {
      t10 = $[5]; t11 = $[6]; t4 = $[7]; t5 = $[8]; t6 = $[9]; t7 = $[10]; t8 = $[11]; t9 = $[12];
    }

    let t12 = <Text><Text dimColor>                           ░░░░</Text><Text>                     ██    </Text></Text>;
    let t13 = <Text><Text dimColor>                         ░░░░░░</Text><Text>               ██▒▒██  </Text></Text>;
    let t14 = <Text>                                            ▒▒      ██   ▒</Text>;
    let t15 = <Text>      <Text color="clawd_body">   ███████   </Text>                     ▒▒         ▒▒ </Text>;
    let t16 = <Text>       <Text color="clawd_body">  █▄███▄█  </Text>                     ░          ▒   </Text>;
    let t17 = <Text>……… <Text color="clawd_body"> █▀     ▀█ </Text> ……………………………░…………▒……</Text>;

    let t19;
    if ($[20] !== t3) {
      t19 = <Box width={WELCOME_V2_WIDTH}><Text>{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}{t16}{t17}</Text></Box>;
      $[20] = t3; $[21] = t19;
    } else {
      t19 = $[21];
    }
    return t19;
  }

  // Apple 暗色
  let t4 = <Text>{"…".repeat(58)}</Text>;
  let t5 = <Text>{"                                                          "}</Text>;
  let t6 = <Text>{"     *                                       ░░░            "}</Text>;
  let t7 = <Text>{"                                 *         ░▒▓█▓▒░     ░░   "}</Text>;
  let t8 = <Text>{"            ░░░░                       ░▒▓█▓▒░           "}</Text>;
  let t9 = <Text>{"    ░░░   ░░░░░░░░░░                       ░░░            "}</Text>;
  let t10 = <Text><Text>   ░░░░░░░░░░░░░░░░░░░    </Text><Text bold>*</Text><Text>                ▒▒░░      ▒   </Text></Text>;
  let t11 = <Text>                                             ░▓▓███▓▓░    </Text>;
  let t12 = <Text dimColor> *                                 ░░░░                   </Text>;
  let t13 = <Text dimColor>                                 ░░░░░░                 </Text>;
  let t14 = <Text dimColor>                               ░░░░░░░░░░░░░░░░           </Text>;
  let t15 = <Text>                                                      <Text dimColor>*</Text> </Text>;
  let t16 = <Text>        <Text color="clawd_body">  █▄███▄█  </Text>                     <Text bold>*</Text>                </Text>;
  let t17 = <Text>        <Text color="clawd_body">  ███████  </Text>      *                                   </Text>;
  let t18 = <Text>……… <Text color="clawd_body"> █▀     ▀█ </Text> ………………………………………………</Text>;

  let t19;
  if ($[42] !== t3) {
    t19 = <Box width={WELCOME_V2_WIDTH}><Text>{t3}{t4}{t5}{t6}{t7}{t8}{t9}{t10}{t11}{t12}{t13}{t14}{t15}{t16}{t17}{t18}</Text></Box>;
    $[42] = t3; $[43] = t19;
  } else {
    t19 = $[43];
  }
  return t19;
}