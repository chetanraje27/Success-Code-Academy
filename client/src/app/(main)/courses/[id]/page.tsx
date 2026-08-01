import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { getApiBase } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${getApiBase()}/api/v1/content/courses`, { cache: 'no-store' });
  const data = await res.json();
  const courses = data?.data || [];
  const course = courses.find(
    (item: any) => item.slug === id || String(item.id) === id,
  );

  return {
    title: `${course?.title || "Course Details"} | Success Code Academy`,
    description: course?.description || "Course details page.",
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getApiBase()}/api/v1/content/courses`, { cache: 'no-store' });
  const data = await res.json();
  const courses = data?.data || [];
  const course = courses.find(
    (item: any) => item.slug === id || String(item.id) === id,
  );

  if (!course) {
    notFound();
  }

  if (String(course.id) === id) {
    permanentRedirect(`/courses/${course.slug}`);
  }

  return <CourseDetailClient course={course} />;
}
