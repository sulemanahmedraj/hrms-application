/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useColorScheme();
  const currentTheme = theme ?? 'light';
  const colorFromProps = props[currentTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[currentTheme][colorName];
  }
}


// import { useState, useEffect, useCallback } from 'react';
// import { Appearance, ColorSchemeName } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEY = '@app-color-scheme';

// export const useColorScheme = () => {
//   const [theme, setTheme] = useState<ColorSchemeName>('light');

//   // Load theme from storage or system preference
//   useEffect(() => {
//     const loadTheme = async () => {
//       const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
//       if (storedTheme === 'dark' || storedTheme === 'light') {
//         setTheme(storedTheme);
//       } else {
//         const systemTheme = Appearance.getColorScheme() || 'light';
//         setTheme(systemTheme);
//       }
//     };
//     loadTheme();
//   }, []);

//   // Toggle theme function
//   const toggleTheme = useCallback(async () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     await AsyncStorage.setItem(STORAGE_KEY, newTheme);
//   }, [theme]);

//   return { theme, toggleTheme };
// };
