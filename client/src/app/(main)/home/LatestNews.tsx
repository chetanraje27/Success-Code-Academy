"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { newsItems } from "@/data/home";
import { FaArrowRight, FaCalendarDay, FaThumbtack } from "react-icons/fa6";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] as const } }
};

export default function LatestNews() {
  const featuredNews = newsItems[0];
  const otherNews = newsItems.slice(1, 4);

  return (
    <section className="latest-news">
      <div className="container">
        <div className="heading-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              title="Notice Board"
              subtitle="Important updates, events, and announcements from the academy."
              align="center"
            />
          </motion.div>
        </div>

        <motion.div 
          className="news-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Featured Notice */}
          <motion.div variants={itemVariants} className="featured-card">
            <Link href={`/news/${featuredNews.slug}`} className="featured-link">
              <div className="featured-bg"></div>
                <div className="featured-content">
                  <div className="featured-top">
                    <span className="pin-icon"><FaThumbtack /> Pinned Notice</span>
                    <span className={`news-category category-${featuredNews.category.toLowerCase()}`}>
                      {featuredNews.category}
                    </span>
                  </div>
                  <div className="featured-bottom">
                    <div className="news-date">
                      <FaCalendarDay className="date-icon" />
                      {new Date(featuredNews.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="featured-title">{featuredNews.title}</h3>
                    <p className="featured-excerpt">{featuredNews.excerpt}</p>
                    <div className="read-more">
                      Read Full Announcement <FaArrowRight />
                    </div>
                  </div>
                </div>
            </Link>
          </motion.div>

          {/* Other Notices */}
          <div className="sidebar-list">
            {otherNews.map((news) => (
              <motion.div key={news.id} variants={itemVariants} className="sidebar-card-wrapper">
                <Link href={`/news/${news.slug}`} className="sidebar-card">
                  <div className="sidebar-date">
                      <span className="day">{new Date(news.date).getDate()}</span>
                      <span className="month">{new Date(news.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="sidebar-content">
                      <span className={`news-category category-${news.category.toLowerCase()}`}>
                        {news.category}
                      </span>
                      <h4 className="sidebar-title">{news.title}</h4>
                    </div>
                    <div className="sidebar-arrow">
                      <FaArrowRight />
                    </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button href="/news" variant="primary" size="lg">
              View All Announcements
            </Button>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .latest-news {
          padding: var(--spacing-24) 0;
          background-color: transparent;
          color: var(--text-primary);
          position: relative;
          overflow: hidden;
        }


        
        .latest-news .heading-wrapper {
          margin-bottom: var(--spacing-16);
        }
        
        .latest-news .section-heading h2 {
          color: var(--text-primary) !important;
        }
        .latest-news .section-heading p {
          color: var(--text-secondary) !important;
        }

        .latest-news .news-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-6);
        }

        @media (min-width: 1024px) {
          .latest-news .news-grid {
            grid-template-columns: 1.2fr 1fr;
            gap: var(--spacing-8);
          }
        }

        /* FEATURED CARD */
        .latest-news .featured-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .latest-news .featured-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.06);
        }

        .latest-news .featured-link {
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .latest-news .featured-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(64,181,193,0.05), transparent);
          z-index: 0;
        }

        .latest-news .featured-content {
          position: relative;
          z-index: 1;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 400px;
        }

        .latest-news .featured-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: auto;
        }

        .latest-news .pin-icon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .latest-news .featured-bottom {
          margin-top: 3rem;
        }

        .latest-news .news-date {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .latest-news .featured-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .latest-news .featured-excerpt {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 90%;
        }

        .latest-news .read-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--accent-primary);
          transition: gap 0.3s ease;
        }

        .latest-news .featured-card:hover .read-more {
          gap: 12px;
        }

        /* SIDEBAR LIST */
        .latest-news .sidebar-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
        }

        .latest-news .sidebar-card-wrapper {
          height: 100%;
        }

        .latest-news .sidebar-card {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          border-radius: 20px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          height: 100%;
        }

        .latest-news .sidebar-card:hover {
          background: #ffffff;
          border-color: rgba(64,181,193,0.3);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transform: translateX(8px);
        }

        .latest-news .sidebar-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(30,64,175,0.04);
          color: var(--text-primary);
          border-radius: 12px;
          width: 60px;
          height: 60px;
          margin-right: 1.5rem;
          flex-shrink: 0;
        }

        .latest-news .sidebar-date .day {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1;
        }

        .latest-news .sidebar-date .month {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent-primary);
          margin-top: 2px;
        }

        .latest-news .sidebar-content {
          flex: 1;
        }

        .latest-news .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.4;
          margin-top: 0.5rem;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .latest-news .sidebar-arrow {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(30,64,175,0.04);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 1rem;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .latest-news .sidebar-card:hover .sidebar-arrow {
          background: var(--accent-primary);
          color: white;
        }

        /* CATEGORY BADGES */
        .latest-news .news-category {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 100px;
        }
        
        .latest-news .category-event { background: rgba(64,181,193,0.15); color: #40b5c1; }
        .latest-news .category-achievement { background: rgba(56,189,248,0.15); color: #38bdf8; }
        .latest-news .category-admission { background: rgba(129,140,248,0.15); color: #818cf8; }
        .latest-news .category-announcement { background: rgba(148,163,184,0.15); color: #94a3b8; }

        .latest-news .mt-12 {
          margin-top: 3rem;
        }

        @media (max-width: 768px) {
          .latest-news .featured-content {
            padding: 2rem;
            min-height: auto;
          }
          .latest-news .featured-title {
            font-size: 1.6rem;
          }
          .latest-news .sidebar-card {
            padding: 1rem;
          }
          .latest-news .sidebar-arrow {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .latest-news .sidebar-date {
            width: 50px;
            height: 50px;
            margin-right: 1rem;
          }
          .latest-news .sidebar-date .day {
            font-size: 1.2rem;
          }
          .latest-news .featured-content {
            padding: 1.5rem;
          }
          .latest-news .featured-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
}