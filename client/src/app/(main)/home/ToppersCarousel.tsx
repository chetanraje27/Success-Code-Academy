"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEditModeOptional } from "@/components/admin/EditModeContext";

type StarStudent = {
  id: string | number;
  name: string;
  score: string;
  total?: string | number;
  rank: string;
  rankType?: string;
  course: string;
  year?: string;
  image: string;
  color?: string;
};

type ParsedResult = {
  score: string;
  total: string;
  rankType: string;
  rank: string;
};

function parseResult(student: StarStudent): ParsedResult {
  const [score = "N/A", scoreTotal = ""] = String(student.score ?? "").split("/");
  const total = student.total ? `/${student.total}` : scoreTotal ? `/${scoreTotal}` : "";

  if (student.rankType) {
    return { score, total, rankType: student.rankType, rank: String(student.rank || "N/A") };
  }

  const rawRank = String(student.rank ?? "").trim();
  if (!rawRank || rawRank === "-") {
    return { score, total, rankType: "NEET", rank: "Qualified" };
  }

  const rankParts = rawRank.split(/\s+/);
  return {
    score,
    total,
    rankType: rankParts.length > 1 ? rankParts[0] : "AIR",
    rank: rankParts.length > 1 ? rankParts.slice(1).join(" ") : rankParts[0],
  };
}

function resolveImageSource(image: string, apiUrl?: string) {
  if (!image) return "";
  if (/^(https?:|data:|blob:)/.test(image)) return image;
  // Serve directly from Next.js public directory
  return image;
}

