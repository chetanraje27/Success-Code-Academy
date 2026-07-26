"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FaXmark } from "react-icons/fa6";
import { resultsData, type StudentResult } from "@/data/results";
import Button from "@/components/ui/Button";
import EditableSection from "@/components/admin/EditableSection";
import ResultEditor from "@/components/admin/ResultEditor";
import { EditableText } from "@/components/admin/EditableText";

const resultYears = [2026, 2025, 2024, 2023, 2022] as const;

const videoStories = [
  {
    id: 1, name: "Shravani Kudale",
    tagline: "Daily Discipline. Expert Guidance. Consistent Success.",
    videoUrl: "/videos/Shravani_Kudale_Success_Story.mp4",
    coverImage: "/videos/Cover/Shravani.jpg",
  },
  {
    id: 2,
    name: "Siddhi Badhe",
    tagline: "Right Guidence. Conceptual Understanding. Extraordinary Results.",
    videoUrl: "/videos/Siddhi_Journey_Video.mp4",
    coverImage: "/videos/Cover/Siddhi.png",
  },
  {
    id: 3,
    name: "Samrudhi Lokhande",
    tagline: "Daily Practice. Doubt Resolution. Consistant Success.",
    videoUrl: "/videos/SuccessCode_Academy1.mp4",
    coverImage: "/videos/Cover/Samrudhi.png",
  },
  { id: 4, name: "", tagline: "", videoUrl: "", coverImage: "" },
  { id: 5, name: "", tagline: "", videoUrl: "", coverImage: "" },
];

function StudentResultCard({
  result,
  featured,
  variant,
}: {
  result: StudentResult;
  featured: boolean;
  variant: number;
}) {
  const score = result.marks !== undefined;

  return (
    <article
      className={[
        "result-student-card",
        `result-student-card-${result.year}`,
        `result-card-variant-${variant}`,
        featured ? "result-card-featured" : "",
      ].filter(Boolean).join(" ")}
    >
      <div className="result-card-art" aria-hidden="true">
        <span className="result-card-arc result-card-arc-one" />
        <span className="result-card-arc result-card-arc-two" />
        <span className="result-card-dot-field" />
        <span className="result-card-rank-watermark">
          {String(result.year).slice(-2)}
        </span>
      </div>

      <div className="result-card-copy">
        <div className="result-card-year">NEET UG {result.year}</div>
        {score ? (
          <div className="result-card-achievement">
            <span className="result-card-achievement-label">MARKS</span>
            <strong>{result.marks}</strong>
          </div>
        ) : (
          <div className="result-card-college">
            <span className="result-card-pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
              </svg>
            </span>
            <strong>GMC {result.city?.toUpperCase()}</strong>
          </div>
        )}
        <h3>{result.name}</h3>
      </div>

      <div className="result-student-portrait">
        <Image
          src={result.image}
          alt={result.name}
          fill
          unoptimized
          sizes={featured
            ? "(max-width: 720px) 100vw, 560px"
            : "(max-width: 640px) 50vw, (max-width: 1100px) 34vw, 260px"}
          className="result-student-image"
        />
      </div>

      <div className="result-card-seal" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M10 5h12v5a6 6 0 0 1-12 0V5Z" />
          <path d="M10 8H6v1a5 5 0 0 0 5 5M22 8h4v1a5 5 0 0 1-5 5M16 16v5M11 26h10M13 21h6v5" />
        </svg>
      </div>

      <span className="result-card-accent-line" aria-hidden="true" />
    </article>
  );
}

