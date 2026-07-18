"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { coursesData } from "@/data/courses";

export default function CoursesClient() {
  const [activeTab, setActiveTab] = useState<"freshers" | "repeaters" | "test-series">("freshers");

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => course.category === activeTab);
  }, [activeTab]);

  return (
    <div className="courses-page-container">
      {/* Decorative background blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* ─── HEADER & FILTERS SECTION ─── */}
      <section className="courses-hero-section">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="courses-hero-title"
          >
            Course that we offer at our institute
          </motion.h1>

          {/* Filtering Tab Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="courses-filter-tabs"
          >
            <button
              onClick={() => setActiveTab("freshers")}
              className={`filter-tab-btn ${activeTab === "freshers" ? "active" : ""}`}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span className="tab-label">Neet Freashers</span>
            </button>

            <button
              onClick={() => setActiveTab("repeaters")}
              className={`filter-tab-btn ${activeTab === "repeaters" ? "active" : ""}`}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span className="tab-label">Neet Repeaters</span>
            </button>

            <button
              onClick={() => setActiveTab("test-series")}
              className={`filter-tab-btn ${activeTab === "test-series" ? "active" : ""}`}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <span className="tab-label">Test series</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── COURSES LIST GRID SECTION ─── */}
      <section className="courses-grid-section">
        <div className="container">
          <div className="courses-list-stack">
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, index) => (
                <Link href={course.link} key={course.id} className="course-card-anchor-link">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                    className="course-horizontal-card"
                  >
                    {/* Left content panel */}
                    <div className="course-card-left">
                      <div className="course-type-pill">
                        <span className="pill-user-icon">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                        </span>
                        <span>{course.type}</span>
                      </div>

                      <h2 className="course-card-title">{course.title}</h2>
                      <p className="course-card-desc">{course.description}</p>

                      <div className="card-divider-line"></div>

                      {/* Highlights bullet checklist */}
                      <div className="course-highlights-list">
                        {course.highlights.map((highlight, idx) => (
                          <div key={idx} className="highlight-item">
                            <span className="highlight-icon-box">
                              {idx === 0 && (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                  <line x1="8" y1="21" x2="16" y2="21" />
                                  <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                              )}
                              {idx === 1 && (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <circle cx="12" cy="12" r="10" />
                                  <circle cx="12" cy="12" r="6" />
                                  <circle cx="12" cy="12" r="2" />
                                </svg>
                              )}
                              {idx === 2 && (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                              )}
                            </span>
                            <span className="highlight-text">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <div className="card-divider-line"></div>

                      {/* Bottom Know More action indicator */}
                      <div className="course-action-wrap">
                        <div className="course-know-more-link">
                          <span>Know more</span>
                          <span className="arrow-symbol">→</span>
                        </div>
                      </div>
                    </div>

                    {/* Right graphical panel */}
                    <div className="course-card-right">
                      {/* Orange fold-over starts ribbon banner */}
                      <div className="starts-ribbon-banner">
                        <span className="ribbon-text">{course.badge}</span>
                        <span className="ribbon-fold-corner"></span>
                      </div>

                      {/* Floating star shape background overlay */}
                      <div className="badge-graphics-wrap">
                        {/* Curvy blue-grey background decoration polygon */}
                        <div className="curved-badge-bg"></div>

                        {/* Dotted matrix grid pattern overlay */}
                        <div className="badge-dots-matrix">
                          {Array.from({ length: 6 }).map((_, rIdx) => (
                            <div key={rIdx} className="matrix-row">
                              {Array.from({ length: 6 }).map((_, cIdx) => (
                                <span key={cIdx} className="matrix-dot"></span>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Shiny 3D gold bevel metal star */}
                        <div className="floating-gold-star">
                          <svg viewBox="0 0 100 100" className="gold-star-svg">
                            <defs>
                              <linearGradient id="gold-light" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffe082" />
                                <stop offset="100%" stopColor="#ffb300" />
                              </linearGradient>
                              <linearGradient id="gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ffb300" />
                                <stop offset="100%" stopColor="#ff6f00" />
                              </linearGradient>
                              <filter id="star-shadow" x="-30%" y="-30%" width="160%" height="160%">
                                <feDropShadow dx="3" dy="6" stdDeviation="5" floodOpacity="0.25" />
                              </filter>
                            </defs>
                            <g filter="url(#star-shadow)" transform="translate(0, 0)">
                              {/* bevel top point */}
                              <polygon points="50,15 50,50 38,38" fill="url(#gold-light)" />
                              <polygon points="50,15 50,50 62,38" fill="url(#gold-dark)" />
                              {/* bevel right point */}
                              <polygon points="85,38 50,50 62,38" fill="url(#gold-light)" />
                              <polygon points="85,38 50,50 69,62" fill="url(#gold-dark)" />
                              {/* bevel bottom-right point */}
                              <polygon points="72,80 50,50 69,62" fill="url(#gold-light)" />
                              <polygon points="72,80 50,50 50,70" fill="url(#gold-dark)" />
                              {/* bevel bottom-left point */}
                              <polygon points="28,80 50,50 50,70" fill="url(#gold-light)" />
                              <polygon points="28,80 50,50 31,62" fill="url(#gold-dark)" />
                              {/* bevel left point */}
                              <polygon points="15,38 50,50 31,62" fill="url(#gold-light)" />
                              <polygon points="15,38 50,50 38,38" fill="url(#gold-dark)" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Styled JSX Styles */}
      <style jsx global>{`
        .courses-page-container {
          min-height: 100vh;
          background-color: #f8fafc;
          position: relative;
          padding-top: 80px; /* Offset header height */
          overflow: hidden;
        }
        .course-card-anchor-link {
          text-decoration: none;
          color: inherit;
          display: block;
          width: 100%;
        }

        /* Ambient background glow decoration */
        .bg-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
        }
        .blob-1 {
          top: 10%;
          left: -10%;
          background: #3b82f6;
        }
        .blob-2 {
          bottom: 20%;
          right: -10%;
          background: #40b5c1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
          width: 100%;
        }

        /* ─── Hero Section ─── */
        .courses-hero-section {
          padding: 60px 0 20px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .courses-hero-title {
          font-size: 2.5rem;
          font-weight: 850;
          color: #0f172a;
          margin: 0 0 40px;
          font-family: var(--font-sans);
          letter-spacing: -0.03em;
        }

        .courses-filter-tabs {
          display: inline-flex;
          gap: 16px;
          background: transparent;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 12px;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #64748b;
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
        }

        .filter-tab-btn:hover {
          color: #1e1b4b;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .filter-tab-btn.active {
          background: #ffffff;
          border-color: #0066cc;
          color: #0066cc;
          box-shadow:
            0 10px 25px rgba(0, 102, 204, 0.1),
            0 1px 2px rgba(0, 102, 204, 0.05);
        }

        .filter-tab-btn .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ─── Grid Section ─── */
        .courses-grid-section {
          padding: 30px 0 80px;
          position: relative;
          z-index: 1;
        }

        .courses-list-stack {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ─── Horizontal Course Card ─── */
        .course-horizontal-card {
          display: flex;
          background: #ffffff;
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 32px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          overflow: visible; /* Allows ribbon fold to extend behind card border */
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          min-height: 400px;
          position: relative;
          box-sizing: border-box;
          background-image: repeating-linear-gradient(
            -45deg,
            #f8fafc,
            #f8fafc 4px,
            #ffffff 4px,
            #ffffff 12px
          );
        }

        .course-horizontal-card:hover {
          transform: translateY(-8px);
          box-shadow:
            0 20px 40px rgba(15, 23, 42, 0.08),
            0 1px 3px rgba(15, 23, 42, 0.02);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .course-card-left {
          flex: 1;
          padding: 32px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .course-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: var(--font-sans);
          align-self: flex-start;
          text-transform: uppercase;
        }

        .pill-user-icon {
          display: flex;
          align-items: center;
        }

        .course-card-title {
          font-size: 1.75rem;
          font-weight: 850;
          color: #0f172a;
          margin: 18px 0 10px;
          font-family: var(--font-sans);
          letter-spacing: -0.02em;
        }

        .course-card-desc {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 20px;
          font-family: var(--font-sans);
        }

        .card-divider-line {
          width: 100%;
          height: 1px;
          background-color: #f1f5f9;
          margin: 8px 0;
        }

        /* Checklist */
        .course-highlights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 12px 0;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .highlight-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          flex-shrink: 0;
        }

        .highlight-text {
          font-size: 0.92rem;
          font-weight: 600;
          color: #334155;
          font-family: var(--font-sans);
        }

        /* Action Know More link */
        .course-action-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .course-know-more-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #1d4ed8;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          font-family: var(--font-sans);
          transition: color 0.2s;
        }

        .course-know-more-link:hover {
          color: #1e40af;
        }

        .course-know-more-link .arrow-symbol {
          transition: transform 0.2s;
        }

        .course-know-more-link:hover .arrow-symbol {
          transform: translateX(4px);
        }

        /* ─── Right graphical panel ─── */
        .course-card-right {
          width: 180px;
          position: relative;
          background: transparent;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Folded starts ribbon */
        .starts-ribbon-banner {
          position: absolute;
          top: 24px;
          right: -10px; /* Extends slightly past the right border */
          background: #ff5a00;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 8px 8px 0 8px; /* Rounded top-left, top-right, bottom-left, sharp bottom-right */
          font-size: 0.8rem;
          font-weight: 850;
          font-family: var(--font-sans);
          text-transform: uppercase;
          z-index: 5;
          box-shadow: -4px 4px 12px rgba(255, 90, 0, 0.2);
        }

        .ribbon-fold-corner {
          position: absolute;
          top: 100%;
          right: 0; /* Align directly with the right edge of the banner */
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 10px 10px 10 0px; /* Triangle sloping down-right from card edge to ribbon end */
          border-color: #cc4800 transparent transparent transparent;
        }

        /* Graphics wraps */
        .badge-graphics-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Curved blue card background decoration - Slanted left Chevron */
        .curved-badge-bg {
          position: absolute;
          right: 0;
          top: 110px;
          width: 140px;
          height: 155px;
          background: #bfdbfe;
          opacity: 0.65;
          border-radius: 20px 0 0 20px;
          clip-path: polygon(25px 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%);
          z-index: 1;
        }

        /* Matrix overlay */
        .badge-dots-matrix {
          position: absolute;
          right: 20px;
          bottom: 45px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          opacity: 0.18;
          z-index: 2;
        }

        .matrix-row {
          display: flex;
          gap: 6px;
        }

        .matrix-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #1d4ed8;
        }

        /* Golden Star */
        .floating-gold-star {
          position: absolute;
          left: 80px; /* Centered exactly on the blue chevron badge */
          top: 150px;
          z-index: 3;
          animation: float 4s ease-in-out infinite;
          /* Subtle rotation angle matching design */
          transform: rotate(-10deg);
        }

        .gold-star-svg {
          width: 75px;
          height: 75px;
          filter: drop-shadow(0 10px 20px rgba(255, 179, 0, 0.4));
        }

        @keyframes float {
          0% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-8px) rotate(-8deg); }
          100% { transform: translateY(0px) rotate(-10deg); }
        }

        /* ─── Responsive Styles ─── */
        @media (max-width: 1024px) {
          .courses-list-stack {
            grid-template-columns: 1fr;
            gap: 24px;
            max-width: 600px;
          }
        }

        @media (max-width: 900px) {
          .course-horizontal-card {
            flex-direction: row !important;
            min-height: auto;
            overflow: visible !important;
          }
          .course-card-right {
            width: 110px !important;
            height: auto !important;
            border-top: none !important;
            border-left: 1px solid rgba(59, 130, 246, 0.08) !important;
            background: transparent !important;
          }
          .starts-ribbon-banner {
            top: 16px !important;
            right: -8px !important; /* Extend past border on mobile */
            padding: 5px 8px !important;
            font-size: 0.6rem !important;
            border-radius: 6px 6px 0 6px !important;
          }
          .ribbon-fold-corner {
            border-width: 10px 10 0 0px !important;
            right: 0 !important;
            left: auto !important;
          }
          .curved-badge-bg {
            right: 0 !important;
            left: auto !important;
            transform: none !important;
            top: 90px !important;
            width: 80px !important;
            height: 100px !important;
            border-radius: 12px 0 0 12px !important;
            clip-path: polygon(15px 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%) !important;
          }
          .badge-dots-matrix {
            display: none !important;
          }
          .floating-gold-star {
            left: 70px !important; /* Moved more towards right side on mobile */
            top: 115px !important;
            transform: rotate(-10deg) !important;
          }
          .gold-star-svg {
            width: 45px !important;
            height: 45px !important;
          }
          @keyframes float {
            0% { transform: translateY(0px) rotate(-10deg); }
            50% { transform: translateY(-5px) rotate(-8deg); }
            100% { transform: translateY(0px) rotate(-10deg); }
          }
        }

        @media (max-width: 600px) {
          .courses-hero-title {
            font-size: 2rem;
            margin-bottom: 30px;
          }
          .courses-filter-tabs {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 8px !important;
            overflow-x: auto !important;
            width: 100% !important;
            padding: 4px 10px !important;
            justify-content: flex-start !important;
            scrollbar-width: none;
          }
          .courses-filter-tabs::-webkit-scrollbar {
            display: none;
          }
          .filter-tab-btn {
            flex: 0 0 auto !important;
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
            width: auto !important;
            justify-content: center;
            gap: 6px !important;
            border-radius: 10px !important;
          }
          .filter-tab-btn .tab-icon svg {
            width: 16px !important;
            height: 16px !important;
          }
          .course-card-left {
            padding: 20px 16px !important;
          }
          .course-card-title {
            font-size: 1.35rem !important;
            margin: 10px 0 6px !important;
          }
          .course-card-desc {
            font-size: 0.82rem !important;
            margin-bottom: 12px !important;
          }
          .highlight-text {
            font-size: 0.82rem !important;
          }
          .highlight-icon-box {
            width: 28px !important;
            height: 28px !important;
          }
          .highlight-icon-box svg {
            width: 13px !important;
            height: 13px !important;
          }
          .course-type-pill {
            padding: 4px 10px !important;
            font-size: 0.72rem !important;
          }
        }
      `}</style>
    </div>
  );
}
