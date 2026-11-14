"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import {
  meRequest,
  signinRequest,
  signoutRequest,
  signupRequest,
} from "@/services/auth.api";
import type { SigninValues, SignupValues } from "@/schemas/auth.schema";
import type { User } from "@/types";

export const authQueryKey = ["auth", "me"] as const;

export function useMe() {
  return useQuery<User>({
    queryKey: authQueryKey,
    queryFn: meRequest,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useSignin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: SigninValues) => signinRequest(values),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
      toast.success("Signed in successfully");
      router.replace("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: SignupValues) => signupRequest(values),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKey, user);
      toast.success("Account created successfully");
      router.replace("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useSignout() {
  const router = useRouter();

  return useMutation({
    mutationFn: signoutRequest,
    onSuccess: () => {
      toast.success("Signed out successfully");
      router.replace("/signin");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
