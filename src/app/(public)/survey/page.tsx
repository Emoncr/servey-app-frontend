import { redirect } from "next/navigation";
import { DEMO_SURVEY_PATH } from "@/lib/constants";

export default function LegacySurveyPage() {
  redirect(DEMO_SURVEY_PATH);
}
