export const DEFAULT_TEMPLATE_ID = 'darkFintech'

export const BUILT_IN_TEMPLATES = {
  darkFintech: {
    id: 'darkFintech',
    collection: 'built-in',
    name: 'Dark Fintech',
    shortName: 'Dark',
    description: 'Premium trading glow with dark green gradients.',
    shell: {
      appBackground:
        'radial-gradient(circle at top, rgba(40,116,90,0.22), transparent 36%), linear-gradient(180deg, #071310 0%, #0a1714 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
      panelBorder: 'rgba(255,255,255,0.1)',
      panelShadow: '0 30px 90px rgba(0,0,0,0.28)',
    },
    preview: {
      background:
        'radial-gradient(circle at 50% 14%, rgba(52,127,101,0.16) 0%, rgba(52,127,101,0) 28%), linear-gradient(180deg, #153b34 0%, #10342d 44%, #0b2924 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0.03) 49%, rgba(255,255,255,0) 79%, rgba(255,255,255,0.02) 100%)',
      lineColor: 'rgba(175, 255, 229, 0.24)',
      lineColorSoft: 'rgba(155, 243, 217, 0.19)',
      lineColorFaint: 'rgba(154, 247, 218, 0.18)',
      lineColorTiny: 'rgba(146, 235, 207, 0.16)',
      footerGradient:
        'linear-gradient(180deg, rgba(4,11,10,0) 0%, rgba(5,11,10,0.35) 22%, rgba(5,10,10,0.55) 100%)',
      footerBorder: 'rgba(255,255,255,0.06)',
      logoBackground: 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)',
      logoShadow: '0 16px 34px rgba(0, 0, 0, 0.18)',
      logoRadius: 18,
      previewFrame: '#06110e',
    },
    typography: {
      headingColor: '#f4f4f4',
      headingAccentColor: '#39eb95',
      extraColor: '#f6f6f6',
      disclaimerColor: 'rgba(255, 255, 255, 0.82)',
      headingFont: 'Outfit',
      bodyFont: 'Inter',
      cardFont: 'Outfit',
    },
    cards: {
      variant: 'classic',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(251,248,241,0.98) 54%, rgba(245,237,224,0.98) 100%)',
      cardBorder: 'rgba(255, 255, 255, 0.3)',
      cardShadow: '0 24px 38px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.7)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 70%)',
      curveStrong: 'rgba(255, 255, 255, 0.38)',
      curveSoft: 'rgba(255, 255, 255, 0.18)',
      cardRadius: 20,
      tabRadius: 10,
      pillRadius: 999,
      sideOpacity: 0.92,
      labelTextColor: '#232323',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffd36c', tabEnd: '#f7b83e', sideStart: '#f1b24d', sideEnd: '#f5b13b', lower: '#ffd871', pillStart: '#f9b542', pillEnd: '#ea9018', text: '#141414' },
      Futures: { tabStart: '#b78cff', tabEnd: '#7d66ef', sideStart: '#8f6ef6', sideEnd: '#8461f3', lower: '#8261f3', pillStart: '#8b6ff5', pillEnd: '#6848d4', text: '#111111' },
      Options: { tabStart: '#ff9bad', tabEnd: '#ff6a84', sideStart: '#ff7891', sideEnd: '#ff6c86', lower: '#f4607b', pillStart: '#f38499', pillEnd: '#dc5370', text: '#111111' },
      Commodity: { tabStart: '#e8d29a', tabEnd: '#c8ab64', sideStart: '#c6aa67', sideEnd: '#ccb06f', lower: '#ccaf6e', pillStart: '#ceb679', pillEnd: '#b48f4e', text: '#151515' },
    },
  },
  minimalLight: {
    id: 'minimalLight',
    collection: 'built-in',
    name: 'Minimal Light',
    shortName: 'Light',
    description: 'Clean white canvas with restrained premium accents.',
    shell: {
      appBackground:
        'radial-gradient(circle at top, rgba(214,227,237,0.55), transparent 38%), linear-gradient(180deg, #edf2f5 0%, #dfe6eb 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,248,250,0.86))',
      panelBorder: 'rgba(21,39,54,0.08)',
      panelShadow: '0 24px 70px rgba(76,95,112,0.16)',
    },
    preview: {
      background:
        'radial-gradient(circle at 50% 10%, rgba(219,236,241,0.72) 0%, rgba(219,236,241,0) 26%), linear-gradient(180deg, #ffffff 0%, #eef3f6 48%, #e3eaee 100%)',
      sheen:
        'linear-gradient(90deg, rgba(0,0,0,0.01) 0%, rgba(255,255,255,0) 30%, rgba(0,0,0,0.02) 52%, rgba(255,255,255,0) 82%, rgba(0,0,0,0.01) 100%)',
      lineColor: 'rgba(74, 124, 110, 0.18)',
      lineColorSoft: 'rgba(74, 124, 110, 0.13)',
      lineColorFaint: 'rgba(74, 124, 110, 0.11)',
      lineColorTiny: 'rgba(74, 124, 110, 0.09)',
      footerGradient:
        'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(233,239,242,0.68) 22%, rgba(225,232,236,0.92) 100%)',
      footerBorder: 'rgba(15,32,38,0.08)',
      logoBackground: 'linear-gradient(180deg, #ffffff 0%, #f2f5f7 100%)',
      logoShadow: '0 16px 34px rgba(86, 105, 122, 0.12)',
      logoRadius: 18,
      previewFrame: '#f5f8fa',
    },
    typography: {
      headingColor: '#1c232b',
      headingAccentColor: '#159e66',
      extraColor: '#1f2c32',
      disclaimerColor: 'rgba(35, 47, 56, 0.78)',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      cardFont: 'Inter',
    },
    cards: {
      variant: 'minimal',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,249,250,0.98) 55%, rgba(239,243,245,0.98) 100%)',
      cardBorder: 'rgba(34, 49, 57, 0.08)',
      cardShadow: '0 20px 34px rgba(134, 154, 168, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(255, 255, 255, 0.36)',
      curveSoft: 'rgba(34, 49, 57, 0.08)',
      cardRadius: 18,
      tabRadius: 10,
      pillRadius: 999,
      sideOpacity: 0.72,
      labelTextColor: '#182027',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffdca3', tabEnd: '#f6bf59', sideStart: '#f8c96e', sideEnd: '#efb347', lower: '#f7cc7a', pillStart: '#f9be56', pillEnd: '#e09a2d', text: '#182027' },
      Futures: { tabStart: '#ccb9ff', tabEnd: '#9580f4', sideStart: '#a68ff6', sideEnd: '#886dee', lower: '#9d85f5', pillStart: '#9e86f0', pillEnd: '#7558cf', text: '#182027' },
      Options: { tabStart: '#ffb9c7', tabEnd: '#ff7a95', sideStart: '#ff93aa', sideEnd: '#f36d8a', lower: '#f68aa1', pillStart: '#f48da2', pillEnd: '#da607c', text: '#182027' },
      Commodity: { tabStart: '#ecdcb1', tabEnd: '#d1b16b', sideStart: '#d9be82', sideEnd: '#c8ab66', lower: '#d6bc7d', pillStart: '#d2b679', pillEnd: '#b79254', text: '#182027' },
    },
  },
  glassmorphism: {
    id: 'glassmorphism',
    collection: 'built-in',
    name: 'Glassmorphism',
    shortName: 'Glass',
    description: 'Frosted cards with aurora gradients and blur.',
    shell: {
      appBackground:
        'radial-gradient(circle at top left, rgba(117,149,255,0.2), transparent 30%), radial-gradient(circle at top right, rgba(89,235,201,0.18), transparent 32%), linear-gradient(180deg, #0c1624 0%, #0a1220 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
      panelBorder: 'rgba(255,255,255,0.12)',
      panelShadow: '0 30px 90px rgba(0,0,0,0.34)',
    },
    preview: {
      background:
        'radial-gradient(circle at 20% 12%, rgba(115,149,255,0.24) 0%, rgba(115,149,255,0) 24%), radial-gradient(circle at 80% 16%, rgba(90,235,201,0.16) 0%, rgba(90,235,201,0) 24%), linear-gradient(180deg, #112233 0%, #0c1a2b 42%, #091523 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 24%, rgba(255,255,255,0.05) 52%, rgba(255,255,255,0.01) 81%, rgba(255,255,255,0.03) 100%)',
      lineColor: 'rgba(197, 228, 255, 0.2)',
      lineColorSoft: 'rgba(197, 228, 255, 0.16)',
      lineColorFaint: 'rgba(197, 228, 255, 0.14)',
      lineColorTiny: 'rgba(197, 228, 255, 0.1)',
      footerGradient:
        'linear-gradient(180deg, rgba(9,19,31,0) 0%, rgba(9,19,31,0.38) 22%, rgba(9,19,31,0.6) 100%)',
      footerBorder: 'rgba(255,255,255,0.08)',
      logoBackground: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)',
      logoShadow: '0 18px 38px rgba(0, 0, 0, 0.24)',
      logoRadius: 18,
      previewFrame: '#0a1320',
    },
    typography: {
      headingColor: '#f6f9ff',
      headingAccentColor: '#61f0c8',
      extraColor: '#eff6ff',
      disclaimerColor: 'rgba(240,246,255,0.8)',
      headingFont: 'Trebuchet',
      bodyFont: 'Inter',
      cardFont: 'Inter',
    },
    cards: {
      variant: 'glass',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.76) 0%, rgba(255,255,255,0.54) 55%, rgba(255,255,255,0.38) 100%)',
      cardBorder: 'rgba(255, 255, 255, 0.26)',
      cardShadow: '0 24px 36px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.48)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(255, 255, 255, 0.34)',
      curveSoft: 'rgba(255, 255, 255, 0.16)',
      cardRadius: 22,
      tabRadius: 12,
      pillRadius: 999,
      sideOpacity: 0.82,
      labelTextColor: '#132030',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffd889', tabEnd: '#f3a634', sideStart: '#ffc967', sideEnd: '#eea742', lower: '#ffc45a', pillStart: '#ffc56e', pillEnd: '#e28d1f', text: '#132030' },
      Futures: { tabStart: '#ccb4ff', tabEnd: '#7d6cff', sideStart: '#aa8dff', sideEnd: '#8467f2', lower: '#947dff', pillStart: '#9c84ff', pillEnd: '#6447d0', text: '#132030' },
      Options: { tabStart: '#ffb1cb', tabEnd: '#ff6f93', sideStart: '#ff8aab', sideEnd: '#eb6384', lower: '#ff7898', pillStart: '#f48dab', pillEnd: '#d65275', text: '#132030' },
      Commodity: { tabStart: '#f0ddb0', tabEnd: '#c4a45d', sideStart: '#dcc07f', sideEnd: '#c2a25d', lower: '#d8b86c', pillStart: '#d5ba7d', pillEnd: '#aa8448', text: '#132030' },
    },
  },
  boldAdStyle: {
    id: 'boldAdStyle',
    collection: 'built-in',
    name: 'Bold Ad Style',
    shortName: 'Bold',
    description: 'High-contrast creative for attention-grabbing banners.',
    shell: {
      appBackground:
        'radial-gradient(circle at top left, rgba(255,115,115,0.18), transparent 28%), radial-gradient(circle at top right, rgba(255,214,92,0.16), transparent 30%), linear-gradient(180deg, #120f17 0%, #1b1523 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      panelBorder: 'rgba(255,255,255,0.12)',
      panelShadow: '0 30px 90px rgba(0,0,0,0.34)',
    },
    preview: {
      background:
        'radial-gradient(circle at 16% 12%, rgba(255,128,111,0.18) 0%, rgba(255,128,111,0) 24%), radial-gradient(circle at 82% 18%, rgba(255,223,111,0.18) 0%, rgba(255,223,111,0) 24%), linear-gradient(180deg, #21172a 0%, #17121f 44%, #100d15 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0) 79%, rgba(255,255,255,0.03) 100%)',
      lineColor: 'rgba(255, 255, 255, 0.18)',
      lineColorSoft: 'rgba(255, 255, 255, 0.14)',
      lineColorFaint: 'rgba(255, 255, 255, 0.12)',
      lineColorTiny: 'rgba(255, 255, 255, 0.1)',
      footerGradient:
        'linear-gradient(180deg, rgba(16,13,21,0) 0%, rgba(16,13,21,0.35) 20%, rgba(16,13,21,0.64) 100%)',
      footerBorder: 'rgba(255,255,255,0.08)',
      logoBackground: 'linear-gradient(180deg, #fff7f4 0%, #ffeede 100%)',
      logoShadow: '0 16px 34px rgba(0, 0, 0, 0.22)',
      logoRadius: 18,
      previewFrame: '#100d15',
    },
    typography: {
      headingColor: '#fff8f4',
      headingAccentColor: '#4bffae',
      extraColor: '#fff4ef',
      disclaimerColor: 'rgba(255,246,238,0.82)',
      headingFont: 'Outfit',
      bodyFont: 'Trebuchet',
      cardFont: 'Outfit',
    },
    cards: {
      variant: 'bold',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,246,241,0.98) 54%, rgba(245,232,225,0.98) 100%)',
      cardBorder: 'rgba(255, 255, 255, 0.28)',
      cardShadow: '0 26px 40px rgba(0, 0, 0, 0.24), inset 0 1px 1px rgba(255, 255, 255, 0.72)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(255, 255, 255, 0.38)',
      curveSoft: 'rgba(255, 255, 255, 0.18)',
      cardRadius: 18,
      tabRadius: 11,
      pillRadius: 999,
      sideOpacity: 0.95,
      labelTextColor: '#1a1715',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffe072', tabEnd: '#ff9f1c', sideStart: '#ffcf45', sideEnd: '#ff9f1c', lower: '#ffbc47', pillStart: '#ffc452', pillEnd: '#f08a00', text: '#1a1715' },
      Futures: { tabStart: '#cfb0ff', tabEnd: '#734eff', sideStart: '#b387ff', sideEnd: '#8454ff', lower: '#8b63ff', pillStart: '#9b72ff', pillEnd: '#5f35ef', text: '#1a1715' },
      Options: { tabStart: '#ff9ab8', tabEnd: '#ff3f6d', sideStart: '#ff6d95', sideEnd: '#ff4b74', lower: '#ff567d', pillStart: '#ff7d9a', pillEnd: '#e33861', text: '#1a1715' },
      Commodity: { tabStart: '#f7e1a5', tabEnd: '#c6922b', sideStart: '#e5c16b', sideEnd: '#c08a26', lower: '#d4aa4b', pillStart: '#d8ba73', pillEnd: '#a8771b', text: '#1a1715' },
    },
  },
  neonOrbit: {
    id: 'neonOrbit',
    collection: 'built-in',
    name: 'Neon Orbit',
    shortName: 'Orbit',
    description: 'Dark outlined cards with cyan-blue ring glow, inspired by premium pricing boards.',
    shell: {
      appBackground:
        'radial-gradient(circle at top left, rgba(53,165,255,0.18), transparent 22%), radial-gradient(circle at bottom right, rgba(50,235,201,0.16), transparent 24%), linear-gradient(180deg, #071623 0%, #091724 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
      panelBorder: 'rgba(255,255,255,0.1)',
      panelShadow: '0 30px 90px rgba(0,0,0,0.32)',
    },
    preview: {
      background:
        'radial-gradient(circle at 14% 10%, rgba(51,142,255,0.25) 0%, rgba(51,142,255,0) 16%), radial-gradient(circle at 80% 86%, rgba(48,232,205,0.22) 0%, rgba(48,232,205,0) 18%), linear-gradient(180deg, #071623 0%, #08131c 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 22%, rgba(0,195,255,0.04) 52%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.02) 100%)',
      lineColor: 'rgba(102, 227, 255, 0.2)',
      lineColorSoft: 'rgba(102, 227, 255, 0.16)',
      lineColorFaint: 'rgba(102, 227, 255, 0.12)',
      lineColorTiny: 'rgba(102, 227, 255, 0.1)',
      footerGradient:
        'linear-gradient(180deg, rgba(5,12,18,0) 0%, rgba(5,12,18,0.34) 22%, rgba(5,12,18,0.6) 100%)',
      footerBorder: 'rgba(117,233,255,0.08)',
      logoBackground: 'transparent',
      logoShadow: 'none',
      logoRadius: 0,
      previewFrame: '#06111a',
    },
    typography: {
      headingColor: '#f6fbff',
      headingAccentColor: '#45f1c6',
      extraColor: '#f2fbff',
      disclaimerColor: 'rgba(229,245,255,0.84)',
      headingFont: 'Georgia',
      bodyFont: 'Inter',
      cardFont: 'Inter',
    },
    cards: {
      variant: 'outlineNeon',
      cardSurface:
        'linear-gradient(180deg, rgba(7,20,32,0.9) 0%, rgba(5,14,24,0.92) 100%)',
      cardBorder: 'rgba(90, 226, 235, 0.38)',
      cardShadow: '0 22px 36px rgba(0, 0, 0, 0.26), inset 0 0 0 1px rgba(82,220,235,0.18)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(103,248,255,0.14) 0%, rgba(255,255,255,0) 70%)',
      curveStrong: 'rgba(82, 220, 235, 0.26)',
      curveSoft: 'rgba(82, 220, 235, 0.14)',
      cardRadius: 20,
      tabRadius: 11,
      pillRadius: 999,
      sideOpacity: 0.88,
      labelTextColor: '#f6fbff',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffbf5f', tabEnd: '#ff8f32', sideStart: '#ffb04b', sideEnd: '#ff8f32', lower: '#0c3141', pillStart: '#1f7bff', pillEnd: '#1450df', text: '#f6fbff' },
      Futures: { tabStart: '#af8dff', tabEnd: '#7859ff', sideStart: '#9777ff', sideEnd: '#6d4df1', lower: '#15355a', pillStart: '#31a5ff', pillEnd: '#0f6be8', text: '#f6fbff' },
      Options: { tabStart: '#ff8fbd', tabEnd: '#ff5a91', sideStart: '#ff79aa', sideEnd: '#f84f89', lower: '#21304d', pillStart: '#2ed0ff', pillEnd: '#1b8cf0', text: '#f6fbff' },
      Commodity: { tabStart: '#f1d48f', tabEnd: '#cfaa4a', sideStart: '#e3bf6f', sideEnd: '#c79c34', lower: '#183246', pillStart: '#23b4ff', pillEnd: '#1169de', text: '#f6fbff' },
    },
  },
  royalGlow: {
    id: 'royalGlow',
    collection: 'built-in',
    name: 'Royal Glow',
    shortName: 'Royal',
    description: 'Luxury violet glow with glossy premium cards and strong contrast.',
    shell: {
      appBackground:
        'radial-gradient(circle at top, rgba(178,111,255,0.22), transparent 30%), linear-gradient(180deg, #120322 0%, #1a0530 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))',
      panelBorder: 'rgba(203,169,255,0.14)',
      panelShadow: '0 30px 90px rgba(0,0,0,0.36)',
    },
    preview: {
      background:
        'radial-gradient(circle at 50% 18%, rgba(177,110,255,0.24) 0%, rgba(177,110,255,0) 26%), radial-gradient(circle at 50% 100%, rgba(144,100,255,0.18) 0%, rgba(144,100,255,0) 20%), linear-gradient(180deg, #130326 0%, #1f0737 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 18%, rgba(189,128,255,0.06) 49%, rgba(255,255,255,0) 79%, rgba(255,255,255,0.02) 100%)',
      lineColor: 'rgba(234, 220, 255, 0.22)',
      lineColorSoft: 'rgba(234, 220, 255, 0.17)',
      lineColorFaint: 'rgba(234, 220, 255, 0.13)',
      lineColorTiny: 'rgba(234, 220, 255, 0.1)',
      footerGradient:
        'linear-gradient(180deg, rgba(18,3,34,0) 0%, rgba(18,3,34,0.3) 22%, rgba(18,3,34,0.62) 100%)',
      footerBorder: 'rgba(255,255,255,0.08)',
      logoBackground: 'transparent',
      logoShadow: 'none',
      logoRadius: 0,
      previewFrame: '#110220',
    },
    typography: {
      headingColor: '#fff8ff',
      headingAccentColor: '#c57bff',
      extraColor: '#f9ecff',
      disclaimerColor: 'rgba(251,239,255,0.82)',
      headingFont: 'Outfit',
      bodyFont: 'Inter',
      cardFont: 'Outfit',
    },
    cards: {
      variant: 'royalGlow',
      cardSurface:
        'linear-gradient(180deg, rgba(120,50,255,0.94) 0%, rgba(82,25,184,0.96) 100%)',
      cardBorder: 'rgba(237,219,255,0.24)',
      cardShadow: '0 24px 40px rgba(117,45,243,0.28), inset 0 1px 0 rgba(255,255,255,0.22)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%)',
      curveStrong: 'rgba(255,255,255,0.42)',
      curveSoft: 'rgba(255,255,255,0.16)',
      cardRadius: 22,
      tabRadius: 14,
      pillRadius: 999,
      sideOpacity: 0.86,
      labelTextColor: '#ffffff',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffcf6d', tabEnd: '#ff9f20', sideStart: '#7a30f6', sideEnd: '#6321d2', lower: '#6e25df', pillStart: '#27113f', pillEnd: '#180924', text: '#ffffff' },
      Futures: { tabStart: '#c386ff', tabEnd: '#7b32ff', sideStart: '#9c56ff', sideEnd: '#6f2ce7', lower: '#7a31f4', pillStart: '#2a1140', pillEnd: '#170722', text: '#ffffff' },
      Options: { tabStart: '#ff97c7', tabEnd: '#ff4b95', sideStart: '#aa4cff', sideEnd: '#7d2bea', lower: '#8533f5', pillStart: '#28103f', pillEnd: '#190925', text: '#ffffff' },
      Commodity: { tabStart: '#f0d88d', tabEnd: '#cfa53b', sideStart: '#8e4cff', sideEnd: '#6928dd', lower: '#7530eb', pillStart: '#28103f', pillEnd: '#190925', text: '#ffffff' },
    },
  },
  auroraFrame: {
    id: 'auroraFrame',
    collection: 'built-in',
    name: 'Aurora Frame',
    shortName: 'Aurora',
    description: 'Soft lavender board with framed presentation and airy modern feel.',
    shell: {
      appBackground:
        'radial-gradient(circle at top, rgba(163,151,255,0.22), transparent 32%), linear-gradient(180deg, #746cff 0%, #a59fff 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08))',
      panelBorder: 'rgba(255,255,255,0.18)',
      panelShadow: '0 26px 80px rgba(84,72,190,0.26)',
    },
    preview: {
      background:
        'radial-gradient(circle at 50% 8%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 20%), linear-gradient(180deg, #776dfd 0%, #8d84ff 54%, #a7a0ff 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0.08) 52%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.05) 100%)',
      lineColor: 'rgba(255, 255, 255, 0.28)',
      lineColorSoft: 'rgba(255, 255, 255, 0.18)',
      lineColorFaint: 'rgba(255, 255, 255, 0.14)',
      lineColorTiny: 'rgba(255, 255, 255, 0.12)',
      footerGradient:
        'linear-gradient(180deg, rgba(122,114,255,0) 0%, rgba(122,114,255,0.18) 24%, rgba(122,114,255,0.34) 100%)',
      footerBorder: 'rgba(255,255,255,0.16)',
      logoBackground: 'transparent',
      logoShadow: 'none',
      logoRadius: 0,
      previewFrame: '#766dff',
    },
    typography: {
      headingColor: '#ffffff',
      headingAccentColor: '#f5ff9d',
      extraColor: '#ffffff',
      disclaimerColor: 'rgba(255,255,255,0.9)',
      headingFont: 'Trebuchet',
      bodyFont: 'Inter',
      cardFont: 'Trebuchet',
    },
    cards: {
      variant: 'softFrame',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(249,247,255,0.96) 100%)',
      cardBorder: 'rgba(255,255,255,0.58)',
      cardShadow: '0 22px 34px rgba(89,79,224,0.2), inset 0 1px 0 rgba(255,255,255,0.86)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(166, 153, 255, 0.34)',
      curveSoft: 'rgba(166, 153, 255, 0.18)',
      cardRadius: 16,
      tabRadius: 12,
      pillRadius: 999,
      sideOpacity: 0.75,
      labelTextColor: '#232134',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ffc76c', tabEnd: '#ffb13a', sideStart: '#d5d0ff', sideEnd: '#b3abff', lower: '#ece9ff', pillStart: '#7c6dff', pillEnd: '#5d51ea', text: '#232134' },
      Futures: { tabStart: '#c6abff', tabEnd: '#8d74ff', sideStart: '#ddd7ff', sideEnd: '#b7b0ff', lower: '#ece9ff', pillStart: '#7c6dff', pillEnd: '#5d51ea', text: '#232134' },
      Options: { tabStart: '#ffabc5', tabEnd: '#ff6f97', sideStart: '#ead9ff', sideEnd: '#c7b6ff', lower: '#f2ebff', pillStart: '#7c6dff', pillEnd: '#5d51ea', text: '#232134' },
      Commodity: { tabStart: '#efd98e', tabEnd: '#d3ad4c', sideStart: '#e4dcff', sideEnd: '#bcb3ff', lower: '#efeaff', pillStart: '#7c6dff', pillEnd: '#5d51ea', text: '#232134' },
    },
  },
  ribbonStack: {
    id: 'ribbonStack',
    collection: 'built-in',
    name: 'Ribbon Stack',
    shortName: 'Ribbon',
    description: 'Bright ad-style white cards with stacked colored ribbons and clean shadows.',
    shell: {
      appBackground:
        'radial-gradient(circle at top, rgba(255,255,255,0.52), transparent 34%), linear-gradient(180deg, #e8e8e8 0%, #d7d7d7 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(247,247,247,0.84))',
      panelBorder: 'rgba(25,25,25,0.08)',
      panelShadow: '0 22px 70px rgba(112,112,112,0.16)',
    },
    preview: {
      background:
        'linear-gradient(180deg, #f1f1f1 0%, #d7d7d7 100%)',
      sheen:
        'linear-gradient(90deg, rgba(0,0,0,0.01) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0.18) 52%, rgba(255,255,255,0) 82%, rgba(0,0,0,0.01) 100%)',
      lineColor: 'rgba(160, 160, 160, 0.18)',
      lineColorSoft: 'rgba(160, 160, 160, 0.14)',
      lineColorFaint: 'rgba(160, 160, 160, 0.1)',
      lineColorTiny: 'rgba(160, 160, 160, 0.08)',
      footerGradient:
        'linear-gradient(180deg, rgba(215,215,215,0) 0%, rgba(215,215,215,0.45) 24%, rgba(215,215,215,0.72) 100%)',
      footerBorder: 'rgba(62,62,62,0.08)',
      logoBackground: 'transparent',
      logoShadow: 'none',
      logoRadius: 0,
      previewFrame: '#dadada',
    },
    typography: {
      headingColor: '#212121',
      headingAccentColor: '#ff3d8a',
      extraColor: '#212121',
      disclaimerColor: 'rgba(34,34,34,0.8)',
      headingFont: 'Outfit',
      bodyFont: 'Inter',
      cardFont: 'Outfit',
    },
    cards: {
      variant: 'ribbonStack',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.98) 100%)',
      cardBorder: 'rgba(0,0,0,0.04)',
      cardShadow: '0 24px 34px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.92)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(235, 235, 235, 0.92)',
      curveSoft: 'rgba(220, 220, 220, 0.7)',
      cardRadius: 18,
      tabRadius: 10,
      pillRadius: 999,
      sideOpacity: 0.94,
      labelTextColor: '#1f1f1f',
    },
    categoryPalettes: {
      Equity: { tabStart: '#8f55ff', tabEnd: '#6b36e8', sideStart: '#a76cff', sideEnd: '#6b36e8', lower: '#ffffff', pillStart: '#965cff', pillEnd: '#f13388', text: '#1f1f1f' },
      Futures: { tabStart: '#f339a2', tabEnd: '#cb1f8e', sideStart: '#ff58b2', sideEnd: '#cb1f8e', lower: '#ffffff', pillStart: '#955cff', pillEnd: '#f13388', text: '#1f1f1f' },
      Options: { tabStart: '#ff5793', tabEnd: '#ff2f6d', sideStart: '#ff7ea9', sideEnd: '#ff2f6d', lower: '#ffffff', pillStart: '#955cff', pillEnd: '#ff3f6d', text: '#1f1f1f' },
      Commodity: { tabStart: '#ffb73c', tabEnd: '#ff8d07', sideStart: '#ffc75b', sideEnd: '#ff8d07', lower: '#ffffff', pillStart: '#ffb43b', pillEnd: '#ff7e00', text: '#1f1f1f' },
    },
  },
  sidebandClean: {
    id: 'sidebandClean',
    collection: 'built-in',
    name: 'Sideband Clean',
    shortName: 'Sideband',
    description: 'Minimal white cards with bold vertical color bands and editorial spacing.',
    shell: {
      appBackground:
        'linear-gradient(180deg, #e7edf3 0%, #f5f7fa 26%, #f3f5f7 74%, #e4eaef 100%)',
      panelBackground:
        'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,249,250,0.88))',
      panelBorder: 'rgba(30,43,55,0.08)',
      panelShadow: '0 24px 70px rgba(126,140,153,0.14)',
    },
    preview: {
      background:
        'linear-gradient(180deg, #eef2f5 0%, #ffffff 34%, #f6f7f9 100%)',
      sheen:
        'linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 26%, rgba(0,0,0,0.02) 52%, rgba(255,255,255,0) 82%, rgba(255,255,255,0.12) 100%)',
      lineColor: 'rgba(76, 92, 108, 0.08)',
      lineColorSoft: 'rgba(76, 92, 108, 0.06)',
      lineColorFaint: 'rgba(76, 92, 108, 0.05)',
      lineColorTiny: 'rgba(76, 92, 108, 0.04)',
      footerGradient:
        'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(239,242,245,0.68) 24%, rgba(232,236,240,0.92) 100%)',
      footerBorder: 'rgba(30,43,55,0.06)',
      logoBackground: 'transparent',
      logoShadow: 'none',
      logoRadius: 0,
      previewFrame: '#f4f7fa',
    },
    typography: {
      headingColor: '#1d2731',
      headingAccentColor: '#139e61',
      extraColor: '#1d2731',
      disclaimerColor: 'rgba(28,39,49,0.78)',
      headingFont: 'Trebuchet',
      bodyFont: 'Inter',
      cardFont: 'Trebuchet',
    },
    cards: {
      variant: 'sidebandClean',
      cardSurface:
        'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,252,252,0.98) 100%)',
      cardBorder: 'rgba(18,31,42,0.05)',
      cardShadow: '0 18px 30px rgba(79,95,110,0.12), inset 0 1px 0 rgba(255,255,255,0.88)',
      topHighlight:
        'radial-gradient(circle at 50% -8%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 70%)',
      curveStrong: 'rgba(235,239,243,0.9)',
      curveSoft: 'rgba(220,225,230,0.7)',
      cardRadius: 16,
      tabRadius: 8,
      pillRadius: 999,
      sideOpacity: 1,
      labelTextColor: '#1d2731',
    },
    categoryPalettes: {
      Equity: { tabStart: '#ff2248', tabEnd: '#df0a2c', sideStart: '#ff2248', sideEnd: '#df0a2c', lower: '#ffffff', pillStart: '#ff2248', pillEnd: '#d70e30', text: '#1d2731' },
      Futures: { tabStart: '#0f2d6e', tabEnd: '#081f53', sideStart: '#0f2d6e', sideEnd: '#081f53', lower: '#ffffff', pillStart: '#0f2d6e', pillEnd: '#081f53', text: '#1d2731' },
      Options: { tabStart: '#07ad59', tabEnd: '#06954d', sideStart: '#07ad59', sideEnd: '#06954d', lower: '#ffffff', pillStart: '#07ad59', pillEnd: '#06954d', text: '#1d2731' },
      Commodity: { tabStart: '#ffac18', tabEnd: '#f18d00', sideStart: '#ffac18', sideEnd: '#f18d00', lower: '#ffffff', pillStart: '#ffac18', pillEnd: '#f18d00', text: '#1d2731' },
    },
  },
}
export const BUILT_IN_TEMPLATE_OPTIONS = Object.values(BUILT_IN_TEMPLATES)
export const BANNER_TEMPLATES = BUILT_IN_TEMPLATES
export const TEMPLATE_OPTIONS = BUILT_IN_TEMPLATE_OPTIONS

export function getBannerTemplate(templateId) {
  return BANNER_TEMPLATES[templateId] || BANNER_TEMPLATES[DEFAULT_TEMPLATE_ID]
}

export function getTemplateCardColors(templateId, category) {
  const template = getBannerTemplate(templateId)
  return {
    ...template.categoryPalettes[category || 'Equity'],
  }
}
