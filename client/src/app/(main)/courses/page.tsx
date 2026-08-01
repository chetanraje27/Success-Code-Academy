import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "NEET Prep Courses & Programs | Success Code Academy",
  description:
    "Explore our premium classroom courses and test series at Success Code Academy, Baramati. NEET Freshers, NEET Repeaters, and All India Test Series programs.",
};

import { getApiBase } from "@/lib/api";

export default async function CoursesPage() {
  const url = `${getApiBase()}/api/v1/content/courses`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // Graceful fallback if API is down
    return <CoursesClient courses={[]} />;
  }
  const data = await res.json();
  const courses = data?.data || [];

  return <CoursesClient courses={courses} />;
}
