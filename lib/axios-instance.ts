"use client";

import { SENSITIVE_FIELDS } from "@/lib/constant";
import axios, { InternalAxiosRequestConfig } from "axios";
import { encryptSensitiveFields } from "./encription";

// Create an instance of axios with custom configuration
export const axiosInstance = axios.create({
  // baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  baseURL: "http://localhost:4000",
  timeout: 50000,
  responseType: "json",
  withCredentials: true
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // Check if we're in browser environment
    if (typeof window === "undefined") {
      return config;
    }

    //   const rawAccessToken = localStorage.getItem("accessToken");
    const ENABLE_ENCRYPTION = process.env.EXPO_PUBLIC_ENABLE_ENCRYPTION === "true";

    //   let accessToken = rawAccessToken;

    //  if (accessToken) {
    //       // Ensure headers exist and is a plain object
    //       if (!config.headers) {
    //           config.headers = new AxiosHeaders();
    //       }
    //       console.log("AccessToken", accessToken)
    //       config.headers["Authorization"] = `Bearer ${accessToken}`;
    //   }

    if (!ENABLE_ENCRYPTION) return config; // skip encryption if disabled from env

    // Skip encryption if data is FormData
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    // Only encrypt for requests with data/body and proper methods
    if (
      config.data &&
      !isFormData &&
      config.method &&
      ["post", "put", "patch"].includes(config.method.toLowerCase())
    ) {
      config.data = encryptSensitiveFields(config.data, SENSITIVE_FIELDS);
    }

    return config;
  },
  (error) => {
    // Forward request error
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh for refresh endpoint and login endpoint
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    // Only handle 401 once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use axiosInstance directly to avoid circular dependency with api-handler
        const res = await axiosInstance.post(`/auth/refresh`);

        // Assuming the response structure matches what apiPost would return or raw axios response
        // If using axiosInstance directly, res is AxiosResponse
        const data = res.data;

        // Check for success based on API structure (assuming standard response wrapper)
        if (data && data.success === false) {
          throw new Error(data.message || "Refresh failed");
        }

        const newAccessToken = data?.data?.accessToken || data?.accessToken;

        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("accessToken", newAccessToken);
        }

        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // In React Native, window.location might not work as expected for navigation
        // Ideally use a navigation service or event emitter
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

