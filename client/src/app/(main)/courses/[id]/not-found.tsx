import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

export default function CourseNotFound() {
  return (
    <section className="course-detail-not-found">
      <div>
        <h1>Course Not Found</h1>
        <p>The selected course program does not exist or has been removed.</p>
        <Link href="/courses">
          <FaArrowLeft aria-hidden="true" />
          Back to Courses
        </Link>
      </div>
    </section>
  );
}
