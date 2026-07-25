"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaChevronLeft, FaChevronRight, FaXmark
} from "react-icons/fa6";
import { resultsData } from "@/data/results";
import Button from "@/components/ui/Button";
import EditableSection from "@/components/admin/EditableSection";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import ResultEditor from "@/components/admin/ResultEditor";
import { EditableText } from "@/components/admin/EditableText";

interface StudentCardTemplateProps {
  name: string;
  image: string;
  city?: string;
  marks?: number;
}

type ResultsBanner = {
  image: string;
  alt?: string;
  type?: string;
};

function StudentCardTemplate({ name, image, city, marks }: StudentCardTemplateProps) {
  const isLongName = name.length > 15;
  return (
    <div className="student-template-card">
      {/* Top half: Photo frame with background decorators */}
      <div className="photo-frame-container">
        {/* Slanted background shapes */}
        <div className="card-top-bg-decorator"></div>
        <div className="card-top-left-chevron"></div>
        <div className="card-top-right-dots">
          {Array.from({ length: 5 }).map((_, r) => (
            <div key={r} className="dots-row" style={{ display: "flex", gap: "5px" }}>
              {Array.from({ length: 8 }).map((_, c) => (
                <span key={c} className="dot-node"></span>
              ))}
            </div>
          ))}
        </div>

        <div className="student-photo-wrapper">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            className="student-photo-img"
            style={{ objectFit: "contain", objectPosition: "bottom" }}
          />
        </div>
      </div>

      {/* Solid gold horizontal separator bar */}
      <div className="gold-separator-bar"></div>

      {/* Bottom half: Info section */}
      <div className="info-section">
        {/* Curvy background decoration vectors */}
        <div className="info-bg-curve-left"></div>
        <div className="info-bg-curve-right"></div>

        <p className={`student-name-text ${isLongName ? "long-name" : ""}`}>{name}</p>

        {/* Customized dotted separator with center solid indicator */}
        <div className="custom-dotted-separator">
          <span className="dot-line-left"></span>
          <span className="center-solid-blue-indicator"></span>
          <span className="dot-line-right"></span>
        </div>

        {/* College / Marks Pill Badge with slanted nose and gold bottom bar */}
        <div className="college-pill-badge-wrap">
          <div className="college-pill-badge">
            {marks !== undefined ? (
              <span className="college-text">{marks} MARKS</span>
            ) : (
              <>
                <span className="pin-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <span className="college-text">GMC {city?.toUpperCase()}</span>
              </>
            )}
          </div>
          <div className="badge-bottom-gold-bar"></div>
        </div>
      </div>
    </div>
  );
}

function BannerImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        unoptimized
        className="results-banner-img"
        style={{ objectFit: "contain", opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

export default function ResultsClient() {
  const [heroSlides, setHeroSlides] = useState<ResultsBanner[]>([]);
  const [isBannersLoading, setIsBannersLoading] = useState(true);
  const [editResults, setEditResults] = useState(false);
  const { refreshKey } = useEditModeOptional();

  useEffect(() => {
    fetch("/api/content/banners", { cache: "no-store" })
      .then(res => res.json())
      .then((data: { status?: string; data?: ResultsBanner[] }) => {
        if (data.status === 'success') {
          const resultBanners = (data.data || []).filter(
            (banner) => banner.type === "RESULTS" && banner.image,
          );
          setHeroSlides(resultBanners);
        } else {
          setHeroSlides([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch result banners", err);
        setHeroSlides([]);
      })
      .finally(() => {
        setIsBannersLoading(false);
      });
  }, [refreshKey]);

  const [slideTuple, setSlideTuple] = useState<[number, number]>([0, 0]); // [slideIndex, direction]
  const currentHeroSlide = slideTuple[0];
  const slideDirection = slideTuple[1];
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videoStories = [
    { id: 1, name: "Siddhi Badhe", tagline: "Right Guidence. Conceptual Understanding. Extraordinary Results.", videoUrl: "/videos/Siddhi_Journey_Video.mp4", coverImage: "/videos/Cover/Siddhi.png" },
    { id: 2, name: "Samrudhi Lokhande", tagline: "Daily Practice. Doubt Resolution. Consistant Success.", videoUrl: "/videos/SuccessCode_Academy1.mp4", coverImage: "/videos/Cover/Samrudhi.png" },
    { id: 3, name: "", tagline: "", videoUrl: "", coverImage: "" },
    { id: 4, name: "", tagline: "", videoUrl: "", coverImage: "" },
    { id: 5, name: "", tagline: "", videoUrl: "", coverImage: "" },
  ];

  const setHeroSlide = (newSlide: number) => {
    if (heroSlides.length === 0) return;
    setSlideTuple((prev) => {
      const current = prev[0];
      const direction = newSlide > current ? 1 : -1;
      return [newSlide, direction];
    });
  };

  const handlePrevSlide = () => {
    if (heroSlides.length === 0) return;
    setSlideTuple((prev) => {
      const current = prev[0];
      const prevSlide = (current - 1 + heroSlides.length) % heroSlides.length;
      return [prevSlide, -1];
    });
  };

  const handleNextSlide = () => {
    if (heroSlides.length === 0) return;
    setSlideTuple((prev) => {
      const current = prev[0];
      const nextSlide = (current + 1) % heroSlides.length;
      return [nextSlide, 1];
    });
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const t = setInterval(() => {
      setSlideTuple((prev) => {
        const current = prev[0];
        const next = (current + 1) % heroSlides.length;
        return [next, 1];
      });
    }, 4000);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  // Filtered results based on active tab
  const filteredResults = useMemo(() => {
    return resultsData.filter((item) => item.year === selectedYear);
  }, [selectedYear]);
  const resultsSectionHeading =
    selectedYear >= 2025
      ? "Other Successful Selections"
      : `Our NEET ${selectedYear} Results`;

  return (
    <div className="results-page-container">
      {/* Decorative gradient blobs in the background */}
      <div className="bg-blob-glow blob-1"></div>
      <div className="bg-blob-glow blob-2"></div>

      {/* ══════════════════════════════════════════
          HERO BANNER (Image-based slider like Home page)
          ══════════════════════════════════════════ */}
      <section className="results-hero-section">
        <div className="results-banner-wrap">
          {isBannersLoading ? (
            <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>
          ) : heroSlides.length > 0 ? (
            <>
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={currentHeroSlide}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 }
                  }}
                  className="results-banner-slide"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                >
                  <BannerImage 
                    src={heroSlides[currentHeroSlide].image} 
                    alt={heroSlides[currentHeroSlide].alt || "SCA Results Banner"} 
                  />
                  <div className="results-banner-overlay" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <button
                onClick={handlePrevSlide}
                className="slider-nav-btn slider-prev-btn"
                aria-label="Previous banner"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextSlide}
                className="slider-nav-btn slider-next-btn"
                aria-label="Next banner"
              >
                <FaChevronRight />
              </button>
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fbff", color: "#64748b", fontWeight: 600 }}>
              No banners available
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        {!isBannersLoading && heroSlides.length > 0 && (
          <div className="results-banner-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroSlide(idx)}
                className={`results-banner-dot ${currentHeroSlide === idx ? "active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SECTION HEADING
          ══════════════════════════════════════════ */}
      <section className="results-heading-section">
        <div className="container">
          <h1 className="results-section-title">
            <EditableText contentKey="results.heading" label="results heading">
              Meet our NEET Results
            </EditableText>
          </h1>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FILTER CONTROLS BAR
          ══════════════════════════════════════════ */}
      <section className="controls-section">
        <div className="container">
          <div className="controls-inner-card">
            {/* Year filter selector tabs */}
            <div className="tabs-container">
              <button
                onClick={() => setSelectedYear(2026)}
                className={`tab-btn ${selectedYear === 2026 ? "active" : ""}`}
              >
                NEET UG 2026
              </button>
              <button
                onClick={() => setSelectedYear(2025)}
                className={`tab-btn ${selectedYear === 2025 ? "active" : ""}`}
              >
                NEET UG 2025
              </button>
              <button
                onClick={() => setSelectedYear(2024)}
                className={`tab-btn ${selectedYear === 2024 ? "active" : ""}`}
              >
                NEET UG 2024
              </button>
              <button
                onClick={() => setSelectedYear(2023)}
                className={`tab-btn ${selectedYear === 2023 ? "active" : ""}`}
              >
                NEET UG 2023
              </button>
              <button
                onClick={() => setSelectedYear(2022)}
                className={`tab-btn ${selectedYear === 2022 ? "active" : ""}`}
              >
                NEET UG 2022
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RESULTS CARDS GRID
          ══════════════════════════════════════════ */}
      <EditableSection label="Results" onEdit={() => setEditResults(true)} as="section">
      <section className="grid-section">
        <div className="container">
          {/* Featured Toppers for 2026 */}
          {selectedYear === 2026 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="toppers-highlight-section"
            >
              <div className="toppers-banner-wrap-2026">
                <Image
                  src="/images/results/heroes/NeetUG2026AchiversShravani.png"
                  alt="NEET UG 2026 Achievers"
                  width={1430}
                  height={813}
                  className="toppers-banner-image-2026"
                />
              </div>
            </motion.div>
          )}

          {/* Featured Toppers for 2025 */}
          {selectedYear === 2025 && (
            <div className="toppers-highlight-section">

              <h3 className="toppers-headline">
                <EditableText
                  contentKey="results.top-achievers-heading"
                  label="top achievers heading"
                >
                  Our Top Achivers
                </EditableText>
              </h3>

              <div className="toppers-cards-container">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="topper-banner-card"
                >
                  <div className="topper-banner-img-wrap">
                    <Image
                      src="/images/results/2025/SiddhiBadhefull.png"
                      alt="Siddhi Badhe - NEET UG 2025 Topper"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="topper-banner-img"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="topper-banner-card"
                >
                  <div className="topper-banner-img-wrap">
                    <Image
                      src="/images/results/2025/SamruddhiLokhandeFull.png"
                      alt="Samruddhi Lokhande - NEET UG 2025 Topper"
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="topper-banner-img"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          <h3 className="toppers-headline other-selections-title">
            <EditableText
              contentKey={`results.${selectedYear}.section-heading`}
              label={`${selectedYear} results section heading`}
            >
              {resultsSectionHeading}
            </EditableText>
          </h3>

          {/* Student cards grid */}
          <div className="results-grid">
            {filteredResults.map((item) => {
              // Skip the featured toppers from the main grid if year is 2025
              if (selectedYear === 2025 && (item.id === 1 || item.id === 2)) return null;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`student-card ${item.isCustomCard ? "custom-template-wrapper" : ""}`}
                >
                  {item.isCustomCard ? (
                    <StudentCardTemplate
                      name={item.name}
                      image={item.image}
                      city={item.city || ""}
                      marks={item.marks}
                    />
                  ) : (
                    <>
                      <div className="card-image-wrap">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="student-card-img"
                        />
                      </div>
                      <div className="card-hover-overlay">
                        <div className="hover-details">
                          <h4>{item.name}</h4>
                          <p>NEET UG {item.year}</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      </EditableSection>
      <ResultEditor open={editResults} onClose={() => setEditResults(false)} />

      {/* ══════════════════════════════════════════
          SUCCESS STORIES SECTION
          ══════════════════════════════════════════ */}
      <section className="success-stories-section">
        <div className="stories-container">
          {/* Left Column: Heading and Info */}
          <div className="stories-left-col">
            <div className="stories-icon-wrapper">
              <svg viewBox="0 0 100 100" className="stories-header-svg">
                <circle cx="50" cy="50" r="40" fill="#e0f2fe" />
                <path d="M42 35 L68 50 L42 65 Z" fill="#0066cc" />
                <path d="M50 15 L52 21 L58 21 L53 25 L55 31 L50 27 L45 31 L47 25 L42 21 L48 21 Z" fill="#0066cc" />
                <path d="M22 35 L24 39 L28 39 L25 42 L26 46 L22 43 L18 46 L19 42 L16 39 L20 39 Z" fill="#0066cc" />
                <path d="M78 35 L80 39 L84 39 L81 42 L82 46 L78 43 L74 46 L75 42 L72 39 L76 39 Z" fill="#0066cc" />
              </svg>
            </div>
            <h2 className="stories-title">
              <EditableText
                contentKey="stories.heading"
                label="success stories heading"
              >
                Success Stories
              </EditableText>
            </h2>
            <div className="stories-title-line"></div>
            <div className="stories-quote">
              <p>
                <EditableText contentKey="stories.quote-line-1" label="success stories quote line 1">
                  “Different paths.
                </EditableText>
              </p>
              <p>
                <EditableText contentKey="stories.quote-line-2" label="success stories quote line 2">
                  One goal.
                </EditableText>
              </p>
              <p>
                <EditableText contentKey="stories.quote-line-3" label="success stories quote line 3">
                  Countless success stories.”
                </EditableText>
              </p>
            </div>
          </div>

          {/* Right Column: Grid of Cards */}
          <div className="stories-right-col">
            <div className="stories-grid-container">
              {videoStories.map((story) => (
                <div key={story.id} className="story-card-wrapper">
                  <div
                    className={`story-video-card ${story.videoUrl ? 'playable' : 'disabled'} ${story.coverImage ? 'has-cover' : ''}`}
                    onClick={() => story.videoUrl && setActiveVideo(story.videoUrl)}
                  >
                    {story.coverImage ? (
                      <>
                        <Image
                          src={story.coverImage}
                          alt={story.name || "Success Story"}
                          fill
                          unoptimized
                          className="story-cover-img"
                        />
                        <div className="story-cover-overlay"></div>
                      </>
                    ) : (
                      <div className="card-curve-decorator"></div>
                    )}

                    {/* Play Button */}
                    <div className="card-play-btn">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    {/* Dotted grid decoration at bottom right */}
                    {!story.coverImage && (
                      <div className="card-dots-decorator">
                        <div className="dot-row">
                          <span className="dot"></span>
                        </div>
                        <div className="dot-row">
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <div className="dot-row">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <div className="dot-row">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <div className="dot-row">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    )}

                    {/* Tagline inside the card */}
                    <div className="story-card-info">
                      {story.tagline ? (
                        <p className="story-card-tagline">
                          <EditableText
                            contentKey={`stories.card-${story.id}.tagline`}
                            label={`${story.name} story tagline`}
                            kind="multiline"
                            showInlineControls={false}
                          >
                            {story.tagline}
                          </EditableText>
                        </p>
                      ) : (
                        <p className="story-card-placeholder">Story Coming Soon</p>
                      )}
                    </div>
                  </div>

                  {/* Name below the card (outside) */}
                  {story.name && (
                    <h4 className="story-card-name-outside">
                      <EditableText
                        contentKey={`stories.card-${story.id}.name`}
                        label={`success story ${story.id} student name`}
                      >
                        {story.name}
                      </EditableText>
                    </h4>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Popup Overlay */}
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
                  className="results-video-player"
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

      {/* ══════════════════════════════════════════
          CTA FOOTER BANNER
          ══════════════════════════════════════════ */}
      <section className="results-cta">
        <div className="container">
          <div className="cta-gradient-card">
            <h2>
              <EditableText contentKey="cta.heading" label="results CTA heading">
                Ready to Write Your Success Story?
              </EditableText>
            </h2>
            <p>
              <EditableText
                contentKey="cta.description"
                label="results CTA description"
                kind="multiline"
              >
                Join Success Code Academy and start your customized learning path. Get expert mentorship, topic-wise tests, and targeted strategy guidance.
              </EditableText>
            </p>
            <div className="cta-actions-group">
              <Button href="/contact" variant="primary" size="lg">
                Register for SCST (Scholarship Test) <span className="cta-arrow">→</span>
              </Button>
              <Button href="/contact" variant="outline" size="lg" className="cta-outline-btn">
                Talk to Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STYLES (styled-jsx Native Styling)
          ══════════════════════════════════════════ */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .results-page-container {
          min-height: 100vh;
          background-color: var(--bg-base);
          position: relative;
          padding-top: 80px; /* offset header height */
          overflow: hidden;
        }

        /* Ambient background glow decoration */
        .bg-blob-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
        }
        .blob-1 {
          background-color: var(--accent-primary);
          top: -100px;
          right: -100px;
        }
        .blob-2 {
          background-color: var(--accent-secondary);
          bottom: 100px;
          left: -100px;
        }

        .container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
        }

        /* ── Hero Banner section ── */
        .results-hero-section {
          width: 100%;
          max-width: 924px; /* Reduced by 30% from 1320px */
          margin: 0 auto;
          padding: 18px 24px 14px;
          box-sizing: border-box;
        }

        .results-banner-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 7.5; /* Height reduced by 15% (for reduced width) */
          overflow: hidden;
          border-radius: 40px;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.05),
            0 25px 60px rgba(37, 99, 235, 0.08);
          transition: all .45s cubic-bezier(.22,1,.36,1);
        }

        .results-banner-wrap:hover {
          transform: translateY(-4px);
          box-shadow:
            0 18px 40px rgba(15, 23, 42, 0.08),
            0 35px 75px rgba(37, 99, 235, 0.14);
        }

        .results-banner-wrap::before {
          content: "";
          position: absolute;
          inset: -80px;
          background: radial-gradient(circle,
              rgba(59,130,246,.12),
              transparent 65%);
          pointer-events: none;
          z-index: 1;
        }

        .results-banner-slide {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        .results-banner-img {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain !important; /* Fits poster within section without cropping */
        }

        .results-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.03) 0%, transparent 40%);
          z-index: 3;
          pointer-events: none;
        }

        .results-banner-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 20px 0 8px;
        }

        .results-banner-dot {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          background: #cbd5e1;
          transition: all .35s ease;
        }

        .results-banner-dot:hover {
          background: #93c5fd;
        }

        .results-banner-dot.active {
          width: 42px;
          background: linear-gradient(
              90deg,
              #2563eb,
              #38bdf8);
          box-shadow: 0 4px 12px rgba(37,99,235,.35);
        }

        .results-heading-section {
          text-align: center;
          padding: 30px 24px 0px;
          position: relative;
          z-index: 2;
        }

        .results-section-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--accent-secondary) 30%, var(--accent-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0px;
        }

        /* Stats dashboard */
        .stats-dashboard {
          display: flex;
          justify-content: center;
          gap: 24px;
          width: 100%;
          max-width: 900px;
          margin-top: 10px;
        }
        .stat-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          box-shadow: var(--shadow-subtle);
          padding: 20px 24px;
          border-radius: var(--radius-md);
          text-align: left;
        }
        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          font-size: 1.25rem;
        }
        .stat-icon.cup {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        .stat-icon.cap {
          background-color: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        .stat-icon.hosp {
          background-color: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
        .stat-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-info p {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        /* ── Controls Section ── */
        .controls-section {
          position: relative;
          z-index: 10;
          margin-bottom: 40px;
        }
        .controls-inner-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid var(--bg-surface-border);
          box-shadow: var(--shadow-subtle);
          border-radius: var(--radius-md);
          padding: 24px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        .search-box-wrapper {
          position: relative;
          flex: 1;
          max-width: 500px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          font-size: 1rem;
        }
        .search-input {
          width: 100%;
          padding: 14px 44px 14px 48px;
          border: 1px solid var(--bg-surface-border);
          border-radius: var(--radius-full);
          font-family: var(--font-sans);
          font-size: 1rem;
          color: var(--text-primary);
          background-color: var(--bg-surface);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .clear-search-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.15rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .clear-search-btn:hover {
          background-color: var(--bg-surface-hover);
          color: var(--text-primary);
        }

        .tabs-container {
          display: flex;
          background: var(--bg-surface-hover);
          padding: 6px;
          border-radius: var(--radius-full);
          border: 1px solid var(--bg-surface-border);
        }
        .tab-btn {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
          color: var(--text-secondary);
        }
        .tab-btn.active {
          background: var(--bg-surface);
          color: var(--accent-secondary);
          box-shadow: var(--shadow-subtle);
        }

        /* ── Grid Section ── */
        .grid-section {
          padding-bottom: 80px;
        }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
          gap: 24px;
        }
         .student-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-subtle);
          cursor: default;
          aspect-ratio: 1 / 1.3;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .student-card.custom-template-wrapper {
          background: transparent;
          border: none;
          box-shadow: none;
          overflow: visible;
        }
        .student-card:hover {
          transform: translateY(-6px);
        }
        .student-card:not(.custom-template-wrapper):hover {
          box-shadow: var(--shadow-hover);
          border-color: var(--accent-primary);
        }
        .card-image-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .student-card-img {
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s ease;
        }
        .student-card:hover .student-card-img {
          transform: scale(1.05);
        }

        /* Hover Overlay */
        .card-hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .student-card:hover .card-hover-overlay {
          opacity: 1;
        }
        .zoom-icon-circle {
          align-self: flex-end;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transform: scale(0.9);
          transition: all 0.3s ease;
        }
        .student-card:hover .zoom-icon-circle {
          transform: scale(1);
        }
        .zoom-icon-circle:hover {
          background: white;
          color: var(--text-primary);
        }
        .hover-details {
          color: white;
          transform: translateY(10px);
          transition: transform 0.3s ease;
        }
        .student-card:hover .hover-details {
          transform: translateY(0);
        }
        .hover-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }
        .hover-year-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          background: var(--accent-primary);
          color: white;
          padding: 2px 10px;
          border-radius: var(--radius-full);
        }

        /* Empty State */
        .no-results-state {
          text-align: center;
          padding: 80px 20px;
          background: var(--bg-surface);
          border: 1px dashed var(--bg-surface-border);
          border-radius: var(--radius-md);
          max-width: 600px;
          margin: 0 auto;
        }
        .no-results-emoji {
          font-size: 3rem;
          margin-bottom: 20px;
          display: block;
        }
        .no-results-state h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        .no-results-state p {
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .reset-search-btn {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.95rem;
          color: white;
          background-color: var(--accent-secondary);
          border: none;
          padding: 10px 24px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-search-btn:hover {
          background-color: #1e3a8a;
        }

        /* ── Lightbox Overlay Modal ── */
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(15px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-close-btn {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: white;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 1010;
        }
        .lightbox-close-btn:hover {
          background: white;
          color: var(--text-primary);
          transform: rotate(90deg);
        }
        .nav-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 1010;
        }
        .nav-arrow-btn:hover {
          background: white;
          color: var(--text-primary);
          transform: translateY(-50%) scale(1.05);
        }
        .arrow-left {
          left: 40px;
        }
        .arrow-right {
          right: 40px;
        }

        .lightbox-modal {
          max-width: 900px;
          width: 100%;
          background: var(--bg-surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          z-index: 1005;
        }
        .modal-img-container {
          position: relative;
          width: 100%;
          max-height: 70vh;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background: #f8fafc;
        }
        .modal-cover-img {
          display: block;
          max-width: 100%;
          height: auto;
          max-height: 70vh;
          object-fit: contain;
        }

        .modal-footer-bar {
          background: white;
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--bg-surface-border);
        }
        .modal-meta-info h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .modal-meta-info p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .modal-item-counter {
          font-weight: 700;
          color: var(--accent-secondary);
          background-color: rgba(30, 64, 175, 0.06);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
        }

        /* ── CTA Section ── */
        .results-cta {
          padding-bottom: 90px;
        }
        .cta-gradient-card {
          background: linear-gradient(135deg, var(--accent-secondary) 0%, #1e3a8a 50%, var(--accent-primary) 100%);
          border-radius: var(--radius-lg);
          padding: 60px 40px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(30, 64, 175, 0.25);
        }
        .cta-gradient-card::after {
          content: "";
          position: absolute;
          top: -150px;
          left: -150px;
          width: 300px;
          height: 300px;
          background: white;
          filter: blur(120px);
          opacity: 0.1;
          border-radius: 50%;
          pointer-events: none;
        }
        .cta-gradient-card h2 {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .cta-gradient-card p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.85);
          max-width: 680px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }
        .cta-actions-group {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cta-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        :global(.btn-primary:hover) .cta-arrow {
          transform: translateX(4px);
        }
        
        /* Custom layout adjustments for outline button in CTA */
        :global(.cta-outline-btn) {
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: white !important;
        }
        :global(.cta-outline-btn:hover) {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: white !important;
        }

        /* ── Toppers Highlight Section ── */
        .toppers-highlight-section {
          margin-bottom: 60px;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .toppers-banner-wrap-2026 {
          max-width: 700px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
        }
        .toppers-banner-image-2026 {
          display: block;
          width: 100%;
          height: auto;
        }
        .toppers-badge-container {
          margin-bottom: 14px;
        }
        .toppers-glow-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-secondary);
          background: rgba(30, 64, 175, 0.08);
          border: 1.5px solid rgba(30, 64, 175, 0.2);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(30, 64, 175, 0.05);
        }
        .toppers-headline {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-primary);
          letter-spacing: -0.015em;
          text-align: center;
        }
        .other-selections-title {
          margin-top: 50px;
          margin-bottom: 30px;
          font-size: 1.85rem;
        }
        .toppers-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto 36px;
          line-height: 1.6;
        }
        .toppers-cards-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 60px;
          max-width: 580px;
          margin: 0 auto;
        }
        .topper-banner-card {
          position: relative;
          background: transparent;
          overflow: hidden;
          cursor: default;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .topper-banner-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 539 / 976; /* Perfect 9:16 vertical aspect ratio */
          overflow: hidden;
        }
        .topper-banner-img {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .topper-banner-img.object-fill {
          object-fit: fill !important;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .controls-inner-card {
            flex-direction: row;
            justify-content: center;
          }
          .nav-arrow-btn {
            width: 48px;
            height: 48px;
          }
          .arrow-left {
            left: 15px;
          }
          .arrow-right {
            right: 15px;
          }
        }

        @media (max-width: 600px) {
          .tabs-container {
            display: flex !important;
            flex-direction: row !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            width: 100% !important;
            background: var(--bg-surface-hover);
            padding: 6px !important;
            border-radius: 30px !important;
            box-sizing: border-box !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            white-space: nowrap !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .tabs-container::-webkit-scrollbar {
            display: none !important;
          }
          .tab-btn {
            font-size: 0.8rem !important;
            padding: 8px 16px !important;
            border-radius: 20px !important;
            text-align: center !important;
            flex: 0 0 auto !important;
            width: auto !important;
            box-sizing: border-box !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            white-space: nowrap !important;
            letter-spacing: -0.01em;
          }
        }

        @media (max-width: 992px) {
          .results-hero-section {
            padding: 16px 20px !important;
          }
          .results-banner-wrap {
            aspect-ratio: 16 / 9.2;
            border-radius: 28px !important;
          }
        }

        @media (max-width: 768px) {
          .results-hero-section {
            padding: 12px 16px !important;
          }
          .results-banner-wrap {
            aspect-ratio: 16 / 10.7;
            border-radius: 20px !important;
          }
          .stats-dashboard {
            flex-direction: column;
            gap: 16px;
          }
          .stat-card {
            padding: 16px 20px;
          }
          .lightbox-backdrop {
            padding: 10px;
          }
          .lightbox-close-btn {
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            font-size: 1.25rem;
          }
          .nav-arrow-btn {
            display: none; /* Hide arrows on small screens, use swiping/index if needed, or overlay them */
          }
          .modal-footer-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 16px 20px;
          }
          .cta-gradient-card {
            padding: 40px 24px;
          }
        }

        @media (max-width: 480px) {
          .results-banner-wrap {
            aspect-ratio: 16 / 12.2;
            border-radius: 22px;
          }
        }

        @media (max-width: 768px) {
          .toppers-cards-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            max-width: 320px;
            margin: 0 auto;
          }
          .toppers-headline {
            font-size: 1.45rem;
            margin-bottom: 20px;
          }
          .topper-banner-card {
            border-radius: 12px;
          }
          .controls-inner-card {
            padding: 12px 10px;
            border-radius: 20px;
            gap: 12px;
          }
          .grid-section .container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .results-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }

          .results-grid .student-card {
            min-width: 0;
          }
          .results-grid .student-template-card {
            min-width: 0;
            border-width: 1.5px;
            border-radius: 12px;
            box-shadow: 0 2px 6px rgba(15, 23, 42, 0.1);
          }
          .results-grid .photo-frame-container {
            height: 55%;
          }
          .results-grid .gold-separator-bar {
            height: 3px;
          }
          .results-grid .info-section {
            padding: 10px 6px;
          }
          .results-grid .student-name-text {
            min-height: 36px;
            height: auto;
            font-size: 0.82rem;
            letter-spacing: -0.01em;
            line-height: 1.2;
            margin: 0;
          }
          .results-grid .student-name-text.long-name {
            font-size: 0.72rem;
          }
          .results-grid .custom-dotted-separator {
            display: none; /* Hide dotted line separator on mobile to prevent layout squishing */
          }
          .results-grid .center-solid-blue-indicator {
            display: none;
          }
          .results-grid .college-pill-badge-wrap {
            max-width: 100%;
            padding: 0;
          }
          .results-grid .college-pill-badge {
            padding: 6px 4px;
            clip-path: none;
            border-radius: 6px;
            justify-content: center;
          }
          .results-grid .badge-bottom-gold-bar {
            height: 2px;
          }
          .results-grid .college-text {
            font-size: 0.68rem;
            letter-spacing: 0.01em;
            text-align: center;
            width: 100%;
          }
          .results-grid .pin-icon {
            display: none; /* Hide pin icon on mobile so text fits cleanly */
          }
        }

        /* ── Student Custom Template Card Styling ── */
        .student-template-card {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          box-sizing: border-box;
          padding: 0;
          border-radius: 28px;
          border: 4px solid #0e3e8c;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .student-card.custom-template-wrapper:hover .student-template-card {
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.3);
          transform: translateY(-4px);
        }

        /* Top half: Photo frame container */
        .photo-frame-container {
          background-color: #dbebff;
          width: 100%;
          height: 60%;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Top background decorators */
        .card-top-bg-decorator {
          position: absolute;
          top: -20px;
          left: -40px;
          width: 180px;
          height: 120px;
          background-color: rgba(59, 130, 246, 0.15);
          transform: rotate(-15deg);
          border-radius: 0 0 40px 0;
          z-index: 1;
        }

        .card-top-left-chevron {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 30px;
          height: 90px;
          background-color: rgba(59, 130, 246, 0.08);
          clip-path: polygon(0 0, 100% 25%, 100% 75%, 0 100%);
          z-index: 1;
        }

        .card-top-right-dots {
          position: absolute;
          top: 24px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          opacity: 0.22;
          z-index: 1;
        }

        .dot-node {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #0e3e8c;
        }

        .student-photo-wrapper {
          position: relative;
          width: 100%;
          height: 94%;
          z-index: 2;
        }

        .student-photo-img {
          object-fit: contain;
          object-position: bottom;
        }

        /* Solid horizontal gold bar separator */
        .gold-separator-bar {
          width: 100%;
          height: 6px;
          background-color: #ffb300;
          z-index: 3;
          flex-shrink: 0;
        }

        /* Bottom half: Info section */
        .info-section {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-sizing: border-box;
          flex: 1;
          background-color: #ffffff;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }

        /* Wave and curve decorations in info section */
        .info-bg-curve-left {
          position: absolute;
          bottom: -10px;
          left: -15px;
          width: 60px;
          height: 60px;
          background-color: rgba(59, 130, 246, 0.05);
          transform: rotate(45deg);
          border-radius: 12px;
          z-index: 1;
        }

        .info-bg-curve-right {
          position: absolute;
          bottom: -15px;
          right: -10px;
          width: 80px;
          height: 80px;
          background-color: rgba(59, 130, 246, 0.08);
          border-radius: 50%;
          z-index: 1;
        }

        .student-name-text {
          color: #0e3e8c;
          font-size: 1.05rem;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
          font-family: var(--font-sans);
          letter-spacing: -0.02em;
          z-index: 2;
          line-height: 1.2;
          height: 42px; /* Fixed height to prevent wrapping from changing the layout structure */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .student-name-text.long-name {
          font-size: 0.85rem;
        }

        /* Dotted line with center indicator */
        .custom-dotted-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 85%;
          margin: 6px 0 14px;
          z-index: 2;
        }

        .dot-line-left,
        .dot-line-right {
          flex: 1;
          height: 1px;
          border-bottom: 2px dashed #cbd5e1;
        }

        .center-solid-blue-indicator {
          width: 28px;
          height: 3px;
          background-color: #0e3e8c;
          margin: 0 8px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* College / Marks Pill Wrapper */
        .college-pill-badge-wrap {
          width: 100%;
          max-width: 220px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
        }

        .college-pill-badge {
          background-color: #0e3e8c;
          color: #ffffff;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          box-sizing: border-box;
          clip-path: polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%);
          border-radius: 0 10px 10px 10px;
        }

        .badge-bottom-gold-bar {
          width: 100%;
          height: 4px;
          background-color: #ffb300;
          border-radius: 0 0 4px 4px;
        }

        .pin-icon {
          display: flex;
          align-items: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .college-text {
          font-size: 0.95rem;
          font-weight: 850;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.02em;
          color: #ffffff;
          font-family: var(--font-sans);
        }

        /* ── Hero Banner Navigation Arrow Buttons ── */
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 70%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }
        .slider-nav-btn:hover {
          background: rgba(15, 23, 42, 0.75);
          transform: translateY(-50%) scale(1.08);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .slider-prev-btn {
          left: 5px;
        }
        .slider-next-btn {
          right: 5px;
        }
        @media (max-width: 768px) {
          .slider-nav-btn {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }
          .slider-prev-btn {
            left: 5px;
          }
          .slider-next-btn {
            right: 5px;
          }
        }

        /* ── Success Stories Section ── */
        .success-stories-section {
          padding: 80px 24px;
          background: #ffffff;
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
        }

        .stories-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 60px;
          align-items: center;
        }

        .stories-left-col {
          width: 320px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .stories-icon-wrapper {
          width: 90px;
          height: 90px;
          margin-bottom: 20px;
        }

        .stories-header-svg {
          width: 100%;
          height: 100%;
        }

        .stories-title {
          font-size: 2.2rem;
          font-weight: 850;
          color: #1e1b4b;
          margin: 0 0 12px;
          font-family: var(--font-sans);
          letter-spacing: -0.03em;
          line-height: 1.25;
        }

        .stories-title-line {
          width: 70px;
          height: 4px;
          background-color: #0066cc;
          border-radius: var(--radius-full);
          margin-bottom: 24px;
        }

        .stories-quote {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          color: #475569;
          line-height: 1.6;
          font-weight: 600;
        }
        .stories-quote p {
          margin: 0 0 4px;
        }

        .stories-right-col {
          flex: 1;
          overflow: hidden;
        }

        .stories-grid-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          width: 100%;
        }

        .story-video-card {
          position: relative;
          aspect-ratio: 1 / 1.55;
          background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: 24px;
          overflow: hidden;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.05);
        }

        .story-video-card.playable {
          cursor: pointer;
        }

        .story-video-card.playable:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 12px 30px rgba(0, 102, 204, 0.18);
        }

        .card-curve-decorator {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 90px;
          background: #ffffff;
          border-bottom-right-radius: 100%;
          opacity: 0.9;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .story-video-card.playable:hover .card-curve-decorator {
          transform: scale(1.05);
        }

        .card-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #0066cc;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 3;
        }

        .story-video-card.playable:hover .card-play-btn {
          background: #0052a3;
          transform: translate(-50%, -50%) scale(1.15);
          box-shadow: 0 8px 24px rgba(0, 102, 204, 0.45);
        }

        .story-video-card.disabled .card-play-btn {
          background: #cbd5e1;
          color: #94a3b8;
          box-shadow: none;
        }

        .card-dots-decorator {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          opacity: 0.3;
          z-index: 1;
        }

        .dot-row {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #0066cc;
        }

        .story-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .story-card-name-outside {
          margin-top: 12px;
          font-size: 1.05rem;
          font-weight: 750;
          color: #1e1b4b;
          text-align: center;
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
        }

        .story-card-info {
          position: relative;
          z-index: 3;
          margin-top: auto;
          width: 100%;
        }

        .story-card-tagline {
          font-size: 0.67rem;
          color: #ffffff;
          font-weight: 700;
          margin: 0;
          line-height: 1.45;
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
          text-align: left;
        }

        .story-card-placeholder {
          font-size: 0.8rem;
          color: #64748b;
          font-style: italic;
          margin: 0;
          font-family: var(--font-sans);
          text-align: center;
        }

        .story-cover-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 1;
        }

        .story-video-card.playable.has-cover:hover .story-cover-img {
          transform: scale(1.08);
        }

        .story-cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(85, 84, 100, 0.2) 0%,
            rgba(30, 27, 75, 0.4) 75%,
            rgba(15, 23, 42, 0.85) 90%
          );
          z-index: 2;
          transition: background 0.3s ease;
        }

        .story-video-card.playable.has-cover:hover .story-cover-overlay {
          background: linear-gradient(
            to bottom,
            rgba(30, 27, 75, 0.15) 0%,
            rgba(30, 27, 75, 0.3) 45%,
            rgba(15, 23, 42, 0.95) 100%
          );
        }

        .story-video-card.has-cover .story-student-name {
          color: #ffffff;
        }

        .story-video-card.has-cover .story-student-desc {
          color: #cbd5e1;
        }

        /* ── Video Modal Styles ── */
        .video-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.85);
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
          background: rgba(255, 255, 255, 0.15);
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
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .iframe-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
        }

        .iframe-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          border: 0;
          outline: none;
          background: #000000;
        }

        @media (max-width: 992px) {
          .stories-container {
            flex-direction: column;
            gap: 32px;
            align-items: flex-start;
          }
          .stories-left-col {
            width: 100%;
          }
          .stories-right-col {
            width: 100%;
            overflow: hidden; /* Added to restrict width boundary for mobile horizontal scrolling */
          }
          .stories-grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stories-grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stories-grid-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 12px;
            padding-bottom: 12px;
            width: 100%;
            -webkit-overflow-scrolling: touch;
          }
          .story-card-wrapper {
            flex: 0 0 160px; /* Fixed card width on mobile carousel */
            scroll-snap-align: start;
            width: auto;
          }
          .story-video-card {
            border-radius: 16px;
            padding: 12px 10px;
            aspect-ratio: 1 / 1.55;
          }
          .story-card-name-outside {
            font-size: 0.82rem;
            margin-top: 6px;
          }
          .card-play-btn {
            width: 32px;
            height: 32px;
          }
          .card-play-btn svg {
            width: 14px;
            height: 14px;
          }
        }

        /* ── Topper 2026 Custom Theme Card ── */
        .topper-2026-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
          width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .topper-2026-theme-card {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          border: 4px solid #0e3e8c;
          border-radius: 28px;
          overflow: hidden;
          width: 100%;
          max-width: 900px;
          box-shadow: 0 12px 35px rgba(15, 23, 42, 0.15);
          transition: all 0.3s ease;
        }
        .topper-2026-theme-card:hover {
          box-shadow: 0 18px 45px rgba(14, 62, 140, 0.25);
          transform: translateY(-5px);
        }
        @media (min-width: 768px) {
          .topper-2026-theme-card {
            flex-direction: row;
          }
        }
        .topper-2026-theme-card .topper-2026-image-section {
          position: relative;
          width: 100%;
          height: 400px;
          background-color: #dbebff;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .topper-2026-theme-card .topper-2026-image-section {
            width: 45%;
            height: auto;
            min-height: 450px;
          }
        }
        .topper-2026-theme-card .topper-2026-img {
          object-fit: contain;
          object-position: bottom;
          z-index: 2;
        }
        .topper-2026-theme-card .topper-2026-separator {
          width: 100%;
          height: 6px;
        }
        @media (min-width: 768px) {
          .topper-2026-theme-card .topper-2026-separator {
            width: 6px;
            height: auto;
          }
        }
        .topper-2026-theme-card .topper-2026-info-section {
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          background: #ffffff;
          position: relative;
        }
        @media (min-width: 768px) {
          .topper-2026-theme-card .topper-2026-info-section {
            width: 55%;
            padding: 50px 40px;
          }
        }
        .topper-2026-theme-card .topper-2026-name {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          margin: 0;
          color: #0e3e8c;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .topper-2026-theme-card .topper-2026-achievements {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }
        .topper-2026-theme-card .topper-2026-achievements li {
          display: flex;
          align-items: center;
          font-size: 1.15rem;
          background: rgba(14, 62, 140, 0.04);
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid rgba(14, 62, 140, 0.1);
          color: var(--text-primary);
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .topper-2026-theme-card .topper-2026-achievements li:hover {
          transform: translateX(5px);
          background: rgba(14, 62, 140, 0.08);
        }
        .topper-2026-theme-card .achieve-icon {
          font-size: 1.6rem;
          margin-right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: #dbebff;
          border-radius: 50%;
          border: 1px solid rgba(14, 62, 140, 0.1);
        }
        .topper-2026-theme-card .topper-2026-achievements strong {
          color: #0e3e8c;
          font-size: 1.25rem;
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
}
