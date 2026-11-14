"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import {
  exportResponsesCsvRequest,
  getResponseRequest,
  getResponsesRequest,
} from "@/services/response.api";
import type { PaginatedResponses, ResponseQueryParams } from "@/types";

export function useResponses(params: ResponseQueryParams) {
  return useQuery<PaginatedResponses>({
    queryKey: ["responses", params],
    queryFn: () => getResponsesRequest(params),
    placeholderData: keepPreviousData,
  });
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export function useExportCsv() {
  return useMutation({
    mutationFn: exportResponsesCsvRequest,
    onSuccess: (blob) => {
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `survey-responses-${date}.csv`);
      toast.success("CSV exported successfully");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useResponse(id: string | null) {
  return useQuery({
    queryKey: ["responses", "detail", id],
    enabled: Boolean(id),
    queryFn: () => getResponseRequest(id as string),
  });
}