function StoryCard({
  story,
  onPlay,
}: {
  story: (typeof videoStories)[number];
  onPlay: (videoUrl: string) => void;
}) {
  return (
    <div className={`result-story-item ${story.videoUrl ? "is-playable" : "is-placeholder"}`}>
      <div className="result-story-card">
        {story.videoUrl ? (
          <button
            type="button"
            className="result-story-media"
            onClick={() => onPlay(story.videoUrl)}
            aria-label={`Play ${story.name} success story`}
          >
            <Image
              src={story.coverImage}
              alt={story.name || "Success Story"}
              fill
              unoptimized
              sizes="(max-width: 720px) 100vw, 460px"
              className="result-story-cover"
            />
            <span className="result-story-overlay" aria-hidden="true" />
            <span className="result-story-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        ) : (
          <div className="result-story-media" aria-hidden="true">
            <div className="result-story-placeholder-visual">
              <span />
              <span />
            </div>
            <span className="result-story-play">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}

        <div className="result-story-details">
          {story.name && (
            <h3>
              <EditableText
                contentKey={`stories.card-${story.id}.name`}
                label={`success story ${story.id} student name`}
              >
                {story.name}
              </EditableText>
            </h3>
          )}

          {story.tagline ? (
            <p>
              <EditableText
                contentKey={`stories.card-${story.id}.tagline`}
                label={`${story.name} story tagline`}
                kind="multiline"
                showInlineControls={false}
              >
                {story.tagline}
              </EditableText>
            </p>
          ) : (
            <span>Story Coming Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsClient() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [editResults, setEditResults] = useState(false);

  const filteredResults = useMemo(
    () => resultsData.filter((result) => result.year === selectedYear),
    [selectedYear],
  );
  const displayedResults = useMemo(
    () =>
      filteredResults.filter(
        (result) => selectedYear !== 2025 || (result.id !== 1 && result.id !== 2),
      ),
    [filteredResults, selectedYear],
  );

  const resultsSectionHeading =
    selectedYear >= 2025
      ? "Other Successful Selections"
      : `Our NEET ${selectedYear} Results`;

  return (
    <div className="results-page-container">
      <EditableSection
        label="Results"
        onEdit={() => setEditResults(true)}
        className="results-primary-content"
      >
        <section className="results-main-poster-section">
          <div className="results-container">
            <div className="results-main-poster">
              <Image
                src="/images/results/heroes/NeetUG2026AchiversShravani.png"
                alt="NEET UG 2026 Achievers"
                width={1430}
                height={813}
                priority
                sizes="(max-width: 1200px) 100vw, 1160px"
              />
            </div>
          </div>
        </section>

        <section className="results-catalog-section">
          <div className="results-container">
            <div className="results-catalog-header">
              <h1>
                <EditableText contentKey="results.heading" label="results heading">
                  Meet our NEET Results
                </EditableText>
              </h1>

              <div className="results-year-tabs" role="tablist" aria-label="NEET result years">
                {resultYears.map((year) => (
                  <button
                    key={year}
                    type="button"
                    role="tab"
                    aria-selected={selectedYear === year}
                    className={selectedYear === year ? "active" : ""}
                    onClick={() => setSelectedYear(year)}
                  >
                    NEET UG {year}
                  </button>
                ))}
              </div>
            </div>

            {selectedYear === 2025 && (
              <section className="results-featured-2025">
                <div className="results-subsection-heading">
                  <span aria-hidden="true" />
                  <h2>
                    <EditableText
                      contentKey="results.top-achievers-heading"
                      label="top achievers heading"
                    >
                      Our Top Achivers
                    </EditableText>
                  </h2>
                </div>

                <div className="results-featured-2025-grid">
                  <article>
                    <Image
                      src="/images/results/2025/SiddhiBadhefull.png"
                      alt="Siddhi Badhe - NEET UG 2025 Topper"
                      width={540}
                      height={976}
                      unoptimized
                    />
                  </article>
                  <article>
                    <Image
                      src="/images/results/2025/SamruddhiLokhandeFull.png"
                      alt="Samruddhi Lokhande - NEET UG 2025 Topper"
                      width={540}
                      height={976}
                      unoptimized
                    />
                  </article>
                </div>
              </section>
            )}

            <section className="results-selection-section">
              <div className="results-subsection-heading results-selection-heading">
                <span aria-hidden="true" />
                <h2>
                  <EditableText
                    contentKey={`results.${selectedYear}.section-heading`}
                    label={`${selectedYear} results section heading`}
                  >
                    {resultsSectionHeading}
                  </EditableText>
                </h2>
              </div>

              <div
                className={`results-student-grid results-student-grid-${selectedYear}`}
                aria-live="polite"
              >
                {displayedResults.map((result, index) => (
                  <StudentResultCard
                    key={result.id}
                    result={result}
                    featured={selectedYear !== 2025 && index === 0}
                    variant={index % 4}
                  />
                ))}
              </div>
            </section>
          </div>
        </section>
      </EditableSection>

      <ResultEditor open={editResults} onClose={() => setEditResults(false)} />

      <section className="results-stories-section">
        <div className="results-container">
          <div className="results-stories-heading">
            <div className="results-stories-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="10" y="14" width="44" height="36" rx="8" />
                <path d="m27 24 14 8-14 8z" />
                <path d="M19 8v6M45 8v6" />
              </svg>
            </div>

            <div>
              <h2>
                <EditableText contentKey="stories.heading" label="success stories heading">
                  Success Stories
                </EditableText>
              </h2>
              <div className="results-stories-quote">
                <p>
                  <EditableText
                    contentKey="stories.quote-line-1"
                    label="success stories quote line 1"
                  >
                    “Different paths.
                  </EditableText>
                </p>
                <p>
                  <EditableText
                    contentKey="stories.quote-line-2"
                    label="success stories quote line 2"
                  >
                    One goal.
                  </EditableText>
                </p>
                <p>
                  <EditableText
                    contentKey="stories.quote-line-3"
                    label="success stories quote line 3"
                  >
                    Countless success stories.”
                  </EditableText>
                </p>
              </div>
            </div>
          </div>

          <div className="results-stories-grid">
            {videoStories.map((story) => (
              <StoryCard key={story.id} story={story} onPlay={setActiveVideo} />
            ))}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div className="results-video-modal" onClick={() => setActiveVideo(null)}>
          <div
            className="results-video-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="results-video-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Close modal"
            >
              <FaXmark />
            </button>
            <div className="results-video-frame">
              {activeVideo.endsWith(".mp4") ? (
                <video src={activeVideo} controls autoPlay />
              ) : (
                <iframe
                  src={activeVideo}
                  title="SCA Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}

      <section className="results-cta-section">
        <div className="results-container">
          <div className="results-cta-card">
            <div>
              <h2>
                <EditableText contentKey="cta.heading" label="results CTA heading">
                  Ready to Write Your Success Story?
                </EditableText>
              </h2>
              <p>
                <EditableText
                  contentKey="cta.description"
                  label="results CTA description"
                  kind="multiline"
                >
                  Join Success Code Academy and start your customized learning path. Get expert mentorship, topic-wise tests, and targeted strategy guidance.
                </EditableText>
              </p>
            </div>

            <div className="results-cta-actions">
              <Button href="/contact" variant="primary" size="lg">
                Register for SCST (Scholarship Test) <span aria-hidden="true">→</span>
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Talk to Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
