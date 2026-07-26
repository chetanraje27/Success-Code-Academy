"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlay,
  FaXmark,
  FaClock,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

interface BlogItem {
  id: number;
  category: string;
  title: string;
  shortTitle?: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  slug: string;
  externalUrl?: string;
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
    id: 0,
    category: "TOI Feature",
    title: '"Stayed away from phone and social media for a year": Highest ranked female candidate Shravani Kudale shares what got her AIR 5 in NEET',
    shortTitle: '"No phone for a year": Shravani Kudale secures AIR 5',
    excerpt: "Shravani Kudale stays away from phone and social media for NEET preparation and gets AIR 5.",
    date: "18 JUL 2026",
    author: "TOI DESK",
    readTime: "4 min read",
    image: "/images/results/heroes/Shravani2.png",
    slug: "shravani-kudale-toi-feature",
    externalUrl: "https://timesofindia.indiatimes.com/life-style/parenting/moments/stayed-away-from-phone-and-social-media-for-a-year-highest-ranked-female-candidate-shravani-kudale-shares-what-got-her-air-5-in-neet/articleshow/132477313.cms"
  },
  {
    id: 1,
    category: "Sakal Feature",
    title: "NEET Exam Result : बारामतीची सिद्धी मुलींमधून राज्यात पहिली; नीट परीक्षेत 665 गुण; ऑल इंडिया रँक 26",
    shortTitle: "NEET Result: बारामतीची सिद्धी राज्यात पहिली",
    excerpt: "बारामती येथील सिद्धीने 'नीट' परीक्षेत तब्बल 665 गुण मिळवीत मुलींमधून संपूर्ण देशात तिसरा क्रमांक पटकावला.",
    date: "17 JUL 2026",
    author: "SAKAL DESK",
    readTime: "3 min read",
    image: "/images/press/siddhi_sakal.png",
    slug: "siddhi-badhe-sakal-feature",
    externalUrl: "https://www.esakal.com/pune/neet-exam-result-baramati-siddhi-badhe-tops-state-among-girls-with-neet-score-of-665-all-india-rank-26-success-motivation-pjp78"
  },
  {
    id: 2,
    category: "HT Feature",
    title: "No phone, no social media for a year: How Maharashtra's NEET topper Shravani Kudale secured AIR 5",
    shortTitle: "Maharashtra's NEET Topper Shravani Kudale (AIR 5)",
    excerpt: "Maharashtra's NEET 2026 topper Shravani Kudale from Pune district scored 710 out of 720.",
    date: "17 JUL 2026",
    author: "HT DESK",
    readTime: "5 min read",
    image: "/images/press/Hindutan1.png",
    slug: "shravani-kudale-ht-feature",
    externalUrl: "https://www.hindustantimes.com/education/exam-results/stayed-away-from-mobile-phones-says-maharashtra-neet-topper-shravani-kudale-101784295153769.html"
  },
  {
    id: 3,
    category: "Campus Life",
    title: "Interactive Classrooms & Late-Night Doubt Desks at SCA",
    shortTitle: "Interactive Classrooms & Doubt Support",
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
    shortTitle: "SCA NEET Mock Test Advantage",
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
    image: "/images/about/infra.png",
    videoUrl: "/videos/SCA_Campus_Tour.mp4"
  },
  {
    id: 2,
    category: "Student Journey",
    title: "Siddhi Badhe: My Journey to AIIMS Delhi",
    excerpt: "Siddhi shares her study schedule, organic chemistry notes, and biology charts that led her to secure a seat at AIIMS Delhi.",
    date: "May 12, 2026",
    duration: "0:58",
    image: "/images/results/heroes/HoneSiddhi.png",
    videoUrl: "/videos/Siddhi_Journey_Video.mp4"
  },
  {
    id: 3,
    category: "Award Ceremony",
    title: "2025 Students Award Ceremony",
    excerpt: "Hear from our top rankers about their daily revision habits, NCERT reading tricks, and how they managed exam-day stress.",
    date: "June 02, 2026",
    duration: "2:21",
    image: "/videos/Cover/Award_Cere_Cover.png",
    videoUrl: "/videos/Award_Ceremony.mp4"
  },
  {
    id: 4,
    category: "Student Journey",
    title: "Samruddhi Lokhande : My Journey to AIIMS Nagpur",
    excerpt: "Her formula flashcard strategy, mock test timing practices, and advice for fellow repeaters.",
    date: "June 08, 2026",
    duration: "7:45",
    image: "/images/results/heroes/HomeSamruddhi.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 5,
    category: "Study Tips",
    title: "Mastering Physics Numericals",
    excerpt: "Expert faculty breaks down the approach to solve complex physics problems quickly.",
    date: "July 10, 2026",
    duration: "12:15",
    image: "/images/blogs/classroom_doubts.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 6,
    category: "Motivation",
    title: "Never Give Up - Director's Message",
    excerpt: "An inspiring talk by our founder on staying focused and motivated during tough times.",
    date: "August 01, 2026",
    duration: "5:30",
    image: "/images/banners/upcoming_batches_hero.png",
    videoUrl: "/videos/SCA_Campus_Tour.mp4"
  }
];

