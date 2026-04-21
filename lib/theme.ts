import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/**
 * Semantic color tokens mapped from globals.css.
 * Syncing JS theme with the new OKLCH values from global.css:
 * Primary: oklch(0.55 0.14 48) -> #b45309 (Amber/Orange)
 * Background (Light): oklch(0.98 0.00 84) -> #fcfaf7
 * Background (Dark):  oklch(0.21 0.00 56) -> #1c1b19
 */
export const THEME = {
  light: {
    background: '#fcfaf7',
    foreground: '#635b4b',
    card: '#f7f4f0',
    cardForeground: '#635b4b',
    popover: '#f7f4f0',
    popoverForeground: '#635b4b',
    primary: '#b45309', // Amber 600
    primaryForeground: '#ffffff',
    secondary: '#dbd1bc',
    secondaryForeground: '#635b4b',
    muted: '#f0e9d9',
    mutedForeground: '#8c8273',
    accent: '#e6dec8',
    accentForeground: '#635b4b',
    destructive: '#991b1b',
    destructiveForeground: '#ffffff',
    border: '#e3dbca',
    input: '#e3dbca',
    ring: '#b45309',
    chart1: '#e45a2e',
    chart2: '#10b981',
    chart3: '#2d4b5e',
    chart4: '#a855f7',
    chart5: '#f59e0b',
  },
  dark: {
    background: '#1c1b19',
    foreground: '#f2f1f0',
    card: '#292724',
    cardForeground: '#f2f1f0',
    popover: '#292724',
    popoverForeground: '#f2f1f0',
    primary: '#f59e0b', // Amber 500
    primaryForeground: '#000000',
    secondary: '#635b4b',
    secondaryForeground: '#f2f1f0',
    muted: '#363430',
    mutedForeground: '#a6a095',
    accent: '#47443e',
    accentForeground: '#f2f1f0',
    destructive: '#f43f5e',
    destructiveForeground: '#ffffff',
    border: '#3d3a36',
    input: '#3d3a36',
    ring: '#f59e0b',
    chart1: '#3b82f6',
    chart2: '#10b981',
    chart3: '#facc15',
    chart4: '#a855f7',
    chart5: '#ef4444',
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