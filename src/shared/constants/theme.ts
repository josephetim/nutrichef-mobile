import { DefaultTheme, type Theme } from '@react-navigation/native';

export const colors = {
  background: '#FBF7F2',
  surface: '#F7F0E8',
  surfaceElevated: '#FFFDFC',
  surfaceMuted: '#F2E9DD',
  primary: '#2F5D50',
  secondary: '#C96A3D',
  accent: '#D9A627',
  text: '#1C1713',
  textMuted: '#6C635B',
  border: '#E6DCD0',
  success: '#4E7A5E',
  danger: '#B05D4A',
  shadow: 'rgba(28, 23, 19, 0.12)',
  overlay: 'rgba(28, 23, 19, 0.45)',
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const fontFamilies = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  display: 'PlayfairDisplay_700Bold',
  displayMedium: 'PlayfairDisplay_600SemiBold',
} as const;

export const shadow = {
  shadowColor: colors.shadow,
  shadowOffset: {
    width: 0,
    height: 12,
  },
  shadowOpacity: 1,
  shadowRadius: 24,
  elevation: 10,
} as const;

export const appTheme = {
  colors,
  spacing,
  radii,
  fontFamilies,
  shadow,
  pageGradient: ['#FBF7F2', '#F3EBE0'] as const,
  accentGradient: ['#E0B74C', '#C96A3D'] as const,
  successGradient: ['#68966F', '#2F5D50'] as const,
  imageOverlay: ['rgba(28, 23, 19, 0.02)', 'rgba(28, 23, 19, 0.65)'] as const,
} as const;

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surfaceElevated,
    text: colors.text,
    border: colors.border,
    notification: colors.secondary,
  },
};
