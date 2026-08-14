"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { EditableText } from "@/components/admin/EditableText";

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

function resolveImageSource(image: string) {
  if (!image) return "";
  if (/^(https?:|data:|blob:)/.test(image)) return image;
  // Serve directly from Next.js public directory
  return image;
}

function StudentImage({ src, alt, priority, sizes, className }: { src: string; alt: string; priority?: boolean; sizes: string; className: string; }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", borderRadius: "inherit" }}>
      {(!isLoaded && !isError) && (
        <div className="skeleton-pulse" style={{ position: "absolute", inset: 0, backgroundColor: "rgba(203, 213, 225, 0.4)", zIndex: 1 }} />
      )}
      {isError ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9", zIndex: 1 }}>
          <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>No Image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setIsError(true); setIsLoaded(true); }}
          style={{ transition: "opacity 0.3s ease-in-out" }}
        />
      )}
    </div>
  );
}

export default function ToppersCarousel() {
  const [stars, setStars] = useState<StarStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const { refreshKey } = useEditModeOptional();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setFetchError(false);

    fetch("/api/content/stars", { signal: controller.signal, cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data && data.data.length > 0) {
          const liveStars = (data.data as StarStudent[]).filter((item) => item?.name);
          if (liveStars.length > 0) {
            setStars(liveStars);
          }
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("Failed to load stars:", err);
          setFetchError(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [refreshKey]);

  const visibleStars = stars.slice(0, 6);
  const featuredStudents = visibleStars.slice(0, 2);
  const supportingStudents = visibleStars.slice(2, 6);

  return (
    <section className="stars-section" aria-labelledby="stars-heading">
      <div className="stars-shell">
        <header className="stars-header">
          <div className="heading-copy">
            <span className="eyebrow">
              <EditableText
                contentKey="stars.eyebrow"
                label="stars eyebrow"
              >
                MEET OUR STARS
              </EditableText>
            </span>
            <h2 id="stars-heading">
              <EditableText contentKey="stars.heading" label="stars heading">
                Meet Our Stars
              </EditableText>
            </h2>
            <p>
              <EditableText
                contentKey="stars.description"
                label="stars description"
                kind="multiline"
              >
                Celebrating the hard work, perseverance, and outstanding NEET scores of our classroom students.
              </EditableText>
            </p>
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
            {[1, 2].map(i => (
              <article className="featured-card skeleton-pulse" key={`feat-skel-${i}`} style={{ backgroundColor: "rgba(203, 213, 225, 0.2)" }}></article>
            ))}
            {[1, 2, 3, 4].map(i => (
              <article className={`support-card support-${i} skeleton-pulse`} key={`supp-skel-${i}`} style={{ backgroundColor: "rgba(203, 213, 225, 0.2)" }}></article>
            ))}
          </div>
        ) : fetchError ? (
          <div style={{ width: "100%", padding: "40px 0", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
            Unable to load student results. Please try again later.
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

                  <StudentImage
                    src={resolveImageSource(featuredStudent.image)}
                    alt={`${featuredStudent.name}, ${featuredResult.rankType} ${featuredResult.rank}`}
                    priority
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
                  <div className="support-copy">
                    <span className="support-year">{student.year || "NEET UG 2025"}</span>
                    <div className="support-rank">{result.rankType} {result.rank}</div>
                    <h3>{student.name}</h3>
                    <div className="support-score">
                      {result.score}<small>{result.total}</small>
                    </div>
                  </div>

                  <StudentImage
                    src={resolveImageSource(student.image)}
                    alt={`${student.name}, ${result.rankType} ${result.rank}`}
                    sizes="(max-width: 720px) 46vw, 240px"
                    className="support-student-image"
                  />
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

