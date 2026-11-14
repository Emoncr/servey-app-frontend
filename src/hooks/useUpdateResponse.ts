"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import { updateResponseRequest } from "@/services/response.api";

interface UpdateResponseVariables {
  id: string;
  answers: Record<string, unknown>;
}

export function useUpdateResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, answers }: UpdateResponseVariables) =>
      updateResponseRequest(id, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Response updated successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
