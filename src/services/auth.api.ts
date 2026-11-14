import { api } from "@/lib/axios";
import { clearAuthToken, setAuthToken } from "@/lib/auth-token";
import type { ApiResponse, AuthResult, User } from "@/types";
import type { SigninValues, SignupValues } from "@/schemas/auth.schema";

export const signinRequest = async (values: SigninValues): Promise<User> => {
  const response = await api.post<ApiResponse<AuthResult>>(
    "/auth/signin",
    values
  );
  if (response.data.data.token) {
    setAuthToken(response.data.data.token);
  }
  return response.data.data.user;
};

export const signupRequest = async (values: SignupValues): Promise<User> => {
  const response = await api.post<ApiResponse<AuthResult>>(
    "/auth/signup",
    values
  );
  if (response.data.data.token) {
    setAuthToken(response.data.data.token);
  }
  return response.data.data.user;
};

export const meRequest = async (): Promise<User> => {
  const response = await api.get<ApiResponse<AuthResult>>("/auth/me");
  return response.data.data.user;
};

export const signoutRequest = async (): Promise<void> => {
  try {
    await api.post("/auth/signout");
  } finally {
    clearAuthToken();
  }
};
