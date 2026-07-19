"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { coursesData } from "@/data/courses";
import { FaChevronDown, FaCalendarDays, FaArrowLeft, FaCheck, FaPhone, FaEnvelope, FaClock, FaBookOpen, FaTrophy, FaGraduationCap, FaFileSignature, FaHeart, FaFilePdf } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";

interface CourseDetailClientProps {
  id: string;
}

export default function CourseDetailClient({ id }: CourseDetailClientProps) {
  const courseId = parseInt(id);
  const course = coursesData.find((c) => c.id === courseId);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visitingDate: "",
    visitingTime: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  // Office Hours
  const timeSlots = [
    "Choose a convenient time slot",
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM"
  ];

  // Classroom course premium feature list (with static cropped graphics)
  const classroomFeatures = [
    {
      title: "Our Results Speak for Themselves",
      bullets: [
        "36+ Selections in NEET 2025",
        "3 Students selected for AIIMS Delhi",
        "Selections in top Government Medical Colleges across Maharashtra",
        "One of the best selection ratios in Maharashtra",
      ],
      renderGraphic: () => (
        <img src="/images/crops/results_graphic.png" alt="Our Results Speak for Themselves" className="row-graphic-img" />
      )
    },
    {
      title: "Personalized Mentorship",
      bullets: [
        "One-on-one mentoring",
        "Personalized study plans",
        "Regular parent interaction",
        "Progress tracking",
        "Exam strategy guidance"
      ],
      renderGraphic: () => (
        <img src="/images/crops/mentorship_graphic.png" alt="Personalized Mentorship" className="row-graphic-img" />
      )
    },
    {
      title: "Concept-Driven Classroom Learning",
      bullets: [
        "Deep conceptual teaching",
        "NCERT-first approach",
        "Application-based learning",
        "Interactive classes",
        "Strong fundamentals over memorization"
      ],
      renderGraphic: () => (
        <img src="/images/crops/learning_graphic.png" alt="Concept-Driven Classroom Learning" className="row-graphic-img" />
      )
    },
    {
      title: "Study Material & Daily Practice",
      bullets: [
        "Printed notes",
        "Daily Practice Papers (DPPs)",
        "Topic-wise assignments",
        "NEET question bank",
        "Revision booklets & PYQs"
      ],
      renderGraphic: () => (
        <img src="/images/crops/material_graphic.png" alt="Study Material & Daily Practice" className="row-graphic-img" />
      )
    },
    {
      title: "Smart Assessment System",
      badge: "OMR",
      bullets: [
        "Topic-wise tests",
        "Full syllabus tests",
        "Revision tests",
        "NEET-pattern mock exams",
        "Time-management practice"
      ],
      renderGraphic: () => (
        <img src="/images/crops/assessment_graphic.png" alt="Smart Assessment System" className="row-graphic-img" />
      )
    },
    {
      title: "Personalized Performance Analytics",
      bullets: [
        "Detailed reports",
        "Error analysis",
        "Chapter-wise performance",
        "Improvement roadmap",
        "Faculty feedback"
      ],
      renderGraphic: () => (
        <img src="/images/crops/analytics_graphic.png" alt="Personalized Performance Analytics" className="row-graphic-img" />
      )
    },
    {
      title: "Unlimited Doubt Support",
      bullets: [
        "Dedicated doubt sessions",
        "One-to-one interaction",
        "Concept clarification",
        "Extra support until every doubt is cleared"
      ],
      renderGraphic: () => (
        <img src="/images/crops/doubt_graphic.png" alt="Unlimited Doubt Support" className="row-graphic-img" />
      )
    },
    {
      title: "Structured Revision Program",
      bullets: [
        "Multiple revision cycles",
        "High-yield revision",
        "Important question practice",
        "Rapid revision before exams"
      ],
      renderGraphic: () => (
        <img src="/images/crops/revision_graphic.png" alt="Structured Revision Program" className="row-graphic-img" />
      )
    },
    {
      title: "Student Wellness & Motivation",
      bullets: [
        "Stress management",
        "Confidence building",
        "Positive learning environment",
        "Continuous motivation"
      ],
      renderGraphic: () => (
        <img src="/images/crops/wellness_graphic.png" alt="Student Wellness & Motivation" className="row-graphic-img" />
      )
    }
  ];

  // Map original fees for display
  const courseFees: Record<number, string> = {
    1: "₹1,00,300",
    2: "₹1,15,300",
    3: "₹1,25,300",
    4: "₹9,900"
  };

  const originalFee = courseFees[courseId] || "₹1,00,300";

  // Syllabus details depending on course
  const syllabusDetails: Record<number, { subject: string; topics: string[] }[]> = {
    1: [
      { subject: "Physics", topics: ["Mathematical Tools", "Units & Measurements", "Kinematics", "Laws of Motion", "Work, Energy & Power"] },
      { subject: "Chemistry", topics: ["Some Basic Concepts", "Structure of Atom", "Classification of Elements", "Chemical Bonding"] },
      { subject: "Biology", topics: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Cell Biology"] }
    ],
    2: [
      { subject: "Physics", topics: ["Electrostatics", "Current Electricity", "Magnetic Effects", "Electromagnetic Induction", "Optics & Modern Physics"] },
      { subject: "Chemistry", topics: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d & f Block Elements", "Organic Chemistry Core"] },
      { subject: "Biology", topics: ["Reproduction", "Genetics & Evolution", "Biology in Human Welfare", "Biotechnology", "Ecology"] }
    ],
    3: [
      { subject: "Complete Physics", topics: ["Mechanics & Thermodynamics", "Electromagnetism", "Optics & Wave Theory", "Modern & Nuclear Physics"] },
      { subject: "Complete Chemistry", topics: ["Physical Chemistry revision", "Inorganic concepts & trends", "Organic reactions & mechanism pathways"] },
      { subject: "Complete Biology", topics: ["Comprehensive Botany", "Advanced Zoology", "NCERT Line-by-line review series"] }
    ],
    4: [
      { subject: "Test Structure", topics: ["24 Part-syllabus minor tests", "12 Full-syllabus major test simulations", "Detailed performance diagnostics & analytics"] },
      { subject: "NCERT Focus", topics: ["Strict alignment with the latest NEET syllabus updates", "Topic-wise weightage indicators"] }
    ]
  };

  const syllabus = syllabusDetails[courseId] || [];

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course Not Found</h2>
        <p>The selected course program does not exist or has been removed.</p>
        <Link href="/courses" className="back-link">
          <FaArrowLeft /> Back to Courses
        </Link>
      </div>
    );
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setFormData(prev => ({
            ...prev,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email || prev.email,
            phone: user.mobileNumber || prev.phone,
          }));
        } catch (e) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setFormData(prev => ({ ...prev, name: "", email: "", phone: "" }));
      }
    };

    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    return () => window.removeEventListener("auth-changed", checkAuth);
  }, []);

  const handleAuthInterceptor = (e: React.MouseEvent | React.FocusEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new Event("open-signin-modal"));
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.visitingDate || formData.visitingTime === "Choose a convenient time slot" || !formData.visitingTime) {
      setFormStatus("error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        courseTitle: course.title,
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone,
        visitingDate: formData.visitingDate,
        visitingTime: formData.visitingTime,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/forms/course-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
    <div className="course-detail-page">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="container">
        {/* Back Link Button */}
        <div className="back-btn-wrap">
          <Link href="/courses" legacyBehavior>
            <a className="back-btn">
              <FaArrowLeft className="back-icon" />
              <span>Back to Courses</span>
            </a>
          </Link>
        </div>

        {/* Dynamic Split Grid Layout */}
        <div className="detail-grid-container">

          {/* LEFT SIDE: Course Overview & Syllabus details */}
          <div className="detail-left-content">
            <h1 className="course-title-header">{course.title}</h1>
            <p className="course-subtitle-desc">{course.description}</p>

            <div className="card-divider-line"></div>

            {/* What's in the Course Section (mockup vertical layout with SVG graphics) */}
            <div className="whats-in-course-section">
              <div className="whats-in-course-header-row">
                <div className="header-text-block">
                  <h2 className="whats-in-course-title">NEET Course Offerings &amp; Why Choose Us</h2>
                </div>
              </div>

              <div className="whats-in-course-list">
                {classroomFeatures.map((feat, idx) => (
                  <div key={idx} className="whats-in-course-row">
                    <div className="row-text-content">
                      <h4 className="row-item-title">
                        {feat.title}
                        {feat.badge && (
                          <span className="row-item-badge">{feat.badge}</span>
                        )}
                      </h4>
                      <ul className="row-bullet-list">
                        {feat.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="row-bullet-point">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="row-graphic-content">
                      {feat.renderGraphic()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-divider-line"></div>

            {/* Syllabus Download Banner */}
            <div className="syllabus-download-card">
              <div className="download-text-wrap">
                <h4 className="download-title">Download Course Syllabus</h4>
                <p className="download-description">
                  Get the comprehensive chapter weightage, topic-wise schedule, mock pattern timeline, and detailed preparation roadmap in PDF format.
                </p>
              </div>
              <a
                href="/documents/Syllabus_neet_2026.pdf"
                download
                className="syllabus-download-btn"
              >
                <span className="pdf-icon-box">
                  <FaFilePdf />
                </span>
                <span>Download PDF Syllabus</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Premium Registration Form */}
          <div className="detail-right-sidebar">
            <div className="register-glass-card">
              {formStatus === "success" ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="registration-success-state"
                  >
                    <div className="success-check-ring">
                      <FaCheck />
                    </div>
                    <h3 className="success-heading">Registration Successful!</h3>
                    <p className="success-desc">
                      Thank you, <strong>{formData.name}</strong>. Your seat reservation has been recorded.
                    </p>
                    <div className="visit-summary-box">
                      <div className="visit-summary-row">
                        <span className="summary-label">Batch:</span>
                        <span className="summary-value">{course.badge.replace("Starts: ", "")}</span>
                      </div>
                      <div className="visit-summary-row">
                        <span className="summary-label">Visiting Date:</span>
                        <span className="summary-value">{formData.visitingDate}</span>
                      </div>
                      <div className="visit-summary-row">
                        <span className="summary-label">Visiting Time:</span>
                        <span className="summary-value">{formData.visitingTime}</span>
                      </div>
                    </div>
                    <p className="visit-note">Our admissions team will call you at {formData.phone} shortly.</p>
                    <button
                      className="reset-form-btn"
                      onClick={() => {
                        setFormData({ name: "", email: "", phone: "", visitingDate: "", visitingTime: "" });
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
                  className="premium-register-form"
                  onClickCapture={handleAuthInterceptor}
                  onFocusCapture={handleAuthInterceptor}
                >
                  <h2 className="form-card-title">
                    Register for the course
                    <span className="form-course-highlight">{course.title}</span>
                  </h2>

                  {/* Section Title */}
                  <div className="form-section-title-wrap">
                    <span className="form-section-label">STUDENT INFORMATION</span>
                  </div>

                  {/* Inputs */}
                  <div className="inputs-block-container">
                    <div className="form-field-group">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pill-text-input"
                        required
                        readOnly={isAuthenticated}
                      />
                    </div>
                    <div className="form-field-group">
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pill-text-input"
                        required
                        readOnly={isAuthenticated}
                      />
                    </div>
                    <div className="form-field-group">
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pill-text-input"
                        required
                        readOnly={isAuthenticated}
                      />
                    </div>
                  </div>

                  {/* Subcard Box for Batch, Visit Date, & Time Slots */}
                  <div className="admissions-subcard-wrapper">

                    {/* Batch starting from block */}
                    <div className="subcard-field-group">
                      <span className="subcard-section-label">BATCH STARTING FROM</span>
                      <div className="batch-pill-badge">
                        <span className="batch-pill-icon"><FaCalendarDays /></span>
                        <span className="batch-pill-date">{course.badge.replace("Starts: ", "")}</span>
                      </div>
                    </div>

                    <div className="subcard-divider"></div>

                    {/* Select Visiting Date */}
                    <div className="subcard-field-group">
                      <label className="subcard-section-label" htmlFor="visiting-date">SELECT VISITING DATE</label>
                      <input
                        id="visiting-date"
                        type="date"
                        value={formData.visitingDate}
                        onChange={(e) => setFormData({ ...formData, visitingDate: e.target.value })}
                        className="subcard-date-input"
                        required
                      />
                    </div>

                    <div className="subcard-divider"></div>

                    {/* Select Visiting Time */}
                    <div className="subcard-field-group">
                      <label className="subcard-section-label" htmlFor="visiting-time">SELECT VISITING TIME (9:00 AM - 7:00 PM)</label>
                      <div className="custom-select-wrap">
                        <select
                          id="visiting-time"
                          value={formData.visitingTime}
                          onChange={(e) => setFormData({ ...formData, visitingTime: e.target.value })}
                          className="subcard-select-field"
                          required
                        >
                          {timeSlots.map((slot, index) => (
                            <option
                              key={index}
                              value={slot}
                              disabled={index === 0}
                            >
                              {slot}
                            </option>
                          ))}
                        </select>
                        <span className="custom-select-arrow"><FaChevronDown /></span>
                      </div>
                    </div>

                  </div>



                  {/* Register button */}
                  <button
                    type="submit"
                    className="submit-registration-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register Now"}
                  </button>

                  {formStatus === "error" && (
                    <p className="form-error-feedback">⚠ Please complete all required form fields.</p>
                  )}
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .course-detail-page {
          position: relative;
          background: linear-gradient(180deg, #f8fafc 0%, #edf2f9 100%);
          min-height: 100vh;
          padding: 120px 0 80px;
          overflow: hidden;
          width: 100%;
        }

        /* Background blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.12;
          z-index: 1;
        }
        .blob-1 {
          background: #40b5c1;
          width: 400px;
          height: 400px;
          top: 10%;
          left: -150px;
        }
        .blob-2 {
          background: #1e40af;
          width: 500px;
          height: 500px;
          bottom: 10%;
          right: -200px;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 5;
          box-sizing: border-box;
        }

        /* Back Button */
        .back-btn-wrap {
          margin-bottom: 32px;
          text-align: left;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1d4ed8;
          background: #eff6ff;
          padding: 8px 20px 8px 16px;
          border-radius: 100px;
          text-decoration: none;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(29, 78, 216, 0.1);
        }
        .back-btn:hover {
          background: #dbeafe;
          color: #1e40af;
          transform: translateX(-4px);
        }
        .back-icon {
          font-size: 0.88rem;
        }

        /* Split Grid Layout */
        .detail-grid-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 50px;
          align-items: start;
        }

        /* LEFT CONTENT */
        .detail-left-content {
          text-align: left;
        }
        .course-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #edf2f9;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #475569;
          margin-bottom: 20px;
          font-family: 'Outfit', sans-serif;
        }
        .pill-user-icon {
          display: flex;
          align-items: center;
        }
        .course-title-header {
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          margin: 0 0 16px;
          letter-spacing: -0.03em;
          font-family: 'Outfit', sans-serif;
        }
        .course-subtitle-desc {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.65;
          margin: 0 0 28px;
          font-family: 'Outfit', sans-serif;
        }
        .card-divider-line {
          height: 1.5px;
          background: #e2e8f0;
          width: 100%;
          margin: 32px 0;
        }

        /* Features checklist */
        .section-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 20px;
          font-family: 'Outfit', sans-serif;
        }
        .highlights-check-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .highlight-check-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .check-icon-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .check-text {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.5;
          font-family: 'Outfit', sans-serif;
        }

        /* Syllabus Subjects */
        .syllabus-cards-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .syllabus-subject-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01);
        }
        .subject-header-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e40af;
          margin: 0 0 12px;
          font-family: 'Outfit', sans-serif;
        }
        .subject-topics-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .topic-bullet-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.9rem;
          color: #475569;
          font-family: 'Outfit', sans-serif;
        }
        .bullet-dot {
          color: #cbd5e1;
          font-size: 1.2rem;
          line-height: 1;
        }

        /* RIGHT SIDE: Register Form (Matches Screenshot perfectly!) */
        .detail-right-sidebar {
          width: 100%;
        }
        .register-glass-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 28px;
          padding: 36px 30px;
          box-shadow: 
            0 20px 40px -15px rgba(15, 23, 42, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.02);
          box-sizing: border-box;
          width: 100%;
        }

        .premium-register-form {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .form-card-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          text-align: center;
          margin: 0 0 28px;
          letter-spacing: -0.02em;
          font-family: 'Outfit', sans-serif;
          line-height: 1.25;
        }
        .form-course-highlight {
          display: block;
          margin-top: 8px;
          background: linear-gradient(135deg, #0257d0 0%, #2563eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 900;
          font-size: 1.8rem;
          letter-spacing: -0.025em;
        }

        /* Section Labels */
        .form-section-title-wrap {
          margin-bottom: 12px;
        }
        .form-section-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.08em;
          font-family: 'Outfit', sans-serif;
        }

        .inputs-block-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        /* Pill Input Fields (matches screenshot capsule input outlines) */
        .pill-text-input {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 9999px; /* Pill capsule */
          padding: 12px 20px;
          font-size: 0.92rem;
          color: #1e293b;
          font-family: 'Outfit', sans-serif;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .pill-text-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        /* Subcard wrapping the time slots/dates */
        .admissions-subcard-wrapper {
          background: #ffffff;
          border: 1.5px solid #d8e2ef;
          border-radius: 20px;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          box-sizing: border-box;
        }

        .subcard-field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
        }

        .subcard-section-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.06em;
          font-family: 'Outfit', sans-serif;
          text-align: left;
        }

        /* Batch Starting From Pill Badge (matches blue outline pill) */
        .batch-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #e0f2fe; /* Light blue */
          border: 1.5px solid #2563eb; /* Blue border */
          border-radius: 12px;
          padding: 10px 16px;
          box-sizing: border-box;
        }
        .batch-pill-icon {
          color: #2563eb;
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }
        .batch-pill-date {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e3a8a;
          font-family: 'Outfit', sans-serif;
        }

        .subcard-divider {
          height: 1px;
          background: #e2e8f0;
          width: 100%;
        }

        /* Date input style */
        .subcard-date-input {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 9999px; /* Capsule */
          padding: 10px 18px;
          font-size: 0.92rem;
          color: #1e293b;
          outline: none;
          font-family: 'Outfit', sans-serif;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .subcard-date-input:focus {
          border-color: #3b82f6;
        }

        /* Time slot selector */
        .custom-select-wrap {
          position: relative;
          width: 100%;
        }
        .subcard-select-field {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 9999px; /* Capsule */
          padding: 10px 40px 10px 18px;
          font-size: 0.92rem;
          color: #1e293b;
          outline: none;
          appearance: none; /* Hide default browser arrow */
          font-family: 'Outfit', sans-serif;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
          cursor: pointer;
        }
        .subcard-select-field:focus {
          border-color: #3b82f6;
        }
        .custom-select-arrow {
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
        }

        /* Fee Summary block */
        .course-fee-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 0 4px;
        }
        .fee-label {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          font-family: 'Outfit', sans-serif;
        }
        .fee-pricing-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .fee-original-strikethrough {
          font-size: 1rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }
        .fee-free-badge {
          font-size: 1.5rem;
          font-weight: 900;
          color: #10b981; /* Emerald Green */
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
        }

        /* Big blue action button */
        .submit-registration-btn {
          width: 100%;
          background: #0257d0; /* Rich blue matches screenshot */
          color: #ffffff;
          border: none;
          border-radius: 9999px; /* Capsule pill */
          padding: 16px 24px;
          font-size: 1.05rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(2, 87, 208, 0.15);
        }
        .submit-registration-btn:hover:not(:disabled) {
          background: #0046b0;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(2, 87, 208, 0.25);
        }
        .submit-registration-btn:active {
          transform: translateY(0);
        }
        .submit-registration-btn:disabled {
          background: #cbd5e1;
          color: #64748b;
          cursor: not-allowed;
          box-shadow: none;
        }

        .form-error-feedback {
          color: #ef4444;
          font-size: 0.82rem;
          font-weight: 800;
          margin-top: 12px;
          text-align: center;
          font-family: 'Outfit', sans-serif;
        }

        /* SUCCESS STATE STYLING */
        .registration-success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 0;
        }
        .success-check-ring {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(21, 128, 61, 0.1);
        }
        .success-heading {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
          font-family: 'Outfit', sans-serif;
        }
        .success-desc {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 24px;
          font-family: 'Outfit', sans-serif;
        }
        .visit-summary-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .visit-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          font-family: 'Outfit', sans-serif;
        }
        .summary-label {
          color: #64748b;
          font-weight: 700;
        }
        .summary-value {
          color: #0f172a;
          font-weight: 800;
        }
        .visit-note {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0 0 24px;
          font-family: 'Outfit', sans-serif;
        }
        .reset-form-btn {
          width: 100%;
          background: #edf2f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 9999px;
          padding: 12px 20px;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
        }
        .reset-form-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* Empty/error courses state */
        .course-not-found {
          max-width: 500px;
          margin: 100px auto;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        }
        .course-not-found h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          font-family: 'Outfit', sans-serif;
        }
        .course-not-found p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0 0 24px;
          line-height: 1.5;
          font-family: 'Outfit', sans-serif;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0257d0;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 9999px;
          text-decoration: none;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
        }

        /* ─── RESPONSIVE OVERRIDES ─── */
        /* What's in the Course Section (Horizontal Stack Row matched styles) */
        .whats-in-course-section {
          margin-top: 20px;
          text-align: left;
        }
        .whats-in-course-header-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          text-align: left;
        }
        .stethoscope-logo {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-text-block {
          flex-grow: 1;
        }
        .whats-in-course-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        .whats-in-course-subtitle {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }
        .whats-in-course-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .whats-in-course-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .whats-in-course-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .row-text-content {
          flex: 1.4;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .row-graphic-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 320px;
          width: 100%;
        }
        .stethoscope-img {
          width: 100px;
          height: 145px;
          display: block;
        }
        .row-graphic-img {
          width: 100%;
          height: auto;
          max-height: 180px;
          object-fit: contain;
          display: block;
        }
        .row-item-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 16px;
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.02em;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .row-item-badge {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: 'Outfit', sans-serif;
        }
        .row-bullet-list {
          list-style-type: disc;
          padding-left: 20px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .row-bullet-point {
          display: list-item;
          font-size: 0.95rem;
          color: #334155;
          line-height: 1.6;
          text-align: left;
          font-family: 'Outfit', sans-serif;
        }

        /* Syllabus Download Card */
        .syllabus-download-card {
          background: linear-gradient(135deg, #f8fafc 0%, #edf2f9 100%);
          border: 1.5px dashed #cbd5e1;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-top: 32px;
          box-sizing: border-box;
          width: 100%;
        }
        .download-text-wrap {
          text-align: left;
          flex-grow: 1;
        }
        .download-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          font-family: 'Outfit', sans-serif;
        }
        .download-description {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }
        .syllabus-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #ef4444; /* Premium PDF red */
          color: #ffffff;
          border-radius: 9999px; /* Capsule pill */
          padding: 14px 28px;
          font-size: 0.95rem;
          font-weight: 800;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);
        }
        .syllabus-download-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.25);
        }
        .syllabus-download-btn:active {
          transform: translateY(0);
        }
        .pdf-icon-box {
          display: flex;
          align-items: center;
          font-size: 1.15rem;
        }

        @media (max-width: 992px) {
          .detail-grid-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .detail-right-sidebar {
            max-width: 550px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .syllabus-download-card {
            flex-direction: column;
            text-align: center;
            align-items: center;
            padding: 24px 20px;
            gap: 20px;
          }
          .download-text-wrap {
            text-align: center;
          }
          .syllabus-download-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .course-detail-page {
            padding-top: 100px;
          }
          .whats-in-course-row {
            flex-direction: column;
            gap: 24px;
            padding: 24px;
          }
          .row-text-content {
            width: 100%;
          }
          .row-graphic-content {
            max-width: 200px;
            margin: 0 auto;
          }
          .register-glass-card {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
}
