"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EditableText } from "@/components/admin/EditableText";

type Course = {
  id: string | number;
  category: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  highlights: string[];
  badge: string;
};

export default function CoursesClient({ courses }: { courses: Course[] }) {
  const categories = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return unique.length > 0 ? unique : ["freshers"];
  }, [courses]);

  const [activeTab, setActiveTab] = useState<string>(categories[0]);

  const filteredCourses = useMemo(
    () => courses.filter((course) => course.category === activeTab),
    [activeTab, courses],
  );

  return (
    <div className="courses-page-container">
      {/* ─── HEADER & FILTERS SECTION ─── */}
      <section className="courses-hero-section">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="courses-hero-title"
          >
            <EditableText contentKey="hero.heading" label="courses page heading">
              Course that we offer at our institute
            </EditableText>
          </motion.h1>

          {/* Filtering Tab Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="courses-filter-tabs"
            role="tablist"
            aria-label="Course categories"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeTab === cat}
                onClick={() => setActiveTab(cat)}
                className={`filter-tab-btn ${activeTab === cat ? "active" : ""}`}
              >
                <span className="tab-icon" aria-hidden="true">
                  {cat === "freshers" ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  ) : cat === "repeaters" ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  ) : cat === "test-series" ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" fill="currentColor" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  )}
                </span>
                <span className="tab-label">
                  <EditableText
                    contentKey={`category.${cat}.label`}
                    label={`${cat} category filter`}
                    showInlineControls={false}
                    scope="global"
                  >
                    {cat === "freshers" ? "NEET Freshers" : cat === "repeaters" ? "NEET Repeaters" : cat === "test-series" ? "Test series" : cat}
                  </EditableText>
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── COURSES LIST GRID SECTION ─── */}
      <section className="courses-grid-section">
        <div className="container">
          <div className="courses-list-stack">
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, index) => (
                <Link href={`/courses/${course.slug}`} key={course.id} className="course-card-anchor-link">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                    className="course-horizontal-card"
                  >
                    {/* Folded ribbon is anchored to the complete card boundary. */}
                    <div className="starts-ribbon-banner">
                      <span className="ribbon-text">
                        <EditableText
                          contentKey={`course-${course.id}.badge`}
                          label={`${course.title} batch badge`}
                          showInlineControls={false}
                        >
                          {course.badge}
                        </EditableText>
                      </span>
                      <span className="ribbon-fold-corner"></span>
                    </div>

                    {/* Left content panel */}
                    <div className="course-card-left">
                      <div className="course-type-pill">
                        <span className="pill-user-icon">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                        </span>
                        <span>
                          <EditableText
                            contentKey={`course-${course.id}.type`}
                            label={`${course.title} type`}
                            showInlineControls={false}
                          >
                            {course.type}
                          </EditableText>
                        </span>
                      </div>

                      <h2 className="course-card-title">
                        <EditableText
                          contentKey={`course-${course.id}.heading`}
                          label={`${course.title} heading`}
                          showInlineControls={false}
                          scope="global"
                        >
                          {course.title}
                        </EditableText>
                      </h2>
                      <p className="course-card-desc">
                        <EditableText
                          contentKey={`course-${course.id}.description`}
                          label={`${course.title} description`}
                          kind="multiline"
                          showInlineControls={false}
                        >
                          {course.description}
                        </EditableText>
                      </p>

                      <div className="card-divider-line"></div>

                      {/* Highlights bullet checklist */}
                      <div className="course-highlights-list">
                        {course.highlights.map((highlight: string, idx: number) => (
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
                              {idx > 2 && (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span className="highlight-text">
                              <EditableText
                                contentKey={`course-${course.id}.highlight-${idx + 1}`}
                                label={`${course.title} highlight ${idx + 1}`}
                                showInlineControls={false}
                              >
                                {highlight}
                              </EditableText>
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="card-divider-line"></div>

                      {/* Bottom Know More action indicator */}
                      <div className="course-action-wrap">
                        <div className="course-know-more-link">
                          <span>
                            <EditableText
                              contentKey={`course-${course.id}.action`}
                              label={`${course.title} action`}
                              showInlineControls={false}
                            >
                              Know more
                            </EditableText>
                          </span>
                          <span className="arrow-symbol">→</span>
                        </div>
                      </div>
                    </div>

                    {/* Right graphical panel */}
                    <div className="course-card-right">
                      {/* Floating star shape background overlay */}
                      <div className="badge-graphics-wrap">
                        {/* Curvy blue-grey background decoration polygon */}
                        <div className="curved-badge-bg"></div>

                        {/* Dotted matrix grid pattern overlay */}
                        <div className="badge-dots-matrix">
                          {Array.from({ length: 6 }).map((_, rIdx) => (
                            <div key={rIdx} className="matrix-row">
                              {Array.from({ length: 6 }).map((_, cIdx) => (
                                <span key={`dot-${rIdx}-${cIdx}`} className="matrix-dot"></span>
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
          --courses-bg: #f6f8fb;
          --courses-surface: #ffffff;
          --courses-border: #d7e0e9;
          --courses-text: #14243a;
          --courses-muted: #5d6c7e;
          --courses-navy: #102f5e;
          --courses-accent: #1b4f86;
          min-height: 100vh;
          background: var(--courses-bg);
          color: var(--courses-text);
          font-family: var(--font-sans), Arial, sans-serif;
          position: relative;
          padding-top: 80px; /* Offset header height */
          overflow: hidden;
        }
        .course-card-anchor-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          width: calc(50% - 0.625rem);
        }

        .courses-page-container .container {
          width: min(calc(100% - clamp(3rem, 8vw, 8rem)), 96rem);
          margin: 0 auto;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }

        /* ─── Hero Section ─── */
        .courses-hero-section {
          padding: clamp(2rem, 4vw, 3rem) 0 1.25rem;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .courses-hero-title {
          font-size: clamp(1.85rem, 2.6vw, 2.15rem);
          font-weight: 650;
          color: var(--courses-text);
          margin: 0 0 1.75rem;
          font-family: var(--font-sans);
          letter-spacing: -0.03em;
        }

        .courses-filter-tabs {
          display: inline-flex;
          gap: 0.5rem;
          background: transparent;
          justify-content: center;
          align-items: center;
          flex-wrap: nowrap;
          box-sizing: border-box;
        }

        .filter-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--courses-surface);
          border: 1px solid var(--courses-border);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--courses-muted);
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .filter-tab-btn:hover {
          color: var(--courses-navy);
          border-color: #bdcad7;
          transform: translateY(-1px);
        }

        .filter-tab-btn.active {
          background: var(--courses-navy);
          border-color: var(--courses-navy);
          color: #ffffff;
        }

        .filter-tab-btn .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ─── Grid Section ─── */
        .courses-grid-section {
          padding: 1.25rem 0 clamp(3rem, 6vw, 4.5rem);
          position: relative;
          z-index: 1;
        }

        .courses-list-stack {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          gap: 1.25rem;
          margin: 0 auto;
        }

        /* ─── Horizontal Course Card ─── */
        .course-horizontal-card {
          display: flex;
          background: var(--courses-surface);
          border: 1px solid var(--courses-border);
          border-radius: 12px;
          overflow: visible; /* Allows ribbon fold to extend behind card border */
          transition: border-color 180ms ease, transform 180ms ease;
          min-height: 380px;
          position: relative;
          box-sizing: border-box;
        }

        .course-horizontal-card:hover {
          transform: translateY(-2px);
          border-color: #bdcad7;
        }

        .course-card-left {
          flex: 1;
          min-width: 0;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .course-type-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #edf3fa;
          color: var(--courses-accent);
          padding: 0.4rem 0.7rem;
          border: 1px solid #d7e2ef;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 650;
          font-family: var(--font-sans);
          align-self: flex-start;
          text-transform: uppercase;
        }

        .pill-user-icon {
          display: flex;
          align-items: center;
        }

        .course-card-title {
          font-size: clamp(1.45rem, 2vw, 1.75rem);
          font-weight: 650;
          color: var(--courses-text);
          margin: 18px 0 10px;
          font-family: var(--font-sans);
          letter-spacing: -0.02em;
        }

        .course-card-desc {
          font-size: 0.92rem;
          color: var(--courses-muted);
          line-height: 1.5;
          margin: 0 0 20px;
          font-family: var(--font-sans);
        }

        .card-divider-line {
          width: 100%;
          height: 1px;
          background-color: var(--courses-border);
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
          background: #edf3fa;
          color: var(--courses-accent);
          flex-shrink: 0;
        }

        .highlight-text {
          min-width: 0;
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--courses-text);
          font-family: var(--font-sans);
          overflow-wrap: anywhere;
        }

        /* Action Know More link */
        .course-action-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 10px;
        }

        .course-know-more-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--courses-navy);
          font-size: 0.95rem;
          font-weight: 650;
          text-decoration: none;
          font-family: var(--font-sans);
          transition: color 0.2s;
        }

        .course-know-more-link:hover {
          color: var(--courses-accent);
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
          border-width: 10px 10px 10px 0px; /* Triangle sloping down-right from card edge to ribbon end */
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
        /* One tier: the stack is already capped at 600px across this range, so
           the compact card is the right layout throughout -- not just below
           900px. 1023 also stops this overlapping the min-width:1024 rules. */
        @media (max-width: 1023px) {
          .courses-list-stack {
            flex-direction: column;
            align-items: center;
            gap: 24px;
            max-width: 600px;
          }
          .course-card-anchor-link {
            width: 100%;
          }
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
            font-size: var(--font-size-micro) !important;
            border-radius: 6px 6px 0 6px !important;
          }
          .ribbon-fold-corner {
            border-width: 10px 10px 0 0px !important;
            right: 0 !important;
            left: auto !important;
          }
          .curved-badge-bg {
            right: 0 !important;
            left: auto !important;
            transform: none !important;
            top: 50% !important;
            width: 92px !important;
            height: 116px !important;
            margin-top: -58px;
            border-radius: 12px 0 0 12px !important;
            clip-path: polygon(15px 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%) !important;
          }
          .badge-dots-matrix {
            display: none !important;
          }
          .floating-gold-star {
            top: 50% !important;
            left: 50% !important;
            margin-top: -29px;
            margin-left: -29px;
            transform: rotate(-10deg) !important;
          }
          .gold-star-svg {
            width: 58px !important;
            height: 58px !important;
          }
        }

        @media (max-width: 767px) {
          .courses-page-container {
            padding-top: var(--header-h);
          }
          .courses-page-container .container {
            width: min(calc(100% - 1.5rem), 96rem);
          }
          .courses-hero-section {
            padding: 1.25rem 0 0.85rem;
          }
          .courses-hero-title {
            max-width: 21rem;
            margin: 0 auto 0.9rem;
            font-size: clamp(1.55rem, 7vw, 1.9rem);
            letter-spacing: 0;
            line-height: 1.12;
            overflow-wrap: anywhere;
          }
          .courses-hero-title .live-editable-text,
          .courses-hero-title .live-editable-value {
            white-space: normal;
            overflow-wrap: anywhere;
          }
          .courses-filter-tabs {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.4rem !important;
            overflow: visible !important;
            width: 100% !important;
            padding: 0.15rem 0.05rem 0.35rem !important;
          }
          .courses-filter-tabs::-webkit-scrollbar {
            display: none;
          }
          .filter-tab-btn {
            min-width: 0;
            min-height: 2.25rem;
            padding: 0.45rem 0.65rem !important;
            font-size: 0.7rem !important;
            width: 100% !important;
            justify-content: center;
            gap: 0.4rem !important;
            border-radius: 8px !important;
            white-space: nowrap;
          }
          .filter-tab-btn .tab-label {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .filter-tab-btn .tab-icon svg {
            width: 14px !important;
            height: 14px !important;
          }
          .courses-grid-section {
            padding: 0.85rem 0 2.5rem;
          }
          .courses-list-stack {
            gap: 0.75rem;
          }
          .course-card-left {
            flex: none !important;
            width: 100% !important;
            padding: 0.9rem 0.8rem 0.75rem !important;
          }
          .course-card-right {
            display: none !important;
          }
          .course-horizontal-card {
            display: flex;
            width: 100%;
            flex-direction: column !important;
            overflow: hidden !important;
            min-height: 0;
            background: var(--courses-surface);
            border-radius: 10px;
          }
          .starts-ribbon-banner {
            top: 0.75rem !important;
            right: 0.75rem !important;
            max-width: none;
            padding: 0.32rem 0.5rem !important;
            font-size: 0.54rem !important;
            line-height: 1.15;
            text-align: center;
            white-space: nowrap;
            border: 1px solid rgba(204, 72, 0, 0.18);
            border-radius: 999px !important;
            box-shadow: none;
          }
          .ribbon-fold-corner {
            display: none !important;
          }
          .course-card-title {
            margin: 0.55rem 0 0.3rem !important;
            font-size: 1.15rem !important;
            line-height: 1.15;
            letter-spacing: 0 !important;
          }
          .course-card-desc {
            display: -webkit-box;
            margin-bottom: 0.45rem !important;
            overflow: hidden;
            font-size: 0.72rem !important;
            line-height: 1.42;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
          .card-divider-line {
            margin: 0.25rem 0;
          }
          .course-highlights-list {
            gap: 0.4rem;
            margin: 0.45rem 0;
          }
          .highlight-item {
            align-items: flex-start;
            gap: 0.45rem;
          }
          .highlight-text {
            font-size: 0.69rem !important;
            line-height: 1.35;
          }
          .highlight-icon-box {
            width: 22px !important;
            height: 22px !important;
            border-radius: 6px;
          }
          .highlight-icon-box svg {
            width: 11px !important;
            height: 11px !important;
          }
          .course-type-pill {
            gap: 0.3rem;
            max-width: calc(100% - 6rem);
            padding: 0.28rem 0.5rem !important;
            font-size: 0.6rem !important;
            letter-spacing: 0.025em;
          }
          .pill-user-icon svg {
            width: 12px;
            height: 12px;
          }
          .course-action-wrap {
            padding-top: 0.35rem;
          }
          .course-know-more-link {
            gap: 0.3rem;
            font-size: 0.72rem;
          }
        }
        @media (max-width: 380px) {
          .course-card-left {
            flex-basis: auto !important;
            width: 100% !important;
            padding: 0.75rem 0.65rem !important;
          }
          .course-card-right {
            display: none !important;
          }
          .course-type-pill {
            white-space: normal !important;
            border-radius: 7px !important;
            line-height: 1.2 !important;
          }
          .courses-page-container .container {
            width: min(calc(100% - 1rem), 96rem);
            padding: 0;
          }
          .courses-hero-section {
            padding-top: 1rem;
          }
          .courses-hero-title {
            max-width: 18rem;
            font-size: 1.4rem;
          }
          .filter-tab-btn {
            min-height: 2.1rem;
            padding: 0.38rem 0.35rem !important;
            font-size: 0.58rem !important;
            gap: 0.25rem !important;
          }
          .filter-tab-btn .tab-icon svg {
            width: 12px !important;
            height: 12px !important;
          }
          .course-card-title {
            font-size: 1.05rem !important;
          }
          .course-card-desc {
            font-size: 0.68rem !important;
          }
          .highlight-text {
            font-size: 0.65rem !important;
          }
          .starts-ribbon-banner {
            top: 0.65rem !important;
            right: 0.65rem !important;
            font-size: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
