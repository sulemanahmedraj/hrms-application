import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

const STORAGE_KEY = '@app-color-scheme';

export function useColorScheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from storage or system preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setTheme(storedTheme);
        } else {
          // First time: use system preference
          const systemColorScheme = Appearance.getColorScheme();
          const initialTheme = (systemColorScheme as 'light' | 'dark') || 'light';
          setTheme(initialTheme);
          await AsyncStorage.setItem(STORAGE_KEY, initialTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        const systemColorScheme = Appearance.getColorScheme();
        setTheme((systemColorScheme as 'light' | 'dark') || 'light');
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [theme]);

  return { theme, toggleTheme, isLoaded };
}
