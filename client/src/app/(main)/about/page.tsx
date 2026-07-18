"use client";

import Image from "next/image";
import { 
  FaCalendarAlt, FaTrophy, FaUsers, FaUniversity, FaAward, 
  FaLightbulb, FaUserTie, FaCheckCircle, FaBuilding, FaGraduationCap, FaBookOpen 
} from "react-icons/fa";
import { 
  FiUsers, FiBookOpen, FiAward, FiTrendingUp 
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <main className="about-page">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container container">
          
          {/* Left Content */}
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-text">ABOUT US</span>
              <div className="eyebrow-line"></div>
            </div>
            <h1 className="hero-title">
              Empowering Dreams.<br/>Building Future Doctors.
            </h1>
            <p className="hero-desc">
              Since 2018, Success Code Academy has been shaping the future of NEET aspirants from Baramati and beyond with quality education, mentorship, and unwavering support.
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
                src="/images/map.png" 
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

      {/* 2. IMPACT SECTION — Pinned Whiteboard Achievements Dashboard (Direct Image) */}
      <section className="impact-section container">
        <div className="whiteboard-image-container">
          <Image 
            src="/images/neet-achievements.jpg" 
            alt="Our NEET Achievements" 
            width={1200}
            height={680}
            className="whiteboard-direct-image"
            unoptimized={true}
          />
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="story-section container">
        <div className="story-content">
          <div className="eyebrow">
            <span className="eyebrow-text">OUR STORY</span>
            <div className="eyebrow-line"></div>
          </div>
          <h2 className="section-title">Built on a Simple Belief</h2>
          <div className="story-text">
            <p>Students from regional areas deserve the same opportunities and quality education as those in larger cities.</p>
            <p>Since 2018, we have been committed to helping aspiring doctors achieve their goals through quality teaching, dedicated guidance, and a student-first approach.</p>
            <p>Our journey is defined not only by academic results but by the confidence, discipline, and success of every student we mentor.</p>
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
            <p className="quote-text">Concept First.<br/>Clarity Always.<br/>Confidence<br/>Forever.</p>
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
              <h3 className="phil-title">Our Teaching Philosophy</h3>
            </div>
            <ul className="phil-list">
              <li><FaCheckCircle className="check-icon blue-check" /><span>Conceptual clarity before moving to application-based problem solving.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Focus on understanding, not memorizing.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Builds analytical thinking and accuracy for NEET.</span></li>
              <li><FaCheckCircle className="check-icon blue-check" /><span>Preparing independent learners for life, not just exams.</span></li>
            </ul>
            <div className="phil-illustration">
              <div className="illustration-placeholder blue-placeholder">
                Illustration Placeholder
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="philosophy-card green-card">
            <div className="phil-header">
              <div className="phil-icon green-icon-box"><FaUserTie /></div>
              <h3 className="phil-title">Personalized Mentorship</h3>
            </div>
            <ul className="phil-list">
              <li><FaCheckCircle className="check-icon green-check" /><span>Every student learns differently – we guide them individually.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>Continuous support and doubt resolution.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>Equal attention and encouragement for every learner.</span></li>
              <li><FaCheckCircle className="check-icon green-check" /><span>A friendly, disciplined, and motivating environment.</span></li>
            </ul>
            <div className="phil-illustration">
              <div className="illustration-placeholder green-placeholder">
                Illustration Placeholder
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INFRASTRUCTURE SECTION */}
      <section className="infra-section container">
        <div className="eyebrow">
          <span className="eyebrow-text">OUR INFRASTRUCTURE</span>
          <div className="eyebrow-line"></div>
        </div>
        <h2 className="section-title">A Space That Inspires Excellence</h2>
        
        <div className="infra-grid-4">
          
          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (1).webp" alt="Campus" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaBuilding /></div>
              <p className="infra-box-text">Welcoming &<br/>Student-Friendly Campus</p>
            </div>
          </div>
          
          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (2).webp" alt="Classrooms" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaGraduationCap /></div>
              <p className="infra-box-text">Smart Classrooms for<br/>Focused Learning</p>
            </div>
          </div>
          
          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (4).webp" alt="Environment" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaUsers /></div>
              <p className="infra-box-text">Engaging Environment<br/>that Drives Success</p>
            </div>
          </div>
          
          <div className="infra-card-new">
            <div className="infra-img-box">
              <Image src="/images/infra/infra (6).webp" alt="Resources" fill sizes="(max-width: 768px) 100vw, 25vw" className="infra-img" />
            </div>
            <div className="infra-info-box">
              <div className="infra-box-icon"><FaBookOpen /></div>
              <p className="infra-box-text">Resources & Facilities<br/>That Support Growth</p>
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
          margin-top: -60px;
          margin-bottom: 80px;
        }

        .whiteboard-image-container {
          position: relative;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
          background: #ffffff;
          padding: 8px;
        }

        .whiteboard-direct-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          border-radius: 18px;
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
          bottom: 20px;
          right: 20px;
          opacity: 0.8;
          z-index: 0;
        }

        .illustration-placeholder {
          width: 250px;
          height: 200px;
          border: 2px dashed rgba(0,0,0,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          text-align: center;
          color: rgba(0,0,0,0.2);
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
           RESPONSIVE STYLES
           ========================================= */
        @media (max-width: 1024px) {
          .hero-container { flex-direction: column; }
          .hero-image-wrapper { position: relative; right: 0; width: 100%; height: 400px; margin-top: 40px; }
          .story-section { flex-direction: column; gap: 40px; }
          .story-quote-card { bottom: 20px; right: 20px; }
          .philosophy-grid { grid-template-columns: 1fr; }
          .infra-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; }
          .hero-pills { flex-direction: column; }
          .whiteboard-image-container { border-radius: 12px; padding: 4px; }
          .infra-grid-4 { grid-template-columns: 1fr; }
          .footer-dots { display: none; }
        }
      `}</style>
    </main>
  );
}
