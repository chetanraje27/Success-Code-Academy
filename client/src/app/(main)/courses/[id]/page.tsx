import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { coursesData } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = coursesData.find(
    (item) => item.slug === id || String(item.id) === id,
  );

  return {
    title: `${course?.title || "Course Details"} | Success Code Academy`,
    description: course?.description || "Course details page.",
  };
}

export function generateStaticParams() {
  return coursesData.map((course) => ({ id: course.slug }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = coursesData.find(
    (item) => item.slug === id || String(item.id) === id,
  );

  if (!course) {
    notFound();
  }

  if (id !== course.slug) {
    permanentRedirect(course.link);
  }

  return <CourseDetailClient course={course} />;
}
