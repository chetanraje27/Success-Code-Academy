"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPhone, FaArrowRight } from "react-icons/fa6";

export default function FinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-panel"
        >
          {/* Decorative background visual circles */}
          <div className="cta-circle circle-1"></div>
          <div className="cta-circle circle-2"></div>

          <div className="cta-content">
            <h2 className="cta-title">Ready to Begin Your Success Journey?</h2>
            <p className="cta-desc">
              Join thousands of successful students preparing for JEE, NEET and Foundation with Success Code Academy. Speak with our counselors today.
            </p>

            <div className="cta-actions">
              <Link href="/contact" className="btn-primary-glow">
                Book Free Demo <FaArrowRight className="action-arrow" />
              </Link>
              <Link href="/courses" className="btn-secondary-outline">
                Explore Courses
              </Link>
            </div>

            <div className="cta-phone-row">
              <span className="phone-label">Or call admissions officer directly:</span>
              <a href="tel:+918600470850" className="phone-number-link">
                <FaPhone className="phone-icon" /> +91 86004 70850
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .final-cta-section {
          padding: 80px 0;
          background: #ffffff;
          width: 100%;
          position: relative;
        }
        .container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        .cta-panel {
          position: relative;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #0f172a 100%);
          border-radius: 40px;
          padding: 80px 48px;
          overflow: hidden;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.3);
        }
        /* Background decor */
        .cta-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          pointer-events: none;
        }
        .circle-1 {
          width: 300px;
          height: 300px;
          top: -150px;
          left: -150px;
        }
        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -200px;
          right: -200px;
        }
        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
          margin: 0 auto;
        }
        .cta-title {
          font-size: 2.6rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .cta-desc {
          font-size: 1.1rem;
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0 0 40px;
        }
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .btn-primary-glow {
          background: #ffffff;
          color: #1e40af;
          padding: 15px 32px;
          border-radius: 99px;
          font-weight: 750;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.15);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(255, 255, 255, 0.25);
          background: #f8fafc;
        }
        .action-arrow {
          transition: transform 0.2s ease;
        }
        .btn-primary-glow:hover .action-arrow {
          transform: translateX(4px);
        }
        .btn-secondary-outline {
          background: transparent;
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          padding: 14px 32px;
          border-radius: 99px;
          font-weight: 750;
          font-size: 0.95rem;
          transition: all 0.25s ease;
        }
        .btn-secondary-outline:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ffffff;
          transform: translateY(-2px);
        }
        /* Call direct detail info */
        .cta-phone-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .phone-label {
          font-size: 0.85rem;
          color: #94a3b8;
        }
        .phone-number-link {
          font-size: 1.2rem;
          font-weight: 800;
          color: #3b82f6;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .phone-number-link:hover {
          color: #60a5fa;
        }
        .phone-icon {
          font-size: 1rem;
        }
        @media (max-width: 768px) {
          .cta-panel {
            padding: 50px 24px;
            border-radius: 30px;
          }
          .cta-title {
            font-size: 2rem;
          }
          .cta-desc {
            font-size: 0.98rem;
            margin-bottom: 30px;
          }
          .cta-actions {
            flex-direction: column;
            gap: 12px;
            max-width: 320px;
            margin: 0 auto 30px;
          }
          .btn-primary-glow, .btn-secondary-outline {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
