import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { useEditModeOptional } from "@/components/admin/EditModeContext";

function TopperImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <>
      {!loaded && (
        <div
          className="skeleton-pulse"
          style={{ position: "absolute", inset: 0, zIndex: 1, backgroundColor: "rgba(203, 213, 225, 0.3)" }}
        ></div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="240px"
        className="topper-cover-img"
        style={{ transition: "transform 0.5s ease" }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

const DEFAULT_STARS = [
  { id: "1", name: "Mahesh Bhosale", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "-", score: "550/720", image: "/images/results/2025/MaheshBhosale.png", color: "#0284c7" },
  { id: "2", name: "Samruddhi Lokhande", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1204", score: "602/720", image: "/images/results/2025/SamruddhiLokhande.png", color: "#2563eb" },
  { id: "3", name: "Aprupa Patil", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1610", score: "547/720", image: "/images/results/2025/AprupaPatil.png", color: "#0284c7" },
  { id: "4", name: "Darshana Dhoka", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1980", score: "533/720", image: "/images/results/2025/DarshanaDhoka.png", color: "#7c3aed" },
  { id: "5", name: "Siddhi Badhe", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 840", score: "681/720", image: "/images/results/2025/SiddhiBadhe.png", color: "#059669" },
];

export default function ToppersCarousel() {
  const [stars, setStars] = React.useState<any[]>(DEFAULT_STARS);
  const [isLoading, setIsLoading] = React.useState(true);
  const { refreshKey } = useEditModeOptional();

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/content/stars`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          setStars((data.data || []).filter((item: any) => item?.name));
        } else {
          setStars(DEFAULT_STARS);
        }
      })
      .catch(err => {
        console.warn("Failed to load stars (backend might be offline):", err);
        setStars(DEFAULT_STARS);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshKey]);

  return (
    <section className="toppers-section">
      <div className="container">

        {/* Section Header */}
        <div className="toppers-header">
          <div className="header-left">
            <span className="section-label">MEET OUR STARS</span>
            <h2 className="toppers-title">Meet Our Stars</h2>
            <p className="toppers-subtitle">
              Celebrating the hard work, perseverance, and outstanding NEET scores of our classroom students.
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
          {isLoading ? (
            <div className="marquee-track" style={{ animationPlayState: 'paused' }}>
              <div className="marquee-group">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="marquee-item">
                    <div className="clean-topper-card skeleton-pulse" style={{ borderColor: 'transparent', boxShadow: 'none' }}>
                      <div className="topper-photo-wrap" style={{ backgroundColor: "rgba(203, 213, 225, 0.4)" }}></div>
                      <div className="topper-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ height: '14px', width: '70%', backgroundColor: "rgba(203, 213, 225, 0.4)", borderRadius: '4px' }}></div>
                        <div style={{ height: '10px', width: '50%', backgroundColor: "rgba(203, 213, 225, 0.4)", borderRadius: '4px' }}></div>
                        <div className="score-box" style={{ marginTop: 'auto', gap: '8px', borderTopColor: "rgba(203, 213, 225, 0.2)" }}>
                          <div style={{ height: '14px', width: '100%', backgroundColor: "rgba(203, 213, 225, 0.4)", borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : stars.length > 0 ? (
            <div className="marquee-track">
              <div className="marquee-group">
                {stars.map((t, idx) => (
                  <div
                    key={`${t.id}-a-${idx}`}
                    className="marquee-item"
                  >
                    <div className="clean-topper-card">
                      {/* Photo Area */}
                      <div className="topper-photo-wrap">
                        <TopperImage src={t.image} alt={t.name} />
                        {/* Floating Year Badge */}
                        <div className="year-indicator">{t.year}</div>
                      </div>

                      {/* Details Body */}
                      <div className="topper-body">
                        <div className="name-batch-block">
                          <h3 className="topper-name-text">{t.name}</h3>
                          <span className="topper-batch-text">{t.course}</span>
                        </div>

                        <div className="score-box">
                          {/* Rank Row */}
                          <div className="rank-row">
                            <span className="rank-label-text">RANK</span>
                            <span className="rank-value-badge">
                              <FaStar className="star-icon" /> {t.rank}
                            </span>
                          </div>

                          {/* Score Row */}
                          <div className="score-row">
                            <span className="score-label-text">NEET SCORE</span>
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
                    <div className="clean-topper-card">
                      {/* Photo Area */}
                      <div className="topper-photo-wrap">
                        <TopperImage src={t.image} alt={t.name} />
                        {/* Floating Year Badge */}
                        <div className="year-indicator">{t.year}</div>
                      </div>

                      {/* Details Body */}
                      <div className="topper-body">
                        <div className="name-batch-block">
                          <h3 className="topper-name-text">{t.name}</h3>
                          <span className="topper-batch-text">{t.course}</span>
                        </div>

                        <div className="score-box">
                          {/* Rank Row */}
                          <div className="rank-row">
                            <span className="rank-label-text">RANK</span>
                            <span className="rank-value-badge">
                              <FaStar className="star-icon" /> {t.rank}
                            </span>
                          </div>

                          {/* Score Row */}
                          <div className="score-row">
                            <span className="score-label-text">NEET SCORE</span>
                            <span className="score-value-text">{t.score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ width: "100%", padding: "40px 0", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
              Results will be updated soon.
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .toppers-section {
          padding: 50px 0;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
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
          margin-bottom: 28px;
        }

        .header-left {
          max-width: 680px;
          text-align: left;
        }

        .section-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          background: #e0f2fe;
          padding: 4px 12px;
          border-radius: 99px;
          text-transform: uppercase;
        }

        .toppers-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .toppers-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .header-right {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .results-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0284c7;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          padding: 8px 18px;
          border-radius: 99px;
          border: 1.5px solid #cbd5e1;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        .results-link:hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
          box-shadow: 0 6px 16px rgba(2, 132, 199, 0.25);
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
          mask-image: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: float-marquee 28s linear infinite;
        }

        .marquee-group {
          display: flex;
          gap: 22px;
          padding-right: 22px;
          flex-shrink: 0;
        }

        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
        }

        /* Topper Card Styling */
        .clean-topper-card {
          width: 220px;
          height: 330px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .clean-topper-card:hover {
          transform: translateY(-6px);
          border-color: #0284c7;
          box-shadow: 
            0 18px 36px rgba(15, 23, 42, 0.08),
            0 6px 16px rgba(2, 132, 199, 0.15);
        }

        .topper-photo-wrap {
          position: relative;
          width: 100%;
          height: 175px;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          overflow: hidden;
        }

        :global(.topper-cover-img) {
          object-fit: cover;
          object-position: center top;
        }

        .clean-topper-card:hover :global(.topper-cover-img) {
          transform: scale(1.05);
        }

        .year-indicator {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #ffffff;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 3px 10px;
          border-radius: 6px;
          z-index: 10;
          letter-spacing: 0.03em;
        }

        .topper-body {
          padding: 14px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          box-sizing: border-box;
        }

        .name-batch-block {
          margin-bottom: 8px;
        }

        .topper-name-text {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.01em;
        }

        .topper-batch-text {
          font-size: 0.68rem;
          font-weight: 700;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .score-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 8px 10px;
          margin-top: auto;
        }

        .rank-row, .score-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .rank-label-text, .score-label-text {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.06em;
        }

        .rank-value-badge {
          font-size: 0.72rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #c2410c;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          padding: 2px 8px;
          border-radius: 99px;
        }

        .star-icon {
          font-size: 0.7rem;
          color: #f59e0b;
        }

        .score-value-text {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
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
          .toppers-section {
            padding: 36px 0;
          }
          .toppers-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .header-right {
            margin-bottom: 0;
          }
          .toppers-title {
            font-size: 1.65rem;
          }
          .clean-topper-card {
            width: 190px;
            height: 300px;
          }
          .topper-photo-wrap {
            height: 155px;
          }
        }
      `}</style>
    </section>
  );
}
