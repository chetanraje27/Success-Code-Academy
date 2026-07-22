"use client";

import React, { useState } from "react";
import { 
  FaUserTie, 
  FaHistory, 
  FaBullseye, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaBuilding, 
  FaUniversity, 
  FaQuoteLeft,
  FaImages,
  FaLayerGroup
} from "react-icons/fa";

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "founder" | "faculty" | "timeline" | "infra">("vision");

  const [story, setStory] = useState({
    title: "Empowering Medical Aspirants Since 2012",
    vision: "To become India's most trusted medical coaching institute by providing student-centric education, rigorous NCERT test series, and compassionate mentorship.",
    mission: "To deliver top-tier classroom and digital learning experiences that help every dedicated student conquer NEET with confidence."
  });

  const [founder, setFounder] = useState({
    name: "Dr. V. K. Gupta",
    role: "Founder & Academic Director",
    photo: "/images/team/gupta.jpg",
    message: "At Success Code Academy, our goal is not just teaching formulas, but nurturing critical medical analytical thinking. Every student receives personal care and mentorship to achieve their dream AIR."
  });

  const [faculty, setFaculty] = useState([
    { id: "1", name: "Dr. V. K. Gupta", role: "Founder & HOD Chemistry", qualification: "M.Sc., Ph.D. Chemistry", experience: "18+ Years", photo: "/images/team/gupta.jpg" },
    { id: "2", name: "Prof. S. R. Verma", role: "HOD Physics", qualification: "M.Tech IIT Bombay", experience: "14+ Years", photo: "/images/team/verma.jpg" },
    { id: "3", name: "Dr. Ananya Roy", role: "HOD Zoology & Biology Specialist", qualification: "M.B.B.S, M.D.", experience: "12+ Years", photo: "/images/team/roy.jpg" }
  ]);

  const [milestones, setMilestones] = useState([
    { id: "1", year: "2012", title: "Academy Established", desc: "Started with 35 students in a single classroom setup." },
    { id: "2", year: "2018", title: "First AIR Top 50 Ranker", desc: "Achieved AIR 28 in NEET UG examination." },
    { id: "3", year: "2025", title: "10,000+ Doctor Selections", desc: "Crossed the milestone of 10k successful medical admissions." }
  ]);

  const [infraPhotos, setInfraPhotos] = useState([
    { id: "1", title: "AC Smart Classroom", category: "Infrastructure", image: "/images/infra/classroom.jpg" },
    { id: "2", title: "Digital Test Lab", category: "Infrastructure", image: "/images/infra/lab.jpg" },
    { id: "3", title: "Library & Study Hall", category: "Infrastructure", image: "/images/infra/library.jpg" }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleStorySave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="about-cms-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">About Us Page Modular CMS</h1>
          <p className="cms-subtitle">Manage vision & mission statements, founder messages, faculty profiles, milestones timeline, and campus infrastructure gallery.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="about-tab-bar">
        <button className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`} onClick={() => setActiveTab('vision')}>
          <FaBullseye /> Vision & Mission
        </button>
        <button className={`tab-btn ${activeTab === 'founder' ? 'active' : ''}`} onClick={() => setActiveTab('founder')}>
          <FaQuoteLeft /> Founder Message
        </button>
        <button className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => setActiveTab('faculty')}>
          <FaUserTie /> Faculty & HOD Team ({faculty.length})
        </button>
        <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
          <FaHistory /> Milestones Timeline ({milestones.length})
        </button>
        <button className={`tab-btn ${activeTab === 'infra' ? 'active' : ''}`} onClick={() => setActiveTab('infra')}>
          <FaBuilding /> Campus & Infrastructure ({infraPhotos.length})
        </button>
      </div>

      {/* Content Panels */}
      <div className="tab-content">
        {activeTab === "vision" && (
          <div className="section-card">
            <h2 className="card-title"><FaBullseye /> Institute Vision & Mission</h2>
            <form onSubmit={handleStorySave} className="form-layout">
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
                {isSaved ? <><FaCheck /> Saved Successfully</> : "Save Vision Details"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "founder" && (
          <div className="section-card">
            <h2 className="card-title"><FaQuoteLeft /> Founder Message & Desk</h2>
            <form onSubmit={handleStorySave} className="form-layout">
              <div className="form-row">
                <div className="form-group">
                  <label>Founder Name</label>
                  <input type="text" value={founder.name} onChange={e => setFounder({ ...founder, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Designation / Title</label>
                  <input type="text" value={founder.role} onChange={e => setFounder({ ...founder, role: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Photo Image Path</label>
                <input type="text" value={founder.photo} onChange={e => setFounder({ ...founder, photo: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Founder Message / Quote</label>
                <textarea rows={4} value={founder.message} onChange={e => setFounder({ ...founder, message: e.target.value })} />
              </div>
              <button type="submit" className="save-btn">Save Founder Message</button>
            </form>
          </div>
        )}

        {activeTab === "faculty" && (
          <div className="section-card">
            <div className="card-top-flex">
              <h2 className="card-title"><FaUserTie /> Faculty & HOD Leadership Team</h2>
              <button className="add-btn-sm" onClick={() => {
                const name = prompt("Enter Faculty Full Name:");
                if (name) setFaculty(prev => [...prev, { id: Date.now().toString(), name, role: "Senior Faculty", qualification: "M.Sc.", experience: "10+ Years", photo: "" }]);
              }}><FaPlus /> Add Faculty</button>
            </div>

            <div className="faculty-grid">
              {faculty.map(f => (
                <div key={f.id} className="faculty-card">
                  <img src={f.photo || "https://placehold.co/100x100/0257d0/ffffff?text=Faculty"} alt={f.name} className="photo" />
                  <div className="info">
                    <h3 className="name">{f.name}</h3>
                    <p className="role">{f.role}</p>
                    <span className="qual">{f.qualification} • {f.experience}</span>
                  </div>
                  <button className="del-btn" onClick={() => setFaculty(prev => prev.filter(x => x.id !== f.id))}><FaTrash /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="section-card">
            <div className="card-top-flex">
              <h2 className="card-title"><FaHistory /> Institute Milestones Timeline</h2>
              <button className="add-btn-sm" onClick={() => {
                const year = prompt("Enter Year:");
                const title = prompt("Enter Milestone Title:");
                if (year && title) setMilestones(prev => [...prev, { id: Date.now().toString(), year, title, desc: "Milestone description..." }]);
              }}><FaPlus /> Add Milestone</button>
            </div>

            <div className="timeline-list">
              {milestones.map(m => (
                <div key={m.id} className="timeline-item">
                  <span className="yr-badge">{m.year}</span>
                  <div className="details">
                    <h4 className="title">{m.title}</h4>
                    <p className="desc">{m.desc}</p>
                  </div>
                  <button className="del-btn" onClick={() => setMilestones(prev => prev.filter(x => x.id !== m.id))}><FaTrash /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "infra" && (
          <div className="section-card">
            <div className="card-top-flex">
              <h2 className="card-title"><FaBuilding /> Campus Infrastructure Gallery</h2>
              <button className="add-btn-sm" onClick={() => {
                const title = prompt("Enter Photo Title:");
                if (title) setInfraPhotos(prev => [...prev, { id: Date.now().toString(), title, category: "Campus", image: "https://placehold.co/400x250/0257d0/ffffff?text=Campus" }]);
              }}><FaPlus /> Add Photo</button>
            </div>

            <div className="infra-grid">
              {infraPhotos.map(p => (
                <div key={p.id} className="infra-card">
                  <img src={p.image} alt={p.title} />
                  <div className="body">
                    <h4>{p.title}</h4>
                    <button className="del-btn" onClick={() => setInfraPhotos(prev => prev.filter(x => x.id !== p.id))}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Styled JSX */}
      <style jsx>{`
        .about-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .about-tab-bar { display: flex; gap: 8px; background: #ffffff; padding: 6px; border-radius: 12px; border: 1px solid #e2e8f0; overflow-x: auto; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 8px; border: none; background: transparent; color: #475569; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .tab-btn.active { background: #eff6ff; color: #0257d0; }

        .section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 10px; }
        .card-top-flex { display: flex; justify-content: space-between; align-items: center; }

        .form-layout { display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; width: max-content; }
        .add-btn-sm { background: #eff6ff; color: #0257d0; border: 1px solid #bfdbfe; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }

        .faculty-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .faculty-card { display: flex; align-items: center; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 10px; }
        .faculty-card .photo { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; }
        .faculty-card .info { flex: 1; display: flex; flex-direction: column; }
        .faculty-card .name { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 0; }
        .faculty-card .role { font-size: 0.75rem; color: #0257d0; margin: 0; font-weight: 600; }
        .faculty-card .qual { font-size: 0.7rem; color: #64748b; }

        .timeline-list { display: flex; flex-direction: column; gap: 12px; }
        .timeline-item { display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 10px; }
        .timeline-item .yr-badge { background: #0f172a; color: #fff; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; }
        .timeline-item .details { flex: 1; }
        .timeline-item .title { font-size: 0.95rem; font-weight: 700; margin: 0; }
        .timeline-item .desc { font-size: 0.8rem; color: #64748b; margin: 0; }

        .infra-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .infra-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
        .infra-card img { width: 100%; height: 140px; object-fit: cover; }
        .infra-card .body { padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; }
        .infra-card h4 { font-size: 0.85rem; font-weight: 700; margin: 0; }

        .del-btn { background: #fee2e2; color: #dc2626; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
}
