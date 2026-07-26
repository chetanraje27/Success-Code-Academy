import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDna, FaArrowsRotate, FaClipboardCheck } from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

const courses = [
  {
    name: "NEET 11th - 12th",
    icon: <FaDna />,
    description: "Conceptual clarity in Physics, Chemistry & Biology for NEET UG.",
    color: "#e2eefa",
    bg: "#e6fcf5",
    href: "/courses",
  },
  {
    name: "NEET Repeaters",
    icon: <FaArrowsRotate />,
    description: "Intensive 1-year program focused on speed, accuracy & revision.",
    color: "#e2eefa",
    bg: "#f3f0ff",
    href: "/courses",
  },
  {
    name: "Test Series",
    icon: <FaClipboardCheck />,
    description: "Offline mock tests simulating the real NEET exam environment.",
    color: "#e2eefa",
    bg: "#fff9db",
    href: "/courses",
  },
];

export default function ExploreCourses() {
  return (
    <section className="explore-section">
      <div className="container">
        <div className="explore-header">
          <h2 className="explore-title">
            <EditableText contentKey="courses.heading" label="courses heading">
              Explore Courses
            </EditableText>
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
          {courses.map((c, i) => (
            <motion.div
              key={c.name}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="explore-card-parent"
            >
              <Link href={c.href} className="course-card-link">
                <div
                  className="explore-card"
                  style={{
                    "--card-color": c.color,
                    "--hover-bg-light": c.bg,
                  } as React.CSSProperties}
                >
                  {/* Floating Icon Box (3D translation) */}
                  <div className="icon-box">
                    <span className="course-icon">{c.icon}</span>
                  </div>

                  {/* Content Box */}
                  <div className="content-box">
                    <h3 className="course-title-text">
                      <EditableText
                        contentKey={`courses.card-${i + 1}.title`}
                        label={`course ${i + 1} title`}
                        showInlineControls={false}
                      >
                        {c.name}
                      </EditableText>
                    </h3>
                    <p className="course-desc-text">
                      <EditableText
                        contentKey={`courses.card-${i + 1}.description`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
