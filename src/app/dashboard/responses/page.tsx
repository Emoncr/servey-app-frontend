import type { Metadata } from "next";
import { ResponsesTable } from "@/components/responses/ResponsesTable";

export const metadata: Metadata = {
  title: "Responses",
};

export default function ResponsesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Responses</h2>
        <p className="text-sm text-muted-foreground">
          Search, review, edit, delete, and export every survey submission.
        </p>
      </div>
      <ResponsesTable />
    </div>
  );
}
