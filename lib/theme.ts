import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 99%)',          // oklch(0.9940 0 0)
    foreground: 'hsl(0 0% 0%)',           // oklch(0 0 0)
    card: 'hsl(0 0% 99%)',
    cardForeground: 'hsl(0 0% 0%)',
    popover: 'hsl(0 0% 98%)',
    popoverForeground: 'hsl(0 0% 0%)',
    primary: 'hsl(276 63% 54%)',          // oklch(0.5393 0.2713 286.7)
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(240 7% 94%)',         // oklch(0.9540 0.0063 255.4)
    secondaryForeground: 'hsl(0 0% 13%)',
    muted: 'hsl(0 0% 96%)',
    mutedForeground: 'hsl(0 0% 44%)',
    accent: 'hsl(249 20% 92%)',           // oklch(0.9393 0.0288 266.3)
    accentForeground: 'hsl(251 50% 50%)', // oklch(0.5445 0.1903 259.4)
    destructive: 'hsl(24 70% 48%)',       // oklch(0.6290 0.1902 23.0)
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(280 5% 92%)',
    input: 'hsl(0 0% 94%)',
    ring: 'hsl(0 0% 0%)',
    radius: '1.4rem',

    // Charts
    chart1: 'hsl(156 45% 63%)',
    chart2: 'hsl(276 63% 54%)',
    chart3: 'hsl(51 72% 62%)',
    chart4: 'hsl(259 54% 58%)',
    chart5: 'hsl(0 0% 54%)',
  },
  dark: {
    background: 'hsl(271 3% 22%)',        // oklch(0.2223 0.0060 271.1)
    foreground: 'hsl(0 0% 96%)',
    card: 'hsl(275 3% 25%)',
    cardForeground: 'hsl(0 0% 96%)',
    popover: 'hsl(275 3% 25%)',
    popoverForeground: 'hsl(0 0% 96%)',
    primary: 'hsl(292 55% 56%)',          // oklch(0.6132 0.2294 291.7)
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(273 5% 29%)',
    secondaryForeground: 'hsl(0 0% 96%)',
    muted: 'hsl(273 5% 29%)',
    mutedForeground: 'hsl(0 0% 71%)',
    accent: 'hsl(260 11% 28%)',
    accentForeground: 'hsl(247 56% 62%)',
    destructive: 'hsl(22 66% 54%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(268 4% 33%)',
    input: 'hsl(268 4% 33%)',
    ring: 'hsl(292 55% 56%)',
    radius: '1.4rem',

    // Charts
    chart1: 'hsl(152 54% 72%)',
    chart2: 'hsl(292 55% 56%)',
    chart3: 'hsl(20 65% 68%)',
    chart4: 'hsl(260 49% 63%)',
    chart5: 'hsl(0 0% 71%)',
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
