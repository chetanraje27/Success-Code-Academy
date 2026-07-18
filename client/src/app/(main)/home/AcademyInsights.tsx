"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlay,
  FaXmark,
  FaClock
} from "react-icons/fa6";

interface BlogItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  slug: string;
}

interface VideoItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  duration: string;
  image: string;
  videoUrl: string;
}

const blogItems: BlogItem[] = [
  {
    id: 1,
    category: "Why Choose Us",
    title: "Why Top Doctors Recommend Our NEET Classroom Batches",
    excerpt: "Our core academic team explains the benefits of the custom classroom mentorship and doubt clearance system.",
    date: "28 MAY 2026",
    author: "DR. S. PATIL",
    readTime: "6 min read",
    image: "/images/blogs/doctors_recommend.png",
    slug: "why-doctors-recommend-sca"
  },
  {
    id: 2,
    category: "Success Stories",
    title: "How Anushka Scored 675/720 in NEET UG 2025",
    excerpt: "Anushka explains how mock test correction booklets helped raise her physics score.",
    date: "10 JUN 2026",
    author: "ANUSHKA J.",
    readTime: "9 min read",
    image: "/images/blogs/study_desk.png",
    slug: "anushka-neet-score-breakdown"
  },
  {
    id: 3,
    category: "Campus Life",
    title: "Interactive Classrooms & Late-Night Doubt Desks at SCA",
    excerpt: "A look at how our subject expert mentors resolve individual student doubts post-lectures.",
    date: "18 JUN 2026",
    author: "PROF. K. JADHAV",
    readTime: "3 min read",
    image: "/images/blogs/classroom_doubts.png",
    slug: "interactive-classrooms-doubt-desks"
  },
  {
    id: 4,
    category: "Academic Edge",
    title: "Analyzing the SCA NEET Offline Mock Test Edge",
    excerpt: "Discover how our All India Test Series simulates exact NTA pressures.",
    date: "22 MAY 2026",
    author: "MOCK DEPT",
    readTime: "5 min read",
    image: "/images/blogs/mock_test.png",
    slug: "sca-mock-test-edge"
  }
];

