"use client";

import { API_METHODS } from "@/lib/constant";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "./axios-instance";

interface ApiHandlerOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data' | 'headers'> {
  method?: keyof typeof API_METHODS | string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  successMessage?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  meta: Record<string, any>;
  statusCode: number;
  stack?: string;
  error?: {
    statusCode: number;
    data: any;
    success: false;
    meta: Record<string, any>;
  };
}

export async function apiHandler<T = any>(
  requestURL: string,
  {
    method = API_METHODS.GET,
    params = {},
    data = {},
    headers = {},
    ...config
  }: ApiHandlerOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

    if (isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    const response: AxiosResponse = await axiosInstance({
      url: requestURL,
      method,
      params,
      data,
      headers,
      ...config,
    });


    console.log("API Response:", response);

    return {
      success: true,
      message: response?.data?.message || "Request successful",
      data: response?.data?.data,
      meta: response?.data?.meta ?? {},
      statusCode: response?.status ?? response?.data?.statusCode ?? 200,
    };
  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";
    const errData = error?.response?.data ?? {};

    return {
      success: false,
      message: errData?.message || error?.message || "An error occurred",
      data: errData?.data ?? null,
      meta: errData?.meta ?? {},
      statusCode: error?.response?.status || errData?.statusCode || 500,
    };
  }
}


export const apiGet = <T>(url: string, params?: Record<string, any>, config?: Omit<ApiHandlerOptions, 'method' | 'params' | 'data'>) =>
  apiHandler<T>(url, { method: API_METHODS.GET, params, ...config });

export const apiPost = <T>(url: string, data?: any, config?: Omit<ApiHandlerOptions, 'method' | 'params' | 'data'>) => {
  console.log({ url, data, config })
  return apiHandler<T>(url, { method: API_METHODS.POST, data, ...config });
}

export const apiPatch = <T>(url: string, data?: any, config?: Omit<ApiHandlerOptions, 'method' | 'params' | 'data'>) =>
  apiHandler<T>(url, { method: API_METHODS.PATCH, data, ...config });

export const apiPut = <T>(url: string, data?: any, config?: Omit<ApiHandlerOptions, 'method' | 'params' | 'data'>) =>
  apiHandler<T>(url, { method: API_METHODS.PUT, data, ...config });

export const apiDelete = <T>(url: string, params?: Record<string, any>, config?: Omit<ApiHandlerOptions, 'method' | 'params' | 'data'>) =>
  apiHandler<T>(url, { method: API_METHODS.DELETE, params, ...config });