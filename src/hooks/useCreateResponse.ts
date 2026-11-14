"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import { createResponseRequest } from "@/services/response.api";
import type { SubmitSurveyPayload } from "@/types";

export function useCreateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitSurveyPayload) =>
      createResponseRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
