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

const defaultStarStudents: StarStudent[] = [
  { id: "siddhi-badhe", name: "Siddhi Badhe", score: "665/720", rank: "AIR 26", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/SiddhiBadhe.png" },
  { id: "samruddhi-lokhande", name: "Samruddhi Lokhande", score: "602/720", rank: "AIR 1204", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/SamruddhiLokhande.png" },
  { id: "mahesh-bhosale", name: "Mahesh Bhosale", score: "550/720", rank: "AIR 6000", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/MaheshBhosale.png" },
  { id: "aprupa-patil", name: "Aprupa Patil", score: "550/720", rank: "AIR 1610", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/AprupaPatil.png" },
  { id: "darshana-dhoka", name: "Darshana Dhoka", score: "550/720", rank: "AIR 1980", course: "NEET Freshers Batch", year: "NEET UG 2025", image: "/images/results/2025/DarshanaDhoka.png" },
  { id: "piyush-kale", name: "Piyush Kale", score: "681/720", rank: "AIR 2840", course: "NEET Freshers Batch", year: "NEET UG 2024", image: "/images/results/2024/PiyushKale.png" },
  { id: "rushikesh-kale", name: "Rushikesh Kale", score: "660/720", rank: "AIR 2840", course: "NEET Freshers Batch", year: "NEET UG 2024", image: "/images/results/2024/RushikeshKale.png" },
];

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

export default function ToppersCarousel() {
  const [stars, setStars] = useState<StarStudent[]>(defaultStarStudents);
  const [brokenImages, setBrokenImages] = useState<Array<string | number>>([]);
  const { refreshKey } = useEditModeOptional();

  useEffect(() => {
    const controller = new AbortController();

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
          console.warn("Failed to load stars (backend might be offline):", err);
        }
      });

    return () => controller.abort();
  }, [refreshKey]);

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

        {featuredStudents.length === 0 ? (
          <div style={{ width: "100%", padding: "40px 0", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
            Results will be updated soon.
          </div>
        ) : (
          <div className="results-grid">
            {featuredStudents.map((featuredStudent) => {
              const featuredResult = parseResult(featuredStudent);
              
              return (
                <article className="featured-card" key={featuredStudent.id}>
                  <span className="featured-watermark" aria-hidden="true">{featuredResult.rank}</span>
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
                    src={brokenImages.includes(featuredStudent.id) ? DEFAULT_AVATAR : resolveImageSource(featuredStudent.image)}
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
                  <span className="support-index" aria-hidden="true">{result.rank}</span>
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
                    src={brokenImages.includes(student.id) ? DEFAULT_AVATAR : resolveImageSource(student.image)}
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
    </section>
  );
}

