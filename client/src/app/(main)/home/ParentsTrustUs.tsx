"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaBullseye, FaHeart, FaUsers, FaAward } from "react-icons/fa6";
import { FiStar } from "react-icons/fi";

function StatCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
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

  return <span ref={ref}>{hasAnimated ? count : 0}{suffix}</span>;
}

export default function ParentsTrustUs() {
  return (
    <section className="parents-trust-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Parents trust us, students succeed.</h2>
          <p className="section-subtitle">
            Numbers that speak for our commitment to student care, academic rigor, and mentorship excellence.
          </p>
        </div>

        {/* Structured Grid matching the screenshot */}
        <div className="trust-grid-wrapper">
          {/* Top Row: Featured 93% Selection Rate + 4.9 Google Rating */}
          <div className="trust-row top-row">
            {/* Card 1: 93% Selection Rate (Featured Light Teal Card) */}
            <div className="trust-card featured-teal-card">
              <div className="card-top-head">
                <div className="card-icon-box teal-icon-box">
                  <FaBullseye className="card-icon" />
                </div>
                <div className="card-number teal-number">
                  <StatCounter value="93%" />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">Selection Rate</h3>
                <p className="card-desc">Sustained performance in NEET qualifiers annually.</p>
              </div>
              {/* Subtle background arc shape */}
              <div className="arc-shape-wrap" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="arc-svg">
                  <path d="M 0 100 A 100 100 0 0 1 100 0" stroke="#b2ece4" strokeWidth="12" fill="none" />
                </svg>
              </div>
            </div>

            {/* Card 2: 4.9 Google Rating */}
            <div className="trust-card standard-white-card">
              <div className="card-top-head">
                <div className="card-icon-box yellow-icon-box">
                  <FiStar className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value="4.9" />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">Google Rating</h3>
                <p className="card-desc">Based on 350+ reviews from parents & alumni.</p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Satisfaction + Students + Excellence */}
          <div className="trust-row bottom-row">
            {/* Card 3: 98% Satisfaction */}
            <div className="trust-card standard-white-card">
              <div className="card-top-head">
                <div className="card-icon-box blue-icon-box">
                  <FaHeart className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value="98%" />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">Satisfaction</h3>
                <p className="card-desc">Highly rated classroom care and responsiveness.</p>
              </div>
            </div>

            {/* Card 4: 1500+ Students */}
            <div className="trust-card standard-white-card">
              <div className="card-top-head">
                <div className="card-icon-box purple-icon-box">
                  <FaUsers className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value="1500+" />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">Students</h3>
                <p className="card-desc">Classroom medical aspirants mentored till date.</p>
              </div>
            </div>

            {/* Card 5: 8+ Excellence */}
            <div className="trust-card standard-white-card">
              <div className="card-top-head">
                <div className="card-icon-box lightblue-icon-box">
                  <FaAward className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value="8+" />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">Excellence</h3>
                <p className="card-desc">Consistently delivering premium medical training.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .parents-trust-section {
          padding: 50px 0;
          background: #ffffff;
          width: 100%;
          position: relative;
        }

        .container {
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        /* Section Header */
        .section-header {
          text-align: left;
          margin-bottom: 36px;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.025em;
          margin: 0 0 10px 0;
          line-height: 1.2;
        }

        .section-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
          font-weight: 400;
        }

        /* Trust Grid Structure */
        .trust-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .trust-row {
          display: grid;
          gap: 20px;
          width: 100%;
        }

        .top-row {
          grid-template-columns: 1.5fr 1fr;
        }

        .bottom-row {
          grid-template-columns: 1fr 1fr 1fr;
        }

        /* Card Common Styles */
        .trust-card {
          border-radius: 18px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 170px;
          box-sizing: border-box;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .trust-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
        }

        /* Featured Light Teal Card */
        .featured-teal-card {
          background-color: #eef8f6;
          border: 1.5px solid #d1ebe6;
        }

        /* Standard White Card */
        .standard-white-card {
          background-color: #ffffff;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);
        }

        /* Card Top Head (Icon + Number) */
        .card-top-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        /* Icon Boxes */
        .card-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-icon {
          font-size: 1.35rem;
        }

        .teal-icon-box {
          background-color: #d7f2ef;
          color: #0e8585;
        }

        .yellow-icon-box {
          background-color: #fef3c7;
          color: #d97706;
        }

        .blue-icon-box {
          background-color: #e0f2fe;
          color: #0284c7;
        }

        .purple-icon-box {
          background-color: #e0e7ff;
          color: #4338ca;
        }

        .lightblue-icon-box {
          background-color: #e0f2fe;
          color: #0284c7;
        }

        /* Numbers */
        .card-number {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .teal-number {
          color: #0b6969;
        }

        .dark-number {
          color: #1e293b;
        }

        /* Card Body */
        .card-body {
          position: relative;
          z-index: 2;
        }

        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
          font-weight: 400;
        }

        /* Background Arc Shape on Featured Card */
        .arc-shape-wrap {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 140px;
          height: 140px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.75;
        }

        .arc-svg {
          width: 100%;
          height: 100%;
        }

        /* Responsive Styles for iPad, Tablet, and Mobile */
        @media (max-width: 992px) {
          .section-title {
            font-size: 1.95rem;
          }
          .section-subtitle {
            font-size: 0.98rem;
          }
          .top-row {
            grid-template-columns: 1.3fr 1fr;
          }
          .bottom-row {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
          }
          .trust-card {
            padding: 24px 20px;
            min-height: 155px;
          }
          .card-number {
            font-size: 1.95rem;
          }
        }

        @media (max-width: 1024px) and (min-width: 641px) {
          .top-row {
            grid-template-columns: 1.5fr 1fr !important;
            gap: 16px !important;
          }
          .bottom-row {
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 16px !important;
          }
          .trust-card {
            padding: 20px 18px;
            min-height: 140px;
          }
          .card-number {
            font-size: 1.85rem;
          }
        }
        @media (max-width: 640px) {
          .parents-trust-section {
            padding: 36px 0;
          }
          .container {
            padding: 0 16px;
          }
          .section-header {
            margin-bottom: 24px;
          }
          .section-title {
            font-size: 1.65rem;
            margin-bottom: 8px;
          }
          .section-subtitle {
            font-size: 0.9rem;
          }
          .trust-grid-wrapper {
            gap: 14px;
          }
          .top-row {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .bottom-row {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .trust-card {
            padding: 20px 18px;
            border-radius: 16px;
            min-height: 140px;
          }
          .card-top-head {
            margin-bottom: 12px;
            gap: 12px;
          }
          .card-icon-box {
            width: 38px;
            height: 38px;
            border-radius: 8px;
          }
          .card-icon {
            font-size: 1.15rem;
          }
          .card-number {
            font-size: 1.75rem;
          }
          .card-title {
            font-size: 1rem;
            margin-bottom: 4px;
          }
          .card-desc {
            font-size: 0.82rem;
          }
        }

        @media (max-width: 480px) {
          .bottom-row {
            grid-template-columns: 1fr;
          }
          .trust-card {
            padding: 18px 16px;
          }
        }
      `}</style>
    </section>
  );
}
