"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ExploreCourses from "./ExploreCourses";
import ToppersCarousel from "./ToppersCarousel";
import WhySCA from "./WhySCA";
import AcademyInsights from "./AcademyInsights";
import ParentsTrustUs from "./ParentsTrustUs";

import FAQAccordion from "./FAQAccordion";
import {
  FaChevronRight, FaChevronLeft
} from "react-icons/fa6";

function BannerImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="banner-img"
        style={{ objectFit: "fill", transition: "opacity 0.3s ease" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

const DEFAULT_HERO_POSTERS = [
  { id: "1", title: "NEET Admissions Open 2026-27", image: "/images/banners/HeroPoster1.png", link: "/courses" },
  { id: "2", title: "NEET Repeater Achievers Batch", image: "/images/banners/HeroPoster2.png", link: "/courses" },
  { id: "3", title: "Class 11 & 12 Foundation Program", image: "/images/banners/HeroPoster3.png", link: "/courses" },
  { id: "4", title: "Grand NEET Mock Test Series", image: "/images/banners/HeroPoster4.png", link: "/admissions" },
  { id: "5", title: "Success Code Scholarship Test 2026", image: "/images/banners/ScholorshipHero.png", link: "/scholarships" },
];

export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [announceIdx, setAnnounceIdx] = useState(0);

  const tickerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (tickerRef.current && textRef.current) {
      setShouldScroll(textRef.current.offsetWidth > tickerRef.current.offsetWidth);
    }
  }, [announceIdx]);

  const highlightText = (text: string) => {
    const highlights = ["NEET & JEE", "NEET", "JEE", "SCST", "100% fee waiver", "Admissions Open", "Admissions Open 2026-27", "Limited seats!", "Free Demo Classes", "July 15"];
    const regex = new RegExp(`(${highlights.map(h => h.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const isHighlighted = highlights.some(h => h.toLowerCase() === part.toLowerCase() || part.toLowerCase().includes(h.toLowerCase()));
      return isHighlighted ? (
        <strong key={i} className="highlighted-word" style={{ color: "#40b5c1", fontWeight: 700 }}>{part}</strong>
      ) : (
        <span key={i} style={{ color: "#ffffff" }}>{part}</span>
      );
    });
  };

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>(DEFAULT_HERO_POSTERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [notifRes, bannerRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/content/notifications`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/content/banners`)
        ]);

        const notifData = await notifRes.json();
        const bannerData = await bannerRes.json();

        const nextAnnouncements = notifData.status === 'success'
          ? (notifData.data || []).filter((item: any) => item?.text)
          : [];
        const homeBanners = bannerData.status === 'success'
          ? (bannerData.data || []).filter((b: any) => (b?.type === 'HOME' || b?.type === undefined) && b?.image)
          : [];

        setAnnouncements(nextAnnouncements);
        if (homeBanners.length > 0) {
          setSlides(homeBanners);
        } else {
          setSlides(DEFAULT_HERO_POSTERS);
        }
      } catch (err) {
        console.error("Failed to load content:", err);
        setSlides(DEFAULT_HERO_POSTERS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  /* ── Slider auto-play ── */
  useEffect(() => {
    if (isSliderHovered || slides.length <= 1) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, [slides.length, isSliderHovered]);

  const prevSlide = () => setCurrentSlide(p => (p - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide(p => (p + 1) % slides.length);

  /* ── Announcement ticker auto-play ── */
  useEffect(() => {
    if (announcements.length <= 1) return;
    const t = setInterval(() => setAnnounceIdx(p => (p + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, [announcements.length]);

  return (
    <div className="home-container">

      {/* ══════════════════════════════════════════
          SECTION 1: FLOATING NOTIFICATION BAR
          ══════════════════════════════════════════ */}
      {isLoading ? (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner">
              <div className="notif-left">
                <span className="notif-icon">📢</span>
                <span className="notif-label">Latest Updates</span>
              </div>
              <div className="notif-ticker">
                <div className="skeleton-pulse" style={{ width: "60%", height: "16px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : announcements.length > 0 ? (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner">
              <div className="notif-left">
                <span className="notif-icon">📢</span>
                <span className="notif-label">Latest Updates</span>
              </div>
              <div className="notif-ticker" ref={tickerRef}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={announceIdx}
                    ref={textRef}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`notif-text ${shouldScroll ? "scroll-active" : ""}`}
                  >
                    {announcements[announceIdx] ? highlightText(announcements[announceIdx].text) : ''}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="notif-right">
                <Button href="/contact" variant="primary" size="sm">Apply Now</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner" style={{ justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600 }}>No latest updates at this time.</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SECTION 2: HERO POSTER BANNER SLIDER
          ══════════════════════════════════════════ */}
      <section className="hero-slider-section">
        <div
          className="hero-banner-wrap"
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          {isLoading ? (
            <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>
          ) : slides.length > 0 ? (
            <>
              <button className="banner-arrow left" onClick={prevSlide} aria-label="Previous slide">
                <FaChevronLeft />
              </button>
              <button className="banner-arrow right" onClick={nextSlide} aria-label="Next slide">
                <FaChevronRight />
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="banner-slide"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit" }}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={slides[currentSlide]?.link || slides[currentSlide]?.targetUrl || "/courses"}
                    style={{ display: "block", width: "100%", height: "100%", cursor: "pointer", position: "relative" }}
                    title={`Click to view details for ${slides[currentSlide]?.title || 'Poster'}`}
                  >
                    <BannerImage
                      src={slides[currentSlide]?.image}
                      alt={slides[currentSlide]?.title || slides[currentSlide]?.altText || "SCA Banner"}
                      priority={currentSlide === 0}
                    />
                  </a>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fbff", color: "#64748b", fontWeight: 600 }}>
              No banners available
            </div>
          )}
        </div>

        {!isLoading && slides.length > 0 && (
          <div className="banner-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`banner-dot ${currentSlide === idx ? "active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: EXPLORE COURSES
          ══════════════════════════════════════════ */}
      <ExploreCourses />

      {/* ══════════════════════════════════════════
          SECTION 4: TOPPERS CAROUSEL
          ══════════════════════════════════════════ */}
      <ToppersCarousel />

      {/* ══════════════════════════════════════════
          SECTION 5: WHY SUCCESS CODE ACADEMY
          ══════════════════════════════════════════ */}
      <WhySCA />

      {/* ══════════════════════════════════════════
          SECTION 6: BLOGS & VIDEOS
          ══════════════════════════════════════════ */}
      <AcademyInsights />

      {/* ══════════════════════════════════════════
          SECTION 7: PARENTS TRUST US
          ══════════════════════════════════════════ */}
      <ParentsTrustUs />



      {/* ══════════════════════════════════════════
          SECTION 12: FAQS SECTION
          ══════════════════════════════════════════ */}
      <FAQAccordion />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .home-container {
          background-color: var(--bg-base);
          background-image: 
            radial-gradient(circle at 10% 15%, rgba(64, 181, 193, 0.035) 0%, transparent 45%),
            radial-gradient(circle at 90% 75%, rgba(30, 64, 175, 0.035) 0%, transparent 45%);
        }

        /* ── SECTION 1: NOTIFICATION BAR ══ */
        .notif-bar-wrap {
          padding-top: 80px; /* Sits flush under header */
          padding-bottom: 0;
          width: 100%;
          box-sizing: border-box;
        }
        .notif-bar {
          display: flex;
          align-items: center;
          height: 42px;
          background: linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
          border-bottom: 1px solid rgba(64, 181, 193, 0.3);
          border-radius: 0;
          padding: 0 24px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
        }
        .notif-inner {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .notif-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .notif-icon { font-size: 1.1rem; }
        .notif-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
          background: linear-gradient(90deg, #40b5c1 0%, #2563eb 100%);
          padding: 4px 10px;
          border-radius: 99px;
          box-shadow: 0 2px 6px rgba(64, 181, 193, 0.25);
        }
        .notif-ticker {
          flex: 1;
          overflow: hidden;
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
        }
        .notif-text {
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff; /* White high contrast text */
          white-space: nowrap;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start; /* align left on desktop default */
          will-change: transform;
        }
        .notif-text.scroll-active {
          position: relative;
          display: inline-flex;
          left: auto;
          right: auto;
          top: auto;
          bottom: auto;
          padding-left: 100%;
          animation: notif-marquee-scroll 18s linear infinite;
        }
        .notif-ticker:hover .notif-text.scroll-active {
          animation-play-state: paused;
        }
        @keyframes notif-marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .notif-right { flex-shrink: 0; }
        .notif-right :global(.btn) {
          background-color: var(--accent-primary) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(64, 181, 193, 0.15) !important;
          height: 28px !important;
          line-height: 28px !important;
          padding: 0 12px !important;
          font-size: 0.75rem !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        .notif-right :global(.btn):hover {
          background-color: #35a5b0 !important;
          box-shadow: 0 6px 16px rgba(64, 181, 193, 0.3) !important;
        }

        /* ══ SECTION 2: HERO POSTER BANNER ══ */
        .hero-slider-section {
          width: 100%;
          max-width: 1200px; /* Exactly matches container width */
          margin: 0 auto;
          padding: 24px 24px 14px;
          box-sizing: border-box;
        }

        .hero-banner-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 6.2;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, #f8fbff 0%, #edf4ff 100%);
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.03),
            0 25px 50px rgba(37, 99, 235, 0.04);
        }

        /* Decorative Glow */
        .hero-banner-wrap::before {
          content: "";
          position: absolute;
          inset: -80px;
          background: radial-gradient(circle,
              rgba(59,130,246,.12),
              transparent 65%);
          pointer-events: none;
          z-index: 1;
        }

        /* Slide */
        :global(.banner-slide) {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        /* Image */
        :global(.banner-img) {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          object-position: center;
        }

        /* Overlay */
        .banner-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
              to bottom,
              rgba(255,255,255,.04),
              rgba(0,0,0,.03));
        }

        /* ============================================
          NAVIGATION BUTTONS
        ============================================ */
        .banner-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          color: #1e3a8a;
          background: rgba(255, 255, 255, .82);
          backdrop-filter: blur(14px);
          box-shadow: 0 10px 25px rgba(15,23,42,.12);
          transition: all .3s ease;
          opacity: .92;
        }

        .banner-arrow.left {
          left: 22px;
        }

        .banner-arrow.right {
          right: 22px;
        }

        .banner-arrow:hover {
          background: #2563eb;
          color: #fff;
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 15px 35px rgba(37,99,235,.35);
          opacity: 1;
        }

        .banner-arrow:active {
          transform: translateY(-50%) scale(.96);
        }

        /* ============================================
          DOTS
        ============================================ */
        .banner-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 20px 0 8px;
        }

        .banner-dot {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          background: #cbd5e1;
          transition: all .35s ease;
        }

        .banner-dot:hover {
          background: #93c5fd;
        }

        .banner-dot.active {
          width: 42px;
          background: linear-gradient(
              90deg,
              #2563eb,
              #38bdf8);
          box-shadow: 0 4px 12px rgba(37,99,235,.35);
        }

        /* ============================================
          RESPONSIVE
        ============================================ */
        @media (max-width: 992px) {
          .hero-slider-section {
            padding: 14px;
          }
          .hero-banner-wrap {
            aspect-ratio: 16 / 7.6;
            border-radius: 32px;
          }
          .banner-arrow {
            width: 44px;
            height: 44px;
          }
        }

        @media (max-width: 768px) {
          .hero-slider-section {
            padding: 10px 12px;
          }
          .hero-banner-wrap {
            aspect-ratio: 16 / 8.8;
            border-radius: 26px;
          }
          .banner-arrow {
            display: none;
          }
          .banner-dots {
            padding-top: 16px;
          }
          .notif-left, .notif-right {
            display: none !important;
          }
          .notif-ticker {
            justify-content: center !important;
            width: 100%;
          }
          .notif-text {
            justify-content: center;
            font-size: 0.78rem !important;
          }
          .notif-text.scroll-active {
            justify-content: flex-start;
          }
          .notif-bar-wrap {
            padding-top: 64px !important; /* Fits flush below 64px scrolled mobile header */
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .notif-bar {
            height: 42px !important;
            padding: 0 16px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-banner-wrap {
            aspect-ratio: 16 / 10.0;
            border-radius: 22px;
          }
          .banner-dot {
            width: 10px;
            height: 10px;
          }
          .banner-dot.active {
            width: 30px;
          }
        }
      `}</style>
    </div>
  );
}
