import type { Metadata } from "next";
import AdmissionsClient from "./AdmissionsClient";
import { getApiBase } from "@/lib/api";

export const metadata: Metadata = {
  title: "NEET Scholarship Test & Merit Concessions 2026-27 | Success Code Academy",
  description:
    "Apply for the Success Code Scholarship Test (SCST) to unlock up to 100% tuition fee waivers. Check merit scholarship slabs, direct board concessions, and register online.",
};

export default async function AdmissionsPage() {
  const base = getApiBase();

  async function fetchJson(url: string) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return data?.data || [];
      }
    } catch (error) {
      console.error("Fetch failed:", url, error);
    }
    return [];
  }

  const [allCourses, programs] = await Promise.all([
    fetchJson(`${base}/api/v1/content/courses`),
    fetchJson(`${base}/api/v1/content/scholarship-programs`),
  ]);

  // Filter out test series, keep only classroom courses (freshers/repeaters)
  const classroomCourses = allCourses.filter((c: any) => c.category !== "test-series");

  return <AdmissionsClient courses={classroomCourses} scholarshipPrograms={programs} />;
}

