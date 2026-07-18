import type { Metadata } from "next";
import AdmissionsClient from "./AdmissionsClient";

export const metadata: Metadata = {
  title: "NEET Scholarship Test & Merit Concessions 2026-27 | Success Code Academy",
  description:
    "Apply for the Success Code Scholarship Test (SCST) to unlock up to 100% tuition fee waivers. Check merit scholarship slabs, direct board concessions, and register online.",
};

export default function AdmissionsPage() {
  return <AdmissionsClient />;
}
