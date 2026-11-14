import { api } from "@/lib/axios";
import type { ApiResponse, Stats } from "@/types";

export const getStatsRequest = async (): Promise<Stats> => {
  const response = await api.get<ApiResponse<Stats>>("/stats");
  return response.data.data;
};