export default function AcademyInsights() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [blogStartIndex, setBlogStartIndex] = useState(0);
  const [videoStartIndex, setVideoStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [videoItemsPerView, setVideoItemsPerView] = useState(4);

  React.useEffect(() => {
    const updateView = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth <= 640) {
          setItemsPerView(1);
          setVideoItemsPerView(1);
        } else if (window.innerWidth <= 1024) {
          setItemsPerView(2);
          setVideoItemsPerView(3);
        } else {
          setItemsPerView(3);
          setVideoItemsPerView(4);
        }
      }
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const handlePrevBlog = () => {
    setBlogStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextBlog = () => {
    setBlogStartIndex((prev) => Math.min(blogItems.length - itemsPerView, prev + 1));
  };

  const handlePrevVideo = () => {
    setVideoStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextVideo = () => {
    setVideoStartIndex((prev) => Math.min(videoItems.length - videoItemsPerView, prev + 1));
  };


  return (
    <section className="insights-outer-section">
      <div className="insights-premium-container">

        {/* ==================== SECTION 1: BLOGS ==================== */}
        <div className="insights-sub-section">
          <div className="section-header">
            <div className="header-text">
              <h2 className="main-heading">
                <EditableText
                  contentKey="insights.news.heading"
                  label="news section heading"
                >
                  Success Code Achievers in the News
                </EditableText>
              </h2>
              <p className="subtitle">
                <EditableText
                  contentKey="insights.news.description"
                  label="news section description"
                  kind="multiline"
                >
                  Read about the incredible achievements and stories of Success Code Academy toppers featured in top national news publications.
                </EditableText>
              </p>
            </div>
            <div className="carousel-controls">
              <button
                onClick={handlePrevBlog}
                disabled={blogStartIndex === 0}
                className="control-btn"
                aria-label="Previous articles"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextBlog}
                disabled={blogStartIndex >= blogItems.length - itemsPerView}
                className="control-btn"
                aria-label="Next articles"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="blog-slider-container">
            <div
              className="cards-grid-layout"
              style={{ transform: `translate3d(calc(-${blogStartIndex} * (100% / ${itemsPerView} + ${itemsPerView > 1 ? 10 : 0}px)), 0, 0)` } as React.CSSProperties}
            >
              {blogItems.map((blog) => (
                <div key={blog.id} className="card-item-wrapper">
                  {blog.externalUrl ? (
                    <a href={blog.externalUrl} target="_blank" rel="noopener noreferrer" className="blog-card-link">
                      <article className="blog-cover-card">
                        <div className="blog-image-overlay" />
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="400px"
                          className="blog-bg-img"
                        />
                        <div className="blog-card-content">
                          <span className="blog-meta-text">
                            {blog.date} | BY {blog.author}
                          </span>
                          <h3 className="blog-card-title-text desktop-title">{blog.title}</h3>
                          <h3 className="blog-card-title-text mobile-title">{blog.shortTitle || blog.title}</h3>
                        </div>
                      </article>
                    </a>
                  ) : (
                    <Link href={`/blogs/${blog.slug}`} className="blog-card-link">
                      <article className="blog-cover-card">
                        <div className="blog-image-overlay" />
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          sizes="400px"
                          className="blog-bg-img"
                        />
                        <div className="blog-card-content">
                          <span className="blog-meta-text">
                            {blog.date} | BY {blog.author}
                          </span>
                          <h3 className="blog-card-title-text desktop-title">{blog.title}</h3>
                          <h3 className="blog-card-title-text mobile-title">{blog.shortTitle || blog.title}</h3>
                        </div>
                      </article>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ==================== SECTION 2: VIDEOS (THEME MATCHED LIGHT THEME WITH GRID PATTERN) ==================== */}
      <div className="video-section-premium-wrap">
        <div className="insights-premium-container">
          <div className="section-header">
            <div className="header-text">
              <h2 className="main-heading">
                <EditableText
                  contentKey="insights.videos.heading"
                  label="video section heading"
                >
                  Get to know Success Code Academy.
                </EditableText>
              </h2>
              <p className="subtitle">
                <EditableText
                  contentKey="insights.videos.description"
                  label="video section description"
                  kind="multiline"
                >
                  Watch classroom campus tours, NEET ranker preparation interviews, and annual felicitation ceremonies.
                </EditableText>
              </p>
            </div>
            <div className="carousel-controls">
              <button
                onClick={handlePrevVideo}
                disabled={videoStartIndex === 0}
                className="control-btn"
                aria-label="Previous videos"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextVideo}
                disabled={videoStartIndex >= videoItems.length - videoItemsPerView}
                className="control-btn"
                aria-label="Next videos"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* 4-Column / Responsive Slider for Videos */}
          <div className="blog-slider-container">
            <div
              className="video-cards-grid-layout"
              style={{ transform: `translate3d(calc(-${videoStartIndex} * (100% / ${videoItemsPerView} + ${videoItemsPerView > 1 ? 10 : 0}px)), 0, 0)` } as React.CSSProperties}
            >
              {videoItems.map((video) => (
                <div key={video.id} className="video-card-item-wrapper">
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
                </div>
              ))}
            </div>
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
    </section>
  );
}
