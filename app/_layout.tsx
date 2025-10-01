import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import React from 'react';
import { Text as RNText, TextInput as RNTextInput, StatusBar, TextInputProps, TextProps } from 'react-native';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

import { Toaster } from '@/components/ui/toaster';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';

// ===============================
// ✅ Wrap Text/TextInput globally
// ===============================
export const Text: React.FC<TextProps> = (props) => (
  <RNText
    {...props}
    allowFontScaling={false}
    style={[{ fontFamily: 'Poppins_400Regular' }, props.style]}
  />
);

export const TextInput: React.FC<TextInputProps> = (props) => (
  <RNTextInput
    {...props}
    allowFontScaling={false}
    style={[{ fontFamily: 'Poppins_400Regular' }, props.style]}
  />
);

// ===============================
// RootLayout Component
// ===============================
export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function RootLayout() {
  const { theme, toggleTheme } = useColorScheme();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const currentTheme = theme === 'dark' ? 'dark' : 'light';
  const themeValue = NAV_THEME[currentTheme];

  return (
    <ThemeProvider value={themeValue}>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerTitleStyle: { fontFamily: 'Poppins_500Medium' },
          headerRight: () => (
            <RNText
              onPress={toggleTheme}
              style={{
                marginRight: 15,
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
              }}
            >
              {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
            </RNText>
          ),
        }}
      >
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <PortalHost />
      <Toaster />
    </ThemeProvider>
  );
}
