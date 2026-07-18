import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "NEET Prep Courses & Programs | Success Code Academy",
  description:
    "Explore our premium classroom courses and test series at Success Code Academy, Baramati. NEET Freshers, NEET Repeaters, and All India Test Series programs.",
};

export default function CoursesPage() {
  return <CoursesClient />;
}
