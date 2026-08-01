"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EditableText } from "@/components/admin/EditableText";
// import removed

type CourseCategory = "freshers" | "repeaters" | "test-series";

export default function CoursesClient({ courses }: { courses: any[] }) {
  const [activeTab, setActiveTab] = useState<CourseCategory>("freshers");

  const filteredCourses = useMemo(
    () => courses.filter((course) => course.category === activeTab),
    [activeTab, courses],
  );

  return (
    <main className="courses-page">
      <section className="course-catalog-hero">
        <div className="course-catalog-container course-catalog-hero-inner">
          <h1 className="course-catalog-title">
            <EditableText contentKey="hero.heading" label="courses page heading">
              Course that we offer at our institute
            </EditableText>
          </h1>

          <div className="course-catalog-tabs" role="tablist" aria-label="Course categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "freshers"}
              onClick={() => setActiveTab("freshers")}
              className={activeTab === "freshers" ? "active" : ""}
            >
              <span className="course-catalog-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3z" />
                  <path d="M21 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z" />
                </svg>
              </span>
              <EditableText
                contentKey="course-1.heading"
                label="freshers filter"
                showInlineControls={false}
                scope="global"
              >
                NEET Freshers
              </EditableText>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "repeaters"}
              onClick={() => setActiveTab("repeaters")}
              className={activeTab === "repeaters" ? "active" : ""}
            >
              <span className="course-catalog-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.5" />
                </svg>
              </span>
              <EditableText
                contentKey="course-3.heading"
                label="repeaters filter"
                showInlineControls={false}
                scope="global"
              >
                NEET Repeaters
              </EditableText>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "test-series"}
              onClick={() => setActiveTab("test-series")}
              className={activeTab === "test-series" ? "active" : ""}
            >
              <span className="course-catalog-tab-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="4" width="14" height="17" rx="2" />
                  <path d="M9 4V2h6v2M9 11l2 2 4-4M9 17h6" />
                </svg>
              </span>
              <EditableText
                contentKey="filters.test-series"
                label="test series filter"
                showInlineControls={false}
              >
                Test series
              </EditableText>
            </button>
          </div>
        </div>
      </section>

      <section className="course-catalog-list-section">
        <div className="course-catalog-container">
          <div className="course-catalog-list" aria-live="polite">
            {filteredCourses.map((course) => (
              <Link href={`/courses/${course.slug}`} key={course.id} className="course-catalog-link">
                <article className={`course-catalog-card course-catalog-card-${course.category}`}>
                  <div className="course-catalog-content">
                    <div className="course-catalog-type">
                      <span aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                      </span>
                      <EditableText
                        contentKey={`course-${course.id}.type`}
                        label={`${course.title} type`}
                        showInlineControls={false}
                      >
                        {course.type}
                      </EditableText>
                    </div>

                    <h2 className="course-catalog-card-title">
                      <EditableText
                        contentKey={`course-${course.id}.heading`}
                        label={`${course.title} heading`}
                        showInlineControls={false}
                        scope="global"
                      >
                        {course.title}
                      </EditableText>
                    </h2>

                    <p className="course-catalog-description">
                      <EditableText
                        contentKey={`course-${course.id}.description`}
                        label={`${course.title} description`}
                        kind="multiline"
                        showInlineControls={false}
                      >
                        {course.description}
                      </EditableText>
                    </p>

                    <ul className="course-catalog-highlights">
                      {course.highlights.map((highlight: string, index: number) => (
                        <li key={highlight}>
                          <span className="course-catalog-check" aria-hidden="true">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m5 10 3 3 7-7" />
                            </svg>
                          </span>
                          <EditableText
                            contentKey={`course-${course.id}.highlight-${index + 1}`}
                            label={`${course.title} highlight ${index + 1}`}
                            showInlineControls={false}
                          >
                            {highlight}
                          </EditableText>
                        </li>
                      ))}
                    </ul>

                    <div className="course-catalog-action">
                      <EditableText
                        contentKey={`course-${course.id}.action`}
                        label={`${course.title} action`}
                        showInlineControls={false}
                      >
                        Know more
                      </EditableText>
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>

                  <div className="course-catalog-visual">
                    <div className="course-catalog-badge">
                      <EditableText
                        contentKey={`course-${course.id}.badge`}
                        label={`${course.title} batch badge`}
                        showInlineControls={false}
                      >
                        {course.badge}
                      </EditableText>
                    </div>

                    <span className="course-catalog-orbit course-catalog-orbit-large" aria-hidden="true" />
                    <span className="course-catalog-orbit course-catalog-orbit-small" aria-hidden="true" />

                    <div className="course-catalog-symbol" aria-hidden="true">
                      {course.category === "freshers" && (
                        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 13h16a7 7 0 0 1 7 7v32a7 7 0 0 0-7-7H9z" />
                          <path d="M55 13H39a7 7 0 0 0-7 7v32a7 7 0 0 1 7-7h16z" />
                          <path d="M17 23h8M39 23h8M17 31h8M39 31h8" />
                        </svg>
                      )}
                      {course.category === "repeaters" && (
                        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="32" cy="32" r="23" />
                          <circle cx="32" cy="32" r="14" />
                          <circle cx="32" cy="32" r="5" />
                          <path d="m45 19 10-10M46 9h9v9" />
                        </svg>
                      )}
                      {course.category === "test-series" && (
                        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="14" y="11" width="36" height="45" rx="4" />
                          <path d="M24 11V7h16v4M23 27l5 5 10-11M23 43h18" />
                        </svg>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
