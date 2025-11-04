"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api-handler';
import { APIs } from '@/lib/APIs';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Check, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { z } from 'zod';

// ========================
// Validation Schema
// ========================
const registerSchema = z
  .object({
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    username: z.string().nonempty("Username is required"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept Terms & Conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

// ========================
// Component
// ========================
export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const response = await apiPost(APIs.auth.register, payload);

      if (response?.success) {
        toast({
          title: "Success",
          description: response.message || "Account created successfully",
        });

        if ((response.data as any)?.intent === "OTP_SENT") {
          router.push(
            `/verify-otp?userId=${(response.data as { user: { id: string } }).user.id}` as any
          );
        } else {
          router.replace("/login");
        }
      } else {
        toast({
          title: "Error",
          description:
            response?.message || "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-2xl items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
              <UserPlus size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              HR Management Registration
            </Text>
            <Text className="text-muted-foreground text-base text-center max-w-xs">
              Create your account to access all features.
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-background rounded-2xl border-2 border-primary p-6 mb-6">

            {/* First + Last Name */}
            <View className="flex-row gap-4">
              {/* First Name */}
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <View className="flex-1 mb-6">
                    <Label className="text-foreground font-medium">
                      First Name
                    </Label>
                    <Input
                      placeholder="Enter first name"
                      value={field.value}
                      onChangeText={field.onChange}
                      editable={!loading}
                    />
                    {errors.firstName && (
                      <Text className="text-destructive text-sm mt-2">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              {/* Last Name */}
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <View className="flex-1 mb-6">
                    <Label className="text-foreground font-medium">
                      Last Name
                    </Label>
                    <Input
                      placeholder="Enter last name"
                      value={field.value}
                      onChangeText={field.onChange}
                      editable={!loading}
                    />
                    {errors.lastName && (
                      <Text className="text-destructive text-sm mt-2">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-foreground font-medium">
                    Username
                  </Label>
                  <Input
                    placeholder="Enter username"
                    value={field.value}
                    onChangeText={field.onChange}
                    editable={!loading}
                  />
                  {errors.username && (
                    <Text className="text-destructive text-sm mt-2">
                      {errors.username.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    placeholder="Enter email"
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  {errors.email && (
                    <Text className="text-destructive text-sm mt-2">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Password */}
            <View className="mb-6">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium mb-4">
                      Password
                    </Label>

                    {/* Wrapper with focus-within */}
                    <View className="relative flex-row items-center">
                      {/* 👁️ Eye icon - absolute, left center */}
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                      >
                        {showPassword ? (
                          <EyeOff size={20} color="#888" />
                        ) : (
                          <Eye size={20} color="#888" />
                        )}
                      </TouchableOpacity>

                      {/* Input with left padding for icon space */}
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                        className="h-12 border-border placeholder:text-muted-foreground bg-background text-foreground focus:border-primary focus:ring-primary/20"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-destructive text-sm mt-2">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium mb-4">
                      Confirm Password
                    </Label>

                    {/* Wrapper with focus-within */}
                    <View className="relative flex-row items-center">
                      {/* 👁️ Eye icon - absolute, left center */}
                      <TouchableOpacity
                        onPress={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                      >
                        {showConfirm ? (
                          <EyeOff size={20} color="#888" />
                        ) : (
                          <Eye size={20} color="#888" />
                        )}
                      </TouchableOpacity>

                      {/* Input with left padding for icon space */}
                      <Input
                        id="confirmPassword"
                        placeholder="Enter your confirm password"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showConfirm}
                        editable={!loading}
                        className="h-12 border-border placeholder:text-muted-foreground bg-background text-foreground focus:border-primary focus:ring-primary/20"
                      />
                    </View>
                  </View>
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-destructive text-sm mt-2">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Terms */}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <TouchableOpacity
                  className="flex-row items-center mb-8"
                  onPress={() => setValue("terms", !field.value)}
                >
                  <View
                    className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${field.value
                      ? "bg-primary border-primary"
                      : "border-border"
                      }`}
                  >
                    {field.value && <Check size={12} color="white" />}
                  </View>
                  <Text className="text-muted-foreground text-sm flex-1">
                    I agree to the{" "}
                    <Text className="text-primary font-semibold">
                      Terms & Conditions
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.terms && (
              <Text className="text-destructive text-sm mb-4">
                {errors.terms.message}
              </Text>
            )}

            {/* Register Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              size="lg"
              disabled={loading}
              className="bg-primary h-12 rounded-lg shadow-lg shadow-primary/25"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="items-center">
            <Text className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Text
                className="text-primary"
                onPress={() => router.push("/login")}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
