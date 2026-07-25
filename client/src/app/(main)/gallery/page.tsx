"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, 
  FaXmark, 
  FaClock, 
  FaMagnifyingGlass, 
  FaArrowDownShortWide, 
  FaX, 
  FaCalendarDays, 
  FaEye, 
  FaBookmark, 
  FaRegBookmark, 
  FaShareNodes, 
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

interface VideoItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  duration: string;
  image: string;
  videoUrl: string;
  timestamp: number;
  views: string;
  featured?: boolean;
}

const videoItems: VideoItem[] = [
  {
    id: 1,
    category: "Campus Tour",
    title: "Success Code Academy Campus Tour & Facility Infrastructure Walkthrough",
    excerpt: "Take an elite virtual tour of our state-of-the-art digital classrooms, advanced personal study cabins, smart labs, and student library resource center.",
    date: "June 15, 2026",
    duration: "4:02",
    image: "/images/blogs/campus_tour.png",
    videoUrl: "/videos/SCA_Campus_Tour.mp4",
    timestamp: 1781481600,
    views: "2.4K",
    featured: true
  },
  {
    id: 2,
    category: "Student Journey",
    title: "Siddhi Badhe: My Journey to AIIMS Delhi & Physics Prep Strategies",
    excerpt: "Siddhi shares her daily classroom schedule, organic chemistry quick-revision charts, and formulas that led her to secure a top seat at AIIMS Delhi.",
    date: "May 12, 2026",
    duration: "0:58",
    image: "/images/results/2025/SiddhiBadhe.png",
    videoUrl: "/videos/Siddhi_Journey_Video.mp4",
    timestamp: 1778630400,
    views: "5.8K"
  },
  {
    id: 3,
    category: "Award Ceremony",
    title: "2025 Top Rankers & MBBS Scholars Felicitation Award Ceremony",
    excerpt: "Celebrate the outstanding achievements of our NEET aspirants with speeches from parents, instructors, and scholarship distributions.",
    date: "June 02, 2026",
    duration: "2:21",
    image: "/images/banners/Award_Cere_Cover.png",
    videoUrl: "/videos/Award_Ceremony.mp4",
    timestamp: 1780358400,
    views: "1.9K"
  },
  {
    id: 4,
    category: "Student Journey",
    title: "Samruddhi Lokhande: My Selection to AIIMS Nagpur",
    excerpt: "Her preparation plan, mock test corrections diary, drop year strategies, and advice for medical aspirants.",
    date: "June 08, 2026",
    duration: "7:45",
    image: "/images/results/2025/SamruddhiLokhande.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timestamp: 1780876800,
    views: "3.2K"
  },
  {
    id: 5,
    category: "Strategy Sessions",
    title: "NEET Physics Last 90 Days High-Yield Blueprint",
    excerpt: "A comprehensive guide on key topics, error books tracking, and fast problem solving strategies by our senior faculty team.",
    date: "July 01, 2026",
    duration: "15:30",
    image: "/images/banners/target_batch_banner.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timestamp: 1782864000,
    views: "8.4K"
  },
  {
    id: 6,
    category: "Classroom Lecture",
    title: "Understanding Organic Chemistry Reaction Pathways & Mnemonics",
    excerpt: "Deep-dive lecture on electrophilic addition and visual mnemonic shortcuts to master high-weightage chapters easily.",
    date: "June 25, 2026",
    duration: "22:15",
    image: "/images/banners/upcoming_batches_hero.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timestamp: 1782345600,
    views: "4.1K"
  },
  {
    id: 7,
    category: "Strategy Sessions",
    title: "Biology NCERT Fast Memorization Map & Flashcard Method",
    excerpt: "Discover how to retain complex plant taxonomies and biochemical loops using our standard retention methodologies.",
    date: "May 29, 2026",
    duration: "12:40",
    image: "/images/banners/student_banner.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timestamp: 1780099200,
    views: "6.7K"
  }
];

