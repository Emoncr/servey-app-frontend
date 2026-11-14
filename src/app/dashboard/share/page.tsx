import type { Metadata } from "next";
import { ShareLink } from "@/components/dashboard/ShareLink";

export const metadata: Metadata = {
  title: "Share survey",
};

export default function SharePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Share survey</h2>
        <p className="text-sm text-muted-foreground">
          Send the public link to students. No login is required to respond.
        </p>
      </div>
      <ShareLink />
    </div>
  );
}
