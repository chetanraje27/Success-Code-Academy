"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaAward, FaUserGraduate, FaBullseye } from "react-icons/fa6";

interface StatItem {
  id: number;
  icon: React.ReactNode;
  percentage: number;
  value: string;
  label: string;
  description: string;
  color: string;
}

const statsData: StatItem[] = [
  {
    id: 1,
    icon: <FaStar />,
    percentage: 98,
    value: "4.9",
    label: "Google Rating",
    description: "Based on 350+ reviews from parents & alumni",
    color: "#3b82f6" // Blue
  },
  {
    id: 2,
    icon: <FaHeart />,
    percentage: 98,
    value: "98%",
    label: "Parent Satisfaction",
    description: "Highly rated classroom care and responsiveness",
    color: "#3b82f6" // Blue
  },
  {
    id: 3,
    icon: <FaAward />,
    percentage: 85,
    value: "8+",
    label: "Years of Excellence",
    description: "Consistently delivering premium medical training",
    color: "#3b82f6" // Blue
  },
  {
    id: 4,
    icon: <FaUserGraduate />,
    percentage: 100,
    value: "1500+",
    label: "Students Enrolled",
    description: "Classroom medical aspirants mentored till date",
    color: "#3b82f6" // Blue
  },
  {
    id: 5,
    icon: <FaBullseye />,
    percentage: 93,
    value: "93%",
    label: "Selection Rate",
    description: "Sustained performance in NEET qualifiers annually",
    color: "#3b82f6" // Blue
  }
];

/* ── Custom Infographic: Radial Progress Ring with Glowing Center Icon ── */
function ProgressRing({ percentage, color, icon }: { percentage: number; color: string; icon: React.ReactNode }) {
  const radius = 34;
  const strokeWidth = 4.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" style={{ "--ring-color": color } as React.CSSProperties}>
      <svg width="84" height="84" viewBox="0 0 84 84" className="progress-ring-svg">
        {/* Background track circle */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          className="progress-ring-circle"
        />
      </svg>
      {/* Centered Glowing Icon */}
      <div className="progress-center-icon" style={{ color: color, background: color + "0a" }}>
        {icon}
      </div>
      <style jsx>{`
        .progress-ring-container {
          position: relative;
          width: 84px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .progress-ring-svg {
          width: 84px;
          height: 84px;
        }
        .progress-ring-circle {
          transition: stroke-dashoffset 1s ease-in-out;
        }
        .progress-center-icon {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
        }
      `}</style>
    </div>
  );
}

function StatCardCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = 0;
          const end = numericPart;
          if (start === end) return;

          const totalFrames = 60;
          const frameDuration = duration / totalFrames;
          let frame = 0;
          
          const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentVal = end * progress;
            setCount(parseFloat(currentVal.toFixed(value.includes(".") ? 1 : 0)));
            if (frame === totalFrames) {
              clearInterval(timer);
            }
          }, frameDuration);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [numericPart, duration, hasAnimated, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function ParentsTrustUs() {
  return (
    <section className="parents-trust-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Parents Trust Us, Students Succeed</h2>
          <p className="section-subtitle">
            Numbers that speak for our commitment to student care, academic rigor, and mentorship excellence.
          </p>
        </div>

        <div className="stats-grid">
          {/* Row 1 */}
          <div className="stats-row stats-row-1">
            {/* Original Set */}
            {statsData.slice(0, 3).map((stat, i) => (
              <motion.div
                key={`row1-orig-${stat.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="stat-card-motion"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <StatCardCounter value={stat.value} />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Duplicate Set for Marquee */}
            {statsData.slice(0, 3).map((stat, i) => (
              <div
                key={`row1-dup-${stat.id}`}
                className="stat-card-motion marquee-duplicate"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <span>{stat.value}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="stats-row stats-row-2">
            {/* Original Set */}
            {statsData.slice(3, 5).map((stat, i) => (
              <motion.div
                key={`row2-orig-${stat.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i + 3) * 0.08 }}
                className="stat-card-motion"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <StatCardCounter value={stat.value} />
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Duplicate Set 1 for Marquee */}
            {statsData.slice(3, 5).map((stat, i) => (
              <div
                key={`row2-dup1-${stat.id}`}
                className="stat-card-motion marquee-duplicate"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <span>{stat.value}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate Set 2 for Marquee */}
            {statsData.slice(3, 5).map((stat, i) => (
              <div
                key={`row2-dup2-${stat.id}`}
                className="stat-card-motion marquee-duplicate"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <span>{stat.value}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate Set 3 for Marquee */}
            {statsData.slice(3, 5).map((stat, i) => (
              <div
                key={`row2-dup3-${stat.id}`}
                className="stat-card-motion marquee-duplicate"
              >
                <div 
                  className="stat-card"
                  style={{ 
                    "--accent-color": stat.color, 
                    "--accent-glow": stat.color + "12" 
                  } as React.CSSProperties}
                >
                  <div className="stat-infographic-wrapper">
                    <ProgressRing percentage={stat.percentage} color={stat.color} icon={stat.icon} />
                  </div>
                  <div className="stat-card-text-wrapper">
                    <div className="stat-value">
                      <span>{stat.value}</span>
                    </div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-desc">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .parents-trust-section {
          padding: 35px 0;
          background: var(--bg-surface);
          width: 100%;
          position: relative;
        }
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .small-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-secondary);
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          background: rgba(30, 64, 175, 0.08);
          padding: 3px 10px;
          border-radius: 99px;
          text-transform: uppercase;
        }
        .section-title {
          font-size: 1.95rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .section-subtitle {
          font-size: 0.92rem;
          color: var(--text-secondary);
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          width: 100%;
        }
        .stats-row {
          display: contents;
        }
        .stat-card-motion {
          width: 100%;
          height: 100%;
        }
        .stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: 20px;
          padding: 20px 16px;
          text-align: center;
          box-shadow: 
            0 1px 3px rgba(0,0,0,0.01),
            0 10px 20px -8px rgba(15, 23, 42, 0.03);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          box-sizing: border-box;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 10px 15px -3px rgba(30, 64, 175, 0.01),
            0 24px 48px -4px var(--accent-glow),
            0 12px 18px -4px rgba(30, 64, 175, 0.01);
          border-color: var(--accent-color);
        }
        .stat-infographic-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-card:hover .stat-infographic-wrapper {
          transform: scale(1.05);
        }
        .stat-card:hover :global(.progress-center-icon) {
          transform: scale(1.1) rotate(6deg);
          box-shadow: 0 4px 10px var(--accent-glow);
        }
        .stat-value {
          font-size: 1.7rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.1;
          margin-bottom: 6px;
          letter-spacing: -0.03em;
        }
        .stat-label {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .stat-desc {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .stat-card-text-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .marquee-duplicate {
          display: none !important;
        }
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 768px) {
          .parents-trust-section { padding: 30px 0; }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px 12px;
          }
          .section-title {
            font-size: 1.6rem;
          }
          .section-subtitle {
            font-size: 0.88rem;
          }
          .stat-card {
            flex-direction: column !important;
            align-items: center !important;
            padding: 16px 12px !important;
            border-radius: 16px !important;
            height: auto !important;
          }
          .stat-infographic-wrapper {
            margin-bottom: 8px !important;
            transform: scale(0.8) !important;
            margin-top: -6px !important;
            margin-bottom: -4px !important;
            flex-shrink: 0;
          }
          .stat-card-text-wrapper {
            align-items: center !important;
            text-align: center !important;
            width: 100%;
          }
          .stat-value {
            font-size: 1.4rem !important;
            margin-bottom: 2px !important;
          }
          .stat-label {
            font-size: 0.82rem !important;
            margin-bottom: 0 !important;
          }
          .stat-desc {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .marquee-duplicate {
            display: flex !important;
          }
          .stats-grid {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100%;
            overflow: hidden;
          }
          .stats-row {
            display: flex;
            gap: 10px;
            width: max-content;
            margin: 0;
            padding: 6px 0;
            box-sizing: border-box;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .stats-row::-webkit-scrollbar {
            display: none;
          }
          
          /* Auto Scrolling Marquee Animations */
          .stats-row-1 {
            animation: marquee-right 14s linear infinite;
          }
          .stats-row-2 {
            animation: marquee-left 14s linear infinite;
          }
          
          /* Pause marquee on active/touch */
          .stats-row:active {
            animation-play-state: paused;
          }

          .stat-card-motion {
            flex: 0 0 130px !important;
            width: 130px !important;
            height: 145px !important;
          }
          .stat-card {
            flex-direction: column !important;
            align-items: center !important;
            padding: 10px 6px !important;
            border-radius: 12px !important;
            height: 100% !important;
            justify-content: center !important;
          }
          .stat-infographic-wrapper {
            margin-bottom: 0 !important;
            transform: scale(0.55) !important;
            margin-top: -16px !important;
            margin-bottom: -12px !important;
            flex-shrink: 0;
          }
          .stat-card-text-wrapper {
            align-items: center !important;
            text-align: center !important;
            width: 100%;
          }
          .stat-value {
            font-size: 1.1rem !important;
            margin-bottom: 1px !important;
          }
          .stat-label {
            font-size: 0.7rem !important;
            margin-bottom: 0 !important;
            line-height: 1.2 !important;
          }
          .stat-desc {
            display: none !important;
          }
        }
        
        @keyframes marquee-left {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </section>
  );
}
