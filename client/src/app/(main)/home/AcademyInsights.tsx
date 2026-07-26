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
import { apiFetch } from "@/lib/api";

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



export default function AcademyInsights() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [blogStartIndex, setBlogStartIndex] = useState(0);
  const [videoStartIndex, setVideoStartIndex] = useState(0);
  const [blogItems, setBlogItems] = useState<BlogItem[]>([]);
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [videoItemsPerView, setVideoItemsPerView] = useState(4);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [newsRes, videoRes] = await Promise.all([
          apiFetch<{ data: BlogItem[] }>("/api/v1/content/news"),
          apiFetch<{ data: VideoItem[] }>("/api/v1/content/videos")
        ]);
        if (newsRes && newsRes.data) setBlogItems(newsRes.data);
        if (videoRes && videoRes.data) setVideoItems(videoRes.data);
      } catch (err) {
        console.error("Failed to load insights data", err);
      }
    }
    loadData();
  }, []);

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
              style={{ transform: `translate3d(calc(-${blogStartIndex} * (100% / ${itemsPerView} + ${20 / itemsPerView}px)), 0, 0)` } as React.CSSProperties}
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
                        <span className="blog-category-badge">{blog.category}</span>
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
                        <span className="blog-category-badge">{blog.category}</span>
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
              style={{ transform: `translate3d(calc(-${videoStartIndex} * (100% / ${videoItemsPerView} + ${20 / videoItemsPerView}px)), 0, 0)` } as React.CSSProperties}
            >
              {videoItems.map((video) => (
                <div key={video.id} className="video-card-item-wrapper">
                  <button
                    type="button"
                    className="apple-video-card"
                    onClick={() => setActiveVideo(video.videoUrl)}
                    aria-label={`Play ${video.title}`}
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
                  </button>
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
