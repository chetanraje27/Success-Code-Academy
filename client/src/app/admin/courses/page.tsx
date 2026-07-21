"use client";

import React, { useState } from "react";
import { FaUserGraduate, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaFilePdf } from "react-icons/fa";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([
    {
      id: "1",
      title: "Class 11 NEET Target Program (2 Years)",
      target: "Class 11 Students",
      duration: "2 Years",
      batchStart: "15th August 2026",
      fee: "₹1,20,000 / year",
      features: "Complete Physics, Chemistry, Biology + 40 Grand Mock Tests",
      status: "Active"
    },
    {
      id: "2",
      title: "Class 12 NEET Intensive Program (1 Year)",
      target: "Class 12 Students",
      duration: "1 Year",
      batchStart: "1st August 2026",
      fee: "₹1,35,000",
      features: "Class 12 Syllabus + Class 11 Fast-track Revision",
      status: "Active"
    },
    {
      id: "3",
      title: "NEET Repeater / Dropper Achievers Batch",
      target: "12th Pass / Repeaters",
      duration: "1 Year",
      batchStart: "10th August 2026",
      fee: "₹1,10,000",
      features: "Daily Problem Practice (DPP) + Personal Mentor + Score Booster Tests",
      status: "Active"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({ status: "Active" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingCourse ? editingCourse.id : Date.now().toString();
    const courseObj = { id, ...formData };
    
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === id ? courseObj : c));
    } else {
      setCourses(prev => [courseObj, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="courses-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Courses & Batches Management</h1>
          <p className="cms-subtitle">Manage NEET coaching programs, fees, batch schedules, and downloadable brochures.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add New Course</button>
      </div>

      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="card-top flex-between">
              <span className="target-pill"><FaUserGraduate /> {course.target}</span>
              <span className={`status-badge ${course.status === 'Active' ? 'active' : 'inactive'}`}>{course.status}</span>
            </div>

            <h3 className="course-name">{course.title}</h3>
            
            <div className="course-meta">
              <div className="meta-item"><span>Duration:</span> <strong>{course.duration}</strong></div>
              <div className="meta-item"><span>Batch Starts:</span> <strong>{course.batchStart}</strong></div>
              <div className="meta-item"><span>Course Fee:</span> <strong className="fee-tag">{course.fee}</strong></div>
            </div>

            <p className="features-desc">{course.features}</p>

            <div className="card-actions flex-between">
              <button className="brochure-btn"><FaFilePdf /> Syllabus PDF</button>
              <div className="flex-gap">
                <button className="btn-icon edit" onClick={() => handleOpenEdit(course)}><FaEdit /> Edit</button>
                <button className="btn-icon delete" onClick={() => handleDelete(course.id)}><FaTrash /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Course Title</label>
                <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Class 11 Target Batch" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Target Audience</label>
                  <input type="text" value={formData.target || ''} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="e.g. Class 11 Students" />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 2 Years" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Batch Start Date</label>
                  <input type="text" value={formData.batchStart || ''} onChange={e => setFormData({ ...formData, batchStart: e.target.value })} placeholder="e.g. 15th August 2026" />
                </div>
                <div className="form-group">
                  <label>Course Fee</label>
                  <input type="text" value={formData.fee || ''} onChange={e => setFormData({ ...formData, fee: e.target.value })} placeholder="e.g. ₹1,20,000 / year" />
                </div>
              </div>
              <div className="form-group">
                <label>Features & Highlights</label>
                <textarea rows={3} value={formData.features || ''} onChange={e => setFormData({ ...formData, features: e.target.value })} placeholder="Key offerings..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .courses-cms-container { padding: 8px 4px; }
        .cms-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .cms-title { font-size: 1.6rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
        .cms-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .course-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 14px; }
        .flex-between { display: flex; align-items: center; justify-content: space-between; }
        .flex-gap { display: flex; gap: 8px; }
        .target-pill { background: #eff6ff; color: #0257d0; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; }
        .status-badge.active { background: #dcfce7; color: #166534; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; }
        .status-badge.inactive { background: #fee2e2; color: #991b1b; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; }
        .course-name { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
        .course-meta { background: #f8fafc; padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; }
        .meta-item { display: flex; justify-content: space-between; color: #475569; }
        .fee-tag { color: #059669; }
        .features-desc { font-size: 0.85rem; color: #64748b; margin: 0; flex: 1; }
        .card-actions { border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: auto; }
        .brochure-btn { background: #f1f5f9; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-icon { border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .btn-icon.edit { background: #e0f2fe; color: #0369a1; }
        .btn-icon.delete { background: #fee2e2; color: #b91c1c; }
        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 520px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
