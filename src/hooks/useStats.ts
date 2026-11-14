"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatsRequest } from "@/services/stats.api";
import type { Stats } from "@/types";

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: getStatsRequest,
    staleTime: 15_000,
  });
}
