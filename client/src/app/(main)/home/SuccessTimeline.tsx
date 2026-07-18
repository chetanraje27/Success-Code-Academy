"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaBookOpen, FaFileSignature, FaUserCheck, FaRotateRight, FaGraduationCap } from "react-icons/fa6";

interface TimelineStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

const stepsData: TimelineStep[] = [
  {
    id: 1,
    icon: <FaUserPlus />,
    title: "1. Admission & Counsel",
    subtitle: "Batch Allocation",
    description: "Initial diagnostics and parent alignment to allocate the ideal classroom batches."
  },
  {
    id: 2,
    icon: <FaBookOpen />,
    title: "2. Conceptual Learning",
    subtitle: "Expert Lectures",
    description: "Direct subject mentor interactive classes with custom classroom note booklets."
  },
  {
    id: 3,
    icon: <FaFileSignature />,
    title: "3. Weekly Test Series",
    subtitle: "OMR Mock Tests",
    description: "Latur city rank benchmark testing mirroring actual NEET pattern and syllabus."
  },
  {
    id: 4,
    icon: <FaUserCheck />,
    title: "4. Personal Mentorship",
    subtitle: "Doubt Desk Solving",
    description: "Daily post-class personal desk support to resolve specific question flaws."
  },
  {
    id: 5,
    icon: <FaRotateRight />,
    title: "5. Analytics Revision",
    subtitle: "Error Log Books",
    description: "Targeted correction of error patterns using our custom rank multiplier tools."
  },
  {
    id: 6,
    icon: <FaGraduationCap />,
    title: "6. GMC Selection",
    subtitle: "Top Medical Ranks",
    description: "Achieving dream medical college admissions with stellar NEET UG performances."
  }
];

export default function SuccessTimeline() {
  return (
    <section className="timeline-section">
      <div className="container">
        <div className="section-header">
          <span className="small-label">🧭 Student Journey</span>
          <h2 className="section-title">The Path to GMC Selection</h2>
          <p className="section-subtitle">
            A structured, tested, and rigorous 6-step preparation timeline that transforms medical aspirants into qualified doctors.
          </p>
        </div>

        {/* Scroll wrapper for horizontal timeline */}
        <div className="timeline-scroll-wrapper">
          <div className="timeline-track">
            {stepsData.map((step, i) => (
              <React.Fragment key={step.id}>
                {/* Node Item */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="timeline-node"
                >
                  <div className="node-icon-box">
                    <span className="node-icon">{step.icon}</span>
                    <span className="node-number">{step.id}</span>
                  </div>
                  <h3 className="node-title">{step.title}</h3>
                  <div className="node-subtitle">{step.subtitle}</div>
                  <p className="node-desc">{step.description}</p>
                </motion.div>

                {/* Connecting arrow line */}
                {i < stepsData.length - 1 && (
                  <div className="timeline-connector">
                    <div className="connector-line"></div>
                    <span className="connector-arrow">➔</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-section {
          padding: 90px 0;
          background: #f8fafc; /* Alternating light background */
          width: 100%;
          overflow: hidden;
          position: relative;
          border-top: 1px solid #edf2f7;
          border-bottom: 1px solid #edf2f7;
        }
        .container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .small-label {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 800;
          color: #1e40af;
          letter-spacing: 0.06em;
          margin-bottom: 12px;
          background: rgba(30, 64, 175, 0.08);
          padding: 4px 12px;
          border-radius: 99px;
          text-transform: uppercase;
        }
        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
        }
        .section-subtitle {
          font-size: 1.05rem;
          color: #475569;
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.55;
        }
        /* Horizontal Scroll timeline */
        .timeline-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          padding: 10px 4px 30px;
        }
        .timeline-scroll-wrapper::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .timeline-track {
          display: flex;
          align-items: flex-start;
          width: max-content;
          padding: 20px 0;
        }
        .timeline-node {
          width: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
        }
        .node-icon-box {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        .timeline-node:hover .node-icon-box {
          transform: translateY(-4px) scale(1.05);
          border-color: rgba(30, 64, 175, 0.25);
          box-shadow: 0 12px 30px rgba(30, 64, 175, 0.08);
        }
        .node-icon {
          font-size: 1.6rem;
          color: #1e40af;
        }
        .node-number {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #3b82f6;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }
        .node-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .node-subtitle {
          font-size: 0.8rem;
          font-weight: 700;
          color: #3b82f6;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
        }
        .node-desc {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
          padding: 0 10px;
        }
        /* Connector line styles */
        .timeline-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 72px; /* aligns with node-icon-box */
          width: 80px;
          position: relative;
        }
        .connector-line {
          width: 100%;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #cbd5e1,
            #cbd5e1 4px,
            transparent 4px,
            transparent 8px
          );
        }
        .connector-arrow {
          position: absolute;
          color: #94a3b8;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .section-title {
            font-size: 1.8rem;
          }
          .section-subtitle {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </section>
  );
}
