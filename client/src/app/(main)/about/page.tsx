"use client";

import Image from "next/image";
import {
  FaCalendarAlt, FaTrophy, FaUsers, FaUniversity, FaAward,
  FaLightbulb, FaUserTie, FaCheckCircle, FaBuilding, FaGraduationCap, FaBookOpen
} from "react-icons/fa";
import {
  FiUsers, FiBookOpen, FiAward, FiTrendingUp
} from "react-icons/fi";
import { EditableText } from "@/components/admin/EditableText";

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* 1. SECTION */}
      <section className="hero-section">
        <div className="hero-container container">

          {/* Left Content */}
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-text">
                <EditableText contentKey="hero.eyebrow" label="about eyebrow">
                  ABOUT US
                </EditableText>
              </span>
              <div className="eyebrow-line"></div>
            </div>
            <h1 className="hero-title">
              <EditableText contentKey="hero.heading" label="about page heading">
                Empowering Dreams. Building Future Doctors.
              </EditableText>
            </h1>
            <p className="hero-desc">
              <EditableText
                contentKey="hero.description"
                label="about page introduction"
                kind="multiline"
              >
                Since 2018, Success Code Academy has been shaping the future of NEET aspirants from Baramati and beyond with quality education, mentorship, and unwavering support.
              </EditableText>
            </p>

            <div className="hero-pills">
              <div className="hero-pill">
                <div className="pill-icon blue-bg"><FaCalendarAlt /></div>
                <div className="pill-text">
                  <span className="pill-label">Founded in</span>
                  <span className="pill-value">2018</span>
                </div>
              </div>
              <div className="hero-pill">
                <div className="pill-icon blue-bg"><FaTrophy /></div>
                <div className="pill-text">
                  <span className="pill-label">Students Admitted</span>
                  <span className="pill-value">36+</span>
                  <span className="pill-sub">NEET 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hero-image-wrapper">
            <div className="hero-image-inner">
              <Image
                src="/images/about/map.png"
                alt="Impact Map"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="hero-img"
                priority
                unoptimized={true}
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. IMPACT SECTION — Pinned Whiteboard Achievements Dashboard */}
      <section className="impact-section container">
        <div className="about-achievement-image-wrap" style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0 auto', maxWidth: '1000px' }}>
          <img
            src="/images/about/About1.png"
            alt="NEET Achievements Dashboard"
            style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 12px 35px rgba(15, 23, 42, 0.12)', display: 'block' }}
          />
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="story-section container">
        <div className="story-content">
          <div className="eyebrow">
            <span className="eyebrow-text">
              <EditableText contentKey="story.eyebrow" label="story eyebrow">
                OUR STORY
              </EditableText>
            </span>
            <div className="eyebrow-line"></div>
          </div>
          <h2 className="section-title">
            <EditableText contentKey="story.heading" label="story heading">
              Built on a Simple Belief
            </EditableText>
          </h2>
          <div className="story-text">
            <p>
              <EditableText contentKey="story.paragraph-1" label="story paragraph 1" kind="multiline">
                Students from regional areas deserve the same opportunities and quality education as those in larger cities.
              </EditableText>
            </p>
            <p>
              <EditableText contentKey="story.paragraph-2" label="story paragraph 2" kind="multiline">
                Since 2018, we have been committed to helping aspiring doctors achieve their goals through quality teaching, dedicated guidance, and a student-first approach.
              </EditableText>
            </p>
            <p>
              <EditableText contentKey="story.paragraph-3" label="story paragraph 3" kind="multiline">
                Our journey is defined not only by academic results but by the confidence, discipline, and success of every student we mentor.
              </EditableText>
            </p>
          </div>
        </div>

        <div className="story-image-container">
          <div className="story-img-wrapper">
            <Image
              src="/images/infra/infra (3).webp"
              alt="Our Story"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="story-img"
            />
          </div>
          <div className="story-quote-card">
            <span className="quote-mark">“</span>
            <p className="quote-text">Concept First.<br />Clarity Always.<br />Confidence<br />Forever.</p>
          </div>
        </div>
      </section>

      {/* 4. PHILOSOPHY SECTION */}
      <section className="philosophy-section container">
        <div className="philosophy-grid">

          {/* Card 1 */}
          <div className="philosophy-card blue-card">
            <div className="phil-header">
              <div className="phil-icon blue-icon-box"><FaLightbulb /></div>
              <h3 className="phil-title">
                <EditableText
                  contentKey="philosophy.teaching.heading"
                  label="teaching philosophy heading"
                >
                  Our Teaching Philosophy
                </EditableText>
              </h3>
            </div>
            <ul className="phil-list">
              <li><FaCheckCircle className="check-icon blue-check" /><span>Conceptual clarity before moving to application-based problem solving.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Focus on understanding, not memorizing.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Builds analytical thinking and accuracy for NEET.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Preparing independent learners for life, not just exams.</span></li>
            </ul>
            <div className="phil-illustration">
              <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="100" r="70" stroke="#dbeafe" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="150" cy="100" r="50" stroke="#93c5fd" strokeWidth="1.5" />
                <circle cx="90" cy="65" r="4" fill="#3b82f6" />
                <circle cx="210" cy="120" r="5" fill="#60a5fa" />
                <path d="M120 40L122 45L127 46L123 50L124 55L120 52L116 55L117 50L113 46L118 45Z" fill="#3b82f6" opacity="0.6" />
                <path d="M180 150L181.5 153.5L185 154.2L182.2 157L183 160.5L180 158.4L177 160.5L177.8 157L175 154.2L178.5 153.5Z" fill="#2563eb" opacity="0.8" />
                <g transform="translate(125, 75)">
                  <circle cx="25" cy="25" r="30" fill="#eff6ff" filter="blur(4px)" />
                  <path d="M25 5C15.6 5 8 12.6 8 22C8 27.8 11 33 15.5 35.8L15.5 41C15.5 42.1 16.4 43 17.5 43L32.5 43C33.6 43 34.5 42.1 34.5 41L34.5 35.8C39 33 42 27.8 42 22C42 12.6 34.4 5 25 5ZM28 38L22 38L22 35L28 35L28 38ZM30.8 32L19.2 32C18.2 29.8 17 27.2 17 22C17 17.6 20.6 14 25 14C29.4 14 33 17.6 33 22C33 27.2 31.8 29.8 30.8 32Z" fill="#2563eb" />
                  <line x1="25" y1="0" x2="25" y2="4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <line x1="8" y1="8" x2="11" y2="11" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <line x1="0" y1="22" x2="4" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <line x1="42" y1="8" x2="39" y2="11" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <line x1="50" y1="22" x2="46" y2="22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="philosophy-card green-card">
            <div className="phil-header">
              <div className="phil-icon green-icon-box"><FaUserTie /></div>
              <h3 className="phil-title">
                <EditableText
                  contentKey="philosophy.mentorship.heading"
                  label="mentorship heading"
                >
                  Personalized Mentorship
                </EditableText>
              </h3>
            </div>
            <ul className="phil-list">
              <li><FaCheckCircle className="check-icon green-check" /><span>Every student learns differently – we guide them individually.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>Continuous support and doubt resolution.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>Equal attention and encouragement for every learner.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>A friendly, disciplined, and motivating environment.</span></li>
            </ul>
            <div className="phil-illustration">
              <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="150" cy="100" r="70" stroke="#dcfce7" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="150" cy="100" r="50" stroke="#86efac" strokeWidth="1.5" />
                <circle cx="95" cy="75" r="4.5" fill="#10b981" />
                <circle cx="195" cy="140" r="4" fill="#34d399" />
                <path d="M110 50L111.5 53.5L115 54.2L112.2 57L113 60.5L110 58.4L107 60.5L107.8 57L105 54.2L108.5 53.5Z" fill="#10b981" opacity="0.7" />
                <path d="M190 60L192 65L197 66L193 70L194 75L190 72L186 75L187 70L183 66L188 65Z" fill="#059669" opacity="0.6" />
                <g transform="translate(125, 75)">
                  <circle cx="25" cy="25" r="30" fill="#f0fdf4" filter="blur(4px)" />
                  <path d="M25 2C15 2 7 10 7 20C7 32 25 46 25 46C25 46 43 32 43 20C43 10 35 2 25 2ZM25 29C20 29 16 25 16 20C16 15 20 11 25 11C30 11 34 15 34 20C34 25 30 29 25 29Z" fill="#10b981" />
                  <path d="M22 17L25 14L28 17M25 15V24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INFRASTRUCTURE SECTION */}
      <section className="infra-section container">
        <div className="eyebrow">
          <span className="eyebrow-text">
            <EditableText
              contentKey="infrastructure.eyebrow"
              label="infrastructure eyebrow"
            >
              OUR INFRASTRUCTURE
            </EditableText>
          </span>
          <div className="eyebrow-line"></div>
        </div>
        <h2 className="section-title">
          <EditableText
            contentKey="infrastructure.heading"
            label="infrastructure heading"
          >
            A Space That Inspires Excellence
          </EditableText>
        </h2>

        <div className="infra-grid-4">

          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (1).webp" alt="Campus" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaBuilding /></div>
              <p className="infra-box-text">Welcoming &<br />Student-Friendly Campus</p>
            </div>
          </div>

          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (2).webp" alt="Classrooms" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaGraduationCap /></div>
              <p className="infra-box-text">Smart Classrooms for<br />Focused Learning</p>
            </div>
          </div>

          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (4).webp" alt="Environment" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaUsers /></div>
              <p className="infra-box-text">Engaging Environment<br />that Drives Success</p>
            </div>
          </div>

          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (6).webp" alt="Resources" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaBookOpen /></div>
              <p className="infra-box-text">Resources & Facilities<br />That Support Growth</p>
            </div>
          </div>

        </div>

        <div className="infra-quote-footer">
          <div className="footer-dots"></div>
          <p className="footer-quote">
            <span className="footer-quote-mark">“</span>
            We don't just prepare students for exams, we prepare them for their future.
          </p>
          <div className="footer-dots"></div>
        </div>
      </section>

      <style jsx>{`
        /* Reset & Base */
        .about-page {
          background-color: #fafbfd;
          color: #0f172a;
          overflow-x: hidden;
          padding-bottom: 100px;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Typography */
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .eyebrow-text {
          color: #2563eb;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .eyebrow-line {
          height: 2px;
          width: 48px;
          background-color: #93c5fd;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 32px;
          letter-spacing: -0.02em;
        }

        /* =========================================
           1. HERO SECTION
           ========================================= */
        .hero-section {
          padding-top: 140px; /* Space for navbar */
          padding-bottom: 80px;
          position: relative;
          background: linear-gradient(to bottom, #eff6ff 0%, #fafbfd 100%);
        }

        .hero-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 10;
        }

        .hero-content {
          flex: 0 0 45%;
          max-width: 500px;
          z-index: 20;
        }

        .hero-title {
          font-size: 3.8rem;
          font-weight: 800;
          line-height: 1.15;
          color: #0f172a;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }

        .hero-desc {
          font-size: 1.15rem;
          line-height: 1.7;
          color: #475569;
          margin-bottom: 40px;
          max-width: 540px;
        }

        .hero-pills {
          display: flex;
          gap: 20px;
        }

        .hero-pill {
          background: white;
          padding: 12px 24px 12px 12px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .pill-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .blue-bg { background-color: #2563eb; }

        .pill-text {
          display: flex;
          flex-direction: column;
        }

        .pill-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        .pill-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: #2563eb;
          line-height: 1.1;
        }

        .pill-sub {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1;
        }

        .hero-image-wrapper {
          position: relative;
          flex: 0 0 67%;
          height: 600px;
          margin-right: 0%;
          z-index: 5;
        }

        .hero-image-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-img {
          object-fit: contain;
          object-position: center;
        }

        /* =========================================
           2. IMPACT SECTION — Pinned Whiteboard Achievements
           ========================================= */
        .impact-section {
          position: relative;
          z-index: 20;
          margin-top: 40px; /* Positive margin to prevent overlap with Hero */
          margin-bottom: 40px; /* Reduced margin */
        }

        /* Whiteboard Outer Frame */
        .whiteboard-outer-frame {
          background: #eef3f9;
          padding: 8px;
          border-radius: 28px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.06);
        }

        /* Whiteboard Inner Board */
        .whiteboard-inner-board {
          position: relative;
          background: #eef3f9;
          border: 4px double #84a9e5;
          outline: 14px solid #d9e6f7;
          border-radius: 20px;
          padding: 16px 24px 16px; /* Decreased padding height-wise */
          text-align: center;
          overflow: hidden;
          box-shadow: inset 0 3px 10px rgba(0,0,0,0.05);
        }

        /* Header Title with Laurels */
        .whiteboard-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 8px; /* Decreased margin */
        }

        .whiteboard-title {
          font-size: 1.8rem; /* Decreased title size */
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .title-laurel {
          color: #2563eb;
          flex-shrink: 0;
          height: 14px;
        }

        /* Center Header Star */
        .header-star {
          font-size: 0.8rem;
          color: #2563eb;
          margin-top: -8px; /* Decreased margin top */
          margin-bottom: 10px; /* Decreased margin bottom */
          text-align: center;
        }

        /* Whiteboard Rows Layout */
        .whiteboard-rows-container {
          display: flex;
          flex-direction: column;
          gap: 16px; /* Decreased gap from 24px */
          align-items: center;
          width: 100%;
        }

        .whiteboard-row {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
        }

        .whiteboard-top-row {
          gap: 28px; /* Decreased gap */
        }

        .whiteboard-bottom-row {
          gap: 20px; /* Decreased gap */
        }

        /* Pinned Card Base */
        .pinned-paper-card {
          position: relative;
          background-color: #ffffff;
          background-image: linear-gradient(rgba(37, 99, 235, 0.05) 1.5px, transparent 1.5px);
          background-size: 100% 20px;
          border-radius: 4px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 
            0 10px 25px rgba(0,0,0,0.06), 
            0 3px 6px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pinned-paper-card::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 14px; /* Moved left to accommodate smaller card width */
          width: 1px;
          background: rgba(239, 68, 68, 0.25);
          z-index: 1;
        }
        .pinned-paper-card:hover {
          transform: scale(1.03) rotate(0deg) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          z-index: 10;
        }

        /* Card Rotations for Pinned Feel */
        .rank-card-left { transform: rotate(-1.5deg); }
        .rank-card-right { transform: rotate(1deg); }
        
        .note-1 { transform: rotate(-1deg); }
        .note-2 { transform: rotate(0.8deg); }
        .note-3 { transform: rotate(-0.5deg); }

        /* Pushpin container */
        .pushpin-container {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          filter: drop-shadow(0 2.5px 3px rgba(0,0,0,0.18));
        }

        /* Rank Cards Layout */
        .rank-paper-card {
          width: 220px; /* Decreased width from 240px */
          height: 190px; /* Decreased height from 230px */
          padding: 16px 12px 12px; /* Decreased padding */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .card-top-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .exam-year-pill {
          border: 1.5px solid #2563eb;
          color: #2563eb;
          font-size: 0.7rem; /* Decreased size */
          font-weight: 800;
          border-radius: 100px;
          padding: 2px 12px;
          line-height: 1;
        }

        .star-mini {
          color: #2563eb;
          font-size: 0.7rem;
        }

        .rank-label {
          font-size: 1.15rem; /* Decreased from 1.45rem */
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .rank-display-wreath {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 0;
        }

        .medal-wreath {
          color: #2563eb;
          flex-shrink: 0;
          width: 24px;  /* Decreased SVG width via CSS */
          height: 48px; /* Decreased SVG height via CSS */
        }

        .rank-huge-number {
          font-size: 3.8rem; /* Decreased rank number from 4.4rem */
          font-weight: 900;
          color: #2563eb;
          line-height: 0.95;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Star & line card decorator */
        .card-bottom-decor {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 12px;
          margin-top: 2px;
        }

        .decor-line {
          height: 1.2px;
          flex-grow: 1;
          background: #93c5fd;
        }

        .decor-star {
          color: #2563eb;
          font-size: 0.75rem;
        }

        /* Stats Paper Card Layout */
        .stat-paper-card {
          width: 220px; /* Decreased width from 240px */
          height: 170px; /* Decreased height from 210px */
          padding: 12px 12px 10px; /* Decreased padding */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
        }

        .stat-circle-icon {
          width: 32px; /* Decreased from 38px */
          height: 32px; /* Decreased from 38px */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px; /* Decreased from 18px */
          margin-bottom: 0px;
        }

        .green-icon {
          background: rgba(16, 185, 129, 0.06);
          color: #10b981;
          border: 1.5px solid rgba(16, 185, 129, 0.15);
        }

        .purple-icon {
          background: rgba(139, 92, 246, 0.06);
          color: #8b5cf6;
          border: 1.5px solid rgba(139, 92, 246, 0.15);
        }

        .orange-icon {
          background: rgba(249, 115, 22, 0.06);
          color: #f97316;
          border: 1.5px solid rgba(249, 115, 22, 0.15);
        }

        .stat-value {
          font-size: 1.7rem; /* Decreased from 2.0rem */
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2px;
        }

        .green-text { color: #10b981; }
        .purple-text { color: #8b5cf6; }
        .orange-text { color: #f97316; }

        .green-decor .decor-line { background: #a7f3d0; }
        .purple-decor .decor-line { background: #ddd6fe; }
        .orange-decor .decor-line { background: #ffedd5; }
        
        .green-decor .decor-star { color: #10b981; }
        .purple-decor .decor-star { color: #8b5cf6; }
        .orange-decor .decor-star { color: #f97316; }

        .stat-title-label {
          font-size: 0.82rem; /* Decreased from 0.95rem */
          font-weight: 800;
          color: #1e293b;
        }

        .stat-title-bold {
          font-size: 0.82rem; /* Decreased from 0.95rem */
          font-weight: 800;
          line-height: 1.35;
        }

        .stat-sub-detail {
          font-size: 0.65rem; /* Decreased from 0.72rem */
          color: #64748b;
          font-weight: 600;
          line-height: 1.3;
        }

        .orange-stars-row {
          display: flex;
          gap: 4px;
          color: #fb923c;
          font-size: 0.75rem; /* Decreased from 0.85rem */
        }

        /* =========================================
           3. OUR STORY SECTION
           ========================================= */
        .story-section {
          display: flex;
          align-items: center;
          gap: 80px;
          margin-bottom: 120px;
        }

        .story-content {
          flex: 1;
        }

        .story-text p {
          font-size: 1.1rem;
          color: #475569;
          line-height: 1.8;
          margin-bottom: 20px;
        }

        .story-image-container {
          flex: 1;
          position: relative;
        }

        .story-img-wrapper {
          position: relative;
          width: 100%;
          height: 450px;
          border-radius: 16px 80px 16px 80px;
          overflow: hidden;
        }

        .story-img {
          object-fit: cover;
        }

        .story-quote-card {
          position: absolute;
          bottom: -30px;
          right: -30px;
          background: #0f172a;
          color: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          z-index: 10;
        }

        .quote-mark {
          font-family: serif;
          font-size: 4rem;
          line-height: 0;
          color: #3b82f6;
          position: absolute;
          top: 30px;
          left: 20px;
        }

        .quote-text {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 0;
          padding-left: 20px;
        }

        /* =========================================
           4. PHILOSOPHY SECTION
           ========================================= */
        .philosophy-section {
          margin-bottom: 120px;
        }

        .philosophy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .philosophy-card {
          border-radius: 24px;
          padding: 48px;
          position: relative;
          overflow: hidden;
          min-height: 500px;
        }

        .blue-card { background: #f4f8ff; }
        .green-card { background: #f0fdf4; }

        .phil-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 40px;
        }

        .phil-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: white;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .blue-icon-box { color: #2563eb; }
        .green-icon-box { color: #10b981; }

        .phil-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }

        .phil-list {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          z-index: 10;
        }

        .phil-list li {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          font-size: 1.05rem;
          color: #334155;
          line-height: 1.6;
          font-weight: 500;
        }

        .check-icon {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .blue-check { color: #2563eb; }
        .green-check { color: #10b981; }

        .phil-illustration {
          position: absolute;
          bottom: 10px;
          right: 10px;
          opacity: 0.65;
          z-index: 0;
          pointer-events: none;
        }

        /* =========================================
           5. INFRASTRUCTURE SECTION
           ========================================= */
        .infra-section {
          margin-bottom: 100px;
        }

        .infra-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }

        .infra-card-new {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .infra-card-new:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }

        .infra-img-box {
          position: relative;
          width: 100%;
          height: 180px;
        }

        .infra-img {
          object-fit: cover;
        }

        .infra-info-box {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .infra-box-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .infra-box-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          line-height: 1.4;
          margin: 0;
        }

        .infra-quote-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
        }

        .footer-dots {
          width: 100px;
          height: 20px;
          background-image: radial-gradient(circle, #cbd5e1 2px, transparent 2px);
          background-size: 12px 12px;
        }

        .footer-quote {
          text-align: center;
          font-size: 1.25rem;
          color: #475569;
          font-style: italic;
          position: relative;
        }

        .footer-quote-mark {
          font-family: serif;
          font-size: 2rem;
          color: #3b82f6;
          margin-right: 8px;
          vertical-align: middle;
        }

        /* =========================================
           RESPONSIVE STYLES FOR TABLET & MOBILE
           ========================================= */

        @media (max-width: 1024px) {
          .desktop-br { display: none !important; }
          .hero-section {
            padding-top: 100px !important;
            padding-bottom: 24px !important;
          }
          .hero-container {
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
          .hero-content {
            flex: 0 0 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            text-align: center !important;
          }
          .eyebrow {
            justify-content: center !important;
          }
          .hero-title {
            font-size: 2.1rem !important;
            line-height: 1.22 !important;
            margin-bottom: 14px !important;
            font-weight: 800 !important;
            letter-spacing: -0.02em !important;
          }
          .hero-desc {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            color: #475569 !important;
            margin: 0 auto 20px !important;
            max-width: 100% !important;
            text-align: center !important;
          }
          .hero-pills {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            width: 100% !important;
            max-width: 440px !important;
            margin: 0 auto !important;
          }
          .hero-pill {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding: 10px 12px !important;
            gap: 10px !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04) !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .pill-icon {
            width: 32px !important;
            height: 32px !important;
            font-size: 13px !important;
            flex-shrink: 0 !important;
          }
          .pill-text {
            text-align: left !important;
          }
          .pill-label {
            font-size: 0.62rem !important;
            font-weight: 700 !important;
            color: #64748b !important;
            text-transform: uppercase !important;
            display: block !important;
            line-height: 1.1 !important;
          }
          .pill-value {
            font-size: 1.05rem !important;
            font-weight: 800 !important;
            color: #2563eb !important;
            line-height: 1.1 !important;
          }
          .pill-sub {
            font-size: 0.6rem !important;
            color: #94a3b8 !important;
            display: block !important;
          }
          .hero-image-wrapper {
            position: relative !important;
            flex: none !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 280px !important;
            margin: 18px auto 0 !important;
            background: #ffffff !important;
            border-radius: 20px !important;
            padding: 8px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 8px 25px rgba(15, 23, 42, 0.05) !important;
            box-sizing: border-box !important;
          }
          .hero-image-inner {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 14px !important;
            overflow: hidden !important;
          }
          .hero-img {
            object-fit: contain !important;
            object-position: center !important;
          }

          /* Achievements Banner */
          .impact-section {
            margin-top: 20px !important;
            margin-bottom: 28px !important;
            padding: 0 16px !important;
          }
          .about-achievement-image-wrap {
            overflow: hidden !important;
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            border-radius: 16px !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08) !important;
          }
          .about-achievement-image-wrap img {
            width: 100% !important;
            height: auto !important;
            border-radius: 16px !important;
            display: block !important;
            object-fit: contain !important;
          }

          /* Our Story Section */
          .story-section {
            flex-direction: column !important;
            gap: 20px !important;
            margin-bottom: 28px !important;
            width: 100% !important;
          }
          .story-content {
            width: 100% !important;
            text-align: left !important;
          }
          .story-content .eyebrow {
            justify-content: flex-start !important;
          }
          .story-text p {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            margin-bottom: 12px !important;
            text-align: left !important;
          }
          .story-image-container {
            width: 100% !important;
            position: relative !important;
            margin-top: 0 !important;
          }
          .story-img-wrapper {
            position: relative !important;
            height: 240px !important;
            width: 100% !important;
            border-radius: 18px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important;
          }
          .story-quote-card {
            display: none !important;
          }

          /* Philosophy & Mentorship Section */
          .philosophy-section {
            margin-bottom: 28px !important;
            width: 100% !important;
          }
          .philosophy-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            width: 100% !important;
          }
          .philosophy-card {
            padding: 22px 18px !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            border-radius: 18px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .phil-header {
            margin-bottom: 18px !important;
            gap: 12px !important;
          }
          .phil-icon {
            width: 44px !important;
            height: 44px !important;
            font-size: 18px !important;
          }
          .phil-title {
            font-size: 1.3rem !important;
          }
          .phil-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
          }
          .phil-list li {
            font-size: 0.92rem !important;
            margin-bottom: 0 !important;
            gap: 10px !important;
            line-height: 1.5 !important;
            align-items: flex-start !important;
          }
          .check-icon {
            font-size: 16px !important;
            margin-top: 3px !important;
          }
          .phil-illustration {
            opacity: 0.2 !important;
            transform: scale(0.6) !important;
            transform-origin: bottom right !important;
          }

          /* Infrastructure Section */
          .infra-section {
            margin-bottom: 36px !important;
            width: 100% !important;
          }
          .infra-section .eyebrow {
            justify-content: flex-start !important;
          }
          .infra-grid-4 {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            width: 100% !important;
            margin-bottom: 30px !important;
          }
          .infra-img-box {
            height: 170px !important;
          }
          .infra-info-box {
            padding: 14px 16px !important;
            gap: 12px !important;
          }
          .infra-box-icon {
            width: 36px !important;
            height: 36px !important;
            font-size: 16px !important;
          }
          .infra-box-text {
            font-size: 0.85rem !important;
          }
          .infra-quote-footer {
            gap: 0 !important;
            margin-top: 10px !important;
          }
          .footer-quote {
            font-size: 1.05rem !important;
            line-height: 1.5 !important;
          }
          .footer-dots {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.8rem !important;
          }
          .hero-pills {
            gap: 8px !important;
          }
          .hero-pill {
            padding: 7px 10px !important;
            gap: 8px !important;
          }
          .hero-image-wrapper {
            aspect-ratio: 16 / 12 !important;
            min-height: 220px !important;
          }
          .story-img-wrapper {
            height: 200px !important;
          }
        }
      `}</style>
    </main>
  );
}
