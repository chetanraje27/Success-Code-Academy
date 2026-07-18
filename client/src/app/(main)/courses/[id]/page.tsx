import type { Metadata } from "next";
import { coursesData } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const course = coursesData.find((c) => c.id === courseId);
  return {
    title: `${course?.title || "Course Details"} | Success Code Academy`,
    description: course?.description || "Course details page.",
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CourseDetailClient id={resolvedParams.id} />;
}
