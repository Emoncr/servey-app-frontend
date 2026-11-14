"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { toast } from "sonner";
import { RefreshCwIcon } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitBar } from "@/components/survey/SubmitBar";
import { SurveyFooter } from "@/components/survey/SurveyFooter";
import { SurveyHeader } from "@/components/survey/SurveyHeader";
import { SurveyIntroCard } from "@/components/survey/SurveyIntroCard";
import { SurveySectionCard } from "@/components/survey/SurveySectionCard";
import { SurveySkeleton } from "@/components/survey/SurveySkeleton";
import { ThankYouScreen } from "@/components/survey/ThankYouScreen";
import { useCreateResponse } from "@/hooks/useCreateResponse";
import { useSurvey } from "@/hooks/useSurvey";
import {
  buildSurveyFormSchema,
  getDefaultSurveyValues,
  getSurveyQuestions,
  toSurveyAnswers,
  type SurveyFormValues,
} from "@/schemas/survey.schema";

const emptySchema = z.object({});

export function PublicSurvey({ slug }: { slug: string }) {
  const { data: survey, isLoading, isError, refetch, isFetching } =
    useSurvey(slug);
  const createResponse = useCreateResponse();
  const [submitted, setSubmitted] = useState(false);

  const schema = useMemo(
    () => (survey ? buildSurveyFormSchema(survey) : emptySchema),
    [survey]
  );

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SurveyFormValues>,
    mode: "onTouched",
    defaultValues: {},
  });

  useEffect(() => {
    if (survey) {
      form.reset(getDefaultSurveyValues(survey));
    }
  }, [survey, form]);

  const questions = useMemo(
    () => (survey ? getSurveyQuestions(survey) : []),
    [survey]
  );

  const onInvalid = (errors: FieldErrors<SurveyFormValues>) => {
    const first = questions.find(({ question }) => errors[question.key]);
    if (!first) return;

    const container = document.getElementById(
      `question-${first.question.key}`
    );

    container?.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      const focusable = container?.querySelector<HTMLElement>(
        'input:not([type="hidden"]), textarea, button'
      );
      focusable?.focus({ preventScroll: true });
    }, 250);
  };

  const submit = form.handleSubmit(async (values) => {
    if (!survey) return;

    try {
      await createResponse.mutateAsync({
        surveySlug: survey.slug,
        answers: toSurveyAnswers(values),
      });
      toast.success("Survey submitted successfully");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // The mutation hook displays the API error toast.
    }
  }, onInvalid);

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 font-sans text-slate-900">
      <SurveyHeader />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
        {isLoading ? <SurveySkeleton /> : null}

        {isError ? (
          <Card className="rounded-xl border border-slate-200 bg-white ring-0 [--card-spacing:2rem]">
            <CardHeader className="gap-2">
              <CardTitle className="text-xl font-semibold text-slate-900">
                This survey is unavailable
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                The link may be incorrect or the survey is no longer accepting
                responses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => void refetch()}
                disabled={isFetching}
                className="border-slate-300"
              >
                <RefreshCwIcon
                  className={isFetching ? "animate-spin" : undefined}
                />
                {isFetching ? "Retrying..." : "Try again"}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError && survey ? (
          submitted ? (
            <ThankYouScreen />
          ) : (
            <Form {...form}>
              <form
                onSubmit={submit}
                noValidate
                className="flex flex-col gap-6"
              >
                <SurveyIntroCard survey={survey} />

                {survey.sections.map((section, index) => (
                  <SurveySectionCard
                    key={`${section.title}-${index}`}
                    section={section}
                    index={index}
                  />
                ))}

                <SubmitBar isSubmitting={createResponse.isPending} />
              </form>
            </Form>
          )
        ) : null}
      </main>

      <SurveyFooter />
    </div>
  );
}