const videoItems: VideoItem[] = [
  {
    id: 1,
    category: "Campus Tour",
    title: "Success Code Academy Campus Tour",
    excerpt: "Take a virtual tour of our state-of-the-art digital classrooms, advanced study cabins, and library resource center.",
    date: "June 15, 2026",
    duration: "4:02",
    image: "/images/blogs/campus_tour.png",
    videoUrl: "/videos/SCA_Campus_Tour.mp4"
  },
  {
    id: 2,
    category: "Student Journey",
    title: "Siddhi Badhe: My Journey to AIIMS Delhi",
    excerpt: "Siddhi shares her study schedule, organic chemistry notes, and biology charts that led her to secure a seat at AIIMS Delhi.",
    date: "May 12, 2026",
    duration: "0:58",
    image: "/images/results/2025/SiddhiBadhe.png",
    videoUrl: "/videos/Siddhi_Journey_Video.mp4"
  },
  {
    id: 3,
    category: "Award Ceremony",
    title: "2025 Students Award Ceremony",
    excerpt: "Hear from our top rankers about their daily revision habits, NCERT reading tricks, and how they managed exam-day stress.",
    date: "June 02, 2026",
    duration: "2:21",
    image: "images/Award_Cere_Cover.png",
    videoUrl: "videos/Award_Ceremony.mp4"
  },
  {
    id: 4,
    category: "Student Journey",
    title: "Samruddhi Lokhande : My Journey to AIIMS Nagpur",
    excerpt: "Her formula flashcard strategy, mock test timing practices, and advice for fellow repeaters.",
    date: "June 08, 2026",
    duration: "7:45",
    image: "/images/results/2025/SamruddhiLokhande.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export default function AcademyInsights() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);


  return (
    <section className="insights-outer-section">
      <div className="insights-premium-container">

        {/* ==================== SECTION 1: BLOGS ==================== */}
        <div className="insights-sub-section">
          <div className="section-header">
            <div className="header-text">
              <h2 className="main-heading">Academic Insights & Articles</h2>
              <p className="subtitle">
                Expert prep strategies, ranker guides, and syllabus analysis from our premium medical faculty.
              </p>
            </div>
            <div className="header-right-action">
              <Link href="/blogs" className="view-all-link">
                View All Blogs <span className="arrow-right-sym">→</span>
              </Link>
            </div>
          </div>

          <div className="cards-grid-layout">
            {blogItems.slice(0, 3).map((blog) => (
              <div key={blog.id} className="card-item-wrapper">
                <Link href={`/blogs/${blog.slug}`} className="blog-card-link">
                  <article className="blog-cover-card">
                    <div className="blog-image-overlay" />
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      unoptimized
                      sizes="400px"
                      className="blog-bg-img"
                    />
                    <div className="blog-card-content">
                      <span className="blog-meta-text">
                        {blog.date} | BY {blog.author}
                      </span>
                      <h3 className="blog-card-title-text">{blog.title}</h3>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ==================== SECTION 2: VIDEOS (THEME MATCHED LIGHT THEME WITH GRID PATTERN) ==================== */}
      <div className="video-section-premium-wrap">
        <div className="insights-premium-container">
          <div className="section-header">
            <div className="header-text">
              <h2 className="main-heading">Get to know Success Code Academy.</h2>
              <p className="subtitle">
                Watch classroom campus tours, NEET ranker preparation interviews, and annual felicitation ceremonies.
              </p>
            </div>
            <div className="header-right-action">
              <Link href="/gallery" className="view-all-link">
                View All Videos <span className="arrow-right-sym">→</span>
              </Link>
            </div>
          </div>

          {/* 3-Column Vertical Apple-Style Card Grid */}
          <div className="apple-grid-layout">
            {videoItems.map((video) => (
              <div
                key={video.id}
                className="apple-video-card"
                onClick={() => setActiveVideo(video.videoUrl)}
              >
                {/* Full Card Cover Image */}
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  unoptimized
                  sizes="400px"
                  className="apple-card-bg-img"
                />

                {/* Top and bottom gradient overlays for text legibility */}
                <div className="apple-card-gradient-overlay" />

                {/* Content Overlay */}
                <div className="apple-card-content">
                  {/* Play Button Icon absolute centered */}
                  <div className="apple-play-btn-wrap">
                    <div className="apple-play-pulse"></div>
                    <div className="apple-play-btn-circle">
                      <FaPlay className="apple-play-icon" />
                    </div>
                  </div>

                  {/* Bottom Text and Duration row */}
                  <div className="apple-card-bottom-info">
                    <div className="apple-card-meta-row">
                      <span className="apple-card-category">{video.category}</span>
                      <div className="apple-duration-badge">
                        <FaClock className="clock-icon-svg" /> <span>{video.duration}</span>
                      </div>
                    </div>
                    <h3 className="apple-card-title">{video.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveVideo(null)} aria-label="Close modal">
              <FaXmark />
            </button>
            <div className="iframe-container">
              {activeVideo.endsWith(".mp4") ? (
                <video
                  src={activeVideo}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%", borderRadius: "12px", border: "none", outline: "none", background: "#000000" }}
                />
              ) : (
                <iframe
                  src={activeVideo}
                  title="SCA Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .insights-outer-section {
          padding: 40px 0 0 0;
          background: var(--bg-base);
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        /* Set same Outfit font style for all elements */
        .insights-outer-section,
        .insights-outer-section h2,
        .insights-outer-section h3,
        .insights-outer-section p,
        .insights-outer-section span,
        .insights-outer-section button,
        .insights-outer-section a {
          font-family: 'Outfit', sans-serif !important;
        }

        .insights-premium-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .insights-sub-section {
          width: 100%;
          margin-bottom: 30px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .header-text {
          max-width: 680px;
          text-align: left;
        }

        .small-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          margin-bottom: 8px;
          padding: 3px 10px;
          border-radius: 99px;
          text-transform: uppercase;
        }
        .font-light-bg {
          color: var(--accent-secondary);
          background: rgba(30, 64, 175, 0.06);
        }
        .font-dark-bg {
          color: #40b5c1;
          background: rgba(64, 181, 193, 0.15);
        }

        .main-heading {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .view-all-link {
          font-size: 0.82rem;
          font-weight: 750;
          color: var(--accent-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg-surface);
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid var(--bg-surface-border);
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          transition: all 0.25s ease;
        }

        .view-all-link:hover {
          background: var(--accent-secondary);
          color: var(--bg-surface);
          border-color: var(--accent-secondary);
        }

        .arrow-right-sym {
          transition: transform 0.2s ease;
        }

        .view-all-link:hover .arrow-right-sym {
          transform: translateX(4px);
        }

        /* 3-column Grid for Blogs */
        .cards-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }

        .card-item-wrapper {
          width: 100%;
          display: flex;
        }

        /* ============ Cover-Image Blog Cards ============ */
        .blog-card-link {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        .blog-cover-card {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: flex-end;
          background: #0f172a;
        }

        @media (min-width: 641px) {
          .blog-cover-card {
            aspect-ratio: 16 / 11;
          }
        }

        .blog-cover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 35px rgba(15, 23, 42, 0.12);
        }

        .blog-bg-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .blog-cover-card:hover .blog-bg-img {
          transform: scale(1.04);
        }

        .blog-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0) 30%, rgba(15, 23, 42, 0.6) 70%, rgba(15, 23, 42, 0.88) 100%);
          z-index: 2;
          transition: background 0.3s ease;
        }

        .blog-cover-card:hover .blog-image-overlay {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0) 20%, rgba(15, 23, 42, 0.68) 60%, rgba(15, 23, 42, 0.94) 100%);
        }

        .blog-card-content {
          position: relative;
          z-index: 3;
          padding: 16px;
          color: #ffffff;
          width: 100%;
          box-sizing: border-box;
          text-align: left;
        }

        .blog-meta-text {
          display: block;
          font-size: 0.68rem;
          font-weight: 750;
          color: rgba(255, 255, 255, 0.82);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .blog-card-title-text {
          font-size: 1.02rem;
          font-weight: 800;
          line-height: 1.3;
          color: #ffffff;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        /* ============ SECTION 2: VIDEOS APPLE-STYLE GRID (THEME-MATCHED LIGHT BG + GRID) ============ */
        .video-section-premium-wrap {
          background-color: var(--bg-surface);
          background-image: 
            linear-gradient(rgba(15, 23, 42, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.012) 1px, transparent 1px);
          background-size: 32px 32px;
          padding: 40px 0;
          width: 100%;
          margin-top: 20px;
          position: relative;
          border-top: 1px solid var(--bg-surface-border);
          border-bottom: 1px solid var(--bg-surface-border);
        }

        .apple-grid-layout {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 1060px;
          margin: 24px auto 0 auto;
        }

        .apple-video-card {
          position: relative;
          aspect-ratio: 0.87;
          width: 245;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 10px 0px 2px rgba(15, 23, 42, 0.06);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #0f172a;
          box-sizing: border-box;
        }

        .apple-video-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 16px 36px rgba(15, 23, 42, 0.12),
            0 6px 16px -8px rgba(15, 23, 42, 0.05);
        }

        .apple-card-bg-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1;
        }

        .apple-video-card:hover .apple-card-bg-img {
          transform: scale(1.04);
        }

        /* Combined gradient overlay for top & bottom readability */
        .apple-card-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0.8) 100%);
          z-index: 2;
          transition: background 0.3s;
        }

        .apple-video-card:hover .apple-card-gradient-overlay {
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.85) 100%);
        }

        .apple-card-content {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          box-sizing: border-box;
        }

        .apple-card-bottom-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
        }

        .apple-card-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 6px;
        }

        .apple-card-category {
          font-size: 0.65rem;
          font-weight: 750;
          color: rgba(255, 255, 255, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .apple-card-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .apple-play-btn-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }

        .apple-video-card:hover .apple-play-btn-wrap {
          transform: translate(-50%, -50%) scale(1.1);
        }

        .apple-play-btn-circle {
          position: absolute;
          inset: 0;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #020617;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          z-index: 5;
          transition: all 0.3s;
        }

        .apple-video-card:hover .apple-play-btn-circle {
          background: #40b5c1;
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(64,181,193,0.4);
        }

        .apple-play-icon {
          font-size: 0.65rem;
          margin-left: 2px;
        }

        .apple-play-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          pointer-events: none;
          z-index: 3;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .apple-video-card:hover .apple-play-pulse {
          animation: ringPulseLight 1.8s infinite linear;
          opacity: 1;
        }

        @keyframes ringPulseLight {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        .apple-duration-badge {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        :global(.clock-icon-svg) {
          font-size: 0.72rem;
        }

        /* Modal Overlay */
        .video-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          width: 100%;
          max-width: 800px;
          background: #000000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .iframe-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
        }

        .iframe-container iframe,
        .iframe-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          outline: none;
          background: #000000;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .cards-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .main-heading {
            font-size: 1.85rem;
          }
          .apple-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .header-right-action {
            align-self: flex-start;
          }
          .insights-premium-container {
            gap: 40px;
          }
          .apple-video-card {
            aspect-ratio: 4 / 5;
          }
        }

        @media (max-width: 640px) {
          .insights-outer-section {
            padding: 40px 0 0 0;
          }
          .video-section-premium-wrap {
            padding: 40px 0;
          }
          .cards-grid-layout {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            gap: 16px;
            padding: 10px 4px;
            margin: 0 -24px;
            padding-left: 24px;
            padding-right: 24px;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .cards-grid-layout::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
          .card-item-wrapper {
            flex: 0 0 80%; /* 80% width so the next card is partially visible */
            scroll-snap-align: start;
          }
          .blog-cover-card {
            aspect-ratio: 16 / 12;
          }
          .apple-grid-layout {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            gap: 12px;
            padding: 20px 48px;
            margin: 0 -24px;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          .apple-grid-layout::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
          .apple-video-card {
            flex: 0 0 76%;
            scroll-snap-align: center;
            aspect-ratio: 3 / 4;
            transition: all 0.3s ease;
          }
          .apple-video-card:nth-child(odd) {
            transform: rotate(-1.5deg) scale(0.96);
          }
          .apple-video-card:nth-child(even) {
            transform: rotate(1.5deg) scale(0.96);
          }
          .apple-video-card:active {
            transform: rotate(0deg) scale(1.02);
          }
          .apple-play-pulse {
            animation: ringPulseLight 1.8s infinite linear;
            opacity: 1;
          }
          .main-heading {
            font-size: 1.55rem;
          }
          .subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </section>
  );
}
