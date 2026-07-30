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
import EditableSection from "@/components/admin/EditableSection";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import BannerEditor from "@/components/admin/BannerEditor";
import NotificationEditor from "@/components/admin/NotificationEditor";
import StarStudentEditor from "@/components/admin/StarStudentEditor";

type Announcement = {
  id?: number;
  text: string;
  link?: string | null;
};

type HomeBanner = {
  id?: number;
  type?: "HOME" | "RESULTS";
  image: string;
  altText?: string;
  title?: string;
  link?: string;
  targetUrl?: string;
};

type PublicContentResponse<T> = {
  status: string;
  data?: T[];
};

const removeAnnouncementEmoji = (text: string) =>
  text.replace(/\p{Extended_Pictographic}|\uFE0F/gu, "").replace(/\s{2,}/g, " ").trim();

function BannerImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {!isLoaded && (
        <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(203, 213, 225, 0.4)", zIndex: 1 }} />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1200px) 100vw, 1200px"
        className={`banner-img ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        style={{ transition: "opacity 0.3s ease-in-out" }}
      />
    </div>
  );
}



export default function HomeClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [announceIdx, setAnnounceIdx] = useState(0);
  const [editNotifs, setEditNotifs] = useState(false);
  const [editBanners, setEditBanners] = useState(false);
  const [editStars, setEditStars] = useState(false);
  const { refreshKey } = useEditModeOptional();

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

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [slides, setSlides] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setFetchError(false);
      try {
        const [notifRes, bannerRes] = await Promise.all([
          fetch("/api/content/notifications", { cache: "no-store" }),
          fetch("/api/content/banners", { cache: "no-store" }),
        ]);

        const notifData = await notifRes.json() as PublicContentResponse<Announcement>;
        const bannerData = await bannerRes.json() as PublicContentResponse<HomeBanner>;

        const nextAnnouncements = notifData.status === 'success'
          ? (notifData.data || [])
              .filter((item) => item?.text)
              .map((item) => ({ ...item, text: removeAnnouncementEmoji(item.text) }))
          : [];
        const homeBanners = bannerData.status === 'success'
          ? (bannerData.data || []).filter((banner) =>
              (banner?.type === 'HOME' || banner?.type === undefined) && banner?.image
            )
          : null;

        if (nextAnnouncements.length > 0) {
          setAnnouncements(nextAnnouncements);
        }
        if (homeBanners && homeBanners.length > 0) {
          setCurrentSlide(0);
          setSlides(homeBanners);
        }
      } catch (err) {
        console.error("Failed to load content:", err);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [refreshKey]);

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
      <h1 className="sr-only">Success Code Academy</h1>

      {/* ══════════════════════════════════════════
          SECTION 1: FLOATING NOTIFICATION BAR
          ══════════════════════════════════════════ */}
      <EditableSection
        label="Notifications"
        onEdit={() => setEditNotifs(true)}
        controlOffsetTop={84}
      >
      {isLoading ? (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner">
              <div className="notif-left">
                <span className="notif-label">Latest Updates</span>
              </div>
              <div className="notif-ticker" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="skeleton-pulse" style={{ width: "40%", height: "16px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
                <div className="skeleton-pulse" style={{ width: "30%", height: "16px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.15)" }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : fetchError ? (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner" style={{ justifyContent: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", fontWeight: 600 }}>Unable to load updates at this time.</span>
            </div>
          </div>
        </div>
      ) : announcements.length > 0 ? (
        <div className="notif-bar-wrap">
          <div className="notif-bar">
            <div className="notif-inner">
              <div className="notif-left">
                <span className="notif-label">Latest Updates</span>
              </div>
              <div className="notif-ticker" ref={tickerRef}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={announceIdx}
                    ref={textRef}
                    initial={false}
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
      </EditableSection>

      {/* ══════════════════════════════════════════
          SECTION 2: HERO POSTER BANNER SLIDER
          ══════════════════════════════════════════ */}
      <EditableSection label="Banners" onEdit={() => setEditBanners(true)} as="section">
      <section className="hero-slider-section">
        <div
          className="hero-banner-wrap"
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
        >
          {slides.length > 0 ? (
            <>
              {slides.length > 1 && (
                <>
                  <button className="banner-arrow left" onClick={prevSlide} aria-label="Previous slide">
                    <FaChevronLeft />
                  </button>
                  <button className="banner-arrow right" onClick={nextSlide} aria-label="Next slide">
                    <FaChevronRight />
                  </button>
                </>
              )}

              {(slides.length > 1 ? [-1, 0, 1] : [0]).map((offset) => {
                const slideIndex = (currentSlide + offset + slides.length) % slides.length;
                const slide = slides[slideIndex];
                const position = offset === 0 ? "active" : offset < 0 ? "previous" : "next";

                return (
                  <div
                    key={slides.length > 2 ? (slide.id ?? slide.image) : `${slide.id ?? slide.image}-${position}`}
                    className={`banner-slide ${position}`}
                    aria-hidden={offset !== 0}
                  >
                    <a
                      href={slide.link || slide.targetUrl || "/courses"}
                      tabIndex={offset === 0 ? 0 : -1}
                      title={`Click to view details for ${slide.title || "Poster"}`}
                    >
                      <BannerImage
                        src={slide.image}
                        alt={slide.title || slide.altText || "SCA Banner"}
                        priority={slideIndex === 0}
                      />
                    </a>
                  </div>
                );
              })}
            </>
          ) : isLoading ? (
            <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>
          ) : fetchError ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9", color: "#64748b", fontWeight: 600 }}>
              Unable to load banners. Please try again later.
            </div>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fbff", color: "#64748b", fontWeight: 600 }}>
              No banners available
            </div>
          )}
        </div>

        {slides.length > 0 && (
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
      </EditableSection>

      <NotificationEditor open={editNotifs} onClose={() => setEditNotifs(false)} />
      <BannerEditor open={editBanners} onClose={() => setEditBanners(false)} />
      <StarStudentEditor open={editStars} onClose={() => setEditStars(false)} />

      {/* ══════════════════════════════════════════
          SECTION 3: EXPLORE COURSES
          ══════════════════════════════════════════ */}
      <ExploreCourses />

      {/* ══════════════════════════════════════════
          SECTION 4: TOPPERS CAROUSEL
          ══════════════════════════════════════════ */}
      <EditableSection label="Star Students" onEdit={() => setEditStars(true)}>
      <ToppersCarousel />
      </EditableSection>

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
    </div>
  );
}
