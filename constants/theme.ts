export const colors = {
  // Brand green
  brand:      '#1D9E75',
  brandDark:  '#0F6E56',
  brandDeep:  '#085041',
  brandLight: '#E1F5EE',
  brandPale:  '#F0FAF6',

  // Ink (neutrals)
  ink:        '#0D0D0B',
  ink80:      '#1A1A17',
  ink60:      '#3A3A37',
  ink40:      '#6B6B67',
  ink20:      '#A8A8A3',
  ink10:      '#D8D8D3',
  ink05:      '#EDEDEA',
  paper:      '#F7F7F4',
  white:      '#FFFFFF',

  // Semantic
  danger:        '#C0392B',
  dangerLight:   '#FCEBEB',
  warning:       '#D68910',
  warningLight:  '#FAEEDA',
  purple:        '#534AB7',
  purpleLight:   '#EEEDFE',
} as const;

export const fonts = {
  display: 'Syne_800ExtraBold',
  displayBold: 'Syne_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyLight: 'DMSans_300Light',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
} as const;

export const spacing = {
  xs:      4,
  sm:      8,
  md:      16,
  lg:      24,
  xl:      32,
  '2xl':   48,
  '3xl':   64,
  section: 80,
} as const;

export const radius = {
  button:  6,
  element: 8,
  card:    12,
  tile:    10,
  screen:  16,
  icon:    22,
  pill:    999,
} as const;
