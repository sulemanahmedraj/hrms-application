"use client";

import favicon from "@/assets/images/favicon.png";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { apiPost } from '@/lib/api-handler';
import { APIs } from '@/lib/APIs';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

  // ========================
  // Submit handler
  // ========================
  const onSubmit = async (data: RegisterData) => {
    console.log("data", data);
    setLoading(true);
    try {
      // Send registration request
      const { confirmPassword, ...payload } = data; // exclude confirmPassword
      const response = await apiPost(APIs.auth.register, payload);

      if (response?.success) {
        toast({ title: "Success", description: response.message || "Account created successfully" });

        // If OTP flow
        if (response.data?.intent === "OTP_SENT") {
          router.push(`/verify-otp?userId=${response.data.user.id}`);
        } else {
          router.replace("/login"); // navigate to login
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
    <ScrollView className="flex-1 bg-gray-100 p-2">
      <View className="flex-1 bg-white px-6 py-8 rounded-xl shadow-md">
        {/* Header */}
        <View className="items-center mb-6">
        <View className="flex-row items-center mb-4">
    {/* Replace the placeholder circle with the image */}
    <Image
      source={favicon}
      style={{ width: 48, height: 48, marginRight: 12 }} // 48px = 12*4
      resizeMode="contain"
    />
    <Text className="text-black text-3xl font-bold">HRMS</Text>
  </View>

          <Text className="text-xl font-bold text-black mt-2">HR Management System Registration</Text>
          <Text className="text-gray-500 mt-1">Create your account to access features.</Text>
        </View>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <View className="mb-4">
              <Label>Name</Label>
              <Input placeholder="Enter Your Name" value={field.value} onChangeText={field.onChange} editable={!loading} />
              {errors.name && <Text className="text-red-500 text-sm">{errors.name.message}</Text>}
            </View>
          )}
        />

        {/* Username */}
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <View className="mb-4">
              <Label>Username</Label>
              <Input placeholder="Enter Your Username" value={field.value} onChangeText={field.onChange} editable={!loading} />
              {errors.username && <Text className="text-red-500 text-sm">{errors.username.message}</Text>}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <View className="mb-4">
              <Label>Email</Label>
              <Input placeholder="Enter Your Email" value={field.value} onChangeText={field.onChange} editable={!loading} keyboardType="email-address" autoCapitalize="none" />
              {errors.email && <Text className="text-red-500 text-sm">{errors.email.message}</Text>}
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View className="mb-4 relative">
              <Label>Password</Label>
              <Input placeholder="Password" secureTextEntry={!showPassword} value={field.value} onChangeText={field.onChange} editable={!loading} className="pr-12" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-2">
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {errors.password && <Text className="text-red-500 text-sm">{errors.password.message}</Text>}
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <View className="mb-4 relative">
              <Label>Confirm Password</Label>
              <Input placeholder="Retype Password" secureTextEntry={!showConfirm} value={field.value} onChangeText={field.onChange} editable={!loading} className="pr-12" />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} className="absolute right-4 bottom-2">
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
              {errors.confirmPassword && <Text className="text-red-500 text-sm">{errors.confirmPassword.message}</Text>}
            </View>
          )}
        />

        {/* Terms */}
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <TouchableOpacity className="flex-row items-center mb-6" onPress={() => setValue("terms", !field.value)}>
              <View className={`w-5 h-5 border rounded mr-2 items-center justify-center ${field.value ? "bg-primary border-primary" : "border-gray-300"}`}>
                {field.value && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text>I agree to the <Text className="text-primary font-semibold">Terms & Conditions</Text></Text>
            </TouchableOpacity>
          )}
        />
        {errors.terms && <Text className="text-red-500 text-sm mb-4">{errors.terms.message}</Text>}

        {/* Register Button */}
        <Button onPress={handleSubmit(onSubmit)} size="lg" disabled={loading}>
          <Text className="text-white text-lg font-semibold">{loading ? "Creating Account..." : "Create Account"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
