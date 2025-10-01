import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export function useColorScheme() {
  const systemColorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>((systemColorScheme as 'light' | 'dark') || 'light');

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme((colorScheme as 'light' | 'dark') || 'light');
    });
    return () => listener.remove();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
