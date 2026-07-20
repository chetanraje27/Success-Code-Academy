"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaImages, FaPlus } from "react-icons/fa6";

interface GalleryItem {
  id: number;
  image: string;
  title: string;
  tag: string;
  size: "small" | "medium" | "large";
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    image: "/images/results/Toppers.jpg",
    title: "NEET Rankers Felicitation",
    tag: "Celebrations",
    size: "large"
  },
  {
    id: 2,
    image: "/images/ui/contact_hero.png",
    title: "SCA Classroom Environment",
    tag: "Campus Life",
    size: "medium"
  },
  {
    id: 3,
    image: "/images/banners/student_banner.png",
    title: "SCA Front Desk Desk & Reception",
    tag: "Infrastructure",
    size: "small"
  },
  {
    id: 4,
    image: "/images/results/2025/AniruddhaDhyagude.png",
    title: "Mentorship Session Desk",
    tag: "Academics",
    size: "small"
  },
  {
    id: 5,
    image: "/images/results/2025/AnushkaJadhav.png",
    title: "One-on-One Doubt Desks",
    tag: "Mentoring",
    size: "medium"
  }
];

export default function GalleryPreview() {
  return (
    <section className="gallery-section">
      <div className="container">
        <div className="section-header">
          <div className="header-left">
            <span className="small-label">📸 Campus life</span>
            <h2 className="section-title">Life at Success Code Academy</h2>
            <p className="section-subtitle">
              Take a virtual glance at our classroom discussions, felicitation ceremonies, study resource desks, and campus achievements.
            </p>
          </div>
          <div className="header-right">
            <Link href="/gallery" className="gallery-link">
              View Campus Gallery <span className="arrow-sym">→</span>
            </Link>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="gallery-masonry">
          {galleryData.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`gallery-card ${item.size}`}
            >
              <img src={item.image} alt={item.title} className="gallery-img" />

              {/* Hover overlay details */}
              <div className="gallery-overlay">
                <span className="card-tag">{item.tag}</span>
                <h3 className="card-title">{item.title}</h3>
                <span className="plus-icon-circle">
                  <FaPlus />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .gallery-section {
          padding: 90px 0;
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
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
        }
        .header-left {
          max-width: 680px;
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
          line-height: 1.55;
          margin: 0;
        }
        .gallery-link {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e40af;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .gallery-link:hover {
          color: #2563eb;
        }
        .arrow-sym {
          transition: transform 0.2s ease;
        }
        .gallery-link:hover .arrow-sym {
          transform: translateX(4px);
        }
        /* Masonry Grid layout */
        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 200px;
          gap: 20px;
          width: 100%;
        }
        .gallery-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background: #e2e8f0;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          cursor: pointer;
        }
        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-card:hover .gallery-img {
          transform: scale(1.04);
        }
        /* Masonry sizes */
        .gallery-card.small {
          grid-row: span 1;
        }
        .gallery-card.medium {
          grid-row: span 2;
        }
        .gallery-card.large {
          grid-column: span 2;
          grid-row: span 2;
        }
        /* Hover details overlay */
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.35s ease;
          box-sizing: border-box;
          z-index: 2;
        }
        .gallery-card:hover .gallery-overlay {
          opacity: 1;
        }
        .card-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }
        .plus-icon-circle {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 0.85rem;
        }
        @media (max-width: 900px) {
          .gallery-masonry {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 180px;
          }
          .gallery-card.large {
            grid-column: span 2;
            grid-row: span 1;
          }
        }
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .header-right {
            align-self: flex-start;
          }
        }
        @media (max-width: 500px) {
          .gallery-masonry {
            grid-template-columns: 1fr;
            grid-auto-rows: 200px;
          }
          .gallery-card.large {
            grid-column: span 1;
            grid-row: span 1;
          }
          .gallery-card.medium {
            grid-row: span 1;
          }
        }
      `}</style>
    </section>
  );
}
