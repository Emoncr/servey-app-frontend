import axios, { AxiosError } from "axios";
import { clearAuthToken, getAuthToken } from "./auth-token";

export interface ApiErrorPayload {
  success: false;
  message: string;
  data: unknown;
}

const rawEnvUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const normalizedUrl = (rawEnvUrl || "http://localhost:5000/api").replace(/\/$/, "");
const baseURL = normalizedUrl.endsWith("/api") ? normalizedUrl : `${normalizedUrl}/api`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/dashboard")
    ) {
      clearAuthToken();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "The request could not be completed."
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};
