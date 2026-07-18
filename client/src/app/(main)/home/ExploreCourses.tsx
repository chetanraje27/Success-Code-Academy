import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDna, FaBookOpen, FaArrowsRotate, FaClipboardCheck } from "react-icons/fa6";

const courses = [
  {
    name: "NEET 11th - 12th",
    icon: <FaDna />,
    description: "Conceptual clarity in Physics, Chemistry & Biology for NEET UG.",
    color: "#5e9cc3ff",
    bg: "#e6fcf5",
    href: "/courses",
  },
  {
    name: "NEET Repeaters",
    icon: <FaArrowsRotate />,
    description: "Intensive 1-year program focused on speed, accuracy & revision.",
    color: "#5e9cc3ff",
    bg: "#f3f0ff",
    href: "/courses",
  },
  {
    name: "Test Series",
    icon: <FaClipboardCheck />,
    description: "Offline mock tests simulating the real NEET exam environment.",
    color: "#5e9cc3ff",
    bg: "#fff9db",
    href: "/courses",
  },
];

export default function ExploreCourses() {
  return (
    <section className="explore-section">
      <div className="container">
        <div className="explore-header">
          <h2 className="explore-title">Explore Courses</h2>
          <p className="explore-subtitle">
            Choose from our specialized classroom programs tailored to guide medical aspirants to their dream destinations.
          </p>
        </div>
        <div className="explore-grid">
          {courses.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="explore-card-parent"
            >
              <Link href={c.href} className="course-card-link">
                <div
                  className="explore-card"
                  style={{
                    "--card-color": c.color,
                    "--hover-bg-light": c.bg,
                  } as React.CSSProperties}
                >
                  {/* Floating Icon Box (3D translation) */}
                  <div className="icon-box">
                    <span className="course-icon">{c.icon}</span>
                  </div>

                  {/* Content Box */}
                  <div className="content-box">
                    <h3 className="course-title-text">{c.name}</h3>
                    <p className="course-desc-text">{c.description}</p>

                    <div className="see-more">
                      <span>Explore Course</span>
                      <span className="arrow-icon">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .explore-section {
          background: var(--bg-base);
          padding: 45px 0;
          width: 100%;
          position: relative;
          scroll-margin-top: 110px;
        }
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        .explore-header {
          margin-bottom: 32px;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .explore-title {
          font-size: 1.95rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .explore-subtitle {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }
        .explore-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
        }
        
        /* 3D Uiverse card structures - Theme Adjusted (Light Premium) */
        .explore-card-parent {
          width: 100%;
          perspective: 1000px;
          box-sizing: border-box;
        }
        .course-card-link {
          text-decoration: none;
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .explore-card {
          position: relative;
          padding-top: 40px;
          border: 2px solid var(--bg-surface-border); /* Light border */
          border-radius: 20px;
          transform-style: preserve-3d;
          background: linear-gradient(135deg, transparent 18.75%, #f1f5f9 0 31.25%, transparent 0),
            repeating-linear-gradient(45deg, #f8fafc -6.25% 6.25%, #ffffff 0 18.75%);
          background-size: 60px 60px;
          background-color: var(--bg-surface); /* White base background */
          width: 100%;
          box-shadow: rgba(149, 157, 165, 0.04) 0px 10px 20px -5px;
          transition: all 0.5s ease-in-out;
          height: 100%;
          min-height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          box-sizing: border-box;
          overflow: visible; /* Let translated items pop out in Z space */
        }

        .explore-card:hover {
          background-position:
            -100px 100px,
            -100px 100px;
          transform: rotate3d(0.5, 1, 0, 18deg);
          box-shadow: 
            0 18px 30px -8px rgba(15, 23, 42, 0.06),
            0 8px 16px -8px var(--card-color);
          border-color: var(--card-color); /* Highlight border on hover */
        }

        .content-box {
          background: var(--card-color);
          border-radius: 0 0 18px 18px;
          transition: all 0.5s ease-in-out;
          padding: 22px 18px 18px 18px;
          transform-style: preserve-3d;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
        }

        .course-title-text {
          display: inline-block;
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          transition: all 0.5s ease-in-out;
          transform: translate3d(0px, 0px, 50px);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        
        .explore-card:hover .course-title-text {
          transform: translate3d(0px, 0px, 60px);
        }

        .course-desc-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          margin: 0;
          transition: all 0.5s ease-in-out;
          transform: translate3d(0px, 0px, 30px);
        }
        
        .explore-card:hover .course-desc-text {
          transform: translate3d(0px, 0px, 60px);
        }
        
        .see-more {
          align-self: flex-start;
          cursor: pointer;
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 900;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--card-color);
          background: #ffffff;
          padding: 6px 12px;
          border-radius: 99px;
          transition: all 0.5s ease-in-out;
          transform: translate3d(0px, 0px, 20px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.04);
        }

        .see-more:hover {
          background: #ffffff;
          color: var(--card-color);
          box-shadow: 0 5px 11px rgba(0,0,0,0.1);
        }
        
        .explore-card:hover .see-more {
          transform: translate3d(0px, 0px, 60px);
        }

        .see-more .arrow-icon {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .see-more:hover .arrow-icon {
          transform: translateX(4px);
        }

        .icon-box {
          position: absolute;
          top: 8px;
          right: 16px;
          height: 38px;
          width: 38px;
          background: #ffffff; /* White background for the icon box */
          border: 2px solid var(--card-color);
          border-radius: 10px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-color);
          transform: translate3d(0px, 0px, 80px);
          box-shadow: rgba(0, 0, 0, 0.04) 0px 6px 12px -4px;
          transition: all 0.5s ease-in-out;
          z-index: 10;
        }

        .course-icon {
          font-size: 1rem;
          display: flex;
        }
        
        .explore-card:hover .icon-box {
          transform: translate3d(0px, 0px, 90px) rotate(8deg);
          box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 16px -5px;
        }
        
        @media (max-width: 1200px) {
          .explore-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 768px) {
          .explore-section { padding: 35px 0; }
          .explore-grid { gap: 16px; }
          .container { padding: 0 16px; }
        }
        @media (max-width: 640px) {
          .explore-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .explore-card { 
            min-height: auto; 
            padding-top: 32px; 
            border-radius: 12px;
          }
          .icon-box {
            top: 6px;
            right: 12px;
            height: 30px;
            width: 30px;
            border-radius: 6px;
            padding: 4px;
          }
          .course-icon {
            font-size: 0.85rem;
          }
          .content-box {
            padding: 14px 10px 10px 10px;
            border-radius: 0 0 10px 10px;
          }
          .course-title-text {
            font-size: 0.9rem;
            margin-bottom: 4px;
          }
          .course-desc-text {
            font-size: 0.7rem;
            line-height: 1.3;
          }
          .see-more {
            margin-top: 0.75rem;
            font-size: 0.6rem;
            padding: 4px 8px;
          }
        }
      `}</style>
    </section>
  );
}
