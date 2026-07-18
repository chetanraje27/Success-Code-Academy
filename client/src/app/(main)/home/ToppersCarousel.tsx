import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";

  // Hardcoded default fallback data
  const defaultToppers = [
    { id: 1, name: "Siddhi Badhe", score: "665/720", rank: "AIR 26", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/SiddhiBadhe.png", color: "#0ca678" },
    { id: 2, name: "Samruddhi Lokhande", score: "602/720", rank: "AIR 1204", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/SamruddhiLokhande.png", color: "#097969" },
    { id: 3, name: "Mahesh Bhosale", score: "550/720", rank: "AIR 6000", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/MaheshBhosale.png", color: "#d9480f" },
  ];

export default function ToppersCarousel() {
  const [stars, setStars] = React.useState<any[]>(defaultToppers);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/content/stars`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data.length > 0) {
          setStars(data.data);
        }
      })
      .catch(err => console.error("Failed to load stars:", err));
  }, []);

  const duplicatedToppers = [...stars, ...stars];

  return (
    <section className="toppers-section">
      <div className="container">

        {/* Section Header */}
        <div className="toppers-header">
          <div className="header-left">
            <h2 className="toppers-title">Meet Our Stars</h2>
            <p className="toppers-subtitle">
              Celebrating the hard work, perseverance, and remarkable NEET scores of our classroom students.
            </p>
          </div>
          <div className="header-right">
            <Link href="/results" className="results-link">
              View All Results <span className="arrow-sym">→</span>
            </Link>
          </div>
        </div>

        {/* Infinite Floating Marquee Ticker */}
        <div className="marquee-container">
          <div className="marquee-track">
            <div className="marquee-group">
              {stars.map((t, idx) => (
                <div
                  key={`${t.id}-a-${idx}`}
                  className="marquee-item"
                >
                  <div
                    className="clean-topper-card"
                    style={{
                      "--topper-accent": t.color,
                    } as React.CSSProperties}
                  >
                    {/* Large Photo Area for Maximum Visibility (No Rank Badge Overlay) */}
                    <div className="topper-photo-wrap">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        unoptimized
                        sizes="240px"
                        className="topper-cover-img"
                      />

                      {/* Floating Year Badge */}
                      <div className="year-indicator">{t.year}</div>
                    </div>

                    {/* Details Body */}
                    <div className="topper-body">
                      <div>
                        <h3 className="topper-name-text">{t.name}</h3>
                        <span className="topper-batch-text">{t.course}</span>
                      </div>

                      <div className="score-box">
                        {/* Rank Row displayed above the NEET score */}
                        <div className="rank-row">
                          <span className="rank-label-text">Rank</span>
                          <span className="rank-value-text" style={{ color: t.color }}>
                            <FaStar className="star-icon" /> {t.rank}
                          </span>
                        </div>

                        <div className="score-row">
                          <span className="score-label-text">NEET Score</span>
                          <span className="score-value-text">{t.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="marquee-group" aria-hidden="true">
              {stars.map((t, idx) => (
                <div
                  key={`${t.id}-b-${idx}`}
                  className="marquee-item"
                >
                  <div
                    className="clean-topper-card"
                    style={{
                      "--topper-accent": t.color,
                    } as React.CSSProperties}
                  >
                    {/* Large Photo Area for Maximum Visibility (No Rank Badge Overlay) */}
                    <div className="topper-photo-wrap">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        unoptimized
                        sizes="240px"
                        className="topper-cover-img"
                      />

                      {/* Floating Year Badge */}
                      <div className="year-indicator">{t.year}</div>
                    </div>

                    {/* Details Body */}
                    <div className="topper-body">
                      <div>
                        <h3 className="topper-name-text">{t.name}</h3>
                        <span className="topper-batch-text">{t.course}</span>
                      </div>

                      <div className="score-box">
                        {/* Rank Row displayed above the NEET score */}
                        <div className="rank-row">
                          <span className="rank-label-text">Rank</span>
                          <span className="rank-value-text" style={{ color: t.color }}>
                            <FaStar className="star-icon" /> {t.rank}
                          </span>
                        </div>

                        <div className="score-row">
                          <span className="score-label-text">NEET Score</span>
                          <span className="score-value-text">{t.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toppers-section {
          padding: 40px 0;
          background: var(--bg-surface);
          overflow: hidden;
          width: 100%;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .toppers-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }

        .header-left {
          max-width: 680px;
          text-align: left;
        }

        .section-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-secondary);
          letter-spacing: 0.07em;
          margin-bottom: 8px;
          background: rgba(30, 64, 175, 0.06);
          padding: 3px 10px;
          border-radius: 99px;
          text-transform: uppercase;
        }

        .toppers-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .toppers-subtitle {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .results-link {
          font-size: 0.82rem;
          font-weight: 750;
          color: var(--accent-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--bg-surface);
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid var(--bg-surface-border);
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          transition: all 0.25s ease;
        }

        .results-link:hover {
          background: var(--accent-secondary);
          color: var(--bg-surface);
          border-color: var(--accent-secondary);
        }

        .arrow-sym {
          transition: transform 0.2s ease;
        }

        .results-link:hover .arrow-sym {
          transform: translateX(4px);
        }

        /* Infinite Floating Marquee structures */
        .marquee-container {
          width: 100%;
          overflow: hidden;
          padding: 16px 0;
          position: relative;
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: float-marquee 28s linear infinite;
        }

        .marquee-group {
          display: flex;
          gap: 20px;
          padding-right: 20px;
          flex-shrink: 0;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
        }

        /* Clean Premium Topper Cards with Large Image Visibility */
        .clean-topper-card {
          width: 200px;
          height: 310px;
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }
        
        .clean-topper-card:hover {
          transform: translateY(-4px);
          border-color: var(--topper-accent);
          box-shadow: 
            0 16px 30px rgba(15, 23, 42, 0.06),
            0 6px 12px -8px var(--topper-accent);
        }

        .topper-photo-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          background: #f1f5f9;
          overflow: hidden;
        }

        :global(.topper-cover-img) {
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s ease;
        }

        .clean-topper-card:hover :global(.topper-cover-img) {
          transform: scale(1.04);
        }

        .year-indicator {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 0.62rem;
          font-weight: 850;
          color: #ffffff;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 2px 8px;
          border-radius: 5px;
          z-index: 10;
        }

        .topper-body {
          padding: 12px 14px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          box-sizing: border-box;
        }

        .topper-name-text {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 1px 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .topper-batch-text {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .score-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-top: 1px solid var(--bg-surface-border);
          padding-top: 6px;
          margin-top: auto;
        }

        .rank-row, .score-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .rank-label-text, .score-label-text {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .rank-value-text {
          font-size: 0.85rem;
          font-weight: 850;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .star-icon {
          font-size: 0.68rem;
        }

        .score-value-text {
          font-size: 1rem;
          font-weight: 900;
          color: var(--topper-accent);
        }

        @keyframes float-marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (max-width: 768px) {
          .toppers-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .header-right {
            margin-bottom: 0;
          }
          .toppers-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </section>
  );
}
