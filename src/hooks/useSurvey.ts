"use client";

import { useQuery } from "@tanstack/react-query";
import { getSurveyBySlugRequest } from "@/services/survey.api";
import type { Survey } from "@/types";

export const surveyQueryKey = (slug: string) => ["surveys", slug] as const;

export function useSurvey(slug: string) {
  return useQuery<Survey>({
    queryKey: surveyQueryKey(slug),
    queryFn: () => getSurveyBySlugRequest(slug),
    enabled: Boolean(slug),
    retry: false,
    staleTime: 5 * 60_000,
  });
}
