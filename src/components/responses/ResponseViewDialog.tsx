"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSurvey } from "@/hooks/useSurvey";
import { formatDateTime } from "@/lib/utils";
import { formatSurveyAnswer } from "@/schemas/survey.schema";
import type { SurveyResponse } from "@/types";

const fallbackKeys: Record<string, keyof SurveyResponse> = {
  fullName: "fullName",
  age: "age",
  gender: "gender",
  address: "address",
  educationLevel: "educationLevel",
  university: "university",
  department: "department",
  currentStatus: "currentStatus",
  email: "email",
  contactNumber: "phone",
  occupation: "occupation",
  comments: "additionalComments",
};

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm break-words">{value}</span>
    </div>
  );
}

export function ResponseViewDialog({
  response,
  open,
  onOpenChange,
}: {
  response: SurveyResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: survey, isLoading } = useSurvey(response?.surveySlug ?? "");

  if (!response) return null;

  const answerFor = (key: string): unknown => {
    const direct = response.answers?.[key];
    if (direct !== undefined && direct !== null && direct !== "") {
      return direct;
    }

    const fallbackKey = fallbackKeys[key];
    return fallbackKey ? response[fallbackKey] : undefined;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{response.fullName}</DialogTitle>
          <DialogDescription>
            Submitted on {formatDateTime(response.createdAt)}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : survey ? (
          <div className="grid gap-5">
            {survey.sections.map((section, index) => (
              <div key={`${section.title}-${index}`} className="grid gap-3">
                {index > 0 ? <Separator /> : null}
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {section.title}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.questions.map((question) => (
                    <Detail
                      key={question.key}
                      label={question.label}
                      value={formatSurveyAnswer(answerFor(question.key))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Age" value={`${response.age} years`} />
            <Detail label="Gender" value={response.gender || "-"} />
            <Detail label="Email" value={response.email || "-"} />
            <Detail label="Phone" value={response.phone || "-"} />
            <Detail label="Address" value={response.address || "-"} />
            <Detail label="Education level" value={response.educationLevel || "-"} />
            <Detail label="University or institute" value={response.university || "-"} />
            <Detail label="Department" value={response.department || "-"} />
            <Detail label="Current status" value={response.currentStatus || "-"} />
            <Detail label="Occupation" value={response.occupation || "-"} />
            <Detail
              label="Additional comments"
              value={response.additionalComments || "-"}
            />
          </div>
        )}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
