import { router } from 'expo-router';
import { Building2 } from 'lucide-react-native';
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
    <View className="flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 justify-center items-center relative">
      {/* Decorative circles */}
      <Animated.View
        style={circleTopStyle}
        className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"
      />
      <Animated.View
        style={circleBottomStyle}
        className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"
      />

      {/* Additional decorative elements */}
      <View className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full" />
      <View className="absolute bottom-32 left-16 w-12 h-12 bg-white/5 rounded-full" />

      {/* Logo */}
      <Animated.View style={logoStyle} className="items-center">
        <View className="w-24 h-24 bg-white/20 rounded-3xl items-center justify-center mb-8 shadow-2xl shadow-white/10">
          <Building2 size={48} color="white" />
        </View>
        <Text className="text-white text-5xl font-bold mb-2">HRMS</Text>
        <Text className="text-white/80 text-lg font-medium">Human Resource Management System</Text>
      </Animated.View>
    </View>
  );
}
