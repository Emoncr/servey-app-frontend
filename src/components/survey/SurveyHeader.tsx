import Link from "next/link";
import { ArrowLeftIcon, ClipboardListIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function SurveyHeader() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ClipboardListIcon className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            SmartSurvey AI
          </span>
        </div>

        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className:
              "gap-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
          })}
        >
          <ArrowLeftIcon />
          Admin Console
        </Link>
      </div>
    </header>
  );
}
