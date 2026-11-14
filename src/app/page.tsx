import { redirect } from "next/navigation";
import { DEMO_SURVEY_PATH } from "@/lib/constants";

export default function HomePage() {
  redirect(DEMO_SURVEY_PATH);
}
