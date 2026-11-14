import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { Survey } from "@/types";

export function SurveyIntroCard({ survey }: { survey: Survey }) {
  const questionCount = survey.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  return (
    <Card className="rounded-xl border border-slate-200 bg-white ring-0 [--card-spacing:1rem] sm:[--card-spacing:2rem]">
      <CardHeader className="gap-3">
        <p className="text-xs font-medium tracking-wide text-slate-500">
          {survey.language} Survey · {survey.sections.length} Sections ·{" "}
          {questionCount} Questions
        </p>
        <h1 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl">
          {survey.title}
        </h1>
        <CardDescription className="text-base leading-relaxed text-slate-600 sm:text-lg">
          {survey.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
