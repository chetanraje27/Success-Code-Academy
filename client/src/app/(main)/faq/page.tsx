import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Success Code Academy",
  description: "Answers about Success Code Academy NEET courses, batches, mentorship, study material, tests, scholarships, admissions, and results.",
};

export default function FaqPage() {
  return <FaqClient />;
}
