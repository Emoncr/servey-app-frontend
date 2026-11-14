import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuestionField } from "@/components/survey/QuestionField";
import type { SurveySection } from "@/types";

export function SurveySectionCard({
  section,
  index,
}: {
  section: SurveySection;
  index: number;
}) {
  return (
    <Card className="rounded-xl border border-slate-200 bg-white ring-0 [--card-spacing:1rem] sm:[--card-spacing:2rem]">
      <CardHeader className="gap-2.5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-600 uppercase">
          Section {index + 1}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          {section.title}
        </h2>
        <CardDescription className="text-sm text-slate-500">
          {section.description}
        </CardDescription>
        <Separator className="mt-2 bg-slate-200" />
      </CardHeader>

      <CardContent className="grid gap-6">
        {section.questions.map((question, questionIndex) => (
          <QuestionField
            key={question.key}
            question={question}
            number={`${index + 1}.${questionIndex + 1}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}
