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
                  <small><EditableText contentKey="hero.metric1.label" label="metric 1 label">Founded in</EditableText></small>
                  <strong><EditableText contentKey="hero.metric1.value" label="metric 1 value">2018</EditableText></strong>
                </span>
              </div>

              <div className="about-hero-metric">
                <span className="about-metric-icon">
                  <FaTrophy />
                </span>
                <span className="about-metric-copy">
                  <small><EditableText contentKey="hero.metric2.label" label="metric 2 label">Students Admitted</EditableText></small>
                  <strong><EditableText contentKey="hero.metric2.value" label="metric 2 value">36+</EditableText></strong>
                  <em><EditableText contentKey="hero.metric2.subtext" label="metric 2 subtext">NEET 2025</EditableText></em>
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
          <div className="about-achievement-grid">
            <article className="about-rank-card">
              <div className="about-rank-card-copy">
                <span className="about-achievement-year"><EditableText contentKey="impact.rank1.year" label="rank 1 year">NEET 2026</EditableText></span>
                <span className="about-rank-label"><EditableText contentKey="impact.rank1.label" label="rank 1 label">AIR</EditableText></span>
                <strong className="about-rank-value"><EditableText contentKey="impact.rank1.value" label="rank 1 value">5</EditableText></strong>
              </div>
              <div className="about-rank-emblem" aria-hidden="true">
                <FaTrophy />
                <span />
              </div>
            </article>

            <article className="about-rank-card about-rank-card-accent">
              <div className="about-rank-card-copy">
                <span className="about-achievement-year"><EditableText contentKey="impact.rank2.year" label="rank 2 year">NEET 2025</EditableText></span>
                <span className="about-rank-label"><EditableText contentKey="impact.rank2.label" label="rank 2 label">AIR</EditableText></span>
                <strong className="about-rank-value"><EditableText contentKey="impact.rank2.value" label="rank 2 value">26</EditableText></strong>
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
              <strong><EditableText contentKey="impact.card1.value" label="impact card 1 value">36+</EditableText></strong>
              <p><EditableText contentKey="impact.card1.text" label="impact card 1 text" kind="multiline">{"Selections in\nNEET 2025"}</EditableText></p>
            </article>

            <article className="about-achievement-card about-achievement-colleges">
              <span className="about-achievement-icon">
                <FaUniversity />
              </span>
              <h3><EditableText contentKey="impact.card2.title" label="impact card 2 title" kind="multiline">{"Admissions in\nTop Government Colleges"}</EditableText></h3>
              <p><EditableText contentKey="impact.card2.text" label="impact card 2 text" kind="multiline">{"AIIMS & State Government\nMedical Colleges"}</EditableText></p>
            </article>

            <article className="about-achievement-card about-achievement-institutes">
              <span className="about-achievement-icon">
                <FaBuilding />
              </span>
              <h3><EditableText contentKey="impact.card3.title" label="impact card 3 title" kind="multiline">{"Admission in\nTop Institutes"}</EditableText></h3>
              <p><EditableText contentKey="impact.card3.text" label="impact card 3 text" kind="multiline">{"AIIMS & Other Premier\nInstitutes"}</EditableText></p>
            </article>

            <article className="about-achievement-card about-achievement-ratio">
              <span className="about-achievement-icon">
                <FaTrophy />
              </span>
              <h3><EditableText contentKey="impact.card4.title" label="impact card 4 title" kind="multiline">{"Top\nSelection Ratio"}</EditableText></h3>
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
                <EditableText contentKey="story.quote" label="story quote" kind="multiline">
                  {"Concept First.\nClarity Always.\nConfidence\nForever."}
                </EditableText>
              </p>
            </blockquote>
          </div>

          <div className="about-story-copy">
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
                  <span><EditableText contentKey="philosophy.teaching.item1" label="teaching item 1">Conceptual clarity before moving to application-based problem solving.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.teaching.item2" label="teaching item 2">Focus on understanding, not memorizing.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.teaching.item3" label="teaching item 3">Builds analytical thinking and accuracy for NEET.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.teaching.item4" label="teaching item 4">Preparing independent learners for life, not just exams.</EditableText></span>
                </li>
              </ul>
            </article>

            <article className="about-philosophy-card about-mentorship-card">
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
                  <span><EditableText contentKey="philosophy.mentorship.item1" label="mentorship item 1">Every student learns differently – we guide them individually.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.mentorship.item2" label="mentorship item 2">Continuous support and doubt resolution.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.mentorship.item3" label="mentorship item 3">Equal attention and encouragement for every learner.</EditableText></span>
                </li>
                <li>
                  <FaCheck />
                  <span><EditableText contentKey="philosophy.mentorship.item4" label="mentorship item 4">A friendly, disciplined, and motivating environment.</EditableText></span>
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
                <p><EditableText contentKey="infrastructure.card1" label="infra card 1" kind="multiline">{"Welcoming &\nStudent-Friendly Campus"}</EditableText></p>
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
                <p><EditableText contentKey="infrastructure.card2" label="infra card 2" kind="multiline">{"Smart Classrooms for\nFocused Learning"}</EditableText></p>
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
                <p><EditableText contentKey="infrastructure.card3" label="infra card 3" kind="multiline">{"Engaging Environment\nthat Drives Success"}</EditableText></p>
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
                <p><EditableText contentKey="infrastructure.card4" label="infra card 4" kind="multiline">{"Resources & Facilities\nThat Support Growth"}</EditableText></p>
              </div>
            </article>
          </div>

          <blockquote className="about-closing-quote">
            <span aria-hidden="true">“</span>
            <p>
              <EditableText contentKey="closing.quote" label="closing quote" kind="multiline">
                We don&apos;t just prepare students for exams, we prepare them for their future.
              </EditableText>
            </p>
          </blockquote>
        </div>
      </section>
    </main>
  );
}
