import { CircleCheckIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ThankYouScreen() {
  return (
    <Card className="rounded-xl border border-slate-200 bg-white text-center ring-0 [--card-spacing:2rem]">
      <CardHeader className="justify-items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheckIcon className="size-7" />
        </span>
        <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
          Thank you
        </CardTitle>
        <CardDescription className="max-w-md text-base text-slate-600">
          Thank you, your response has been submitted.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
