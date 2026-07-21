"use client";

import React, { useState } from "react";
import { FaWpforms, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaAward, FaTimes } from "react-icons/fa";

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState([
    {
      id: "1",
      title: "Success Code Super 30 Scholarship Test 2026",
      examDate: "27th July 2026 (Sunday)",
      mode: "Offline & Online",
      maxDiscount: "100% Fee Waiver",
      eligibility: "Class 10, 11 & 12th Pass Students",
      regFee: "FREE",
      status: "Registration Open"
    },
    {
      id: "2",
      title: "NEET Talent Hunt Exam (NTHE 2026)",
      examDate: "10th August 2026",
      mode: "Online Portal",
      maxDiscount: "Up to 75% Scholarship",
      eligibility: "Class 11 & 12 Aspirants",
      regFee: "₹99",
      status: "Upcoming"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ status: "Registration Open", regFee: "FREE" });
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
    const itemObj = { id, ...formData };
    if (editingItem) {
      setScholarships(prev => prev.map(s => s.id === id ? itemObj : s));
    } else {
      setScholarships(prev => [itemObj, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this scholarship test event?")) {
      setScholarships(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="scholarships-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Scholarships & Admission Tests</h1>
          <p className="cms-subtitle">Create and manage talent scholarship exams, waiver slabs, and registration portals.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add Scholarship Exam</button>
      </div>

      <div className="sch-grid">
        {scholarships.map(sch => (
          <div key={sch.id} className="sch-card">
            <div className="card-top flex-between">
              <span className="discount-badge"><FaAward /> {sch.maxDiscount}</span>
              <span className={`status-pill ${sch.status === 'Registration Open' ? 'open' : 'upcoming'}`}>{sch.status}</span>
            </div>

            <h3 className="sch-title">{sch.title}</h3>

            <div className="sch-meta">
              <div className="meta-row"><FaCalendarAlt className="meta-ic" /> <span>Exam Date: <strong>{sch.examDate}</strong></span></div>
              <div className="meta-row"><span>Exam Mode: <strong>{sch.mode}</strong></span></div>
              <div className="meta-row"><span>Eligibility: <strong>{sch.eligibility}</strong></span></div>
              <div className="meta-row"><span>Reg. Fee: <strong className="fee-badge">{sch.regFee}</strong></span></div>
            </div>

            <div className="card-actions flex-end">
              <button className="action-btn edit" onClick={() => handleOpenEdit(sch)}><FaEdit /> Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(sch.id)}><FaTrash /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Scholarship Exam' : 'Add New Scholarship Exam'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Test Title</label>
                <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Super 30 Scholarship Exam" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Exam Date & Time</label>
                  <input type="text" required value={formData.examDate || ''} onChange={e => setFormData({ ...formData, examDate: e.target.value })} placeholder="e.g. 27th July 2026" />
                </div>
                <div className="form-group">
                  <label>Exam Mode</label>
                  <input type="text" value={formData.mode || 'Offline & Online'} onChange={e => setFormData({ ...formData, mode: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Max Scholarship Discount</label>
                  <input type="text" value={formData.maxDiscount || '100% Fee Waiver'} onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Registration Fee</label>
                  <input type="text" value={formData.regFee || 'FREE'} onChange={e => setFormData({ ...formData, regFee: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Eligibility Criteria</label>
                <input type="text" value={formData.eligibility || ''} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} placeholder="e.g. Class 10, 11 & 12 Students" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status || 'Registration Open'} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                  <option value="Registration Open">Registration Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .scholarships-cms-container { padding: 8px 4px; }
        .cms-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .cms-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
        .cms-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .sch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .sch-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 14px; }
        .flex-between { display: flex; align-items: center; justify-content: space-between; }
        .flex-end { display: flex; justify-content: flex-end; gap: 10px; }
        .discount-badge { background: #fef3c7; color: #b45309; font-size: 0.8rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: flex; align-items: center; gap: 6px; }
        .status-pill.open { background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; }
        .status-pill.upcoming { background: #dbeafe; color: #1e40af; font-weight: 700; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; }
        .sch-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0; }
        .sch-meta { background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; color: #475569; }
        .meta-row { display: flex; align-items: center; gap: 8px; }
        .meta-ic { color: #0257d0; }
        .fee-badge { color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; }
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
