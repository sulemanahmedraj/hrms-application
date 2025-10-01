import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import * as z from 'zod';

import favicon from '@/assets/images/favicon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from 'expo-image';

// ========================
// Validation Schema
// ========================
const ForgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

// ========================
// Component
// ========================
export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });


  return (
    <ScrollView className="flex-1 bg-gray-100 p-2">

    <View className="flex-1 bg-white px-6">
     

      {/* Logo */}
      <View className="items-center mb-8">
          <View className="flex-row items-center mb-4">
            {/* Replace the placeholder circle with the image */}
            <Image
              source={favicon}
              style={{ width: 48, height: 48, marginRight: 12 }} // 48px = 12*4
              resizeMode="contain"
            />
            <Text className="text-black text-3xl !font-bold">HRMS</Text>
          </View>
          <Text className="text-2xl font-semibold mb-1">Welcome 👋</Text>
          <Text className="text-gray-400 text-base">Please login here</Text>
        </View>
      {/* Title */}
      <View className="mb-4">
        <Text className="text-black text-2xl font-bold">Forgot Password</Text>
      </View>

      {/* Instructions */}
      <View className="mb-8">
        <Text className="text-gray-400 text-base leading-6">
          Enter your registered email address. We'll send you a code to reset your password.
        </Text>
      </View>

      {/* Email Input */}
      <View className="mb-2">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              className="border border-purple-200 rounded-lg px-4 py-4 text-base"
              placeholder="robertallen@example.com"
              placeholderTextColor="#9CA3AF"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 mt-1">{errors.email.message}</Text>
        )}
      </View>

      {/* Send OTP Button */}
      <Button
      className='mt-5'
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-lg font-semibold">Send OTP</Text>
      </Button>
    </View> 
    </ScrollView>
  );
}
