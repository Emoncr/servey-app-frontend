import { api } from "@/lib/axios";
import type { ApiResponse, AuthResult, User } from "@/types";
import type { SigninValues, SignupValues } from "@/schemas/auth.schema";

export const signinRequest = async (values: SigninValues): Promise<User> => {
  const response = await api.post<ApiResponse<AuthResult>>(
    "/auth/signin",
    values
  );
  return response.data.data.user;
};

export const signupRequest = async (values: SignupValues): Promise<User> => {
  const response = await api.post<ApiResponse<AuthResult>>(
    "/auth/signup",
    values
  );
  return response.data.data.user;
};

export const meRequest = async (): Promise<User> => {
  const response = await api.get<ApiResponse<AuthResult>>("/auth/me");
  return response.data.data.user;
};

export const signoutRequest = async (): Promise<void> => {
  await api.post("/auth/signout");
};
