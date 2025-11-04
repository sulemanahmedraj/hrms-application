import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import * as z from 'zod';

// import favicon from '@/assets/images/favicon.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >         
      <View className="flex-1 px-6 py-12">
        {/* Header Section */}
        <View className="items-center mb-12">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
            <Mail size={32} color="white" />
          </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-2">Forgot Password?</Text>
            <Text className="text-muted-foreground text-base text-center max-w-sm">
            No worries! Enter your email address and we'll send you a reset code.
          </Text>
        </View>

        {/* Form Card */}
          <View className="bg-background rounded-2xl border-2 border-primary  p-6 mb-6">

          {/* Email Input */}
          <View className="mb-8">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <View className="space-y-4">
                  <Text className="text-foreground ml-4 font-medium">Email Address</Text>
                  <Input
                    placeholder="Enter your email address"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="h-12 border-border bg-background placeholder:text-muted-foreground text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </View>
              )}
            />
            {errors.email && (
                <Text className="text-destructive text-sm mt-2">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Send OTP Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
              className="bg-primary h-12 rounded-lg shadow-lg shadow-primary/25"
          >
            <Text className="text-white text-base font-semibold">Send Reset Code</Text>
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center">
            <Text className="text-muted-foreground text-sm">
            Remember your password?{" "}
            <Text
                className="text-primary font-semibold"
              onPress={() => router.back()}
            >
              Back to login
            </Text>
          </Text>
        </View>
      </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
