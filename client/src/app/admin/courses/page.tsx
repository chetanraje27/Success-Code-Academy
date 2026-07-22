"use client";

import React, { useState } from "react";
import { 
  FaUserGraduate, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaFilePdf,
  FaChalkboardTeacher,
  FaClock,
  FaRupeeSign,
  FaAward,
  FaSearch,
  FaLayerGroup
} from "react-icons/fa";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  target: string;
  duration: string;
  batchTiming: string;
  mode: "Classroom" | "Online" | "Hybrid";
  fee: string;
  scholarshipAvailable: boolean;
  batchStart: string;
  eligibility: string;
  faculty: string;
  subjects: string[];
  features: string;
  curriculumSummary: string;
  brochurePdf: string;
  status: "Active" | "Draft";
  priority: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: "1",
      title: "Class 11 NEET Foundation Program (2 Years)",
      slug: "class-11-neet-2-years",
      target: "Class 11 Students",
      duration: "2 Years",
      batchTiming: "Morning (8:00 AM - 1:30 PM)",
      mode: "Classroom",
      fee: "₹1,20,000 / year",
      scholarshipAvailable: true,
      batchStart: "15th August 2026",
      eligibility: "Class 10 Passed from recognized board",
      faculty: "Dr. V. K. Gupta (Chemistry HOD), Prof. S. R. Verma (Physics)",
      subjects: ["Physics", "Chemistry", "Botany", "Zoology"],
      features: "Complete Physics, Chemistry, Biology + 40 Grand Mock Tests",
      curriculumSummary: "Year 1: Complete Class 11 NCERT. Year 2: Class 12 NCERT + Full Revision & Mock Tests.",
      brochurePdf: "/brochures/neet-2-year-program.pdf",
      status: "Active",
      priority: 1
    },
    {
      id: "2",
      title: "Class 12 NEET Intensive Program (1 Year)",
      slug: "class-12-neet-1-year",
      target: "Class 12 Students",
      duration: "1 Year",
      batchTiming: "Afternoon (2:00 PM - 7:00 PM)",
      mode: "Classroom",
      fee: "₹1,35,000",
      scholarshipAvailable: true,
      batchStart: "1st August 2026",
      eligibility: "Class 11 Completed",
      faculty: "Prof. S. R. Verma (Physics HOD)",
      subjects: ["Physics", "Chemistry", "Biology"],
      features: "Class 12 Board Prep + NEET High-yield NCERT revision",
      curriculumSummary: "Class 12 NCERT deep dive + Class 11 revision modules",
      brochurePdf: "/brochures/neet-1-year-program.pdf",
      status: "Active",
      priority: 2
    },
    {
      id: "3",
      title: "NEET Repeater / Dropper Achievers Batch",
      slug: "neet-repeater-achievers",
      target: "12th Pass / Repeaters",
      duration: "1 Year",
      batchTiming: "Full Day (9:00 AM - 4:00 PM)",
      mode: "Classroom",
      fee: "₹1,10,000",
      scholarshipAvailable: true,
      batchStart: "10th August 2026",
      eligibility: "NEET Attempted / Class 12 Passed",
      faculty: "Senior HOD Team",
      subjects: ["Physics", "Chemistry", "Botany", "Zoology"],
      features: "Daily Problem Practice (DPP) + Personal Mentor + Score Booster Tests",
      curriculumSummary: "Intensive 30-week Rank Booster syllabus completion",
      brochurePdf: "/brochures/repeater-batch.pdf",
      status: "Active",
      priority: 3
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [formData, setFormData] = useState<Partial<CourseItem>>({});

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      mode: "Classroom",
      status: "Active",
      scholarshipAvailable: true,
      priority: courses.length + 1,
      subjects: ["Physics", "Chemistry", "Biology"]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingCourse ? editingCourse.id : Date.now().toString();
    const courseObj = { id, ...formData } as CourseItem;
    
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === id ? courseObj : c));
    } else {
      setCourses(prev => [...prev, courseObj]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course program?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="courses-cms-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">NEET Courses & Batches CMS</h1>
          <p className="cms-subtitle">Create & manage academic coaching programs, fee structures, faculty assignments, and syllabus brochures.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add New Course Program</button>
      </div>

      {/* Search Toolbar */}
      <div className="filter-bar">
        <div className="search-wrap">
          <FaSearch className="ic" />
          <input 
            type="text" 
            placeholder="Search course title or target grade..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="count-badge">Total: {filteredCourses.length} Courses</span>
      </div>

      {/* Course Cards Grid */}
      <div className="course-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="card-top">
              <span className="target-pill"><FaUserGraduate /> {course.target}</span>
              <span className={`status-badge ${course.status.toLowerCase()}`}>{course.status}</span>
            </div>

            <h3 className="course-name">{course.title}</h3>
            
            <div className="course-meta">
              <div className="meta-item"><span>Mode:</span> <strong className="mode-tag">{course.mode}</strong></div>
              <div className="meta-item"><span>Duration:</span> <strong>{course.duration}</strong></div>
              <div className="meta-item"><span>Timing:</span> <strong>{course.batchTiming}</strong></div>
              <div className="meta-item"><span>Fee:</span> <strong className="fee-tag">{course.fee}</strong></div>
            </div>

            <p className="features-desc">{course.features}</p>

            {course.faculty && (
              <div className="faculty-row">
                <FaChalkboardTeacher className="ic" />
                <span>Faculty: {course.faculty}</span>
              </div>
            )}

            <div className="card-bottom">
              {course.brochurePdf && (
                <a href={course.brochurePdf} target="_blank" rel="noreferrer" className="pdf-link">
                  <FaFilePdf /> Syllabus Brochure PDF
                </a>
              )}

              <div className="actions">
                <button className="action-btn edit" onClick={() => handleOpenEdit(course)}><FaEdit /> Edit</button>
                <button className="action-btn delete" onClick={() => handleDelete(course.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course Program' : 'Create New Course Program'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Course Title</label>
                  <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Class 11 NEET Foundation" />
                </div>
                <div className="form-group">
                  <label>Target Grade / Audience</label>
                  <input type="text" required value={formData.target || ''} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="e.g. Class 11 Students" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Learning Mode</label>
                  <select value={formData.mode || 'Classroom'} onChange={e => setFormData({ ...formData, mode: e.target.value as any })}>
                    <option value="Classroom">Classroom</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Course Fee Structure</label>
                  <input type="text" required value={formData.fee || ''} onChange={e => setFormData({ ...formData, fee: e.target.value })} placeholder="e.g. ₹1,20,000 / year" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" required value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 2 Years" />
                </div>
                <div className="form-group">
                  <label>Daily Batch Timing</label>
                  <input type="text" value={formData.batchTiming || ''} onChange={e => setFormData({ ...formData, batchTiming: e.target.value })} placeholder="e.g. Morning 8:00 AM - 1:30 PM" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Batch Start Date</label>
                  <input type="text" value={formData.batchStart || ''} onChange={e => setFormData({ ...formData, batchStart: e.target.value })} placeholder="e.g. 15th August 2026" />
                </div>
                <div className="form-group">
                  <label>Eligibility Criteria</label>
                  <input type="text" value={formData.eligibility || ''} onChange={e => setFormData({ ...formData, eligibility: e.target.value })} placeholder="e.g. Class 10 Passed" />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Faculty / HODs</label>
                <input type="text" value={formData.faculty || ''} onChange={e => setFormData({ ...formData, faculty: e.target.value })} placeholder="e.g. Dr. V. K. Gupta, Prof. S. R. Verma" />
              </div>

              <div className="form-group">
                <label>Key Features & Highlights</label>
                <textarea rows={2} value={formData.features || ''} onChange={e => setFormData({ ...formData, features: e.target.value })} placeholder="Complete Physics, Chemistry, Biology + 40 Mock Tests" />
              </div>

              <div className="form-group">
                <label>Curriculum Breakdown Summary</label>
                <textarea rows={2} value={formData.curriculumSummary || ''} onChange={e => setFormData({ ...formData, curriculumSummary: e.target.value })} placeholder="Year 1 NCERT completion..." />
              </div>

              <div className="form-group">
                <label>Syllabus Brochure PDF Path</label>
                <input type="text" value={formData.brochurePdf || ''} onChange={e => setFormData({ ...formData, brochurePdf: e.target.value })} placeholder="/brochures/neet-2-year.pdf" />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .courses-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-bar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 320px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }
        .count-badge { font-size: 0.82rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }

        .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .course-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .target-pill { background: #eff6ff; color: #0257d0; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; }
        .status-badge.active { background: #dcfce7; color: #15803d; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        .course-name { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
        .course-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 0.8rem; }
        .meta-item { display: flex; flex-direction: column; gap: 2px; }
        .meta-item span { font-size: 0.7rem; color: #64748b; font-weight: 600; }
        .fee-tag { color: #0257d0; }
        .mode-tag { color: #059669; }

        .features-desc { font-size: 0.85rem; color: #475569; margin: 0; }
        .faculty-row { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #475569; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; }

        .card-bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: auto; }
        .pdf-link { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #dc2626; font-weight: 700; text-decoration: none; }
        .actions { display: flex; gap: 8px; }
        .action-btn { display: flex; align-items: center; gap: 4px; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .action-btn.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn.delete { background: #fee2e2; color: #b91c1c; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 620px; overflow: hidden; }
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
