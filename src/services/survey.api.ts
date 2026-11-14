import { api } from "@/lib/axios";
import type { ApiResponse, Survey } from "@/types";

export const getSurveyBySlugRequest = async (slug: string): Promise<Survey> => {
  const response = await api.get<ApiResponse<{ survey: Survey }>>(
    `/surveys/${encodeURIComponent(slug)}`
  );
  return response.data.data.survey;
};
