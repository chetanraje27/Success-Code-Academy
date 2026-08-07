"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarDays,
  FaCheck,
  FaChevronDown,
  FaCircleExclamation,
  FaFilePdf,
} from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";
// import removed

interface CourseDetailClientProps {
  course: {
    id: string | number;
    category: string;
    type: string;
    title: string;
    description: string;
    highlights: string[];
    badge: string;
  };
}

const timeSlots = [
  "Choose a convenient time slot",
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

const courseVisuals: Record<string, string> = {
  freshers: "/images/courses/neet-foundation.png",
  repeaters: "/images/courses/neet-repeaters.png",
  "test-series": "/images/courses/test-series.png",
};

const classroomFeatures = [
  {
    title: "Our Results Speak for Themselves",
    bullets: [
      "36+ Selections in NEET 2025",
      "3 Students selected for AIIMS Delhi",
      "Selections in top Government Medical Colleges across Maharashtra",
      "One of the best selection ratios in Maharashtra",
    ],
    image: "/images/crops/results_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Personalized Mentorship",
    bullets: [
      "One-on-one mentoring",
      "Personalized study plans",
      "Regular parent interaction",
      "Progress tracking",
      "Exam strategy guidance",
    ],
    image: "/images/crops/mentorship_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Concept-Driven Classroom Learning",
    bullets: [
      "Deep conceptual teaching",
      "NCERT-first approach",
      "Application-based learning",
      "Interactive classes",
      "Strong fundamentals over memorization",
    ],
    image: "/images/crops/learning_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Study Material & Daily Practice",
    bullets: [
      "Printed notes",
      "Daily Practice Papers (DPPs)",
      "Topic-wise assignments",
      "NEET question bank",
      "Revision booklets & PYQs",
    ],
    image: "/images/crops/material_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Smart Assessment System",
    badge: "OMR",
    bullets: [
      "Topic-wise tests",
      "Full syllabus tests",
      "Revision tests",
      "NEET-pattern mock exams",
      "Time-management practice",
    ],
    image: "/images/crops/assessment_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Personalized Performance Analytics",
    bullets: [
      "Detailed reports",
      "Error analysis",
      "Chapter-wise performance",
      "Improvement roadmap",
      "Faculty feedback",
    ],
    image: "/images/crops/analytics_graphic.png",
    width: 1672,
    height: 941,
  },
  {
    title: "Student Wellness & Motivation",
    bullets: [
      "Stress management",
      "Confidence building",
      "Positive learning environment",
      "Continuous motivation",
    ],
    image: "/images/crops/wellness_graphic.png",
    width: 1672,
    height: 941,
  },
];

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visitingDate: "",
    visitingTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setIsAuthenticated(false);
        setFormData((previous) => ({
          ...previous,
          name: "",
          email: "",
          phone: "",
        }));
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setFormData((previous) => ({
          ...previous,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || previous.email,
          phone: user.mobileNumber || previous.phone,
        }));
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    return () => window.removeEventListener("auth-changed", checkAuth);
  }, []);

  const handleAuthInterceptor = (event: React.MouseEvent | React.FocusEvent) => {
    if (isAuthenticated) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    window.dispatchEvent(new Event("open-signin-modal"));

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.visitingDate ||
      !formData.visitingTime ||
      formData.visitingTime === "Choose a convenient time slot"
    ) {
      setFormStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/public/forms/course-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseTitle: course.title,
            studentName: formData.name,
            studentEmail: formData.email,
            studentPhone: formData.phone,
            visitingDate: formData.visitingDate,
            visitingTime: formData.visitingTime,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to register for the course");
      }

      setFormStatus("success");
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`course-detail-page course-detail-${course.category}`}>
      <section className="course-detail-hero">
        <div className="course-detail-container">
          <Link href="/courses" className="course-detail-back">
            <FaArrowLeft aria-hidden="true" />
            <EditableText
              contentKey="navigation.back"
              label="back to courses link"
              showInlineControls={false}
            >
              Back to Courses
            </EditableText>
          </Link>

          <div className="course-detail-hero-card">
            <div className="course-detail-hero-copy">
              <div className="course-detail-type">
                <EditableText
                  contentKey={`course-${course.id}.type`}
                  label={`${course.title} type`}
                  showInlineControls={false}
                >
                  {course.type}
                </EditableText>
              </div>

              <h1 className="course-detail-title">
                <EditableText contentKey={`course-${course.id}.heading`} label="course heading" scope="global">
                  {course.title}
                </EditableText>
              </h1>

              <p className="course-detail-description">
                <EditableText
                  contentKey={`course-${course.id}.description`}
                  label="course description"
                  kind="multiline"
                >
                  {course.description}
                </EditableText>
              </p>

              <ul className="course-detail-highlights">
                {course.highlights.map((highlight: string, index: number) => (
                  <li key={highlight}>
                    <span aria-hidden="true">
                      <FaCheck />
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
</div>

            <div
              className="course-detail-hero-visual"
              aria-hidden="true"
              style={{
                backgroundImage: `url("${courseVisuals[course.category] || courseVisuals.freshers}")`,
              }}
            >
              <div className="course-detail-batch">
                <EditableText
                  contentKey={`course-${course.id}.badge`}
                  label={`${course.title} batch badge`}
                  showInlineControls={false}
                >
                  {course.badge}
                </EditableText>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="course-detail-body">
        <div className="course-detail-container course-detail-layout">
          <div className="course-detail-content">
            <div className="course-detail-section-heading">
              <span className="course-detail-section-line" aria-hidden="true" />
              <h2>
                <EditableText
                  contentKey="course.offerings-heading"
                  label="course offerings heading"
                >
                  NEET Course Offerings &amp; Why Choose Us
                </EditableText>
              </h2>
            </div>

            <div className="course-detail-feature-grid">
              {classroomFeatures.map((feature, index) => (
                <article
                  key={feature.title}
                  className="course-detail-feature-card"
                  data-feature={index + 1}
                >
                  <div className="course-detail-feature-copy">
                    <h3>
                      <EditableText
                        contentKey={`offerings.item-${index + 1}.heading`}
                        label={`course offering ${index + 1} heading`}
                      >
                        {feature.title}
                      </EditableText>
                      {feature.badge && (
                        <span className="course-detail-feature-badge">
                          <EditableText
                            contentKey={`offerings.item-${index + 1}.badge`}
                            label={`course offering ${index + 1} badge`}
                            showInlineControls={false}
                          >
                            {feature.badge}
                          </EditableText>
                        </span>
                      )}
                    </h3>

                    <ul>
                      {feature.bullets.map((bullet, bulletIndex) => (
                        <li key={bullet}>
                          <EditableText
                            contentKey={`offerings.item-${index + 1}.point-${bulletIndex + 1}`}
                            label={`course offering ${index + 1}, point ${bulletIndex + 1}`}
                            showInlineControls={false}
                          >
                            {bullet}
                          </EditableText>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="course-detail-feature-visual">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={feature.width}
                      height={feature.height}
                      sizes="(max-width: 720px) 45vw, 180px"
                      priority={index === 0}
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="course-detail-syllabus">
              <div className="course-detail-syllabus-icon" aria-hidden="true">
                <FaFilePdf />
              </div>
              <h3>
                <EditableText
                  contentKey="syllabus.heading"
                  label="syllabus download heading"
                >
                  Download Course Syllabus
                </EditableText>
              </h3>
              <a
                href="/documents/Syllabus_neet_2026.pdf"
                download
                className="course-detail-syllabus-action"
              >
                <EditableText
                  contentKey="syllabus.action"
                  label="syllabus download action"
                  showInlineControls={false}
                >
                  Download PDF Syllabus
                </EditableText>
              </a>
            </div>
          </div>

          <aside className="course-detail-sidebar">
            <div className="course-detail-register-card">
              {formStatus === "success" ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="course-registration-success"
                  >
                    <div className="course-registration-success-icon">
                      <FaCheck />
                    </div>
                    <h2>Registration Successful!</h2>
                    <p>
                      Thank you, <strong>{formData.name}</strong>. Your seat reservation has been recorded.
                    </p>

                    <div className="course-registration-summary">
                      <div>
                        <span>Batch:</span>
                        <strong>{course.badge.replace("Starts: ", "")}</strong>
                      </div>
                      <div>
                        <span>Visiting Date:</span>
                        <strong>{formData.visitingDate}</strong>
                      </div>
                      <div>
                        <span>Visiting Time:</span>
                        <strong>{formData.visitingTime}</strong>
                      </div>
                    </div>

                    <p className="course-registration-note">
                      Our admissions team will call you at {formData.phone} shortly.
                    </p>
                    <button
                      type="button"
                      className="course-registration-reset"
                      onClick={() => {
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          visitingDate: "",
                          visitingTime: "",
                        });
                        setFormStatus("idle");
                      }}
                    >
                      Reserve Another Spot
                    </button>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="course-registration-form"
                  onClickCapture={handleAuthInterceptor}
                  onFocusCapture={handleAuthInterceptor}
                >
                  <div className="course-registration-heading">
                    <h2>
                      <EditableText
                        contentKey="registration.heading"
                        label="registration form heading"
                      >
                        Register for the course
                      </EditableText>
                    </h2>
                    <span>
                      <EditableText
                        contentKey={`course-${course.id}.heading`}
                        label="course heading"
                        showInlineControls={false}
                        scope="global"
                      >
                        {course.title}
                      </EditableText>
                    </span>
                  </div>

                  <div className="course-registration-section-label">
                    <EditableText
                      contentKey="registration.student-section"
                      label="student information label"
                      showInlineControls={false}
                    >
                      STUDENT INFORMATION
                    </EditableText>
                  </div>

                  <div className="course-registration-fields">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      required
                      readOnly={isAuthenticated}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({ ...formData, email: event.target.value })
                      }
                      required
                      readOnly={isAuthenticated}
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({ ...formData, phone: event.target.value })
                      }
                      required
                      readOnly={isAuthenticated}
                    />
                  </div>

                  <div className="course-registration-visit">
                    <div className="course-registration-field">
                      <span className="course-registration-section-label">
                        <EditableText
                          contentKey="registration.batch-label"
                          label="batch starting label"
                          showInlineControls={false}
                        >
                          BATCH STARTING FROM
                        </EditableText>
                      </span>
                      <div className="course-registration-batch">
                        <FaCalendarDays aria-hidden="true" />
                        <strong>{course.badge.replace("Starts: ", "")}</strong>
                      </div>
                    </div>

                    <div className="course-registration-field">
                      <label htmlFor="visiting-date">SELECT VISITING DATE</label>
                      <input
                        id="visiting-date"
                        type="date"
                        value={formData.visitingDate}
                        onChange={(event) =>
                          setFormData({ ...formData, visitingDate: event.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="course-registration-field">
                      <label htmlFor="visiting-time">
                        SELECT VISITING TIME (9:00 AM - 7:00 PM)
                      </label>
                      <div className="course-registration-select">
                        <select
                          id="visiting-time"
                          value={formData.visitingTime}
                          onChange={(event) =>
                            setFormData({ ...formData, visitingTime: event.target.value })
                          }
                          required
                        >
                          {timeSlots.map((slot, index) => (
                            <option key={slot} value={slot} disabled={index === 0}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <FaChevronDown aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="course-registration-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Registering..."
                    ) : (
                      <EditableText
                        contentKey="registration.action"
                        label="registration action"
                        showInlineControls={false}
                      >
                        Register Now
                      </EditableText>
                    )}
                  </button>

                  {formStatus === "error" && (
                    <p className="course-registration-error">
                      <FaCircleExclamation aria-hidden="true" />
                      Please complete all required form fields.
                    </p>
                  )}
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
