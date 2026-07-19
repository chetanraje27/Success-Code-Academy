import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  FaCalendarDays, FaTrophy, FaHospital, FaBrain,
  FaUserGroup, FaChartLine, FaGraduationCap, FaHeart,
  FaArrowRight, FaChevronDown
} from "react-icons/fa6";

interface CountUpProps {
  end: string;
  duration?: number;
  suffix?: string;
}

// Counting component to animate numbers when visible
function CountUp({ end, duration = 1500, suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const endNum = parseInt(end.replace(/\D/g, ''));
    if (isNaN(endNum)) {
      setCount(end as any);
      return;
    }
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
  }, [isInView, end, duration]);

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
  const [isExpanded, setIsExpanded] = useState(false);
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
          <h2 className="header-title">Why Success Code Academy?</h2>
          <p className="header-subtitle">Conceptual Learning. Personalized Mentorship. Proven Results.</p>

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
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="capsule left-capsule">
                  <div className="capsule-icon-box" style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}dd 100%)`, boxShadow: `0 8px 20px ${c.color}25` }}>
                    <span className="capsule-icon">{c.icon}</span>
                  </div>
                  <div className="capsule-content">
                    <h4 className="capsule-title" style={{ color: c.color }}>{c.title}</h4>
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
                <img
                  src="/images/Success Code Academy Logo.png"
                  alt="Success Code Academy Logo"
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
              const showOnMobile = isExpanded || (c.id <= 9); // Handles mobile logic dynamically
              return (
                <motion.div
                  key={c.id}
                  className={`capsule-wrap ${!isExpanded && c.id > 5 ? "mobile-hidden" : ""}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="capsule right-capsule">
                    <div className="capsule-content text-right">
                      <h4 className="capsule-title" style={{ color: c.color }}>{c.title}</h4>
                      <div className="capsule-desc">{c.description}</div>
                    </div>
                    <div className="capsule-icon-box" style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}dd 100%)`, boxShadow: `0 8px 20px ${c.color}25` }}>
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
                      <div className="capsule-icon-box" style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${c.color}dd 100%)`, boxShadow: `0 8px 20px ${c.color}25` }}>
                        <span className="capsule-icon">{c.icon}</span>
                      </div>
                      <div className="capsule-content">
                        <h4 className="capsule-title" style={{ color: c.color }}>{c.title}</h4>
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

      <style jsx>{`
        .why-sca-section {
          position: relative;
          background: linear-gradient(180deg, var(--bg-base) 0%, #edf3fc 100%);
          padding: 40px 0;
          width: 100%;
          overflow: hidden;
        }
        .mobile-ecosystem-carousel {
          display: none;
        }
        /* Background patterns */
        .medical-pattern-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .medical-lines {
          width: 100%;
          height: 100%;
        }
        .gradient-blob {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
        }
        .blob-top-left {
          background: #40b5c1;
          top: -100px;
          left: -100px;
        }
        .blob-bottom-right {
          background: #1e40af;
          bottom: -150px;
          right: -150px;
        }
        .container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        /* Header styles */
        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .header-title {
          font-size: 1.95rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .header-subtitle {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin: 0 0 12px;
          letter-spacing: 0.02em;
        }
        /* Heartbeat Divider */
        .heartbeat-divider {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20px;
        }
        .heartbeat-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: heartbeat-draw 2.5s ease-out forwards infinite;
        }

        /* Ecosystem main layout container (fixed width to match SVG coordinate layout) */
        .ecosystem-container {
          width: 1150px;
          max-width: 100%;
          margin: 0 auto 30px;
          position: relative;
          height: 600px;
        }
        .left-column {
          position: absolute;
          left: 20px;
          top: 0;
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 0;
          box-sizing: border-box;
          z-index: 5;
        }
        .right-column {
          position: absolute;
          right: 20px;
          top: 0;
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 0;
          box-sizing: border-box;
          z-index: 5;
        }
        .capsule-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        /* Pill-shaped capsules (white surface, thin borders) */
        .capsule {
          display: flex;
          align-items: center;
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: 20px;
          padding: 16px 20px;
          min-height: auto;
          box-shadow: 0 8px 24px rgba(149, 157, 165, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
          box-sizing: border-box;
          z-index: 10;
          position: relative;
        }
        .left-capsule {
          gap: 12px;
          padding-left: 48px; /* space for absolute icon overlapping left side */
        }
        .right-capsule {
          gap: 12px;
          padding-right: 48px; /* space for absolute icon overlapping right side */
          justify-content: flex-end;
        }
        /* Hover lift & shadow increase */
        .capsule:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 30px rgba(149, 157, 165, 0.08);
          border-color: var(--accent-secondary);
        }
        
        .capsule-icon-box {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          z-index: 15;
          top: calc(50% - 22px);
          transition: transform 0.3s ease;
        }
        .left-capsule .capsule-icon-box {
          left: -22px;
        }
        .right-capsule .capsule-icon-box {
          right: -22px;
        }
        .capsule:hover .capsule-icon-box {
          transform: scale(1.08) rotate(4deg);
        }
        .capsule-icon {
          font-size: 1.05rem;
          display: flex;
        }

        .capsule-content {
          flex-grow: 1;
        }
        .capsule-title {
          font-size: 0.92rem;
          font-weight: 850;
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .capsule-desc {
          font-size: 0.72rem;
          color: var(--text-secondary);
          font-weight: 500;
          line-height: 1.4;
          margin: 0;
        }
        .text-right {
          text-align: right;
        }

        /* Connecting SVG Lines (Desktop only) */
        .ecosystem-svg-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          display: block;
        }
        .glow-dot {
          animation: dot-glow-pulse 2s infinite alternate;
        }
        @keyframes dot-glow-pulse {
          0% { r: 3.5px; opacity: 0.7; }
          100% { r: 5px; opacity: 1; }
        }        /* Hexagon centerpiece centerpiece */
        .ecosystem-center {
          position: absolute;
          left: 445px; /* Centered in 1150px container: (1150 - 260) / 2 */
          top: 160px; /* Centered vertically in 600px container: (600 - 280) / 2 */
          width: 260px;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          flex-shrink: 0;
        }
        .hexagon-inner {
          position: absolute;
          inset: 0;
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px 14px;
          text-align: center;
        }
        .hexagon-glow {
          display: none;
        }
        .logo-icon-wrap {
          margin-bottom: 6px;
        }
        .logo-text-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .logo-success {
          font-size: 0.9rem;
          font-weight: 900;
          color: #0b1a30;
          letter-spacing: 0.04em;
        }
        .logo-code {
          font-size: 0.9rem;
          font-weight: 900;
          color: #0b1a30;
          letter-spacing: 0.04em;
        }
        .logo-city {
          font-size: 0.68rem;
          font-weight: 700;
          color: #1e40af;
          letter-spacing: 0.12em;
          margin-top: 1px;
        }
        .center-divider {
          width: 60px;
          height: 1.5px;
          background: #1e40af;
          margin: 8px 0;
        }
        .center-tagline {
          font-size: 0.68rem;
          font-weight: 600;
          color: #475569;
          margin: 0;
          line-height: 1.35;
        }
        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(30, 64, 175, 0.15);
          border-radius: 32px;
          animation: pulse 3.5s linear infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0; }
        } }


        /* Mobile Expand Button */
        .mobile-expand-btn-wrap {
          display: none;
        }

        /* Animations */
        @keyframes heartbeat-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes hex-pulse {
          0% { transform: scale(0.96); opacity: 0.6; }
          100% { transform: scale(1.04); opacity: 1; }
        }

        /* Tablet Layout (4 blocks on top, Center, 4 blocks below) */
        @media (min-width: 769px) and (max-width: 1100px) {
          .ecosystem-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            height: auto !important;
            min-height: auto;
            max-width: 100%;
          }
          .left-column, .right-column {
            display: contents;
            position: static !important;
            width: auto !important;
            height: auto !important;
          }
          .left-column > * {
            order: 1;
          }
          .ecosystem-center {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 180px !important;
            height: 200px !important;
            grid-column: span 4;
            justify-self: center;
            margin: 20px 0;
            order: 2;
          }
          .right-column > * {
            order: 3;
          }
          .ecosystem-svg-lines {
            display: none;
          }
          .left-capsule, .right-capsule {
            padding: 20px;
            min-height: 120px;
            border-radius: 20px;
          }
          .left-capsule {
            padding-left: 20px;
          }
          .right-capsule {
            padding-right: 20px;
          }
          .capsule-icon-box {
            position: static !important;
            margin-bottom: 12px;
          }
          .left-capsule, .right-capsule {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
          .text-right {
            text-align: left;
          }
        }

        /* Mobile Layout (< 768px) */
        @media (max-width: 768px) {
          .why-sca-section { padding: 40px 0; }
          .header-title { font-size: 1.9rem; }
          .header-subtitle { font-size: 0.88rem; }
          
          .ecosystem-container {
            display: none !important; /* Hide static layout on mobile */
          }
          .mobile-ecosystem-carousel {
            display: block !important;
            position: relative;
            width: 100%;
            overflow: hidden;
            margin-bottom: 20px;
            padding: 10px 0;
            box-sizing: border-box;
          }
          .mobile-carousel-track {
            display: flex;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            width: 100%;
          }
          .mobile-carousel-slide {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            flex-shrink: 0;
            box-sizing: border-box !important;
            padding: 0 24px !important;
          }
          .mobile-slide-pair-wrap {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            background: rgba(255, 255, 255, 0.6) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.8) !important;
            border-radius: 24px !important;
            padding: 20px 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            box-shadow: 0 10px 30px rgba(30, 64, 175, 0.04) !important;
          }
          .mobile-slider-card {
            position: relative !important;
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 16px !important;
            padding: 16px 12px 12px 48px !important;
            min-height: auto !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            text-align: left !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.02) !important;
          }
          .capsule-icon-box {
            position: absolute !important;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            top: calc(50% - 18px) !important;
            left: -18px !important;
            right: auto !important;
            border-width: 2px;
          }
          .capsule-icon {
            font-size: 0.9rem;
          }
          .capsule-content {
            text-align: left !important;
          }
          .capsule-title { 
            font-size: 0.85rem; 
            margin-bottom: 4px;
          }
          .capsule-desc { 
            font-size: 0.68rem; 
            line-height: 1.35;
          }
          .mobile-carousel-dots {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
          }
          .carousel-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #cbd5e1;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .carousel-dot:focus {
            outline: none;
          }
          .carousel-dot.active {
            width: 24px;
            border-radius: 4px;
            background: #1e40af;
          }
          .mobile-expand-btn-wrap {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
