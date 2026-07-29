"use client";

import Image from "next/image";
import {
  FaAward,
  FaBookOpen,
  FaBuilding,
  FaCalendarAlt,
  FaCheck,
  FaGraduationCap,
  FaLightbulb,
  FaStar,
  FaTrophy,
  FaUniversity,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { EditableText } from "@/components/admin/EditableText";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-container about-hero-grid">
          <div className="about-hero-copy">
            <div className="about-kicker">
              <span>
                <EditableText contentKey="hero.eyebrow" label="about eyebrow">
                  ABOUT US
                </EditableText>
              </span>
              <i aria-hidden="true" />
            </div>

            <h1 className="about-hero-title">
              <EditableText contentKey="hero.heading" label="about page heading">
                Empowering Dreams. Building Future Doctors.
              </EditableText>
            </h1>

            <p className="about-hero-description">
              <EditableText
                contentKey="hero.description"
                label="about page introduction"
                kind="multiline"
              >
                Since 2018, Success Code Academy has been shaping the future of
                NEET aspirants from Baramati and beyond with quality education,
                mentorship, and unwavering support.
              </EditableText>
            </p>

            <div className="about-hero-metrics">
              <div className="about-hero-metric">
                <span className="about-metric-icon">
                  <FaCalendarAlt />
                </span>
                <span className="about-metric-copy">
                  <small>Founded in</small>
                  <strong>2018</strong>
                </span>
              </div>

              <div className="about-hero-metric">
                <span className="about-metric-icon">
                  <FaTrophy />
                </span>
                <span className="about-metric-copy">
                  <small>Students Admitted</small>
                  <strong>36+</strong>
                  <em>NEET 2025</em>
                </span>
              </div>
            </div>
          </div>

          <div className="about-map-card">
            <div className="about-map-image">
              <Image
                src="/images/about/map.png"
                alt="Impact Map"
                fill
                sizes="(max-width: 900px) 100vw, 52vw"
                className="about-map-img"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-impact about-section">
        <div className="about-container">
          <header className="about-section-heading about-section-heading-centered">
            <span className="about-section-label">Our NEET Achievements</span>
            <span className="about-heading-rule" aria-hidden="true">
              <i />
            </span>
          </header>

          <div className="about-achievement-grid">
            <article className="about-rank-card">
              <div className="about-rank-card-copy">
                <span className="about-achievement-year">NEET 2026</span>
                <span className="about-rank-label">AIR</span>
                <strong className="about-rank-value">5</strong>
              </div>
              <div className="about-rank-emblem" aria-hidden="true">
                <FaTrophy />
                <span />
              </div>
            </article>

            <article className="about-rank-card about-rank-card-accent">
              <div className="about-rank-card-copy">
                <span className="about-achievement-year">NEET 2025</span>
                <span className="about-rank-label">AIR</span>
                <strong className="about-rank-value">26</strong>
              </div>
              <div className="about-rank-emblem" aria-hidden="true">
                <FaAward />
                <span />
              </div>
            </article>

            <article className="about-achievement-card about-achievement-selections">
              <span className="about-achievement-icon">
                <FaUsers />
              </span>
              <strong>36+</strong>
              <p>Selections in<br />NEET 2025</p>
            </article>

            <article className="about-achievement-card about-achievement-colleges">
              <span className="about-achievement-icon">
                <FaUniversity />
              </span>
              <h3>Admissions in<br />Top Government Colleges</h3>
              <p>AIIMS &amp; State Government<br />Medical Colleges</p>
            </article>

            <article className="about-achievement-card about-achievement-institutes">
              <span className="about-achievement-icon">
                <FaBuilding />
              </span>
              <h3>Admission in<br />Top Institutes</h3>
              <p>AIIMS &amp; Other Premier<br />Institutes</p>
            </article>

            <article className="about-achievement-card about-achievement-ratio">
              <span className="about-achievement-icon">
                <FaTrophy />
              </span>
              <h3>Top<br />Selection Ratio</h3>
              <div className="about-stars" aria-label="Five stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="about-story about-section">
        <div className="about-container about-story-grid">
          <div className="about-story-media">
            <div className="about-story-image">
              <Image
                src="/images/infra/infra (3).webp"
                alt="Our Story"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="about-story-img"
              />
            </div>

            <blockquote className="about-story-quote">
              <span aria-hidden="true">“</span>
              <p>
                Concept First.<br />
                Clarity Always.<br />
                Confidence<br />
                Forever.
              </p>
            </blockquote>
          </div>

          <div className="about-story-copy">
            <div className="about-kicker">
              <span>
                <EditableText contentKey="story.eyebrow" label="story eyebrow">
                  OUR STORY
                </EditableText>
              </span>
              <i aria-hidden="true" />
            </div>

            <h2 className="about-section-title">
              <EditableText contentKey="story.heading" label="story heading">
                Built on a Simple Belief
              </EditableText>
            </h2>

            <div className="about-story-text">
              <p>
                <EditableText
                  contentKey="story.paragraph-1"
                  label="story paragraph 1"
                  kind="multiline"
                >
                  Students from regional areas deserve the same opportunities
                  and quality education as those in larger cities.
                </EditableText>
              </p>
              <p>
                <EditableText
                  contentKey="story.paragraph-2"
                  label="story paragraph 2"
                  kind="multiline"
                >
                  Since 2018, we have been committed to helping aspiring doctors
                  achieve their goals through quality teaching, dedicated
                  guidance, and a student-first approach.
                </EditableText>
              </p>
              <p>
                <EditableText
                  contentKey="story.paragraph-3"
                  label="story paragraph 3"
                  kind="multiline"
                >
                  Our journey is defined not only by academic results but by the
                  confidence, discipline, and success of every student we
                  mentor.
                </EditableText>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-philosophy about-section">
        <div className="about-container">
          <div className="about-philosophy-grid">
            <article className="about-philosophy-card about-teaching-card">
              <div className="about-philosophy-visual about-teaching-visual" aria-hidden="true">
                <FaLightbulb />
                <span className="about-open-book">
                  <i />
                  <i />
                </span>
              </div>

              <header className="about-philosophy-header">
                <span className="about-philosophy-icon">
                  <FaLightbulb />
                </span>
                <h2>
                  <EditableText
                    contentKey="philosophy.teaching.heading"
                    label="teaching philosophy heading"
                  >
                    Our Teaching Philosophy
                  </EditableText>
                </h2>
              </header>

              <ul className="about-philosophy-list">
                <li>
                  <FaCheck />
                  <span>Conceptual clarity before moving to application-based problem solving.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>Focus on understanding, not memorizing.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>Builds analytical thinking and accuracy for NEET.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>Preparing independent learners for life, not just exams.</span>
                </li>
              </ul>
            </article>

            <article className="about-philosophy-card about-mentorship-card">
              <div className="about-philosophy-visual about-mentorship-visual" aria-hidden="true">
                <FaUserTie className="about-mentor-figure" />
                <span className="about-student-figure">
                  <FaGraduationCap />
                </span>
                <i className="about-guidance-path" />
              </div>

              <header className="about-philosophy-header">
                <span className="about-philosophy-icon">
                  <FaUserTie />
                </span>
                <h2>
                  <EditableText
                    contentKey="philosophy.mentorship.heading"
                    label="mentorship heading"
                  >
                    Personalized Mentorship
                  </EditableText>
                </h2>
              </header>

              <ul className="about-philosophy-list">
                <li>
                  <FaCheck />
                  <span>Every student learns differently – we guide them individually.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>Continuous support and doubt resolution.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>Equal attention and encouragement for every learner.</span>
                </li>
                <li>
                  <FaCheck />
                  <span>A friendly, disciplined, and motivating environment.</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="about-infrastructure about-section">
        <div className="about-container">
          <header className="about-infrastructure-heading">
            <div>
              <div className="about-kicker">
                <span>
                  <EditableText
                    contentKey="infrastructure.eyebrow"
                    label="infrastructure eyebrow"
                  >
                    OUR INFRASTRUCTURE
                  </EditableText>
                </span>
                <i aria-hidden="true" />
              </div>
              <h2 className="about-section-title">
                <EditableText
                  contentKey="infrastructure.heading"
                  label="infrastructure heading"
                >
                  A Space That Inspires Excellence
                </EditableText>
              </h2>
            </div>
          </header>

          <div className="about-infrastructure-grid">
            <article className="about-infrastructure-card about-infrastructure-card-wide">
              <Image
                src="/images/infra/infra (1).webp"
                alt="Campus"
                fill
                sizes="(max-width: 700px) 100vw, 58vw"
                className="about-infrastructure-img"
              />
              <div className="about-infrastructure-overlay">
                <span><FaBuilding /></span>
                <p>Welcoming &amp;<br />Student-Friendly Campus</p>
              </div>
            </article>

            <article className="about-infrastructure-card">
              <Image
                src="/images/infra/infra (2).webp"
                alt="Classrooms"
                fill
                sizes="(max-width: 700px) 100vw, 42vw"
                className="about-infrastructure-img"
              />
              <div className="about-infrastructure-overlay">
                <span><FaGraduationCap /></span>
                <p>Smart Classrooms for<br />Focused Learning</p>
              </div>
            </article>

            <article className="about-infrastructure-card">
              <Image
                src="/images/infra/infra (4).webp"
                alt="Environment"
                fill
                sizes="(max-width: 700px) 100vw, 42vw"
                className="about-infrastructure-img"
              />
              <div className="about-infrastructure-overlay">
                <span><FaUsers /></span>
                <p>Engaging Environment<br />that Drives Success</p>
              </div>
            </article>

            <article className="about-infrastructure-card about-infrastructure-card-wide">
              <Image
                src="/images/infra/infra (6).webp"
                alt="Resources"
                fill
                sizes="(max-width: 700px) 100vw, 58vw"
                className="about-infrastructure-img"
              />
              <div className="about-infrastructure-overlay">
                <span><FaBookOpen /></span>
                <p>Resources &amp; Facilities<br />That Support Growth</p>
              </div>
            </article>
          </div>

          <blockquote className="about-closing-quote">
            <span aria-hidden="true">“</span>
            <p>
              We don&apos;t just prepare students for exams, we prepare them for
              their future.
            </p>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
