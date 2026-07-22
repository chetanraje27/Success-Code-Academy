"use client";

import React, { useState } from "react";
import { 
  FaWpforms, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaAward, 
  FaTimes, 
  FaDownload, 
  FaFileExcel, 
  FaUserGraduate, 
  FaFilePdf,
  FaCheckCircle
} from "react-icons/fa";

interface ScholarshipExamItem {
  id: string;
  title: string;
  examDate: string;
  deadlineDate: string;
  mode: "Offline Classroom" | "Online Portal" | "Both";
  maxDiscount: string;
  eligibility: string;
  totalSeats: number;
  regFee: string;
  syllabusPdf?: string;
  admitCardStatus: "Released" | "Pending";
  status: "Registration Open" | "Upcoming" | "Closed";
  totalApplicants: number;
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<ScholarshipExamItem[]>([
    {
      id: "1",
      title: "Success Code Scholarship Test 2026",
      examDate: "27th July 2026 (Sunday)",
      deadlineDate: "25th July 2026",
      mode: "Both",
      maxDiscount: "Up to 100% Fee Waiver",
      eligibility: "Class 10, 11 & 12th Pass Students",
      totalSeats: 500,
      regFee: "FREE",
      syllabusPdf: "/brochures/scholarship-syllabus.pdf",
      admitCardStatus: "Released",
      status: "Registration Open",
      totalApplicants: 850
    },
    {
      id: "2",
      title: "NEET Talent Hunt Exam (NTHE 2026)",
      examDate: "10th August 2026",
      deadlineDate: "08th August 2026",
      mode: "Online Portal",
      maxDiscount: "Up to 75% Scholarship",
      eligibility: "Class 11 & 12 Aspirants",
      totalSeats: 300,
      regFee: "₹99",
      admitCardStatus: "Pending",
      status: "Upcoming",
      totalApplicants: 140
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScholarshipExamItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScholarshipExamItem>>({});

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      mode: "Both",
      status: "Registration Open",
      regFee: "FREE",
      admitCardStatus: "Released",
      totalSeats: 500,
      totalApplicants: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScholarshipExamItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : Date.now().toString();
    const itemObj = { id, ...formData } as ScholarshipExamItem;
    setScholarships(prev => editingItem ? prev.map(s => s.id === id ? itemObj : s) : [itemObj, ...prev]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this scholarship exam event?")) {
      setScholarships(prev => prev.filter(s => s.id !== id));
    }
  };

  const exportExcel = (sch: ScholarshipExamItem) => {
    const csvContent = "data:text/csv;charset=utf-8,Exam,Total Applicants,Exam Date,Status\n" +
      `"${sch.title}",${sch.totalApplicants},"${sch.examDate}","${sch.status}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${sch.title.replace(/\s+/g, '_')}_Applicants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="scholarships-cms-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Scholarship Exams & Admission Tests CMS</h1>
          <p className="cms-subtitle">Create talent search exams, fee waiver slabs, admit card releases, and manage student registration rosters.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Create Scholarship Exam</button>
      </div>

      {/* Grid */}
      <div className="sch-grid">
        {scholarships.map(sch => (
          <div key={sch.id} className="sch-card">
            <div className="card-top">
              <span className="discount-badge"><FaAward /> {sch.maxDiscount}</span>
              <span className={`status-pill ${sch.status === 'Registration Open' ? 'open' : 'upcoming'}`}>{sch.status}</span>
            </div>

            <h3 className="sch-title">{sch.title}</h3>

            <div className="sch-meta">
              <div className="meta-row"><FaCalendarAlt className="meta-ic" /> <span>Exam Date: <strong>{sch.examDate}</strong></span></div>
              <div className="meta-row"><span>Registration Deadline: <strong>{sch.deadlineDate}</strong></span></div>
              <div className="meta-row"><span>Exam Mode: <strong>{sch.mode}</strong></span></div>
              <div className="meta-row"><span>Eligibility: <strong>{sch.eligibility}</strong></span></div>
              <div className="meta-row"><span>Fee: <strong className="fee-badge">{sch.regFee}</strong></span> • <span>Total Applicants: <strong>{sch.totalApplicants}</strong></span></div>
            </div>

            <div className="card-actions">
              <button className="action-btn export" onClick={() => exportExcel(sch)} title="Export Registration Roster CSV"><FaFileExcel /> Export Applicants</button>
              <button className="action-btn edit" onClick={() => handleOpenEdit(sch)}><FaEdit /> Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(sch.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Scholarship Exam' : 'Create Scholarship Exam'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Scholarship Exam Title</label>
                <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Success Code Scholarship Test 2026" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Fee Waiver / Discount</label>
                  <input type="text" required value={formData.maxDiscount || ''} onChange={e => setFormData({ ...formData, maxDiscount: e.target.value })} placeholder="e.g. Up to 100% Fee Waiver" />
                </div>
                <div className="form-group">
                  <label>Exam Status</label>
                  <select value={formData.status || 'Registration Open'} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
                    <option value="Registration Open">Registration Open</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="text" required value={formData.examDate || ''} onChange={e => setFormData({ ...formData, examDate: e.target.value })} placeholder="e.g. 27th July 2026 (Sunday)" />
                </div>
                <div className="form-group">
                  <label>Registration Deadline</label>
                  <input type="text" value={formData.deadlineDate || ''} onChange={e => setFormData({ ...formData, deadlineDate: e.target.value })} placeholder="e.g. 25th July 2026" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exam Mode</label>
                  <select value={formData.mode || 'Both'} onChange={e => setFormData({ ...formData, mode: e.target.value as any })}>
                    <option value="Both">Classroom & Online</option>
                    <option value="Offline Classroom">Offline Classroom</option>
                    <option value="Online Portal">Online Portal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Registration Fee</label>
                  <input type="text" value={formData.regFee || 'FREE'} onChange={e => setFormData({ ...formData, regFee: e.target.value })} placeholder="FREE or ₹99" />
                </div>
              </div>

              <div className="form-group">
                <label>Eligibility Criteria</label>
                <input type="text" value={formData.eligibility || ''} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} placeholder="e.g. Class 10, 11 & 12th Pass Students" />
              </div>

              <div className="form-group">
                <label>Syllabus PDF File Path</label>
                <input type="text" value={formData.syllabusPdf || ''} onChange={e => setFormData({ ...formData, syllabusPdf: e.target.value })} placeholder="/brochures/scholarship-syllabus.pdf" />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .scholarships-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .sch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
        .sch-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .discount-badge { background: #fef3c7; color: #b45309; font-size: 0.78rem; font-weight: 800; padding: 3px 10px; border-radius: 6px; display: flex; align-items: center; gap: 6px; }

        .status-pill.open { background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
        .status-pill.upcoming { background: #eff6ff; color: #0257d0; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        .sch-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
        .sch-meta { display: flex; flex-direction: column; gap: 6px; background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.82rem; color: #475569; }
        .meta-row { display: flex; align-items: center; gap: 6px; }
        .meta-ic { color: #0257d0; }
        .fee-badge { color: #059669; }

        .card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px dashed #e2e8f0; }
        .action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .action-btn.export { background: #ecfdf5; color: #059669; }
        .action-btn.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn.delete { background: #fee2e2; color: #b91c1c; flex: 0 0 32px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 600px; overflow: hidden; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 75vh; overflow-y: auto; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea, .form-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
