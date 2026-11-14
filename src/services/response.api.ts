import { api } from "@/lib/axios";
import type {
  ApiResponse,
  PaginatedResponses,
  ResponseQueryParams,
  SubmitSurveyPayload,
  SurveyResponse,
} from "@/types";

export const createResponseRequest = async (
  payload: SubmitSurveyPayload
): Promise<SurveyResponse> => {
  const response = await api.post<ApiResponse<{ response: SurveyResponse }>>(
    "/responses",
    payload
  );
  return response.data.data.response;
};

export const getResponsesRequest = async (
  params: ResponseQueryParams
): Promise<PaginatedResponses> => {
  const response = await api.get<ApiResponse<PaginatedResponses>>(
    "/responses",
    {
      params,
    }
  );
  return response.data.data;
};

export const getResponseRequest = async (
  id: string
): Promise<SurveyResponse> => {
  const response = await api.get<ApiResponse<{ response: SurveyResponse }>>(
    `/responses/${id}`
  );
  return response.data.data.response;
};

export const updateResponseRequest = async (
  id: string,
  answers: Record<string, unknown>
): Promise<SurveyResponse> => {
  const response = await api.put<ApiResponse<{ response: SurveyResponse }>>(
    `/responses/${id}`,
    { answers }
  );
  return response.data.data.response;
};

export const deleteResponseRequest = async (id: string): Promise<void> => {
  await api.delete(`/responses/${id}`);
};

export const exportResponsesCsvRequest = async (): Promise<Blob> => {
  const response = await api.get<Blob>("/responses/export/csv", {
    responseType: "blob",
  });
  return response.data;
};
