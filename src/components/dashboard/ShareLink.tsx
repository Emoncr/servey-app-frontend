"use client";

import { useEffect, useState } from "react";
import { CopyIcon, ExternalLinkIcon, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DEMO_SURVEY_PATH } from "@/lib/constants";

export function ShareLink() {
  const [surveyUrl, setSurveyUrl] = useState("");

  useEffect(() => {
    setSurveyUrl(`${window.location.origin}${DEMO_SURVEY_PATH}`);
  }, []);

  const copyLink = async () => {
    if (!surveyUrl) return;
    try {
      await navigator.clipboard.writeText(surveyUrl);
      toast.success("Survey link copied to clipboard");
    } catch {
      toast.error("Could not copy the link. Please copy it manually.");
    }
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="size-4" />
            Public survey link
          </CardTitle>
          <CardDescription>
            Anyone with this link can open the survey on mobile or desktop and
            submit answers without signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            {surveyUrl ? (
              <Input
                readOnly
                value={surveyUrl}
                onFocus={(event) => event.target.select()}
                className="font-mono text-xs sm:text-sm"
                aria-label="Public survey link"
              />
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
            <Button
              onClick={() => void copyLink()}
              disabled={!surveyUrl}
              className="shrink-0"
            >
              <CopyIcon />
              Copy link
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={DEMO_SURVEY_PATH}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <ExternalLinkIcon />
              Open survey
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharing tips</CardTitle>
          <CardDescription>
            A few ways to get a good response rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li>
              Share the link in class groups, email lists, or student forums.
            </li>
            <li>
              Mention that it takes about two minutes and needs no account.
            </li>
            <li>
              Responses appear on the overview dashboard as soon as they are
              submitted.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
