"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaBuildingUser, FaUserTie, FaPenToSquare, FaBookBookmark } from "react-icons/fa6";

const bentoItems = [
  {
    id: "campus",
    title: "State-of-the-Art Campuses",
    desc: "Experience focused learning in our fully equipped, modern offline classrooms designed for maximum concentration.",
    icon: <FaBuildingUser />,
    className: "bento-large dark-card",
  },
  {
    id: "faculty",
    title: "Expert Mentorship",
    desc: "Learn directly from top medical professionals and highly experienced educators who guide you every step of the way.",
    icon: <FaUserTie />,
    className: "bento-tall",
  },
  {
    id: "tests",
    title: "Rigorous Mock Tests",
    desc: "Regular offline tests modeled exactly on the NEET pattern.",
    icon: <FaPenToSquare />,
    className: "bento-small",
  },
  {
    id: "material",
    title: "Premium Study Material",
    desc: "Exclusive, highly researched printed modules and workbooks.",
    icon: <FaBookBookmark />,
    className: "bento-small",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] as const } }
};

export default function AcademyOverview() {
  return (
    <section className="academy-overview">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="heading-wrapper"
        >
          <SectionHeading
            title="The Ultimate Offline Experience"
            subtitle="Everything you need to succeed, all under one roof."
          />
        </motion.div>

        <motion.div 
          className="bento-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {bentoItems.map((item) => (
              <motion.div key={item.id} className={`bento-card ${item.className}`} variants={itemVariants}>
                
                {/* 
                  To add real photos later, simply uncomment the div below and set the background image! 
                  <div className="bento-photo-layer" style={{ backgroundImage: "url('/path-to-photo.jpg')" }}></div>
                */}

                <div className="bento-content">
                  <div className="bento-icon-wrapper">
                    {item.icon}
                  </div>
                  <div className="bento-text">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>

                {/* Massive watermark icon for premium tech aesthetic */}
                <div className="bento-watermark">
                  {item.icon}
                </div>
              </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .academy-overview {
          padding: var(--spacing-24) 0;
          background-color: transparent;
        }

        .academy-overview .heading-wrapper {
          text-align: center;
          margin-bottom: var(--spacing-16);
        }

        .academy-overview .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-6);
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .academy-overview .bento-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto auto auto;
          }
        }

        @media (min-width: 1024px) {
          .academy-overview .bento-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(2, 320px);
          }
          
          .academy-overview .bento-large {
            grid-column: span 2;
          }
          .academy-overview .bento-tall {
            grid-row: span 2;
          }
        }

        .academy-overview .bento-card {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          background: #ffffff;
          background-image: radial-gradient(circle at 100% 100%, rgba(64,181,193,0.04) 0%, transparent 60%);
          min-height: 320px;
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        .academy-overview .bento-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(5, 28, 74, 0.08);
        }

        /* Dark Card Variant for Contrast */
        .academy-overview .dark-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .academy-overview .dark-card .bento-text h3 {
          color: #ffffff;
        }

        .academy-overview .dark-card .bento-text p {
          color: #94a3b8;
        }

        .academy-overview .dark-card .bento-icon-wrapper {
          background: rgba(255,255,255,0.1);
          color: #40b5c1;
        }

        .academy-overview .dark-card .bento-watermark {
          color: rgba(255,255,255,0.02);
        }

        /* If photos are added later */
        .academy-overview .bento-photo-layer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background-size: cover;
          background-position: center;
          opacity: 0.15; /* Keeps text readable */
          mix-blend-mode: luminosity;
        }

        .academy-overview .bento-content {
          position: relative;
          z-index: 2;
          padding: 3rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          pointer-events: none;
        }

        .academy-overview .bento-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(30,64,175,0.04);
          color: var(--accent-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.02);
        }

        .academy-overview .bento-text h3 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .academy-overview .bento-text p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 90%;
        }

        .academy-overview .bento-watermark {
          position: absolute;
          right: -15%;
          bottom: -15%;
          font-size: 20rem;
          color: rgba(64,181,193,0.03);
          z-index: 0;
          transform: rotate(-15deg);
          pointer-events: none;
        }
        
        @media (max-width: 768px) {
          .academy-overview .bento-card {
            min-height: 280px;
          }
          .academy-overview .bento-content {
            padding: 2rem;
          }
          .academy-overview .bento-watermark {
            font-size: 15rem;
            right: -20%;
            bottom: -20%;
          }
        }
      `}</style>
    </section>
  );
}