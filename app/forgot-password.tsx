import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import * as z from 'zod';

// import favicon from '@/assets/images/favicon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  const onSubmit = (data: ForgotPasswordForm) => {
    // Handle forgot password logic here
    console.log('Forgot password data:', data);
  };


  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <View className="flex-1 px-6 py-12">
        {/* Header Section */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
            <Mail size={32} color="white" />
          </View>
          <Text className="text-3xl font-bold text-slate-800 mb-2">Forgot Password?</Text>
          <Text className="text-slate-500 text-base text-center max-w-sm">
            No worries! Enter your email address and we'll send you a reset code.
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-6">

          {/* Email Input */}
          <View className="mb-8">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-2">
                  <Text className="text-slate-700 font-medium">Email Address</Text>
                  <Input
                    placeholder="Enter your email address"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Send OTP Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 h-12 rounded-lg shadow-lg shadow-purple-500/25"
          >
            <Text className="text-white text-base font-semibold">Send Reset Code</Text>
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center">
          <Text className="text-slate-500 text-sm">
            Remember your password?{" "}
            <Text
              className="text-purple-600 font-semibold"
              onPress={() => router.back()}
            >
              Back to login
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
