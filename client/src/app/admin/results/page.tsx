"use client";

import React, { useState } from "react";
import { FaStar, FaPlus, FaEdit, FaTrash, FaTrophy, FaGraduationCap, FaTimes } from "react-icons/fa";

export default function AdminResultsPage() {
  const [results, setResults] = useState([
    {
      id: "1",
      year: "2026",
      studentName: "Aarav Sharma",
      neetScore: "715 / 720",
      rank: "AIR 14",
      college: "AIIMS New Delhi",
      batch: "Two Year Classroom Program",
      photo: "/images/results/aarav.jpg"
    },
    {
      id: "2",
      year: "2026",
      studentName: "Priya Patel",
      neetScore: "705 / 720",
      rank: "AIR 42",
      college: "JIPMER Puducherry",
      batch: "Repeater Achievers Batch",
      photo: "/images/results/priya.jpg"
    },
    {
      id: "3",
      year: "2025",
      studentName: "Rohan Deshmukh",
      neetScore: "695 / 720",
      rank: "AIR 89",
      college: "KGMU Lucknow",
      batch: "One Year Classroom Program",
      photo: "/images/results/rohan.jpg"
    }
  ]);

  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const filteredResults = selectedYear === "All" ? results : results.filter(r => r.year === selectedYear);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ year: "2026" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : Date.now().toString();
    const obj = { id, ...formData };
    if (editingItem) {
      setResults(prev => prev.map(r => r.id === id ? obj : r));
    } else {
      setResults(prev => [obj, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this result entry?")) {
      setResults(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="results-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">NEET Results & Top Rankers Management</h1>
          <p className="cms-subtitle">Showcase year-wise NEET top rankers, AIR scores, and medical college admissions.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add Ranker Result</button>
      </div>

      <div className="year-filter-bar">
        <div className="flex-gap">
          {["All", "2026", "2025", "2024"].map(yr => (
            <button
              key={yr}
              className={`yr-btn ${selectedYear === yr ? 'active' : ''}`}
              onClick={() => setSelectedYear(yr)}
            >
              {yr === "All" ? "All Years" : `NEET ${yr}`}
            </button>
          ))}
        </div>
        <span className="total-count">Showing {filteredResults.length} Rankers</span>
      </div>

      <div className="ranker-grid">
        {filteredResults.map(ranker => (
          <div key={ranker.id} className="ranker-card">
            <div className="card-top flex-between">
              <span className="year-badge">NEET {ranker.year}</span>
              <span className="air-rank-badge"><FaTrophy /> {ranker.rank}</span>
            </div>

            <div className="ranker-body">
              <div className="avatar">
                <img src={ranker.photo || "https://placehold.co/90x90/0257d0/ffffff?text=Ranker"} alt={ranker.studentName} />
              </div>
              <h3 className="ranker-name">{ranker.studentName}</h3>
              <p className="ranker-score">NEET Score: <strong>{ranker.neetScore}</strong></p>
              
              <div className="college-info">
                <FaGraduationCap className="ic" />
                <span>{ranker.college}</span>
              </div>
              <p className="batch-lbl">{ranker.batch}</p>
            </div>

            <div className="card-actions flex-end">
              <button className="action-btn edit" onClick={() => handleOpenEdit(ranker)}><FaEdit /> Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(ranker.id)}><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Ranker Result' : 'Add New NEET Ranker'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>NEET Exam Year</label>
                  <select value={formData.year || '2026'} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Student Full Name</label>
                  <input type="text" required value={formData.studentName || ''} onChange={e => setFormData({ ...formData, studentName: e.target.value })} placeholder="e.g. Aarav Sharma" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>NEET Score</label>
                  <input type="text" required value={formData.neetScore || ''} onChange={e => setFormData({ ...formData, neetScore: e.target.value })} placeholder="715 / 720" />
                </div>
                <div className="form-group">
                  <label>All India Rank (AIR)</label>
                  <input type="text" required value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} placeholder="AIR 14" />
                </div>
              </div>
              <div className="form-group">
                <label>Allotted Medical College</label>
                <input type="text" value={formData.college || ''} onChange={e => setFormData({ ...formData, college: e.target.value })} placeholder="e.g. AIIMS New Delhi" />
              </div>
              <div className="form-group">
                <label>Enrolled Batch</label>
                <input type="text" value={formData.batch || ''} onChange={e => setFormData({ ...formData, batch: e.target.value })} placeholder="Two Year Classroom Program" />
              </div>
              <div className="form-group">
                <label>Student Photo URL</label>
                <input type="text" value={formData.photo || ''} onChange={e => setFormData({ ...formData, photo: e.target.value })} placeholder="Image URL" />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .results-cms-container { padding: 8px 4px; }
        .cms-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .cms-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
        .cms-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .year-filter-bar { display: flex; align-items: center; justify-content: space-between; background: #ffffff; padding: 8px 12px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
        .flex-gap { display: flex; gap: 8px; }
        .yr-btn { background: transparent; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; color: #475569; cursor: pointer; font-size: 0.85rem; }
        .yr-btn.active { background: #eff6ff; color: #0257d0; }
        .total-count { font-size: 0.85rem; color: #64748b; font-weight: 500; }
        .ranker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .ranker-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 14px; text-align: center; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-end { display: flex; justify-content: flex-end; gap: 8px; }
        .year-badge { background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
        .air-rank-badge { background: #fef3c7; color: #b45309; font-size: 0.8rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; }
        .ranker-body { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .avatar img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #eff6ff; }
        .ranker-name { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 4px 0 0; }
        .ranker-score { font-size: 0.9rem; color: #334155; margin: 0; }
        .college-info { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #0257d0; font-weight: 600; background: #eff6ff; padding: 4px 12px; border-radius: 6px; margin-top: 4px; }
        .batch-lbl { font-size: 0.75rem; color: #64748b; margin: 0; }
        .card-actions { border-top: 1px solid #f1f5f9; padding-top: 12px; }
        .action-btn { border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .action-btn.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn.delete { background: #fee2e2; color: #b91c1c; }
        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 520px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
