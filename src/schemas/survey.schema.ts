import { z } from "zod";
import type {
  Survey,
  SurveyAnswer,
  SurveyQuestion,
  SurveySection,
} from "@/types";

export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export const EDUCATION_LEVELS = [
  "SSC / Secondary",
  "HSC / Higher Secondary",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
] as const;

export type SurveyFormValues = Record<string, string | number | undefined>;

export interface FlatSurveyQuestion {
  question: SurveyQuestion;
  number: string;
  sectionIndex: number;
  sectionTitle: string;
}

const isBlank = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

const normalizePhone = (value: string): string =>
  value.replace(/[\s()-]/g, "");

const buildQuestionSchema = (question: SurveyQuestion): z.ZodTypeAny => {
  if (question.type === "number") {
    const numberSchema = z
      .number({ error: `${question.label} is required` })
      .int(`${question.label} must be a whole number`);

    const bounded =
      question.min !== undefined && question.max !== undefined
        ? numberSchema
            .min(question.min, `${question.label} must be at least ${question.min}`)
            .max(question.max, `${question.label} must be at most ${question.max}`)
        : question.min !== undefined
          ? numberSchema.min(
              question.min,
              `${question.label} must be at least ${question.min}`
            )
          : question.max !== undefined
            ? numberSchema.max(
                question.max,
                `${question.label} must be at most ${question.max}`
              )
            : numberSchema;

    return z.preprocess((value) => {
      if (isBlank(value)) return undefined;
      return typeof value === "number" ? value : Number(value);
    }, question.required ? bounded : bounded.optional());
  }

  if (question.type === "radio" || question.type === "select") {
    const values = (question.options ?? []) as [string, ...string[]];
    const enumSchema = z.enum(values, {
      error: `${question.label} is required`,
    });

    if (question.required) return enumSchema;

    return z.preprocess(
      (value) => (isBlank(value) ? undefined : value),
      enumSchema.optional()
    );
  }

  if (question.format === "bd-phone") {
    const phoneSchema = z
      .string()
      .trim()
      .min(1, `${question.label} is required`)
      .refine(
        (value) =>
          value.length === 0 || BD_PHONE_REGEX.test(value),
        "Enter a valid Bangladeshi phone number (e.g. +8801712345678)"
      );

    return z.preprocess((value) => {
      if (question.required) {
        if (typeof value !== "string") return "";
        return normalizePhone(value);
      }
      if (typeof value !== "string") return undefined;
      const normalized = normalizePhone(value);
      return normalized === "" ? undefined : normalized;
    }, question.required ? phoneSchema : phoneSchema.optional());
  }

  let stringSchema = z.string({
    error: `${question.label} is required`,
  }).trim();

  if (question.type === "email") {
    stringSchema = stringSchema
      .min(1, `${question.label} is required`)
      .refine(
        (value) =>
          value.length === 0 ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        "Enter a valid email address"
      );
  } else if (question.required) {
    const minimum = question.minLength;
    stringSchema = stringSchema.superRefine((value, ctx) => {
      if (value.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: `${question.label} is required`,
        });
      } else if (minimum !== undefined && value.length < minimum) {
        ctx.addIssue({
          code: "custom",
          message: `${question.label} must be at least ${minimum} characters`,
        });
      }
    });
  } else if (question.minLength !== undefined) {
    stringSchema = stringSchema.min(
      question.minLength,
      `${question.label} must be at least ${question.minLength} characters`
    );
  }

  if (question.maxLength !== undefined) {
    stringSchema = stringSchema.max(
      question.maxLength,
      `${question.label} must be at most ${question.maxLength} characters`
    );
  }

  if (question.required) return stringSchema;

  return z.preprocess(
    (value) => (isBlank(value) ? undefined : value),
    stringSchema.optional()
  );
};

export const buildSurveyFormSchema = (survey: Survey) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const section of survey.sections) {
    for (const question of section.questions) {
      shape[question.key] = buildQuestionSchema(question);
    }
  }

  return z.object(shape);
};

export const getSurveyQuestions = (survey: Survey): FlatSurveyQuestion[] =>
  survey.sections.flatMap((section, sectionIndex) =>
    section.questions.map((question, questionIndex) => ({
      question,
      number: `${sectionIndex + 1}.${questionIndex + 1}`,
      sectionIndex,
      sectionTitle: section.title,
    }))
  );

export const getDefaultSurveyValues = (survey: Survey): SurveyFormValues => {
  const values: SurveyFormValues = {};

  for (const section of survey.sections) {
    for (const question of section.questions) {
      if (question.type === "number") {
        values[question.key] = undefined;
      } else if (question.type === "radio" || question.type === "select") {
        values[question.key] = undefined;
      } else {
        values[question.key] = "";
      }
    }
  }

  return values;
};

export const getResponseAnswers = (
  responseAnswers: Record<string, unknown> | undefined,
  sections: SurveySection[]
): SurveyFormValues => {
  const values: SurveyFormValues = {};

  for (const section of sections) {
    for (const question of section.questions) {
      const raw = responseAnswers?.[question.key];

      if (question.type === "number") {
        values[question.key] =
          typeof raw === "number" || typeof raw === "string"
            ? raw === ""
              ? undefined
              : Number(raw)
            : undefined;
      } else if (
        question.type === "radio" ||
        question.type === "select"
      ) {
        values[question.key] =
          typeof raw === "string" && raw !== "" ? raw : undefined;
      } else {
        values[question.key] = typeof raw === "string" ? raw : "";
      }
    }
  }

  return values;
};

export const toSurveyAnswers = (values: SurveyFormValues): Record<string, SurveyAnswer> => {
  const answers: Record<string, SurveyAnswer> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    answers[key] = typeof value === "string" ? value.trim() : value;
  }

  return answers;
};

export const formatSurveyAnswer = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "Not provided";
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not provided";
  }
  return String(value);
};