export default function ToppersCarousel() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:5000';
  const [stars, setStars] = useState<StarStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Array<string | number>>([]);
  const { refreshKey } = useEditModeOptional();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiUrl}/api/v1/content/stars`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          setStars((data.data || []).filter((item: any) => item?.name));
        } else {
          setStars([]);
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.warn("Failed to load stars (backend might be offline):", err);
          setStars([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [apiUrl, refreshKey]);

  const markImageBroken = (id: string | number) => {
    setBrokenImages((current) => current.includes(id) ? current : [...current, id]);
  };

  const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  const visibleStars = stars.slice(0, 6);
  const featuredStudents = visibleStars.slice(0, 2);
  const supportingStudents = visibleStars.slice(2, 6);

  return (
    <section className="stars-section" aria-labelledby="stars-heading">
      <div className="stars-shell">
        <header className="stars-header">
          <div className="heading-copy">
            <span className="eyebrow">MEET OUR STARS</span>
            <h2 id="stars-heading">Meet Our Stars</h2>
            <p>Celebrating the hard work, perseverance, and outstanding NEET scores of our classroom students.</p>
          </div>

          <Link href="/results" className="results-link">
            <span className="results-button">
              View all results
              <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
          </Link>
        </header>

        {isLoading ? (
          <div className="results-grid">
            {[1, 2].map((i) => (
              <article key={`f-${i}`} className="featured-card skeleton-pulse" style={{ background: "rgba(203, 213, 225, 0.2)", borderColor: "transparent" }}>
                <div className="featured-copy">
                  <div style={{ height: 12, width: 80, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4 }}></div>
                  <div className="featured-rank" style={{ marginTop: 30 }}>
                    <div style={{ height: 12, width: 40, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4, marginBottom: 4 }}></div>
                    <div style={{ height: 50, width: 100, background: "rgba(203, 213, 225, 0.4)", borderRadius: 8 }}></div>
                  </div>
                  <div style={{ height: 24, width: 140, background: "rgba(203, 213, 225, 0.4)", borderRadius: 6, marginTop: 22 }}></div>
                  <div style={{ height: 14, width: 120, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4, marginTop: 10 }}></div>

                  <div className="featured-score" style={{ marginTop: "auto", paddingTop: 17, borderTop: "none" }}>
                    <div style={{ height: 32, width: 90, background: "rgba(203, 213, 225, 0.4)", borderRadius: 6 }}></div>
                    <div style={{ height: 10, width: 70, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4, marginTop: 8 }}></div>
                  </div>
                </div>
              </article>
            ))}

            {[1, 2, 3, 4].map((i) => (
              <article key={`s-${i}`} className="support-card skeleton-pulse" style={{ background: "rgba(203, 213, 225, 0.2)", borderColor: "transparent" }}>
                <div className="support-copy">
                  <div style={{ height: 10, width: 60, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4 }}></div>
                  <div style={{ height: 20, width: 100, background: "rgba(203, 213, 225, 0.4)", borderRadius: 6, marginTop: 17 }}></div>
                  <div style={{ height: 16, width: 120, background: "rgba(203, 213, 225, 0.4)", borderRadius: 4, marginTop: 12 }}></div>
                  <div style={{ height: 20, width: 80, background: "rgba(203, 213, 225, 0.4)", borderRadius: 6, marginTop: "auto" }}></div>
                </div>
              </article>
            ))}
          </div>
        ) : featuredStudents.length === 0 ? (
          <div style={{ width: "100%", padding: "40px 0", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
            Results will be updated soon.
          </div>
        ) : (
          <div className="results-grid">
            {featuredStudents.map((featuredStudent) => {
              const featuredResult = parseResult(featuredStudent);
              
              return (
                <article className="featured-card" key={featuredStudent.id}>
                  <span className="featured-watermark" aria-hidden="true">{featuredResult.rankType}</span>
                  <span className="featured-orbit" aria-hidden="true" />

                  <div className="featured-copy">
                    <span className="result-year">{featuredStudent.year || "NEET UG 2025"}</span>
                    <div className="featured-rank">
                      <span>{featuredResult.rankType}</span>
                      <strong>{featuredResult.rank}</strong>
                    </div>
                    <h3>{featuredStudent.name}</h3>
                    <p>{featuredStudent.course}</p>

                    <div className="featured-score">
                      <strong>{featuredResult.score}<small>{featuredResult.total}</small></strong>
                      <span>NEET UG score</span>
                    </div>
                  </div>

                  <Image
                    src={brokenImages.includes(featuredStudent.id) ? DEFAULT_AVATAR : resolveImageSource(featuredStudent.image, apiUrl)}
                    alt={`${featuredStudent.name}, ${featuredResult.rankType} ${featuredResult.rank}`}
                    fill
                    unoptimized
                    priority
                    onError={() => markImageBroken(featuredStudent.id)}
                    sizes="(max-width: 720px) 92vw, 480px"
                    className="featured-student-image"
                  />
                </article>
              );
            })}

            {supportingStudents.map((student, index) => {
              const result = parseResult(student);

              return (
                <article className={`support-card support-${index + 1}`} key={student.id}>
                  <span className="support-index" aria-hidden="true">0{index + 2}</span>
                  <span className="support-accent" aria-hidden="true" />

                  <div className="support-copy">
                    <span className="support-year">{student.year || "NEET UG 2025"}</span>
                    <div className="support-rank">{result.rankType} {result.rank}</div>
                    <h3>{student.name}</h3>
                    <div className="support-score">
                      {result.score}<small>{result.total}</small>
                    </div>
                  </div>

                  <Image
                    src={brokenImages.includes(student.id) ? DEFAULT_AVATAR : resolveImageSource(student.image, apiUrl)}
                    alt={`${student.name}, ${result.rankType} ${result.rank}`}
                    fill
                    unoptimized
                    onError={() => markImageBroken(student.id)}
                    sizes="(max-width: 720px) 46vw, 240px"
                    className="support-student-image"
                  />
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .stars-section {
          width: 100%;
          padding: 64px 24px 70px;
          overflow: hidden;
          background: #efede8;
          color: #2c4050;
          font-family: "Segoe UI", Arial, sans-serif;
        }

        .stars-shell {
          width: 100%;
          max-width: 1220px;
          min-width: 0;
          margin: 0 auto;
        }

        .stars-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 30px;
        }

        .heading-copy {
          max-width: 680px;
        }

        .eyebrow {
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

        h2 {
          margin: 0;
          color: #0f172a;
          font-family: inherit;
          font-size: clamp(2rem, 3vw, 2.7rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.08;
        }

        .heading-copy p {
          max-width: 640px;
          margin: 11px 0 0;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.5;
        }

        :global(.results-link) {
          flex-shrink: 0;
        }

        .results-button {
          display: inline-flex;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          border: 1.5px solid #cbd5e1;
          border-radius: 99px;
          background: #ffffff;
          color: #0284c7;
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
        }

        :global(.results-link:hover) .results-button {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
          box-shadow: 0 6px 16px rgba(2, 132, 199, 0.25);
        }

        .results-grid {
          display: grid;
          width: 100%;
          min-width: 0;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-auto-rows: 218px;
          gap: 12px;
        }

        .featured-card,
        .support-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border: 1px solid #c3ced0;
          border-radius: 8px;
          background: #e3e8e8;
          isolation: isolate;
          transition: border-color 160ms ease, background-color 160ms ease;
        }

        .featured-card:hover,
        .support-card:hover {
          border-color: #91a7aa;
          background: #dce5e5;
        }

        .featured-card {
          grid-row: 1 / 3;
          background: #d9e5e6;
        }

        .featured-card::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: -1;
          width: 58%;
          height: 11px;
          background: #27868d;
        }

        .featured-watermark {
          position: absolute;
          top: 24px;
          right: 22px;
          z-index: -1;
          color: #173d76;
          font-size: 6rem;
          font-weight: 600;
          letter-spacing: -0.08em;
          line-height: 1;
          opacity: 0.055;
        }

        .featured-orbit {
          position: absolute;
          right: -80px;
          bottom: -105px;
          z-index: -1;
          width: 330px;
          height: 330px;
          border: 28px solid #c2d5d6;
          border-radius: 50%;
        }

        .featured-copy {
          position: relative;
          z-index: 3;
          display: flex;
          width: 55%;
          height: 100%;
          min-width: 160px;
          flex-direction: column;
          align-items: flex-start;
          padding: 24px 12px 24px 20px;
        }

        .result-year,
        .support-year {
          color: #197985;
          font-size: 0.61rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .featured-rank {
          margin-top: 30px;
        }

        .featured-rank span {
          display: block;
          margin-bottom: 1px;
          color: #687986;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
        }

        .featured-rank strong {
          display: block;
          color: #173d76;
          font-size: clamp(3.5rem, 5.5vw, 5.2rem);
          font-weight: 600;
          letter-spacing: -0.07em;
          line-height: 0.92;
        }

        .featured-copy h3 {
          margin: 22px 0 0;
          color: #273d4e;
          font-family: inherit;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }

        .featured-copy > p {
          margin: 6px 0 0;
          color: #687783;
          font-size: 0.69rem;
          line-height: 1.35;
        }

        .featured-score {
          margin-top: auto;
          padding-top: 17px;
          border-top: 1px solid #b8c9cb;
        }

        .featured-score strong {
          display: block;
          color: #197985;
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 1;
        }

        .featured-score strong small,
        .support-score small {
          margin-left: 2px;
          color: #6e7e8a;
          font-size: 0.64rem;
          font-weight: 500;
          letter-spacing: 0;
        }

        .featured-score > span {
          display: block;
          margin-top: 5px;
          color: #697985;
          font-size: 0.58rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          line-height: 1.2;
          text-transform: uppercase;
        }

        :global(.featured-student-image) {
          z-index: 2;
          width: 75% !important;
          height: 94% !important;
          top: auto !important;
          right: -15% !important;
          bottom: 0 !important;
          left: auto !important;
          object-fit: contain;
          object-position: bottom right;
        }

        .support-index {
          position: absolute;
          top: 14px;
          right: 15px;
          z-index: 1;
          color: #173d76;
          font-size: 2.4rem;
          font-weight: 600;
          letter-spacing: -0.06em;
          line-height: 1;
          opacity: 0.06;
        }

        .support-accent {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 3;
          width: 48%;
          height: 5px;
          background: #27868d;
        }

        .support-copy {
          position: relative;
          z-index: 3;
          display: flex;
          width: 58%;
          height: 100%;
          min-width: 150px;
          flex-direction: column;
          align-items: flex-start;
          padding: 18px 4px 17px 18px;
        }

        .support-rank {
          margin-top: 17px;
          color: #173d76;
          font-size: 1.7rem;
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 1;
          white-space: nowrap;
        }

        .support-copy h3 {
          max-width: 100%;
          overflow: hidden;
          margin: 9px 0 0;
          color: #2b4050;
          font-family: inherit;
          font-size: 0.83rem;
          font-weight: 600;
          letter-spacing: -0.015em;
          line-height: 1.2;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .support-score {
          margin-top: auto;
          color: #197985;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1;
        }

        :global(.support-student-image) {
          z-index: 2;
          width: 56% !important;
          height: 92% !important;
          top: auto !important;
          right: -5% !important;
          bottom: 0 !important;
          left: auto !important;
          object-fit: contain;
          object-position: bottom right;
        }

        @media (max-width: 1020px) {
          .results-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: minmax(205px, auto);
          }

          .featured-card {
            grid-column: span 2;
            height: 380px;
          }

          .featured-copy {
            width: 45%;
          }

          :global(.featured-student-image) {
            width: 60% !important;
            right: 0 !important;
          }
        }

        @media (max-width: 640px) {
          .stars-section {
            padding: 46px 20px 52px;
          }

          .stars-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
            margin-bottom: 23px;
          }

          h2 {
            font-size: 1.95rem;
          }

          :global(.results-link),
          .results-button {
            width: 100%;
          }

          .results-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 430px repeat(4, 190px);
          }

          .featured-card {
            grid-column: auto;
          }

          .featured-copy {
            width: 52%;
            min-width: 180px;
            padding: 25px 8px 24px 22px;
          }

          .featured-rank {
            margin-top: 24px;
          }

          .featured-rank strong {
            font-size: 3.6rem;
          }

          .featured-copy h3 {
            margin-top: 18px;
            font-size: 1.15rem;
          }

          :global(.featured-student-image) {
            width: 68% !important;
            right: -8% !important;
          }

          .support-copy {
            width: 60%;
          }

          :global(.support-student-image) {
            width: 55% !important;
          }
        }
      `}</style>
    </section>
  );
}

