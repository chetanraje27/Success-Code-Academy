import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EditableText } from "@/components/admin/EditableText";
import { useEditModeOptional } from "@/components/admin/EditModeContext";

const courseStyles = [
  "/images/courses/neet-foundation.png",
  "/images/courses/neet-repeaters.png",
  "/images/courses/test-series.png",
];

type Course = {
  id?: string | number;
  title: string;
  description: string;
  slug: string;
};

export default function ExploreCourses({ courses = [] }: { courses?: Course[] }) {
  const { refreshKey } = useEditModeOptional();
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      setIsLoading(true);
      setLocalCourses([]); // Clear previous data to show skeleton loaders
      try {
        const res = await fetch('/api/content/courses', { cache: 'no-store' });
        const data = await res.json();
        if (data.status === 'success' && isMounted) {
          setLocalCourses(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const displayCourses = localCourses.slice(0, 3).map((c, i) => {
    return {
      id: c.id,
      name: c.title,
      description: c.description,
      image: courseStyles[i] || courseStyles[0],
      href: `/courses/${c.slug}`,
    };
  });

  return (
    <section className="explore-section relative">
      <div className="container">
        <div className="explore-header">
          <h2 className="explore-title flex items-center gap-3">
            <EditableText contentKey="courses.heading" label="courses heading">
              Explore Courses
            </EditableText>
            {isLoading && (
              <div className="w-5 h-5 border-2 border-[#40b5c1] border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>
          <p className="explore-subtitle">
            <EditableText
              contentKey="courses.description"
              label="courses introduction"
              kind="multiline"
            >
              Choose from our specialized classroom programs tailored to guide medical aspirants to their dream destinations.
            </EditableText>
          </p>
        </div>
        <div className="explore-grid">
          {isLoading && localCourses.length === 0 ? (
            [1, 2, 3].map((_, i) => (
              <div key={`skeleton-${i}`} className="explore-card-parent">
                <div className="explore-card">
                  <div className="icon-box skeleton-pulse"></div>
                  <div className="content-box">
                    <div className="skeleton-pulse" style={{ width: "70%", height: 24, borderRadius: 4, backgroundColor: "#e2e8f0", marginBottom: 12 }}></div>
                    <div className="skeleton-pulse" style={{ width: "100%", height: 16, borderRadius: 4, backgroundColor: "#e2e8f0", marginBottom: 8 }}></div>
                    <div className="skeleton-pulse" style={{ width: "80%", height: 16, borderRadius: 4, backgroundColor: "#e2e8f0" }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : localCourses.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-10 font-medium">
              No courses available at the moment.
            </div>
          ) : (
            displayCourses.map((c, i) => (
              <motion.div
                key={c.id || c.name}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="explore-card-parent"
              >
                <Link href={c.href} className="course-card-link">
                  <div className="explore-card">
                    <div
                      className="icon-box"
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url("${c.image}")`,
                      }}
                    />

                    <div className="content-box">
                      <h3 className="course-title-text">
                        <EditableText
                          contentKey={c.id ? `course-${c.id}.heading` : `courses.card-${i + 1}.title`}
                          label={`course ${i + 1} title`}
                          showInlineControls={false}
                          scope="global"
                        >
                          {c.name}
                        </EditableText>
                      </h3>
                      <p className="course-desc-text">
                        <EditableText
                          contentKey={c.id ? `course-${c.id}.description` : `courses.card-${i + 1}.description`}
                          label={`course ${i + 1} description`}
                          kind="multiline"
                          showInlineControls={false}
                        >
                          {c.description}
                        </EditableText>
                      </p>

                      <div className="see-more">
                        <span>Explore Course</span>
                        <span className="arrow-icon">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
