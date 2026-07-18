"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { courses } from "@/data/home";
import { FaArrowRight, FaTicket } from "react-icons/fa6";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const ticketVariants = {
  hidden: { opacity: 0, y: 50, rotateX: 20 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] as const } }
};

export default function FeaturedCourses() {
  return (
    <section className="featured-courses">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <SectionHeading
            title="Premium Offline Programs"
            subtitle="Secure your seat in our highly sought-after batches. Limited intake for maximum personal attention."
            align="center"
          />
        </motion.div>

        <motion.div 
          className="ticket-grid mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {courses.map((course) => (
            <motion.div key={course.id} variants={ticketVariants} className="ticket-wrapper">
              <div className="ticket">
                {/* Top Section - Dark */}
                <div className="ticket-top">
                  <div className="ticket-badge">{course.category}</div>
                  <h3 className="course-title">{course.title}</h3>
                  <div className="duration-pill">
                    {course.duration}
                  </div>
                </div>

                {/* Separator with cutouts */}
                <div className="ticket-separator">
                  <div className="cutout left"></div>
                  <div className="dash-line"></div>
                  <div className="cutout right"></div>
                </div>

                {/* Bottom Section - Light/White */}
                <div className="ticket-bottom">
                  <p className="course-desc">{course.description}</p>
                  
                  <div className="ticket-barcode">
                    <div className="bars"></div>
                    <span>ADMIT ONE</span>
                  </div>

                  <Link href={`/courses/${course.slug}`} className="enrol-btn">
                    <span>View Details</span>
                    <FaArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .featured-courses {
          padding: var(--spacing-24) 0;
          background-color: transparent;
          position: relative;
          overflow: hidden;
        }

        .featured-courses .ticket-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-8);
          max-width: 1200px;
          margin: 0 auto;
          perspective: 1000px;
        }

        @media (min-width: 768px) {
          .featured-courses .ticket-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .featured-courses .ticket-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: var(--spacing-6);
          }
        }

        .featured-courses .ticket-wrapper {
          position: relative;
          will-change: transform;
        }

        .featured-courses .ticket {
          background: transparent;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.06));
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.4s ease;
          height: 100%;
        }

        .featured-courses .ticket-wrapper:hover .ticket {
          transform: translateY(-10px) rotateY(-2deg) rotateX(2deg);
          filter: drop-shadow(0 30px 50px rgba(0,0,0,0.12));
        }

        /* --- TICKET TOP --- */
        .featured-courses .ticket-top {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: var(--spacing-8) var(--spacing-6);
          border-radius: 20px 20px 0 0;
          position: relative;
          overflow: hidden;
        }

        .featured-courses .ticket-top::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(64,181,193,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .featured-courses .ticket-wrapper:hover .ticket-top::before {
          opacity: 1;
        }

        .featured-courses .ticket-badge {
          display: inline-block;
          background: rgba(64,181,193,0.2);
          color: #40b5c1;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: var(--spacing-4);
          border: 1px solid rgba(64,181,193,0.3);
        }

        .featured-courses .course-title {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: var(--spacing-6);
          letter-spacing: -0.02em;
        }

        .featured-courses .duration-pill {
          display: inline-flex;
          align-items: center;
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 8px;
        }

        /* --- TICKET SEPARATOR --- */
        .featured-courses .ticket-separator {
          height: 30px;
          background: #ffffff;
          position: relative;
          display: flex;
          align-items: center;
        }

        .featured-courses .dash-line {
          width: 100%;
          height: 2px;
          background-image: linear-gradient(to right, #cbd5e1 50%, transparent 50%);
          background-size: 12px 2px;
          background-repeat: repeat-x;
        }

        .featured-courses .cutout {
          width: 30px;
          height: 30px;
          background-color: #f8fafc; /* Must match section background */
          border-radius: 50%;
          position: absolute;
          z-index: 2;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .featured-courses .cutout.left {
          left: -15px;
        }

        .featured-courses .cutout.right {
          right: -15px;
        }

        /* --- TICKET BOTTOM --- */
        .featured-courses .ticket-bottom {
          background: #ffffff;
          padding: var(--spacing-6);
          border-radius: 0 0 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .featured-courses .course-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: var(--spacing-8);
          flex: 1;
        }

        .featured-courses .ticket-barcode {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing-6);
          opacity: 0.5;
        }

        .featured-courses .bars {
          height: 24px;
          flex: 1;
          margin-right: 16px;
          background-image: repeating-linear-gradient(
            to right,
            #334155,
            #334155 2px,
            transparent 2px,
            transparent 4px,
            #334155 4px,
            #334155 5px,
            transparent 5px,
            transparent 8px
          );
        }

        .featured-courses .ticket-barcode span {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
          color: #334155;
        }

        .featured-courses .enrol-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px;
          background: var(--bg-surface-hover);
          color: var(--text-primary);
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border: 1px solid var(--bg-surface-border);
        }

        .featured-courses .enrol-btn span {
          margin-right: 8px;
        }

        .featured-courses .btn-icon {
          transition: transform 0.3s ease;
        }

        .featured-courses .ticket-wrapper:hover .enrol-btn {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
        }

        .featured-courses .ticket-wrapper:hover .btn-icon {
          transform: translateX(4px);
        }

        .featured-courses .mt-12 {
          margin-top: 3rem;
        }
      `}</style>
    </section>
  );
}