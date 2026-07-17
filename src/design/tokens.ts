export const colors = {
  sky: '#EAFBFF',
  foam: '#FFFDF4',
  sand: '#FFF0C7',
  aqua: '#62E5E0',
  blue: '#3EC6F3',
  sun: '#FFD95A',
  coral: '#FF7A7A',
  mango: '#FFAA4C',
  lime: '#B8ED72',
  lavender: '#BBA7FF',
  shell: '#FFB7D5',
  ink: '#073B4C',
  muted: '#4C7180',
  line: '#BDECF1',
  warning: '#E98939',
  danger: '#C94C5E',
  white: '#FFFFFF',
  overlay: 'rgba(7,59,76,0.08)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
} as const;
export const radii = {
  tile: 16,
  compact: 18,
  button: 18,
  card: 24,
  sheet: 32,
  pill: 999,
} as const;
export const type = {
  hero: { fontFamily: 'Fraunces_600SemiBold', fontSize: 44, lineHeight: 48 },
  display: { fontFamily: 'Fraunces_600SemiBold', fontSize: 34, lineHeight: 40 },
  h1: { fontFamily: 'Manrope_700Bold', fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: 'Manrope_700Bold', fontSize: 22, lineHeight: 28 },
  h3: { fontFamily: 'Manrope_700Bold', fontSize: 18, lineHeight: 24 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 16, lineHeight: 24 },
  small: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 20 },
  label: { fontFamily: 'Manrope_700Bold', fontSize: 12, lineHeight: 16 },
  metric: { fontFamily: 'Fraunces_600SemiBold', fontSize: 28, lineHeight: 30 },
} as const;
