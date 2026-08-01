"use client";

import React from "react";
import { FaBullseye, FaHeart, FaUsers, FaAward } from "react-icons/fa6";
import { FiStar } from "react-icons/fi";
import { EditableText } from "@/components/admin/EditableText";

function StatCounter({ value }: { value: React.ReactNode }) {
  return <span>{value}</span>;
}

export default function ParentsTrustUs() {
  return (
    <section className="parents-trust-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            <EditableText
              contentKey="trust.heading"
              label="parent trust heading"
            >
              Parents trust us, students succeed.
            </EditableText>
          </h2>
          <p className="section-subtitle">
            <EditableText
              contentKey="trust.description"
              label="parent trust description"
              kind="multiline"
            >
              Numbers that speak for our commitment to student care, academic rigor, and mentorship excellence.
            </EditableText>
          </p>
        </div>

        {/* Structured Grid matching the screenshot */}
        <div className="trust-grid-wrapper">
          {/* Top Row: Featured 93% Selection Rate + 4.9 Google Rating */}
          <div className="trust-row top-row">
            {/* Card 1: 93% Selection Rate (Featured Light Teal Card) */}
            <div className="trust-card featured-teal-card">
              <div className="trust-card-motif trust-motif-selection" aria-hidden="true">
                <FaBullseye />
              </div>
              <div className="card-top-head">
                <div className="card-icon-box teal-icon-box">
                  <FaBullseye className="card-icon" />
                </div>
                <div className="card-number teal-number">
                  <StatCounter value={<EditableText contentKey="trust.selection.value" label="selection rate value">93%</EditableText>} />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">
                  <EditableText contentKey="trust.selection.title" label="selection rate title">
                    Selection Rate
                  </EditableText>
                </h3>
                <p className="card-desc">
                  <EditableText contentKey="trust.selection.description" label="selection rate description">
                    Sustained performance in NEET qualifiers annually.
                  </EditableText>
                </p>
              </div>
              {/* Subtle background arc shape */}
              <div className="arc-shape-wrap" aria-hidden="true">
                <svg viewBox="0 0 100 100" className="arc-svg">
                  <path d="M 0 100 A 100 100 0 0 1 100 0" stroke="#b2ece4" strokeWidth="12" fill="none" />
                </svg>
              </div>
            </div>

            {/* Card 2: 4.9 Google Rating */}
            <div className="trust-card standard-white-card">
              <div className="trust-card-motif trust-motif-rating" aria-hidden="true">
                <FiStar />
              </div>
              <div className="card-top-head">
                <div className="card-icon-box yellow-icon-box">
                  <FiStar className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value={<EditableText contentKey="trust.rating.value" label="Google rating value">4.9</EditableText>} />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">
                  <EditableText contentKey="trust.rating.title" label="Google rating title">
                    Google Rating
                  </EditableText>
                </h3>
                <p className="card-desc">
                  <EditableText contentKey="trust.rating.description" label="Google rating description">
                    Based on 350+ reviews from parents & alumni.
                  </EditableText>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Satisfaction + Students + Excellence */}
          <div className="trust-row bottom-row">
            {/* Card 3: 98% Satisfaction */}
            <div className="trust-card standard-white-card">
              <div className="trust-card-motif trust-motif-satisfaction" aria-hidden="true">
                <FaHeart />
              </div>
              <div className="card-top-head">
                <div className="card-icon-box blue-icon-box">
                  <FaHeart className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value={<EditableText contentKey="trust.satisfaction.value" label="satisfaction value">98%</EditableText>} />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">
                  <EditableText contentKey="trust.satisfaction.title" label="satisfaction title">
                    Satisfaction
                  </EditableText>
                </h3>
                <p className="card-desc">
                  <EditableText contentKey="trust.satisfaction.description" label="satisfaction description">
                    Highly rated classroom care and responsiveness.
                  </EditableText>
                </p>
              </div>
            </div>

            {/* Card 4: 1500+ Students */}
            <div className="trust-card standard-white-card">
              <div className="trust-card-motif trust-motif-students" aria-hidden="true">
                <FaUsers />
              </div>
              <div className="card-top-head">
                <div className="card-icon-box purple-icon-box">
                  <FaUsers className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value={<EditableText contentKey="trust.students.value" label="students value">1500+</EditableText>} />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">
                  <EditableText contentKey="trust.students.title" label="students metric title">
                    Students
                  </EditableText>
                </h3>
                <p className="card-desc">
                  <EditableText contentKey="trust.students.description" label="students metric description">
                    Classroom medical aspirants mentored till date.
                  </EditableText>
                </p>
              </div>
            </div>

            {/* Card 5: 8+ Excellence */}
            <div className="trust-card standard-white-card">
              <div className="trust-card-motif trust-motif-excellence" aria-hidden="true">
                <FaAward />
              </div>
              <div className="card-top-head">
                <div className="card-icon-box lightblue-icon-box">
                  <FaAward className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value={<EditableText contentKey="trust.excellence.value" label="excellence value">8+</EditableText>} />
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">
                  <EditableText contentKey="trust.excellence.title" label="excellence title">
                    Excellence
                  </EditableText>
                </h3>
                <p className="card-desc">
                  <EditableText contentKey="trust.excellence.description" label="excellence description">
                    Consistently delivering premium medical training.
                  </EditableText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
