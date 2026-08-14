"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { FaChevronDown, FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { faqSections } from "./faq-data";

export default function FaqClient() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        [section.title, item.question, item.answer, ...(item.points ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(deferredQuery),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const resultCount = filteredSections.reduce((total, section) => total + section.items.length, 0);

  return (
    <div className="faq-page">
      <header className="faq-hero">
        <div className="faq-container faq-hero-inner">
          <h1>Frequently Asked Questions</h1>
          <p>Find clear answers about NEET courses, mentorship, tests, admissions, scholarships, and student support.</p>

          <label className="faq-search" htmlFor="faq-search-input">
            <FaMagnifyingGlass aria-hidden="true" />
            <input
              id="faq-search-input"
              type="text"
              role="searchbox"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions, courses, tests..."
              autoComplete="off"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear FAQ search">
                <FaXmark aria-hidden="true" />
              </button>
            )}
          </label>
          <span className="faq-result-count" aria-live="polite">
            {deferredQuery ? `${resultCount} matching ${resultCount === 1 ? "answer" : "answers"}` : "61 answers across 12 topics"}
          </span>
        </div>
      </header>

      <main className="faq-content">
        <div className="faq-container">
          {filteredSections.length > 0 ? (
            <div className="faq-sections">
              {filteredSections.map((section) => (
                <section className="faq-section" key={section.title}>
                  <div className="faq-section-heading">
                    <span aria-hidden="true" />
                    <div>
                      <h2>{section.title}</h2>
                      <p>{section.items.length} {section.items.length === 1 ? "question" : "questions"}</p>
                    </div>
                  </div>

                  <div className="faq-list">
                    {section.items.map((item) => (
                      <details className="faq-item" key={item.id}>
                        <summary>
                          <span className="faq-number">{String(item.id).padStart(2, "0")}</span>
                          <span className="faq-question">{item.question}</span>
                          <span className="faq-chevron"><FaChevronDown aria-hidden="true" /></span>
                        </summary>
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                          {item.points && (
                            <ul>
                              {item.points.map((point) => <li key={point}>{point}</li>)}
                            </ul>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="faq-empty">
              <h2>No matching questions</h2>
              <p>Try a shorter search or browse all FAQ topics.</p>
              <button type="button" onClick={() => setQuery("")}>Clear search</button>
            </div>
          )}

          <section className="faq-contact">
            <div>
              <h2>Still have questions?</h2>
              <p>Our team can help you choose the right NEET batch and explain admissions, scholarship tests, or preparation support.</p>
            </div>
            <Link href="/contact">Contact our team</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
