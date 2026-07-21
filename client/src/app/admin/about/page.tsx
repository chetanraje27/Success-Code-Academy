"use client";

import React, { useState } from "react";
import { FaUserTie, FaHistory, FaBullseye, FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

export default function AdminAboutPage() {
  const [story, setStory] = useState({
    title: "Empowering NEET Aspirants Since 2012",
    vision: "To become India's most trusted medical coaching institute by providing student-centric education, rigorous test series, and compassionate mentorship.",
    mission: "To deliver top-tier classroom and digital learning experiences that help every dedicated student conquer NEET with confidence."
  });

  const [faculty, setFaculty] = useState([
    { id: "1", name: "Dr. V. K. Gupta", role: "Senior HOD Chemistry & Founder", experience: "18+ Years Experience", photo: "/images/team/gupta.jpg" },
    { id: "2", name: "Prof. S. R. Verma", role: "HOD Physics", experience: "14+ Years Experience", photo: "/images/team/verma.jpg" },
    { id: "3", name: "Dr. Ananya Roy", role: "HOD Zoology & Biology Specialist", experience: "12+ Years Experience", photo: "/images/team/roy.jpg" }
  ]);

  const [milestones, setMilestones] = useState([
    { id: "1", year: "2012", title: "Foundation Established", desc: "Started with 35 students in a single classroom setup." },
    { id: "2", year: "2018", title: "First AIR Top 50 Ranker", desc: "Achieved AIR 28 in NEET UG examination." },
    { id: "3", year: "2025", title: "10,000+ Doctor Selections", desc: "Crossed the milestone of 10k successful medical admissions." }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleStorySave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="about-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">About Us Page Management</h1>
          <p className="cms-subtitle">Update institute story, vision, faculty members, and historic milestones.</p>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="section-card">
        <h2 className="section-title"><FaBullseye /> Institute Vision & Mission</h2>
        <form onSubmit={handleStorySave} className="story-form">
          <div className="form-group">
            <label>Headline Title</label>
            <input type="text" value={story.title} onChange={e => setStory({ ...story, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Vision Statement</label>
            <textarea rows={3} value={story.vision} onChange={e => setStory({ ...story, vision: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Mission Statement</label>
            <textarea rows={3} value={story.mission} onChange={e => setStory({ ...story, mission: e.target.value })} />
          </div>
          <button type="submit" className="save-btn">
            {isSaved ? <><FaCheck /> Saved Successfully</> : "Save Story Details"}
          </button>
        </form>
      </div>

      {/* Faculty Team Section */}
      <div className="section-card">
        <div className="card-header-flex">
          <h2 className="section-title"><FaUserTie /> Faculty & Leadership Team</h2>
          <button className="add-sm-btn" onClick={() => {
            const name = prompt("Enter Faculty Name:");
            if (name) setFaculty(prev => [...prev, { id: Date.now().toString(), name, role: "Faculty Member", experience: "10+ Years", photo: "" }]);
          }}><FaPlus /> Add Faculty</button>
        </div>

        <div className="faculty-grid">
          {faculty.map(f => (
            <div key={f.id} className="faculty-item">
              <div className="fac-avatar">
                <img src={f.photo || "https://placehold.co/80x80/0257d0/ffffff?text=Faculty"} alt={f.name} />
              </div>
              <div className="fac-info">
                <h3>{f.name}</h3>
                <p className="role">{f.role}</p>
                <span className="exp">{f.experience}</span>
              </div>
              <button className="del-btn" onClick={() => setFaculty(prev => prev.filter(x => x.id !== f.id))}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="section-card">
        <div className="card-header-flex">
          <h2 className="section-title"><FaHistory /> Institute Milestones Timeline</h2>
          <button className="add-sm-btn" onClick={() => {
            const year = prompt("Enter Year (e.g. 2026):");
            const title = prompt("Enter Milestone Title:");
            if (year && title) setMilestones(prev => [...prev, { id: Date.now().toString(), year, title, desc: "Milestone description..." }]);
          }}><FaPlus /> Add Milestone</button>
        </div>

        <div className="milestone-list">
          {milestones.map(m => (
            <div key={m.id} className="milestone-row">
              <span className="yr-badge">{m.year}</span>
              <div className="ms-content">
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
              <button className="del-btn" onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .about-cms-container { padding: 8px 4px; display: flex; flex-direction: column; gap: 24px; }
        .cms-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
        .cms-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
        .section-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .section-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px; margin: 0 0 20px; }
        .card-header-flex { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .card-header-flex .section-title { margin: 0; }
        .story-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; }
        .save-btn { align-self: flex-start; background: #0257d0; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .add-sm-btn { background: #eff6ff; color: #0257d0; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .faculty-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .faculty-item { display: flex; align-items: center; gap: 14px; padding: 14px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; position: relative; }
        .fac-avatar img { width: 55px; height: 55px; border-radius: 50%; object-fit: cover; }
        .fac-info h3 { font-size: 0.95rem; font-weight: 700; margin: 0 0 2px; }
        .fac-info .role { font-size: 0.8rem; color: #0257d0; font-weight: 600; margin: 0; }
        .fac-info .exp { font-size: 0.75rem; color: #64748b; }
        .del-btn { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.7; }
        .del-btn:hover { opacity: 1; }
        .milestone-list { display: flex; flex-direction: column; gap: 12px; }
        .milestone-row { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0257d0; position: relative; }
        .yr-badge { background: #0257d0; color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; }
        .ms-content h4 { margin: 0 0 2px; font-size: 0.95rem; font-weight: 700; }
        .ms-content p { margin: 0; font-size: 0.85rem; color: #64748b; }
      `}</style>
    </div>
  );
}
