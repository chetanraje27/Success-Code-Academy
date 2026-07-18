"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaPlay, FaXmark } from "react-icons/fa6";

interface SuccessStory {
  id: number;
  quoteTitle: string;
  name: string;
  location: string;
  image: string;
  badgeText: string;
  examInfo: string;
  videoUrl: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    quoteTitle: "The study schedule was perfect",
    name: "Aniruddha's Father",
    location: "Baramati, Maharashtra",
    image: "/images/results/2025/AniruddhaDhyagude.png",
    badgeText: "685/720",
    examInfo: "NEET 2025",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    quoteTitle: "The quality of tests was top-notch!",
    name: "Anushka's Mother",
    location: "Bhigwan, Maharashtra",
    image: "/images/results/2025/AnushkaJadhav.png",
    badgeText: "675/720",
    examInfo: "NEET 2025",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    quoteTitle: "My child was WITH me all the time",
    name: "Siddhi's Father",
    location: "Patas, Maharashtra",
    image: "/images/results/2025/SiddhiBadhe.png",
    badgeText: "695/720",
    examInfo: "NEET 2025",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 4,
    quoteTitle: "Her mental ability improved a lot",
    name: "Vivek's Father",
    location: "Indapur, Maharashtra",
    image: "/images/results/2025/VivekSable.png",
    badgeText: "AIR 2415",
    examInfo: "NEET 2025",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 5,
    quoteTitle: "Personalized care by expert doctors",
    name: "Darshana's Mother",
    location: "Phaltan, Maharashtra",
    image: "/images/results/2025/DarshanaDhoka.png",
    badgeText: "690/720",
    examInfo: "NEET 2025",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export default function StudentSuccessStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = 320 + 24; // Card width + gap
      const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="success-stories-section">
      <div className="container">
        <div className="section-header">
          <div className="header-text">
            <h2 className="section-title">
              Success Code Academy se, <span className="highlight-blue">success MUMKIN hai!</span>
            </h2>
            <p className="section-subtitle">What our parents say about us</p>
          </div>
          <div className="navigation-controls">
            <button
              onClick={() => handleScroll("left")}
              className="control-btn"
              aria-label="Previous testimonials"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="control-btn"
              aria-label="Next testimonials"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="slider-wrapper">
          <div className="slider-track" ref={scrollRef}>
            {successStories.map((story) => (
              <div key={story.id} className="story-card">
                {/* Top Quote Heading & Grid Pattern */}
                <div className="card-top-header">
                  <div className="grid-overlay"></div>
                  <h3 className="quote-heading">"{story.quoteTitle}"</h3>
                </div>

                {/* Main Portrait Photo Frame */}
                <div className="photo-container">
                  <Image
                    src={story.image}
                    alt={story.name}
                    width={320}
                    height={380}
                    className="portrait-img"
                    unoptimized
                  />
                  {/* Watch Now Video Overlay Button */}
                  <button
                    onClick={() => setActiveVideo(story.videoUrl)}
                    className="watch-now-btn"
                  >
                    <span className="play-icon-wrap">
                      <FaPlay className="play-icon" />
                    </span>
                    <span className="watch-text">Watch Now</span>
                  </button>
                </div>

                {/* Card Footer Meta Data */}
                <div className="card-footer">
                  <div className="author-details">
                    <h4 className="author-name">{story.name}</h4>
                    <p className="author-location">{story.location}</p>
                  </div>
                  <div className="badge-details">
                    <div className="score-badge">{story.badgeText}</div>
                    <span className="exam-info">{story.examInfo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveVideo(null)}>
              <FaXmark />
            </button>
            <div className="iframe-container">
              <iframe
                src={activeVideo}
                title="Student Success Story"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .success-stories-section {
          padding: 80px 0;
          background-color: #ffffff;
          overflow: hidden;
          width: 100%;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          padding: 0 4px;
        }

        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .highlight-blue {
          color: #1e40af;
          background-image: linear-gradient(120deg, rgba(30, 64, 175, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
          background-repeat: no-repeat;
          background-size: 100% 0.25em;
          background-position: 0 88%;
          padding: 0 4px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #475569;
          font-weight: 500;
          margin: 0;
        }

        .navigation-controls {
          display: flex;
          gap: 12px;
        }

        .control-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e293b;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .control-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }

        .control-btn:active {
          transform: translateY(0);
        }

        .slider-wrapper {
          position: relative;
          width: 100%;
        }

        .slider-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 12px 4px 30px;
          scrollbar-width: none; /* Firefox */
        }

        .slider-track::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        /* Card design: white background, rounded corners, thin border, soft shadow */
        .story-card {
          flex: 0 0 320px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .story-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px rgba(30, 64, 175, 0.08);
          border-color: #1e40af;
        }

        /* Card top header with Grid pattern background */
        .card-top-header {
          position: relative;
          padding: 24px 20px;
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: #f8fafc;
          border-bottom: 1px dashed #e2e8f0;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.6;
          background-size: 16px 16px;
          background-image: 
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px);
          z-index: 1;
        }

        .quote-heading {
          font-size: 1rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
          z-index: 2;
          font-family: var(--font-sans);
          line-height: 1.4;
        }

        /* Photo container styling */
        .photo-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 4.2;
          background-color: #f1f5f9;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s ease;
        }

        .story-card:hover .portrait-img {
          transform: scale(1.03);
        }

        /* Watch Now button overlay */
        .watch-now-btn {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 3;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .watch-now-btn:hover {
          background: #1e40af;
          border-color: #1e40af;
          transform: translateX(-50%) scale(1.05);
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.3);
        }

        .play-icon-wrap {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 0.65rem;
          transition: all 0.25s ease;
        }

        .watch-now-btn:hover .play-icon-wrap {
          background: #ffffff;
          color: #1e40af;
        }

        .play-icon {
          margin-left: 1px; /* Center-adjust play triangle */
        }

        /* Card footer layout */
        .card-footer {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-width: 65%;
        }

        .author-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .author-location {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .badge-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .score-badge {
          background: #1e40af;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(30, 64, 175, 0.15);
        }

        .exam-info {
          font-size: 0.72rem;
          color: #1e40af;
          font-weight: 700;
        }

        /* Video Modal Styles */
        .video-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          width: 100%;
          max-width: 800px;
          background: #000000;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.05);
        }

        .iframe-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
        }

        .iframe-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .success-stories-section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .section-subtitle {
            font-size: 0.95rem;
          }

          .control-btn {
            width: 40px;
            height: 40px;
            font-size: 0.85rem;
          }

          .slider-track {
            gap: 16px;
          }

          .story-card {
            flex: 0 0 290px;
            border-radius: 20px;
          }

          .card-top-header {
            padding: 18px 16px;
            min-height: 70px;
          }

          .quote-heading {
            font-size: 0.9rem;
          }

          .watch-now-btn {
            bottom: 18px;
            padding: 6px 14px;
            font-size: 0.8rem;
          }

          .card-footer {
            padding: 16px;
          }

          .author-name {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 24px;
          }

          .navigation-controls {
            align-self: flex-end;
          }

          .story-card {
            flex: 0 0 270px;
          }
        }
      `}</style>
    </section>
  );
}
