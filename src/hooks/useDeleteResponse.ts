"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import { deleteResponseRequest } from "@/services/response.api";

export function useDeleteResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResponseRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Response deleted successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
