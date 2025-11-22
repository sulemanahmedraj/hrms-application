import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Building2 } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Dimensions, Text, View } from 'react-native'
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

export default function SplashScreen() {
  // Animation values
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    })

    const timer = setTimeout(() => {
      router.replace('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Animated styles
  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.5, 1.1])
    const opacity = interpolate(progress.value, [0, 1], [0, 1])
    return {
      opacity,
      transform: [{ scale }],
    }
  })

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 0.6])
    const scale = interpolate(progress.value, [0, 1], [0.5, 2])
    return {
      opacity,
      transform: [{ scale }],
    }
  })

  return (
    <View className="flex-1 justify-center items-center bg-[#1C003D]">
      {/* Background gradients */}
      <LinearGradient
        colors={['#7F00FF', '#E100FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          width,
          height: height * 0.6,
          top: -height * 0.2,
          borderBottomLeftRadius: width,
          borderBottomRightRadius: width,
        }}
      />

      {/* Glow behind logo */}
      <Animated.View
        style={[
          glowStyle,
          {
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#A855F7',
          },
        ]}
      />

      {/* Logo container */}
      <Animated.View style={logoStyle} className="items-center">
        <View className="w-24 h-24 bg-white/15 rounded-3xl items-center justify-center mb-8 shadow-lg shadow-white/10">
          <Building2 size={52} color="white" />
        </View>

        {/* App title with shimmer effect */}

        <Text
          style={{
            fontSize: 48,
            fontWeight: '800',
            color: 'white',
            letterSpacing: 2,
            textShadowColor: 'rgba(255,255,255,0.25)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6,
          }}>
          HRMS
        </Text>

        <Text className="text-foreground text-base font-medium mt-1">
          Human Resource Management System
        </Text>
      </Animated.View>

      {/* Subtle footer accent */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.05)']}
        style={{
          position: 'absolute',
          bottom: 0,
          width,
          height: height * 0.3,
        }}
      />
    </View>
  )
}
