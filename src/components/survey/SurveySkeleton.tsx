import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const cardClassName =
  "rounded-xl border border-slate-200 bg-white ring-0 [--card-spacing:1rem] sm:[--card-spacing:2rem]";

export function SurveySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
      <Card className={cardClassName}>
        <CardHeader className="gap-3">
          <Skeleton className="h-3 w-52 bg-slate-200" />
          <Skeleton className="h-10 w-full max-w-xl bg-slate-200" />
          <Skeleton className="h-5 w-full max-w-2xl bg-slate-200" />
        </CardHeader>
      </Card>

      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <Card key={sectionIndex} className={cardClassName}>
          <CardHeader className="gap-2.5">
            <Skeleton className="h-3 w-20 bg-slate-200" />
            <Skeleton className="h-6 w-64 bg-slate-200" />
            <Skeleton className="h-4 w-80 bg-slate-200" />
            <Skeleton className="mt-2 h-px w-full bg-slate-200" />
          </CardHeader>
          <CardContent className="grid gap-6">
            {Array.from({ length: 4 }).map((_, questionIndex) => (
              <div key={questionIndex} className="grid gap-2">
                <Skeleton className="h-4 w-44 bg-slate-200" />
                <Skeleton className="h-11 w-full bg-slate-200" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
