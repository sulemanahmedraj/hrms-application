"use client";

// import favicon from "@/assets/images/favicon.png";
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
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { z } from 'zod';

// ========================
// Validation Schema
// ========================
const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  username: z.string().nonempty("Username is required"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().nonempty("Please confirm your password"),
  terms: z.boolean().refine(val => val === true, { message: "You must accept Terms & Conditions" }),
}).refine(data => data.password === data.confirmPassword, {
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

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const response = await apiPost(APIs.auth.register, payload);

      if (response?.success) {
        toast({ title: "Success", description: response.message || "Account created successfully" });
        if (response.data?.intent === "OTP_SENT") {
          router.push(`/verify-otp?userId=${response.data.user.id}`);
        } else {
          router.replace("/login");
        }
      } else {
        toast({ title: "Error", description: response?.message || "Failed to create account", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Unexpected error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
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
            <View className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
              <UserPlus size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-slate-800 mb-2">Create Account</Text>
            <Text className="text-slate-500 text-base text-center max-w-xs">
              Join HRMS and start managing your workforce
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 mb-6">

            {/* Name */}
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-slate-700 font-medium">Full Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={field.value}
                    onChangeText={field.onChange}
                    editable={!loading}
                    className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  {errors.name && <Text className="text-red-500 text-sm mt-2">{errors.name.message}</Text>}
                </View>
              )}
            />

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-slate-700 font-medium">Username</Label>
                  <Input
                    placeholder="Choose a username"
                    value={field.value}
                    onChangeText={field.onChange}
                    editable={!loading}
                    className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  {errors.username && <Text className="text-red-500 text-sm mt-2">{errors.username.message}</Text>}
                </View>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    placeholder="Enter your email address"
                    value={field.value}
                    onChangeText={field.onChange}
                    editable={!loading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                  {errors.email && <Text className="text-red-500 text-sm mt-2">{errors.email.message}</Text>}
                </View>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-slate-700 font-medium">Password</Label>
                  <View className="flex-row items-center border border-slate-200 rounded-lg px-3 h-12 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20">
                    <Input
                      placeholder="Create a password"
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                      className="flex-1 border-0 text-base"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                      {showPassword ? (
                        <EyeOff size={20} color="#64748b" />
                      ) : (
                        <Eye size={20} color="#64748b" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text className="text-red-500 text-sm mt-2">{errors.password.message}</Text>}
                </View>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <View className="mb-6">
                  <Label className="text-slate-700 font-medium">Confirm Password</Label>
                  <View className="flex-row items-center border border-slate-200 rounded-lg px-3 h-12 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20">
                    <Input
                      placeholder="Confirm your password"
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showConfirm}
                      editable={!loading}
                      className="flex-1 border-0 text-base"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="p-2">
                      {showConfirm ? (
                        <EyeOff size={20} color="#64748b" />
                      ) : (
                        <Eye size={20} color="#64748b" />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && <Text className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</Text>}
                </View>
              )}
            />

            {/* Terms */}
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <TouchableOpacity className="flex-row items-center mb-8" onPress={() => setValue("terms", !field.value)}>
                  <View className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${field.value ? "bg-purple-600 border-purple-600" : "border-slate-300"}`}>
                    {field.value && <Check size={12} color="white" />}
                  </View>
                  <Text className="text-slate-600 text-sm flex-1">
                    I agree to the <Text className="text-purple-600 font-semibold">Terms & Conditions</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.terms && <Text className="text-red-500 text-sm mb-4">{errors.terms.message}</Text>}

            {/* Register Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 h-12 rounded-lg shadow-lg shadow-purple-500/25"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="items-center">
            <Text className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Text
                className="text-purple-600 font-semibold"
                onPress={() => router.push("/login")}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
