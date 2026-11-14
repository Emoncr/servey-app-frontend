"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionField } from "@/components/survey/QuestionField";
import { useSurvey } from "@/hooks/useSurvey";
import { useUpdateResponse } from "@/hooks/useUpdateResponse";
import {
  buildSurveyFormSchema,
  getResponseAnswers,
  toSurveyAnswers,
  type SurveyFormValues,
} from "@/schemas/survey.schema";
import type { Survey, SurveyResponse } from "@/types";

function EditResponseForm({
  survey,
  response,
  onSuccess,
}: {
  survey: Survey;
  response: SurveyResponse;
  onSuccess: () => void;
}) {
  const updateResponse = useUpdateResponse();
  const schema = useMemo(() => buildSurveyFormSchema(survey), [survey]);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(schema) as Resolver<SurveyFormValues>,
    mode: "onTouched",
    defaultValues: getResponseAnswers(response.answers, survey.sections),
  });

  const submit = form.handleSubmit((values) => {
    updateResponse.mutate(
      { id: response.id, answers: toSurveyAnswers(values) },
      { onSuccess }
    );
  });

  return (
    <Form {...form}>
      <form
        id="edit-response-form"
        onSubmit={submit}
        noValidate
        className="grid gap-5"
      >
        {survey.sections.map((section, sectionIndex) => (
          <div key={`${section.title}-${sectionIndex}`} className="grid gap-4">
            {sectionIndex > 0 ? <Separator /> : null}
            <div className="grid gap-1">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Section {sectionIndex + 1}
              </p>
              <h3 className="text-sm font-semibold">{section.title}</h3>
            </div>
            {section.questions.map((question, questionIndex) => (
              <QuestionField
                key={question.key}
                question={question}
                number={`${sectionIndex + 1}.${questionIndex + 1}`}
              />
            ))}
          </div>
        ))}
      </form>

      <DialogFooter>
        <DialogClose
          render={<Button variant="outline" />}
          disabled={updateResponse.isPending}
        >
          Cancel
        </DialogClose>
        <Button
          type="submit"
          form="edit-response-form"
          disabled={updateResponse.isPending}
        >
          {updateResponse.isPending ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </Form>
  );
}

export function ResponseEditDialog({
  response,
  open,
  onOpenChange,
}: {
  response: SurveyResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: survey, isLoading } = useSurvey(response?.surveySlug ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit response</DialogTitle>
          <DialogDescription>
            Update the answers for {response?.fullName ?? "this respondent"}.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full" />
            ))}
          </div>
        ) : survey && response ? (
          <EditResponseForm
            survey={survey}
            response={response}
            onSuccess={() => onOpenChange(false)}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            The survey definition for this response is unavailable, so it
            cannot be edited.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
