import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SplashScreen() {
  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const circleTopScale = useSharedValue(0);
  const circleBottomScale = useSharedValue(0);

  // Animate on mount
  useEffect(() => {
    // Fade-in & scale logo
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });

    // Decorative circles
    circleTopScale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });
    circleBottomScale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.exp) });

    // Navigate to login after 3s
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const circleTopStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleTopScale.value }],
  }));

  const circleBottomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleBottomScale.value }],
  }));

  return (
    <View className="flex-1 bg-purple-600 justify-center items-center relative">
      {/* Decorative circles */}
      <Animated.View
        style={circleTopStyle}
        className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full -translate-x-16 -translate-y-16"
      />
      <Animated.View
        style={circleBottomStyle}
        className="absolute bottom-0 right-0 w-40 h-40 bg-white/20 rounded-full translate-x-20 translate-y-20"
      />

      {/* Logo */}
      <Animated.View style={logoStyle} className="items-center">
        <View className="flex-row items-center mb-4">
          {/* Infinity symbol logo */}
          <View className="w-12 h-12 border-4 border-white rounded-full items-center justify-center mr-3">
            <View className="w-6 h-6 border-2 border-white rounded-full" />
          </View>
          <Text className="text-white text-4xl font-bold">HRMS</Text>
        </View>
      </Animated.View>
    </View>
  );
}
