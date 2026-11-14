export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type Role = "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResult {
  user: User;
}

export const QUESTION_TYPES = [
  "text",
  "number",
  "email",
  "textarea",
  "radio",
  "select",
] as const;

export type SurveyQuestionType = (typeof QUESTION_TYPES)[number];

export interface SurveyQuestion {
  key: string;
  label: string;
  type: SurveyQuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  format?: "bd-phone";
}

export interface SurveySection {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface Survey {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  sections: SurveySection[];
  createdAt?: string;
  updatedAt?: string;
}

export type SurveyAnswer = string | number | string[] | undefined;
export type SurveyAnswers = Record<string, SurveyAnswer>;

export interface SubmitSurveyPayload {
  surveySlug: string;
  answers: SurveyAnswers;
}

export type EducationLevel = string;

export interface SurveyResponse {
  id: string;
  surveySlug: string;
  answers: Record<string, unknown>;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
  educationLevel: EducationLevel;
  university: string;
  department: string;
  semester: string;
  currentStatus: string;
  email: string;
  occupation?: string;
  additionalComments?: string;
  skillLevel?: string;
  interestedFields: string[];
  aiUsage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponses {
  items: SurveyResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ResponseSort =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "age-asc"
  | "age-desc";

export interface ResponseQueryParams {
  page: number;
  limit: number;
  search?: string;
  educationLevel?: EducationLevel;
  sort?: ResponseSort;
}

export interface ChartPoint {
  name: string;
  count: number;
}

export interface TrendPoint {
  date: string;
  count: number;
}

export interface Stats {
  totalResponses: number;
  averageAge: number;
  responsesToday: number;
  topUniversity: string;
  educationLevel: ChartPoint[];
  gender: ChartPoint[];
  skillLevel: ChartPoint[];
  submissionsPerDay: TrendPoint[];
  interestedFields: ChartPoint[];
}
