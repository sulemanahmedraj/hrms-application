import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { Text as RNText, TextInput as RNTextInput, StatusBar, TextInputProps, TextProps, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
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
  const { theme, toggleTheme, isLoaded } = useColorScheme();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded || !isLoaded) return null;

  const currentTheme = theme === 'dark' ? 'dark' : 'light';
  const themeValue = NAV_THEME[currentTheme];

  return (
    <ThemeProvider value={themeValue}>
      <View className={theme === 'dark' ? 'dark' : ''} colorScheme={theme} style={{ flex: 1 }}>
        <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} />

        <Stack
          screenOptions={{
            headerTitleStyle: { fontFamily: 'Poppins_500Medium' },
            headerRight: () => (
              <TouchableOpacity
                onPress={toggleTheme}
                style={{
                  marginRight: 15,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {theme === 'dark' ? (
                  <Sun size={18} color="#fbbf24" />
                ) : (
                  <Moon size={18} color="#6366f1" />
                )}
                <RNText
                  style={{
                    fontFamily: 'Poppins_500Medium',
                    fontSize: 14,
                    color: theme === 'dark' ? '#fbbf24' : '#6366f1',
                  }}
                >
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </RNText>
              </TouchableOpacity>
            ),
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          {/* <Stack.Screen name="login" options={{ title: 'Login' }} /> */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

        <PortalHost />
        <Toaster />
      </View>
    </ThemeProvider>
  );
}
