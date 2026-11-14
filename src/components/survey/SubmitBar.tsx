"use client";

import { Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SubmitBar({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Card className="rounded-xl border border-slate-200 bg-white px-4 py-4 ring-0 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Fields marked with <span className="font-medium text-slate-700">*</span>{" "}
          are required.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-sky-800 sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
          {isSubmitting ? "Submitting..." : "Submit Survey"}
        </Button>
      </div>
    </Card>
  );
}
