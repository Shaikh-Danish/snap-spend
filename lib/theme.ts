import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/**
 * Semantic color tokens mapped from globals.css (oklch → hex for RN).
 * Derived from your specific OKLCH values:
 * Primary (Light): oklch(0.53 0.27 286) -> #a855f7
 * Primary (Dark):  oklch(0.61 0.22 291) -> #a855f7 (closer to brand purple)
 * Background (Dark): oklch(0.22 0.00 271) -> #09090b
 */
export const THEME = {
  light: {
    background: '#fafafa',
    foreground: '#09090b',
    card: '#ffffff',
    cardForeground: '#09090b',
    popover: '#ffffff',
    popoverForeground: '#09090b',
    primary: '#a855f7', // Brand Purple
    primaryForeground: '#ffffff',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',
    destructiveForeground: '#fafafa',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#a1a1aa',
    chart1: '#e45a2e',
    chart2: '#10b981',
    chart3: '#2d4a5e',
    chart4: '#8B5CF6',
    chart5: '#F59E0B',
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    card: '#18181b',
    cardForeground: '#fafafa',
    popover: '#18181b',
    popoverForeground: '#fafafa',
    primary: '#a855f7', // Brand Purple
    primaryForeground: '#ffffff',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#7f1d1d',
    destructiveForeground: '#fafafa',
    border: '#27272a',
    input: '#27272a',
    ring: '#71717a',
    chart1: '#3b82f6',
    chart2: '#10b981',
    chart3: '#d9903a',
    chart4: '#8B5CF6',
    chart5: '#F59E0B',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};