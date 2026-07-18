import type { Metadata } from "next";
import ResultsClient from "./ResultsClient";

export const metadata: Metadata = {
  title: "Academic Results & Toppers | Success Code Academy",
  description:
    "Explore the stellar achievements, scorecards, and success stories of Success Code Academy students in NEET UG 2024 and 2025. Celebrating our future doctors.",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
