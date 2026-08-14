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

        <div className="trust-grid-wrapper">
          <div className="trust-row top-row">
            <div className="trust-card featured-teal-card">
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
            </div>

            <div className="trust-card standard-white-card">
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

          <div className="trust-row bottom-row">
            <div className="trust-card standard-white-card">
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

            <div className="trust-card standard-white-card">
              <div className="card-top-head">
                <div className="card-icon-box purple-icon-box">
                  <FaUsers className="card-icon" />
                </div>
                <div className="card-number dark-number">
                  <StatCounter value={<EditableText contentKey="trust.students.value" label="students value">500+</EditableText>} />
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

            <div className="trust-card standard-white-card">
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