const categoryConfig = [
  { id: "All", label: "All Categories", icon: "📁" },
  { id: "Campus Tour", label: "Campus Tour", icon: "🏫" },
  { id: "Strategy Sessions", label: "Strategy Sessions", icon: "🎯" },
  { id: "Student Journey", label: "Student Journey", icon: "🎓" },
  { id: "Award Ceremony", label: "Award Ceremony", icon: "🏆" },
  { id: "Classroom Lecture", label: "Classroom Lecture", icon: "📚" }
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "views">("newest");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sync Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Modal ESC handler
  useEffect(() => {
    const handleESC = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleESC);
    return () => window.removeEventListener("keydown", handleESC);
  }, []);

  // Trigger Share links
  const triggerShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied to Clipboard!");
    } else {
      showToast(`Sharing: ${title}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Only one Featured Video
  const featuredVideo = useMemo(() => {
    return videoItems.find((v) => v.featured) || videoItems[0];
  }, []);

  // Get active list of videos, ensuring featured video is excluded so it NEVER appears twice
  const nonFeaturedVideos = useMemo(() => {
    return videoItems.filter((v) => v.id !== featuredVideo.id);
  }, [featuredVideo]);

  // Process sorting & filtering
  const processedVideos = useMemo(() => {
    let list = nonFeaturedVideos.filter((video) => {
      const catMatch = activeCategory === "All" || video.category === activeCategory;
      const searchMatch =
        video.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        video.excerpt.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        video.category.toLowerCase().includes(debouncedQuery.toLowerCase());
      return catMatch && searchMatch;
    });

    return list.sort((a, b) => {
      if (sortBy === "views") {
        return parseFloat(b.views) - parseFloat(a.views);
      }
      return b.timestamp - a.timestamp;
    });
  }, [activeCategory, debouncedQuery, sortBy, nonFeaturedVideos]);

  // Group videos by category for horizontal rows (when no active filter or search)
  const groupedCategories = useMemo(() => {
    const groups: Record<string, VideoItem[]> = {};
    nonFeaturedVideos.forEach((video) => {
      if (!groups[video.category]) {
        groups[video.category] = [];
      }
      groups[video.category].push(video);
    });
    return groups;
  }, [nonFeaturedVideos]);

  const handleScrollRow = (rowId: string, direction: "left" | "right") => {
    const element = document.getElementById(rowId);
    if (element) {
      const scrollAmount = direction === "left" ? -360 : 360;
      element.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Check if search/filter is active
  const isFilterActive = useMemo(() => {
    return activeCategory !== "All" || debouncedQuery.trim() !== "";
  }, [activeCategory, debouncedQuery]);

  // Disable body scroll when modal is active
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  return (
    <div className="gallery-page-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="toast-notification"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section (Compact ~320px tall) */}
      <section className="gallery-hero" aria-labelledby="hero-title">
        <div className="container hero-grid-split">
          <div className="hero-left-content">
            <span className="hero-badge">
              <EditableText contentKey="hero.badge" label="gallery badge">
                Success Code Media Library
              </EditableText>
            </span>
            <h1 id="hero-title" className="hero-title">
              <EditableText contentKey="hero.heading" label="gallery heading">
                Learn Beyond the Classroom
              </EditableText>
            </h1>
            <p className="hero-desc">
              <EditableText
                contentKey="hero.description"
                label="gallery introduction"
                kind="multiline"
              >
                Watch campus tours, topper interviews, classroom lectures, and strategic guides to accelerate your NEET prep.
              </EditableText>
            </p>
            <div className="hero-ctas">
              <button onClick={() => setActiveVideo(featuredVideo)} className="btn-primary-custom">
                <FaPlay /> Watch Featured Video
              </button>
            </div>
          </div>

          <div className="hero-right-preview">
            <div 
              onClick={() => setActiveVideo(featuredVideo)} 
              className="featured-preview-card"
            >
              <Image
                src={featuredVideo.image}
                alt="Featured Video Preview"
                fill
                unoptimized
                className="preview-img"
              />
              <div className="preview-overlay">
                <span className="featured-badge-float">Featured</span>
                <span className="duration-badge-float">
                  <FaClock /> {featuredVideo.duration}
                </span>
                <div className="preview-play-glow">
                  <FaPlay className="play-ico" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="gallery-content">
        <div className="container max-width-wrapper">
          
          {/* Search and Filters Toolbar */}
          <div className="toolbar-container">
            <div className="toolbar-search">
              <span className="search-icon"><FaMagnifyingGlass /></span>
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search curated media library"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="clear-btn">
                  <FaX />
                </button>
              )}
            </div>

            <div className="toolbar-filters">
              {/* Category Dropdown */}
              <div className="filter-select-wrap">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by Category"
                >
                  {categoryConfig.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="filter-select-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="filter-select"
                  aria-label="Sort videos"
                >
                  <option value="newest">Newest First</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Catalog Layout logic */}
          {isInitialLoading ? (
            /* Skeleton Shimmer Loaders */
            <div className="skeleton-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-thumb shimmer" />
                  <div className="skeleton-content">
                    <div className="skeleton-bar short shimmer" />
                    <div className="skeleton-bar shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {isFilterActive ? (
                /* 1. Filtered/Search Active View (Clean Grid Layout) */
                <motion.div
                  key="filtered-grid"
                  className="filtered-results-wrap"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="section-head-minimal">
                    <h2 className="section-title">
                      <EditableText
                        contentKey="search.heading"
                        label="gallery search heading"
                      >
                        Search &amp; Filter Results
                      </EditableText>
                    </h2>
                    <p className="sub-title">Found {processedVideos.length} matching resources in catalog.</p>
                  </div>

                  {processedVideos.length > 0 ? (
                    <div className="filtered-grid">
                      {processedVideos.map((video) => (
                        <div 
                          key={video.id} 
                          onClick={() => setActiveVideo(video)}
                          className="video-item-card"
                        >
                          <div className="card-thumb-wrap">
                            <Image
                              src={video.image}
                              alt={video.title}
                              fill
                              unoptimized
                              className="card-img"
                            />
                            <div className="card-thumb-overlay">
                              <div className="card-play-btn-circle">
                                <FaPlay className="card-play-ico" />
                              </div>
                              <span className="card-duration-badge">
                                <FaClock /> {video.duration}
                              </span>
                            </div>
                          </div>

                          <div className="card-details">
                            <span className="card-category">{video.category}</span>
                            <h3 className="card-title">
                              <EditableText
                                contentKey={`video-${video.id}.title`}
                                label={`${video.title} video title`}
                                showInlineControls={false}
                              >
                                {video.title}
                              </EditableText>
                            </h3>
                            <div className="card-meta">
                              <span><FaEye /> {video.views} Views</span>
                              <span><FaCalendarDays /> {video.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Search return empty state screen */
                    <div className="empty-results-box">
                      <span className="empty-results-ico">🔍</span>
                      <h3>No Videos Found</h3>
                      <p>No results match "{debouncedQuery}". Reset search query to browse Categories.</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("All");
                        }}
                        className="btn-primary-custom"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* 2. Standard Horizontal Carousels View */
                <motion.div
                  key="carousels-list"
                  className="carousels-stack"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {categoryConfig.filter((cat) => cat.id !== "All").map((cat) => {
                    const categoryVideos = groupedCategories[cat.id] || [];
                    if (categoryVideos.length === 0) return null;

                    return (
                      <div key={cat.id} className="carousel-row">
                        {/* Carousel Header */}
                        <div className="carousel-header">
                          <h2 className="carousel-title">
                            <span className="carousel-title-icon">{cat.icon}</span> {cat.label}
                          </h2>
                          <div className="carousel-controls">
                            <button 
                              onClick={() => handleScrollRow(cat.id, "left")} 
                              className="carousel-arrow"
                              aria-label={`Scroll ${cat.label} left`}
                            >
                              <FaChevronLeft />
                            </button>
                            <button 
                              onClick={() => handleScrollRow(cat.id, "right")} 
                              className="carousel-arrow"
                              aria-label={`Scroll ${cat.label} right`}
                            >
                              <FaChevronRight />
                            </button>
                          </div>
                        </div>

                        {/* Horizontal Scroll Track */}
                        <div id={cat.id} className="carousel-track">
                          {categoryVideos.map((video) => (
                            <div
                              key={video.id}
                              onClick={() => setActiveVideo(video)}
                              className="video-item-card"
                            >
                              <div className="card-thumb-wrap">
                                <Image
                                  src={video.image}
                                  alt={video.title}
                                  fill
                                  unoptimized
                                  className="card-img"
                                />
                                <div className="card-thumb-overlay">
                                  <div className="card-play-btn-circle">
                                    <FaPlay className="card-play-ico" />
                                  </div>
                                  <span className="card-duration-badge">
                                    <FaClock /> {video.duration}
                                  </span>
                                </div>
                              </div>

                              <div className="card-details">
                                <span className="card-category">{video.category}</span>
                                <h3 className="card-title">
                                  <EditableText
                                    contentKey={`video-${video.id}.title`}
                                    label={`${video.title} video title`}
                                    showInlineControls={false}
                                  >
                                    {video.title}
                                  </EditableText>
                                </h3>
                                <div className="card-meta">
                                  <span><FaEye /> {video.views} Views</span>
                                  <span><FaCalendarDays /> {video.date}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </section>

      {/* Premium Video Modal Lightbox with Related Videos */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              className="lightbox-overlay"
              onClick={() => setActiveVideo(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="lightbox-modal-content"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
              >
                <button
                  className="lightbox-close-btn"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close video player"
                >
                  <FaXmark />
                </button>

                <div className="modal-inner-split">
                  {/* Left: Video Player */}
                  <div className="modal-player-side">
                    <div className="lightbox-video-frame">
                      {activeVideo.videoUrl.includes("youtube.com") || activeVideo.videoUrl.includes("youtu.be") ? (
                        <iframe
                          src={`${activeVideo.videoUrl}?autoplay=1`}
                          title={activeVideo.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="embedded-player"
                        />
                      ) : (
                        <video
                          src={activeVideo.videoUrl}
                          controls
                          autoPlay
                          className="embedded-player"
                        />
                      )}
                    </div>
                    <div className="modal-text-content">
                      <span className="modal-tag">{activeVideo.category}</span>
                      <h2 className="modal-title">
                        <EditableText
                          contentKey={`video-${activeVideo.id}.title`}
                          label={`${activeVideo.title} video title`}
                          showInlineControls={false}
                        >
                          {activeVideo.title}
                        </EditableText>
                      </h2>
                      <p className="modal-excerpt">
                        <EditableText
                          contentKey={`video-${activeVideo.id}.excerpt`}
                          label={`${activeVideo.title} video description`}
                          kind="multiline"
                          showInlineControls={false}
                        >
                          {activeVideo.excerpt}
                        </EditableText>
                      </p>
                      <div className="modal-specs">
                        <span><FaCalendarDays /> {activeVideo.date}</span>
                        <span><FaEye /> {activeVideo.views} Views</span>
                        <span><FaClock /> {activeVideo.duration} Duration</span>
                        <button 
                          onClick={(e) => triggerShare(activeVideo.title, e)} 
                          className="modal-share-btn"
                          title="Copy video share link"
                        >
                          <FaShareNodes /> Share Link
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Curated Recommendations */}
                  <div className="modal-related-side">
                    <h4 className="related-heading">Up Next / Curated</h4>
                    <div className="related-videos-stack">
                      {videoItems
                        .filter((v) => v.id !== activeVideo.id)
                        .slice(0, 3)
                        .map((rec) => (
                          <div 
                            key={rec.id}
                            onClick={() => setActiveVideo(rec)}
                            className="related-item-row"
                          >
                            <div className="related-thumb">
                              <Image
                                src={rec.image}
                                alt={rec.title}
                                fill
                                unoptimized
                                className="rec-img"
                              />
                              <div className="related-play-mini">
                                <FaPlay className="mini-ico" />
                              </div>
                            </div>
                            <div className="related-info">
                              <span className="related-tag">{rec.category}</span>
                              <h5 className="related-title">{rec.title}</h5>
                              <span className="related-duration">{rec.duration}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <style jsx>{`
        .gallery-page-container {
          background-color: #ffffff;
          min-height: 100vh;
          padding-top: 80px; /* Offset sticky header */
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0f172a;
          overflow-x: hidden;
        }

        /* Toast Alert */
        .toast-notification {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: #0b1f4d;
          color: #ffffff;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(11, 31, 77, 0.25);
          z-index: 1001;
        }

        /* Hero Section (Compact ~320px tall) */
        .gallery-hero {
          background: #f8fafc;
          position: relative;
          padding: 40px 0;
          min-height: 320px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .hero-grid-split {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 40px;
          align-items: center;
          height: 100%;
          width: 100%;
        }

        .hero-left-content {
          text-align: left;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(44, 168, 224, 0.08);
          color: #2ca8e0;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          border-radius: 99px;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 3.3rem; /* 54px desktop */
          font-weight: 800;
          color: #0b1f4d;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 0 0 12px 0;
        }

        .hero-desc {
          font-size: 1.1rem; /* 18px desktop */
          color: #475569;
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 540px;
        }

        .hero-ctas {
          display: flex;
          gap: 12px;
        }

        .btn-primary-custom {
          background: #0b1f4d;
          color: #ffffff;
          border: none;
          padding: 12px 24px;
          border-radius: 14px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          min-height: 48px;
        }

        .btn-primary-custom:hover {
          background: #2ca8e0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(44, 168, 226, 0.2);
        }

        .hero-right-preview {
          position: relative;
          width: 100%;
          height: 220px;
        }

        .featured-preview-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .featured-preview-card:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.1);
        }

        .preview-img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .featured-preview-card:hover .preview-img {
          transform: scale(1.04);
        }

        .preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 31, 77, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .featured-badge-float {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #f5b700;
          color: #0b1f4d;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .duration-badge-float {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .preview-play-glow {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .featured-preview-card:hover .preview-play-glow {
          transform: scale(1.1);
          background: #2ca8e0;
          border-color: #2ca8e0;
          box-shadow: 0 0 20px rgba(44, 168, 226, 0.5);
        }

        .play-ico {
          font-size: 1.15rem;
          color: #ffffff;
          margin-left: 3px;
        }

        /* Curated Media Library Content gap and width */
        .gallery-content {
          padding: 80px 0; /* Spacing desktop */
          background: #ffffff;
        }

        .max-width-wrapper {
          max-width: 1400px;
        }

        /* Search and Filters Toolbar */
        .toolbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px; /* Spacing desktop */
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .toolbar-search {
          position: relative;
          width: 320px;
          transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .toolbar-search:focus-within {
          width: 380px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          display: flex;
          font-size: 0.85rem;
        }

        .search-input {
          width: 100%;
          padding: 11px 36px 11px 38px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #2ca8e0;
          box-shadow: 0 0 0 3px rgba(44, 168, 226, 0.1);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          font-size: 0.75rem;
        }

        .toolbar-filters {
          display: flex;
          gap: 14px;
        }

        .filter-select-wrap {
          position: relative;
        }

        .filter-select {
          padding: 11px 32px 11px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #475569;
          background-color: #ffffff;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 10px center;
          background-repeat: no-repeat;
          background-size: 16px;
          transition: border-color 0.25s;
        }

        .filter-select:focus {
          border-color: #2ca8e0;
        }

        /* Standard Minimal header */
        .section-head-minimal {
          margin-bottom: 24px;
          text-align: left;
        }

        .section-title {
          font-size: 1.8rem; /* 30px desktop */
          font-weight: 700;
          color: #0b1f4d;
          letter-spacing: -0.02em;
          margin: 0 0 4px 0;
        }

        .sub-title {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }

        /* Filtered Grid View Layout */
        .filtered-results-wrap {
          width: 100%;
        }

        .filtered-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          width: 100%;
        }

        /* Video item card specs: 340 width base layout */
        .video-item-card {
          flex: 0 0 340px; /* 340px Desktop */
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.03);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          scroll-snap-align: start;
        }

        .video-item-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
          border-color: #2ca8e0;
        }

        .card-thumb-wrap {
          position: relative;
          width: 100%;
          height: 190px; /* 340x190 desktop aspect ratio */
          overflow: hidden;
          background: #0f172a;
        }

        .card-img {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .video-item-card:hover .card-img {
          transform: scale(1.04);
        }

        .card-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(11, 31, 77, 0.4) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
          transition: background 0.3s;
        }

        .video-item-card:hover .card-thumb-overlay {
          background: linear-gradient(to bottom, transparent 30%, rgba(11, 31, 77, 0.5) 100%);
        }

        .card-play-btn-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .video-item-card:hover .card-play-btn-circle {
          transform: scale(1.1);
          background: #2ca8e0;
          box-shadow: 0 0 16px rgba(44, 168, 226, 0.5);
        }

        .card-play-ico {
          font-size: 0.95rem;
          color: #0b1f4d;
          margin-left: 3px;
          transition: color 0.3s;
        }

        .video-item-card:hover .card-play-ico {
          color: #ffffff;
        }

        .card-duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .card-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          text-align: left;
        }

        .card-category {
          font-size: 0.72rem;
          font-weight: 800;
          color: #2ca8e0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .card-title {
          font-size: 1.1rem; /* 18px desktop */
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8em;
        }

        .card-meta {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
          border-top: 1px solid #f1f5f9;
          padding-top: 12px;
        }

        .card-meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Coming Soon Dotted Card */
        .dotted-placeholder-card {
          flex: 0 0 340px;
          border: 2px dashed #cbd5e1;
          border-radius: 18px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          box-sizing: border-box;
        }

        .placeholder-content {
          max-width: 240px;
          margin: 0 auto;
        }

        .placeholder-ico {
          font-size: 2rem;
          display: block;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .placeholder-content h3 {
          font-size: 0.88rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 4px;
        }

        .placeholder-content p {
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.4;
        }

        /* Empty results box */
        .empty-results-box {
          text-align: center;
          padding: 60px 24px;
          border-radius: 18px;
          border: 1px dashed #cbd5e1;
          max-width: 400px;
          margin: 40px auto;
        }

        .empty-results-ico {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 12px;
        }

        .empty-results-box h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0b1f4d;
          margin-bottom: 6px;
        }

        .empty-results-box p {
          color: #64748b;
          font-size: 0.82rem;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        /* Carousels Stack Row Layout */
        .carousels-stack {
          display: flex;
          flex-direction: column;
          gap: 72px; /* Spacing desktop */
        }

        .carousel-row {
          width: 100%;
          text-align: left;
        }

        .carousel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .carousel-title {
          font-size: 1.8rem; /* 30px desktop */
          font-weight: 700;
          color: #0b1f4d;
          letter-spacing: -0.02em;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .carousel-title-icon {
          font-size: 1.6rem;
        }

        .carousel-controls {
          display: flex;
          gap: 8px;
        }

        .carousel-arrow {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
        }

        .carousel-arrow:hover {
          background: #f8fafc;
          color: #0b1f4d;
          border-color: #cbd5e1;
        }

        .carousel-track {
          display: flex;
          gap: 24px; /* Card gap desktop */
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          padding: 8px 4px 20px 4px;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }

        .carousel-track::-webkit-scrollbar {
          display: none; /* Chrome / Safari */
        }

        /* Skeleton loader shimmer elements */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .skeleton-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 18px;
          overflow: hidden;
          min-height: 280px;
        }

        .skeleton-thumb {
          width: 100%;
          height: 190px;
          background: #e2e8f0;
        }

        .skeleton-content {
          padding: 20px;
        }

        .skeleton-bar {
          height: 12px;
          background: #e2e8f0;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .skeleton-bar.short {
          width: 35%;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #edf2f7 25%,
            #f7fafc 50%,
            #edf2f7 75%
          );
          background-size: 200% 100%;
          animation: loading-shimmer 1.4s infinite;
        }

        /* Lightbox Premium Video Modal layout */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .lightbox-modal-content {
          position: relative;
          width: 100%;
          max-width: 1100px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
        }

        .lightbox-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .lightbox-close-btn:hover {
          transform: scale(1.1);
          background: rgba(0, 0, 0, 0.7);
        }

        .modal-inner-split {
          display: grid;
          grid-template-columns: 1.45fr 0.55fr;
          height: 100%;
          max-height: 85vh;
          overflow: hidden;
        }

        .modal-player-side {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        .lightbox-video-frame {
          width: 100%;
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000000;
        }

        .embedded-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .modal-text-content {
          padding: 24px;
          text-align: left;
        }

        .modal-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #2ca8e0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0b1f4d;
          line-height: 1.35;
          margin: 0 0 12px 0;
        }

        .modal-excerpt {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .modal-specs {
          display: flex;
          gap: 16px;
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 600;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .modal-specs span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .modal-share-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0b1f4d;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.75rem;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }

        .modal-share-btn:hover {
          background: #f1f5f9;
        }

        /* Right Related Videos Column */
        .modal-related-side {
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          padding: 24px;
          overflow-y: auto;
          scrollbar-width: thin;
          text-align: left;
        }

        .related-heading {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0b1f4d;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 16px;
        }

        .related-videos-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .related-item-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 12px;
          cursor: pointer;
        }

        .related-item-row:hover .related-title {
          color: #2ca8e0;
        }

        .related-thumb {
          position: relative;
          aspect-ratio: 16 / 10;
          border-radius: 8px;
          overflow: hidden;
          background: #0f172a;
        }

        .rec-img {
          object-fit: cover;
        }

        .related-play-mini {
          position: absolute;
          inset: 0;
          background: rgba(11, 31, 77, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-ico {
          font-size: 0.65rem;
          color: #ffffff;
        }

        .related-info {
          display: flex;
          flex-direction: column;
        }

        .related-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #2ca8e0;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .related-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .related-duration {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Responsive Breakpoint: Large Desktop (1440px+) */
        @media (min-width: 1440px) {
          .container {
            max-width: 1400px;
            padding: 0 48px; /* Container padding desktop */
          }
          .video-item-card {
            flex: 0 0 340px; /* 4 cards visible */
          }
        }

        /* Responsive Breakpoint: Desktop (1200px - 1439px) */
        @media (min-width: 1200px) and (max-width: 1439px) {
          .container {
            max-width: 1200px;
            padding: 0 48px;
          }
          .video-item-card {
            flex: 0 0 340px; /* 3.2 cards visible */
          }
        }

        /* Responsive Breakpoint: Tablet Landscape / Laptop (992px - 1199px) */
        @media (min-width: 992px) and (max-width: 1199px) {
          .container {
            max-width: 960px;
            padding: 0 32px; /* Container padding tablet */
          }
          .gallery-content {
            padding: 64px 0; /* Spacing tablet */
          }
          .carousels-stack {
            gap: 64px;
          }
          .hero-title {
            font-size: 2.6rem; /* 42px tablet */
          }
          .hero-desc {
            font-size: 1rem; /* 16px tablet */
          }
          .section-title, .carousel-title {
            font-size: 1.6rem; /* 32px/26px tablet */
          }
          .video-item-card {
            flex: 0 0 300px; /* Show 3 cards */
          }
          .card-thumb-wrap {
            height: 170px; /* 300x170 tablet aspect ratio */
          }
          .card-title {
            font-size: 1rem; /* 16px tablet */
          }
          .filtered-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
          .skeleton-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .lightbox-modal-content {
            width: 90%; /* 90% viewport width tablet */
          }
        }

        /* Responsive Breakpoint: Tablet Portrait (768px - 991px) */
        @media (min-width: 768px) and (max-width: 991px) {
          .container {
            max-width: 720px;
            padding: 0 32px;
          }
          .gallery-content {
            padding: 64px 0;
          }
          .carousels-stack {
            gap: 64px;
          }
          .hero-grid-split {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .gallery-hero {
            height: auto;
            padding: 40px 0;
          }
          .hero-right-preview {
            max-width: 440px;
            margin: 0 auto;
            height: 240px;
          }
          .hero-title {
            font-size: 2.6rem;
          }
          .hero-desc {
            font-size: 1rem;
          }
          .section-title, .carousel-title {
            font-size: 1.6rem;
          }
          .video-item-card {
            flex: 0 0 280px; /* Show 2.5 cards */
          }
          .card-thumb-wrap {
            height: 160px;
          }
          .card-title {
            font-size: 1rem;
          }
          .filtered-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lightbox-modal-content {
            width: 90%;
            max-height: 90vh;
          }
          .modal-inner-split {
            grid-template-columns: 1fr;
            max-height: 85vh;
          }
          .modal-related-side {
            border-left: none;
            border-top: 1px solid #e2e8f0;
          }
        }

        /* Responsive Breakpoint: Mobile Large / Small (320px - 767px) */
        @media (max-width: 767px) {
          .container {
            padding: 0 20px; /* Container padding mobile */
          }
          .gallery-content {
            padding: 48px 0; /* Spacing mobile */
          }
          .carousels-stack {
            gap: 48px;
          }
          .hero-grid-split {
            grid-template-columns: 1fr;
            gap: 20px;
            text-align: center;
          }
          .hero-left-content {
            text-align: center;
          }
          .hero-badge {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-title {
            font-size: 2rem; /* 32px mobile */
            line-height: 1.3;
          }
          .hero-desc {
            font-size: 0.92rem; /* 15px mobile */
            margin-left: auto;
            margin-right: auto;
          }
          .hero-ctas {
            justify-content: center;
          }
          .btn-primary-custom {
            width: 100%; /* Full width mobile */
            justify-content: center;
          }
          .hero-right-preview {
            max-width: 100%;
            height: 180px;
          }
          .gallery-hero {
            height: auto;
            padding: 40px 0;
          }
          .section-title, .carousel-title {
            font-size: 1.35rem; /* 24px/20px mobile */
          }
          .carousel-arrow {
            display: none; /* Hide arrows on mobile */
          }
          .video-item-card {
            flex: 0 0 260px; /* Show 1.2 cards (peeking effect) */
          }
          .card-thumb-wrap {
            height: 150px; /* 260x150 mobile aspect ratio */
          }
          .card-title {
            font-size: 0.92rem;
          }
          .card-excerpt-text {
            display: none; /* Hide description on mobile to save space */
          }
          .filtered-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .skeleton-grid {
            grid-template-columns: 1fr;
          }
          .toolbar-container {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .toolbar-search {
            width: 100%;
          }
          .toolbar-search:focus-within {
            width: 100%;
          }
          .toolbar-filters {
            width: 100%;
            justify-content: space-between;
          }
          .filter-select-wrap {
            flex-grow: 1;
          }
          .filter-select {
            width: 100%;
          }
          .lightbox-overlay {
            padding: 0;
          }
          .lightbox-modal-content {
            width: 100%;
            height: 100vh;
            border-radius: 0;
            max-height: 100vh;
          }
          .modal-inner-split {
            grid-template-columns: 1fr;
            max-height: 100vh;
          }
          .lightbox-close-btn {
            top: 12px;
            right: 12px;
            background: rgba(0, 0, 0, 0.6);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            z-index: 110;
          }
          .modal-share-btn {
            margin-left: 0;
            width: 100%;
            justify-content: center;
            margin-top: 10px;
          }
          .modal-related-side {
            border-left: none;
            border-top: 1px solid #e2e8f0;
            padding: 20px;
          }
        }

        /* prefers-reduced-motion settings */
        @media (prefers-reduced-motion: reduce) {
          .video-item-card, .featured-preview-card, .preview-img, .card-img, .card-play-btn-circle, .preview-play-glow {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
          .shimmer {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
