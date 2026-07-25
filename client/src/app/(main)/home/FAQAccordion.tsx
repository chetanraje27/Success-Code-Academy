"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaMagnifyingGlass } from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What courses are offered at Success Code Academy?",
    answer: "We offer specialized offline classroom programs for NEET UG preparation, including NEET 11th & 12th Two-Year Integrated Course, NEET Repeaters (Dropper Batch), and All India NEET Test Series."
  },
  {
    id: 2,
    question: "Where are the SCA campuses located?",
    answer: "Our main campus is located in Baramati, Maharashtra, equipped with digital classrooms, separate doubt resolution desks, study cabins, and library resource centers."
  },
  {
    id: 3,
    question: "How do I apply for the Success Code Scholarship Test (SCST)?",
    answer: "You can register online through our website's Admissions page or visit our Baramati campus directly. Registration for SCST is 100% free and offers up to 100% tuition fee waivers."
  },
  {
    id: 4,
    question: "Do you offer personal doubt-solving desk facilities?",
    answer: "Yes, we run dedicated 1-on-1 doubt resolution desks staffed by experienced subject mentors immediately after lectures and during evening self-study sessions."
  },
  {
    id: 5,
    question: "How are student test performances and results tracked?",
    answer: "We conduct regular weekly OMR simulated NEET mock tests under real exam conditions. Detailed error analysis booklets, rank lists, and subject-wise score reports are shared with students and parents."
  }
];

export default function FAQAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-grid-layout">
          
          {/* Left Column: Heading and Search Bar */}
          <div className="faq-header-column">
            <h2 className="section-title">
              <EditableText contentKey="faq.heading" label="FAQ heading">
                Frequently Asked Questions
              </EditableText>
            </h2>
            <p className="section-subtitle">
              <EditableText
                contentKey="faq.description"
                label="FAQ introduction"
                kind="multiline"
              >
                Have questions about admissions, test structures, or batch timings? Search our quick reference.
              </EditableText>
            </p>

            {/* Real-time search bar inside left column */}
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon-wrap">
                  <FaMagnifyingGlass />
                </span>
                <input
                  type="text"
                  placeholder="Type to search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Accordion list */}
          <div className="faq-accordion-column">
            <div className="faq-accordion-list">
              <AnimatePresence>
                {filteredFaqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div key={faq.id} className={`faq-card ${isOpen ? "open" : ""}`}>
                      <button onClick={() => toggleFaq(faq.id)} className="faq-question-btn">
                        <span className="question-text">
                          <EditableText
                            contentKey={`faq.item-${faq.id}.question`}
                            label={`FAQ ${faq.id} question`}
                            showInlineControls={false}
                          >
                            {faq.question}
                          </EditableText>
                        </span>
                        <span className={`chevron-circle ${isOpen ? "rotate" : ""}`}>
                          <FaChevronDown />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="faq-answer-wrap"
                          >
                            <div className="faq-answer-text">
                              <EditableText
                                contentKey={`faq.item-${faq.id}.answer`}
                                label={`FAQ ${faq.id} answer`}
                                kind="multiline"
                                showInlineControls={false}
                              >
                                {faq.answer}
                              </EditableText>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </AnimatePresence>
              {filteredFaqs.length === 0 && (
                <div className="empty-search">
                  <p>No questions matched your query. Please search using other keywords.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .faq-section {
          padding: 35px 0;
          background: var(--bg-base); /* Alternating background style */
          width: 100%;
          position: relative;
          border-top: 1px solid var(--bg-surface-border);
          border-bottom: 1px solid var(--bg-surface-border);
        }
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }
        
        /* 2-Column layout on desktop */
        .faq-grid-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 32px;
          align-items: flex-start;
        }

        .faq-header-column {
          position: sticky;
          top: 130px; /* Keep anchored on scroll */
        }

        .small-label {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--accent-secondary);
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          background: rgba(30, 64, 175, 0.08);
          padding: 3px 10px;
          border-radius: 99px;
          text-transform: uppercase;
        }
        .section-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin: 0 0 8px;
          line-height: 1.25;
        }
        .section-subtitle {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 20px;
        }

        /* Search input styling */
        .search-container {
          width: 100%;
        }
        .search-box {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .search-icon-wrap {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 10;
        }
        .search-input {
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: 99px;
          padding: 12px 16px 12px 44px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
          transition: all 0.25s ease;
          outline: none;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: var(--accent-secondary);
          box-shadow: 0 8px 24px rgba(30, 64, 175, 0.08);
        }

        /* Accordion items */
        .faq-accordion-column {
          width: 100%;
        }
        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }
        .faq-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 
            0 1px 3px rgba(0,0,0,0.01),
            0 10px 20px -8px rgba(15, 23, 42, 0.02);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faq-card.open {
          border-color: var(--accent-secondary);
          box-shadow: 
            0 10px 15px -3px rgba(30, 64, 175, 0.02),
            0 20px 30px -4px rgba(30, 64, 175, 0.05);
          background: linear-gradient(180deg, var(--bg-surface) 0%, rgba(30, 64, 175, 0.005) 100%);
        }
        .faq-question-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          color: var(--text-primary);
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .question-text {
          font-size: 0.95rem;
          font-weight: 800;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .faq-question-btn:hover .question-text {
          color: var(--accent-secondary);
        }
        .faq-card.open .question-text {
          color: var(--accent-secondary);
        }
        .chevron-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }
        .chevron-circle.rotate {
          transform: rotate(180deg);
          background: var(--accent-secondary);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
        }
        .faq-answer-wrap {
          overflow: hidden;
        }
        .faq-answer-text {
          padding: 0 20px 16px 20px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .empty-search {
          text-align: center;
          padding: 30px;
          color: #64748b;
          font-weight: 500;
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .faq-grid-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .faq-header-column {
            position: static;
            text-align: center;
          }
          .search-box {
            max-width: 500px;
            margin: 0 auto;
          }
        }
        @media (max-width: 640px) {
          .faq-section {
            padding: 30px 0;
          }
          .section-title {
            font-size: 1.6rem;
          }
          .faq-question-btn {
            padding: 16px;
          }
          .question-text {
            font-size: 0.92rem;
          }
          .faq-answer-text {
            padding: 0 16px 16px 16px;
          }
        }
      `}</style>
    </section>
  );
}
