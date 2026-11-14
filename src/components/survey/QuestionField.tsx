"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioCardGroup } from "@/components/survey/RadioCardGroup";
import type { SurveyFormValues } from "@/schemas/survey.schema";
import type { SurveyQuestion } from "@/types";

const inputClassName =
  "h-11 rounded-lg border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-sky-600 focus-visible:ring-sky-600/20 aria-invalid:border-red-500 aria-invalid:ring-red-500/20";

const autoCompleteFor = (key: string): string | undefined => {
  switch (key) {
    case "fullName":
      return "name";
    case "email":
      return "email";
    case "contactNumber":
      return "tel";
    case "address":
      return "street-address";
    default:
      return undefined;
  }
};

export function QuestionField({
  question,
  number,
}: {
  question: SurveyQuestion;
  number: string;
}) {
  const form = useFormContext<SurveyFormValues>();

  return (
    <div id={`question-${question.key}`}>
      <FormField
        control={form.control}
        name={question.key}
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel
              className={cn(
                "flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm font-medium text-slate-800",
                "data-[error=true]:text-slate-800"
              )}
            >
              <span className="text-xs font-normal text-slate-400">
                {number}
              </span>
              <span>{question.label}</span>
              {question.required ? (
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              ) : (
                <span className="text-xs font-normal text-slate-400">
                  (Optional)
                </span>
              )}
            </FormLabel>

            {question.type === "text" ||
            question.type === "email" ||
            question.type === "number" ? (
              <FormControl>
                <Input
                  type={question.type}
                  inputMode={question.type === "number" ? "numeric" : undefined}
                  min={question.min}
                  max={question.max}
                  placeholder={question.placeholder}
                  autoComplete={autoCompleteFor(question.key)}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={
                    question.type === "number"
                      ? field.value ?? ""
                      : (field.value as string | undefined) ?? ""
                  }
                  onChange={(event) => {
                    if (question.type === "number") {
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value)
                      );
                      return;
                    }
                    field.onChange(event.target.value);
                  }}
                  className={inputClassName}
                  aria-required={question.required}
                />
              </FormControl>
            ) : null}

            {question.type === "textarea" ? (
              <FormControl>
                <Textarea
                  placeholder={question.placeholder}
                  autoComplete={autoCompleteFor(question.key)}
                  className={cn(
                    inputClassName,
                    "min-h-20 resize-y px-3 py-2.5"
                  )}
                  {...field}
                  value={(field.value as string | undefined) ?? ""}
                  aria-required={question.required}
                />
              </FormControl>
            ) : null}

            {question.type === "radio" ? (
              <FormControl>
                <RadioCardGroup
                  options={question.options ?? []}
                  value={
                    typeof field.value === "string" ? field.value : undefined
                  }
                  onValueChange={field.onChange}
                  idPrefix={`survey-${question.key}`}
                />
              </FormControl>
            ) : null}

            {question.type === "select" ? (
              <FormControl>
                <Select
                  value={
                    typeof field.value === "string" ? field.value : null
                  }
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className={cn(inputClassName, "w-full justify-between")}
                    aria-required={question.required}
                  >
                    <SelectValue
                      placeholder={
                        question.placeholder ?? "Select an option..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(question.options ?? []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            ) : null}

            <FormMessage className="text-xs font-medium text-red-600" />
          </FormItem>
        )}
      />
    </div>
  );
}
