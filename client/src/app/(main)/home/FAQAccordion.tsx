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
    </section>
  );
}
