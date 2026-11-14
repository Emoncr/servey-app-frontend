import type { Metadata } from "next";
import { PublicSurvey } from "@/components/survey/PublicSurvey";

export const metadata: Metadata = {
  title: "Participant survey",
  description:
    "Share your personal, educational, and contact details in a short survey.",
};

export default async function ShareableSurveyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PublicSurvey slug={slug} />;
}
