"use client";

import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";

import favicon from "@/assets/images/favicon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast"; // your custom toast
import { apiPost } from "@/lib/api-handler"; // your axios wrapper
import { Image } from "expo-image";

// ========================
// Validation schema
// ========================
const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

const saveToken = async (token: string) => {
  // if (Platform.OS === "web") {
  localStorage.setItem("accessToken", token);
  // } else {
  //   await SecureStore.setItemAsync("accessToken", token);
  // }
};



// ========================
// Component
// ========================
export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const response = await apiPost("/auth/login", {
        email: data.email,
        password: data.password,
        rememberMe,
      });

      if (!response?.success) {
        toast({
          title: "Error",
          description: response?.message || "Login failed",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: response?.message || "Logged in successfully",
      });

      const accessToken = (response.data as any)?.accessToken; //NOTE - It should be removed in future.
      if (accessToken) {
        // Store securely
        await saveToken(accessToken);
      }

      // Navigate to app
      router.replace("/(tabs)");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-2">
      <View className="flex-1 bg-white px-6 py-8 rounded-xl shadow-md">
        {/* Logo & Welcome */}
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

        {/* Email input */}
        <View className="mb-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password input */}
        <View className="mb-4 relative">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  className="pr-12"
                />
                <TouchableOpacity
                  className="absolute right-4 bottom-2"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Remember Me & Forgot */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`w-5 h-5 border-2 rounded mr-2 items-center justify-center ${rememberMe ? "bg-primary border-primary" : "border-gray-300"
                }`}
            >
              {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
            </View>
            <Text className="text-black text-base">Remember Me</Text>
          </TouchableOpacity>

          <Button variant={"link"} className="text-primary/80 text-base hover:text-primary" onPress={() => router.push("/forgot-password")}>
            
              Forgot Password?
            </Button>
        </View>

        {/* Login Button */}
        <Button onPress={handleSubmit(onSubmit)} size="lg" disabled={loading}>
          <Text className="text-white text-lg font-semibold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </Button>

        {/* Optional footer */}
        <View className="mt-4 text-center">
          <Text className="text-gray-500 text-sm">
            Not registered yet?{" "}
            <Text
              className="text-primary font-semibold"
              onPress={() => router.push("/register")}
            >
              Create an Account
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
