"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGraduationCap, FaCircleCheck, FaClock } from "react-icons/fa6";

export default function ScholarshipTest() {
  const [timeLeft, setTimeLeft] = useState({ days: 6, hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    // Dynamic countdown: 7 days from component mount
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="scholarship-section">
      <div className="container">
        
        {/* Large Floating Gradient Card Container */}
        <div className="scholarship-panel">
          {/* Decorative background blurred blobs */}
          <div className="blurred-blob blob-left"></div>
          <div className="blurred-blob blob-right"></div>
          
          <div className="panel-grid">
            
            {/* Left Content Column */}
            <div className="panel-content">
              <span className="premium-tag">
                <FaGraduationCap className="tag-icon" /> SCA Scholarship Test
              </span>
              <h2 className="panel-title">
                Admission cum <span className="highlight-text">Scholarship Test</span>
              </h2>
              <p className="panel-desc">
                Earn scholarships, experience real exam pressure, and evaluate your preparation through our state-level entrance test.
              </p>

              {/* Enhanced Feature Check List */}
              <div className="benefits-list">
                <div className="benefit-item">
                  <span className="benefit-icon-circle">
                    <FaCircleCheck className="benefit-check" />
                  </span>
                  <span>Up to 100% Scholarship</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon-circle">
                    <FaCircleCheck className="benefit-check" />
                  </span>
                  <span>Real Exam Environment</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon-circle">
                    <FaCircleCheck className="benefit-check" />
                  </span>
                  <span>Performance Analytics</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon-circle">
                    <FaCircleCheck className="benefit-check" />
                  </span>
                  <span>Personalized Counseling</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon-circle">
                    <FaCircleCheck className="benefit-check" />
                  </span>
                  <span>Instant Rank Prediction</span>
                </div>
              </div>
            </div>

            {/* Right Glass Countdown Column */}
            <div className="panel-countdown-card">
              <div className="countdown-header">
                <FaClock className="clock-icon" />
                <span>Next Test Registration Closes In</span>
              </div>

              {/* Large digits timer grid */}
              <div className="timer-grid">
                <div className="time-block">
                  <div className="time-number">{formatNumber(timeLeft.days)}</div>
                  <div className="time-label">Days</div>
                </div>
                <div className="time-colon">:</div>
                <div className="time-block">
                  <div className="time-number">{formatNumber(timeLeft.hours)}</div>
                  <div className="time-label">Hrs</div>
                </div>
                <div className="time-colon">:</div>
                <div className="time-block">
                  <div className="time-number">{formatNumber(timeLeft.minutes)}</div>
                  <div className="time-label">Mins</div>
                </div>
                <div className="time-colon">:</div>
                <div className="time-block">
                  <div className="time-number">{formatNumber(timeLeft.seconds)}</div>
                  <div className="time-label">Secs</div>
                </div>
              </div>

              <div className="countdown-divider"></div>

              {/* Meta Exam Details */}
              <div className="countdown-details">
                <div className="test-detail-row">
                  <span>Exam Date:</span>
                  <strong>Sunday, July 12, 2026</strong>
                </div>
                <div className="test-detail-row">
                  <span>Registration Ends:</span>
                  <strong>July 10, 2026</strong>
                </div>
                <div className="test-detail-row">
                  <span>Mode:</span>
                  <strong>Offline (SCA Campuses)</strong>
                </div>
                <div className="test-detail-row">
                  <span>Registration Fee:</span>
                  <strong className="free-tag">FREE</strong>
                </div>
                <div className="test-detail-row">
                  <span>Seats Remaining:</span>
                  <strong className="seats-alert">Last 45 Slots</strong>
                </div>
              </div>

              {/* Dual Button CTAs */}
              <div className="cta-buttons-wrap">
                <Link href="/admissions" className="register-btn">
                  Register Now <span className="arrow-sym">→</span>
                </Link>
                <Link href="/admissions" className="syllabus-btn">
                  View Syllabus
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style jsx global>{`
        .scholarship-section {
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
        }

        /* Large Floating Gradient Container Card */
        .scholarship-panel {
          position: relative;
          background: linear-gradient(135deg, var(--accent-secondary) 0%, #2b7da1 50%, var(--accent-primary) 100%);
          border-radius: 28px;
          padding: 36px 30px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 10px 15px -3px rgba(30, 64, 175, 0.05),
            0 25px 50px -12px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          box-sizing: border-box;
          width: 100%;
        }

        /* Background blur blobs */
        .blurred-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          pointer-events: none;
        }
        .blob-left {
          width: 250px;
          height: 250px;
          background: #ffffff;
          top: -100px;
          left: -100px;
        }
        .blob-right {
          width: 280px;
          height: 280px;
          background: #22d3ee;
          bottom: -150px;
          right: -100px;
        }

        .panel-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 30px;
          align-items: center;
        }

        .premium-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tag-icon {
          font-size: 0.8rem;
        }
        .panel-title {
          font-size: 1.95rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.25;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .highlight-text {
          color: #22d3ee; /* Glowing light cyan highlight */
        }
        .panel-desc {
          font-size: 0.92rem;
          color: #e2e8f0;
          line-height: 1.5;
          margin: 0 0 20px;
        }

        /* Check list details */
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }
        .benefit-icon-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22d3ee;
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        /* Glass Countdown Card on the Right */
        .panel-countdown-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }
        .countdown-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 800;
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
          justify-content: center;
        }
        .clock-icon {
          color: #22d3ee;
          font-size: 0.85rem;
        }

        /* Digits grid */
        .timer-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
          margin-bottom: 16px;
        }
        .time-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50px;
        }
        .time-number {
          font-size: 1.7rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .time-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: #e2e8f0;
          text-transform: uppercase;
          margin-top: 4px;
          opacity: 0.85;
        }
        .time-colon {
          font-size: 1.4rem;
          font-weight: 800;
          color: #22d3ee;
          margin-bottom: 14px;
        }

        .countdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 16px;
        }

        .countdown-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .test-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #cbd5e1;
        }
        .test-detail-row strong {
          color: #ffffff;
        }
        .free-tag {
          color: #22d3ee !important;
          font-weight: 900;
        }
        .seats-alert {
          color: #fda4af !important; /* Soft rose red text warning */
        }

        /* Action Buttons */
        .cta-buttons-wrap {
          display: flex !important;
          flex-direction: row !important;
          gap: 12px !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          margin-top: 10px !important;
        }
        .register-btn {
          flex: 1 !important;
          background: #ff5a00 !important; /* Premium Brand Orange */
          color: #ffffff !important;
          padding: 12px 16px !important;
          border-radius: 12px !important;
          font-weight: 800 !important;
          font-size: 0.82rem !important;
          text-align: center !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-shadow: 0 4px 14px rgba(255, 90, 0, 0.25) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          text-decoration: none !important;
          box-sizing: border-box !important;
          border: none !important;
        }
        .register-btn:hover {
          background: #e04f00 !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(255, 90, 0, 0.45) !important;
        }
        .arrow-sym {
          transition: transform 0.25s ease !important;
        }
        .register-btn:hover .arrow-sym {
          transform: translateX(4px) !important;
        }

        .syllabus-btn {
          flex: 1 !important;
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
          padding: 11px 16px !important;
          border-radius: 12px !important;
          font-weight: 800 !important;
          font-size: 0.82rem !important;
          text-align: center !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          text-decoration: none !important;
          box-sizing: border-box !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .syllabus-btn:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          border-color: #ffffff !important;
          transform: translateY(-2px) !important;
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .panel-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .scholarship-panel {
            padding: 30px;
            border-radius: 24px;
          }
        }
        @media (max-width: 640px) {
          .scholarship-section { padding: 30px 0; }
          .panel-title {
            font-size: 1.6rem;
          }
          .panel-desc {
            font-size: 0.88rem;
            margin-bottom: 20px;
          }
          .panel-countdown-card {
            padding: 20px;
          }
          .time-number {
            font-size: 1.5rem;
          }
          .time-block {
            width: 42px;
          }
        }
        @media (max-width: 480px) {
          .cta-buttons-wrap {
            flex-direction: column !important; /* Stack vertically on very narrow screens */
            gap: 10px !important;
          }
          .register-btn, .syllabus-btn {
            width: 100% !important;
            flex: none !important;
          }
        }
      `}</style>
    </section>
  );
}
