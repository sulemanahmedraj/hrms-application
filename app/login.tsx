"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Check, Eye, EyeOff, LogIn } from "lucide-react-native";
// import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { z } from "zod";

// import favicon from "@/assets/images/favicon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { toast } from "@/hooks/use-toast"; // your custom toast
import { apiPost } from "@/lib/api-handler"; // your axios wrapper
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
              <LogIn size={32} color="white" />
            </View>
            <Text className="text-3xl text-foreground text-center mb-2">Welcome Back</Text>
            <Text className="text-muted-foreground text-base text-center max-w-xs">
              Sign in to your HRMS account to continue
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-card rounded-2xl border-2 border-primary p-6 mb-6">

            {/* Email input */}
            <View className="mb-6">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium mb-2 ml-1">Email Address</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                      className="h-12 border-border placeholder:text-muted-foreground bg-background text-foreground focus:border-primary focus:ring-primary/20"
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

            {/* Password input */}
            <View className="mb-6">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium mb-2 ml-1">
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



            {/* Remember Me & Forgot */}
            <View className="flex-row justify-between items-center mb-8">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${rememberMe ? "bg-purple-600 border-purple-600" : "border-slate-300"
                    }`}
                >
                  {rememberMe && <Check size={12} color="white" />}
                </View>
                <Text className="text-muted-foreground text-sm font-medium">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                <Text className="text-primary text-sm font-medium">Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              size="lg"
              disabled={loading}
              className="bg-primary h-12 rounded-lg shadow-lg shadow-primary/25"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Button>
          </View>

          {/* Footer */}
          <View className="items-center">
            <Text className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Text
                className="text-primary font-semibold"
                onPress={() => router.push("/register")}
              >
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
