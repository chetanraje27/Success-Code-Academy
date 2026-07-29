import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  FaTrophy, FaHospital, FaBrain,
  FaUserGroup, FaChartLine, FaGraduationCap, FaHeart,
} from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

interface CountUpProps {
  end: string;
  duration?: number;
  suffix?: string;
}

// Counting component to animate numbers when visible
function CountUp({ end, duration = 1500, suffix = "" }: CountUpProps) {
  const endNum = parseInt(end.replace(/\D/g, ""));
  const isNumeric = !Number.isNaN(endNum);
  const [count, setCount] = useState<number | string>(isNumeric ? 0 : end);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    const totalFrames = 50;
    const frameDuration = duration / totalFrames;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.round(endNum * progress));
      if (frame === totalFrames) {
        clearInterval(timer);
      }
    }, frameDuration);
    return () => clearInterval(timer);
  }, [isInView, endNum, isNumeric, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const leftCapsules = [
  {
    id: 1,
    metric: <>AIR <CountUp end="5" /></>,
    title: "AIR 5",
    description: (
      <>
        <strong>NEET 2026</strong>
        <br />
        All India Girls Topper
        <br />
        Maharashtra Girls Rank 1
      </>
    ),
    icon: <FaTrophy />,
    color: "#0ca678", // Green
    bg: "#e6fcf5",
  },
  {
    id: 2,
    metric: <>AIR <CountUp end="26" /></>,
    title: "AIR 26",
    description: "Outstanding NEET 2025 performance reflecting our dedication and expertise.",
    icon: <FaTrophy />,
    color: "#f08c00", // Amber
    bg: "#fff9db",
  },

  {
    id: 4,
    metric: <><CountUp end="36" />+</>,
    title: "Best Selection Ratio",
    description: "In 2025 – 36+ students got selected for MBBS in Government Medical Colleges.",
    icon: <FaHospital />,
    color: "#1c7ed6", // Blue
    bg: "#e7f5ff",
  },
  {
    id: 5,
    metric: "Concept-Based",
    title: "Concept-Based Learning",
    description: "Strong conceptual foundation before problem-solving for long-term understanding.",
    icon: <FaBrain />,
    color: "#7048e8", // Purple
    bg: "#f3f0ff",
  }
];

const rightCapsules = [
  {
    id: 6,
    metric: "1:1 Mentorship",
    title: "Personalized Mentorship",
    description: "Individual attention, doubt solving, progress tracking and confidence-building guidance.",
    icon: <FaUserGroup />,
    color: "#e03131", // Red
    bg: "#fff5f5",
  },
  {
    id: 7,
    metric: "NEET pattern",
    title: "Regular Tests & Analysis",
    description: "NEET pattern tests with detailed performance analysis to improve accuracy and confidence.",
    icon: <FaChartLine />,
    color: "#097969", // Pine Green
    bg: "#eaf6f0",
  },
  {
    id: 8,
    metric: "Mentors",
    title: "Experienced Faculty",
    description: "Passionate and experienced mentors focused on your success at every step.",
    icon: <FaGraduationCap />,
    color: "#1c7ed6", // Blue
    bg: "#e7f5ff",
  },
  {
    id: 9,
    metric: "Student-First",
    title: "Student-First Environment",
    description: "A disciplined, motivating and supportive atmosphere where every dream matters.",
    icon: <FaHeart />,
    color: "#d9480f", // Orange
    bg: "#fff4e6",
  }
];

export default function WhySCA() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentMobileSlide((prev) => (prev + 1) % 4);
    } else if (isRightSwipe) {
      setCurrentMobileSlide((prev) => (prev - 1 + 4) % 4);
    }
  };

  return (
    <section className="why-sca-section" ref={containerRef}>
      {/* Background medical patterns & subtle blobs - minimal (3-5% opacity) */}
      <div className="medical-pattern-bg">
        <svg className="medical-lines" width="100%" height="100%">
          <defs>
            <pattern id="dot-mesh" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="rgba(64, 181, 193, 0.04)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-mesh)" />
          <path d="M120 180 Q160 90 200 180 T280 180" fill="none" stroke="rgba(30, 64, 175, 0.02)" strokeWidth="2.5" />
          <path d="M120 180 Q160 270 200 180 T280 180" fill="none" stroke="rgba(64, 181, 193, 0.02)" strokeWidth="2.5" />
          <path d="M 900 100 L 970 100 L 980 80 L 990 130 L 1000 70 L 1010 110 L 1020 100 L 1090 100" stroke="rgba(64, 181, 193, 0.02)" strokeWidth="2" fill="none" />
        </svg>
        <div className="gradient-blob blob-top-left"></div>
        <div className="gradient-blob blob-bottom-right"></div>
      </div>

      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="header-title">
            <EditableText contentKey="why.heading" label="why SCA heading">
              Why Success Code Academy?
            </EditableText>
          </h2>
          <p className="header-subtitle">
            <EditableText
              contentKey="why.description"
              label="why SCA introduction"
            >
              Conceptual Learning. Personalized Mentorship. Proven Results.
            </EditableText>
          </p>

          {/* Animated Heartbeat Line */}
          <div className="heartbeat-divider">
            <svg className="heartbeat-svg" viewBox="0 0 200 20" width="160" height="20">
              <path
                className="heartbeat-path"
                d="M 0 10 L 80 10 L 90 10 L 95 2 L 100 18 L 105 10 L 115 10 L 125 10 L 200 10"
                fill="none"
                stroke="#1e40af"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* main infographic ecosystem container */}
        <div className="ecosystem-container">

          {/* Responsive SVG Connecting Lines (Desktop only) */}
          <svg className="ecosystem-svg-lines" viewBox="0 0 1150 600" fill="none">
            {/* Left lines (4 paths, color-coded to capsules) */}
            <path d="M 300 75 C 380 75, 450 200, 495 220" stroke="#0ca678" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 300 225 C 360 225, 410 240, 465 260" stroke="#f08c00" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 300 375 C 360 375, 410 360, 465 340" stroke="#1c7ed6" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 300 525 C 380 525, 450 400, 495 380" stroke="#7048e8" strokeWidth="2" strokeDasharray="5 5" />

            {/* Right lines (4 paths, color-coded to capsules) */}
            <path d="M 850 75 C 770 75, 700 200, 655 220" stroke="#e03131" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 850 225 C 790 225, 740 240, 685 260" stroke="#097969" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 850 375 C 790 375, 740 360, 685 340" stroke="#1c7ed6" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M 850 525 C 770 525, 700 400, 655 380" stroke="#d9480f" strokeWidth="2" strokeDasharray="5 5" />

            {/* Glowing contact points on centerpiece boundary */}
            <circle cx="495" cy="220" r="4.5" fill="#0ca678" className="glow-dot" />
            <circle cx="465" cy="260" r="4.5" fill="#f08c00" className="glow-dot" />
            <circle cx="465" cy="340" r="4.5" fill="#1c7ed6" className="glow-dot" />
            <circle cx="495" cy="380" r="4.5" fill="#7048e8" className="glow-dot" />

            <circle cx="655" cy="220" r="4.5" fill="#e03131" className="glow-dot" />
            <circle cx="685" cy="260" r="4.5" fill="#097969" className="glow-dot" />
            <circle cx="685" cy="340" r="4.5" fill="#1c7ed6" className="glow-dot" />
            <circle cx="655" cy="380" r="4.5" fill="#d9480f" className="glow-dot" />
          </svg>

          {/* Left Columns - Capsules (Icon Left) */}
          <div className="ecosystem-column left-column">
            {leftCapsules.map((c, i) => (
              <motion.div
                key={c.id}
                className="capsule-wrap"
                initial={false}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="capsule left-capsule">
                  <div className={`capsule-card-motif why-motif-${c.id}`} aria-hidden="true">
                    {c.icon}
                  </div>
                  <div className="capsule-icon-box">
                    <span className="capsule-icon">{c.icon}</span>
                  </div>
                  <div className="capsule-content">
                    <h4 className="capsule-title">
                      <EditableText
                        contentKey={`why.feature-${c.id}.title`}
                        label={`${c.title} feature title`}
                        showInlineControls={false}
                      >
                        {c.title}
                      </EditableText>
                    </h4>
                    <div className="capsule-desc">{c.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Glowing Hexagon Centerpiece */}
          <div className="ecosystem-center">
            <div className="hexagon-inner">
              <div className="logo-icon-wrap" style={{ width: '220px', height: '110px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Image
                  src="/images/ui/Success Code Academy Logo.png"
                  alt="Success Code Academy Logo"
                  width={220}
                  height={110}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="logo-text-wrap">
                <span className="logo-city">BARAMATI</span>
              </div>
              <div className="center-divider"></div>
              <p className="center-tagline">
                Teaching Is Our Prayer.<br />
                NEET Results<br />
                Are Its Blessings.
              </p>
            </div>
          </div>

          {/* Right Columns - Capsules (Icon Right) */}
          <div className="ecosystem-column right-column">
            {rightCapsules.map((c, i) => {
              return (
                <motion.div
                  key={c.id}
                  className={`capsule-wrap ${c.id > 5 ? "mobile-hidden" : ""}`}
                  initial={false}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="capsule right-capsule">
                    <div className={`capsule-card-motif why-motif-${c.id}`} aria-hidden="true">
                      {c.icon}
                    </div>
                    <div className="capsule-content text-right">
                      <h4 className="capsule-title">
                        <EditableText
                          contentKey={`why.feature-${c.id}.title`}
                          label={`${c.title} feature title`}
                          showInlineControls={false}
                        >
                          {c.title}
                        </EditableText>
                      </h4>
                      <div className="capsule-desc">{c.description}</div>
                    </div>
                    <div className="capsule-icon-box">
                      <span className="capsule-icon">{c.icon}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Mobile Carousel Slider */}
        <div 
          className="mobile-ecosystem-carousel"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="mobile-carousel-track" 
            style={{ transform: `translateX(-${currentMobileSlide * 100}%)` }}
          >
            {[
              [leftCapsules[0], leftCapsules[1]],
              [leftCapsules[2], leftCapsules[3]],
              [rightCapsules[0], rightCapsules[1]],
              [rightCapsules[2], rightCapsules[3]]
            ].map((pair, idx) => (
              <div key={idx} className="mobile-carousel-slide">
                <div className="mobile-slide-pair-wrap">
                  {pair.map((c) => (
                    <div key={c.id} className="capsule mobile-slider-card">
                      <div className={`capsule-card-motif why-motif-${c.id}`} aria-hidden="true">
                        {c.icon}
                      </div>
                      <div className="capsule-icon-box">
                        <span className="capsule-icon">{c.icon}</span>
                      </div>
                      <div className="capsule-content">
                        <h4 className="capsule-title">
                          <EditableText
                            contentKey={`why.feature-${c.id}.title`}
                            label={`${c.title} feature title`}
                            showInlineControls={false}
                          >
                            {c.title}
                          </EditableText>
                        </h4>
                        <div className="capsule-desc">{c.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Slide dots */}
          <div className="mobile-carousel-dots">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                className={`carousel-dot ${currentMobileSlide === idx ? "active" : ""}`}
                onClick={() => setCurrentMobileSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>



      </div>
    </section>
  );
}
