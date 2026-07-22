"use client";

import React, { useState } from "react";
import { 
  FaQuoteLeft, 
  FaStar, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUser, 
  FaUserFriends, 
  FaVideo, 
  FaCheck, 
  FaSearch,
  FaTimes
} from "react-icons/fa";

interface TestimonialItem {
  id: string;
  authorName: string;
  type: "Student" | "Parent";
  format: "Text" | "Video";
  rating: number;
  course: string;
  rank?: string;
  college?: string;
  photo: string;
  videoUrl?: string;
  text: string;
  featured: boolean;
  status: "Approved" | "Pending";
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    {
      id: "1",
      authorName: "Samruddhi Lokhande",
      type: "Student",
      format: "Text",
      rating: 5,
      course: "NEET FRESHERS BATCH",
      rank: "AIR 1204",
      college: "BJ Medical College",
      photo: "https://placehold.co/100x100/e2e8f0/1e293b?text=Samruddhi",
      text: "The faculty personal care and daily doubt sessions helped me crack NEET on my 1st attempt!",
      featured: true,
      status: "Approved"
    },
    {
      id: "2",
      authorName: "Mr. Ramesh Bhosale",
      type: "Parent",
      format: "Video",
      rating: 5,
      course: "Parent of Mahesh Bhosale",
      photo: "https://placehold.co/100x100/e2e8f0/1e293b?text=Parent",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      text: "As a parent, I saw remarkable discipline and academic growth in my child under Dr. Gupta's mentorship.",
      featured: true,
      status: "Approved"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialItem>>({});

  const filtered = testimonials.filter(t => 
    t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ type: "Student", format: "Text", rating: 5, featured: true, status: "Approved" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : Date.now().toString();
    const itemToSave = { id, ...formData } as TestimonialItem;
    setTestimonials(prev => editingItem ? prev.map(t => t.id === id ? itemToSave : t) : [itemToSave, ...prev]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete testimonial?")) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="testimonials-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Testimonials & Review CMS</h1>
          <p className="cms-subtitle">Manage student & parent feedback, video testimonials, ratings, and website homepage placement.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add Testimonial</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <FaSearch className="ic" />
          <input type="text" placeholder="Search author or course..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <span className="count-badge">Total: {filtered.length} Reviews</span>
      </div>

      <div className="grid-layout">
        {filtered.map(t => (
          <div key={t.id} className="testimonial-card">
            <div className="card-header">
              <img src={t.photo || "https://placehold.co/80x80/0257d0/ffffff?text=User"} alt={t.authorName} className="avatar" />
              <div className="author-meta">
                <h3 className="author-name">{t.authorName}</h3>
                <span className="type-badge">{t.type} • {t.format}</span>
              </div>
              <span className={`status-pill ${t.status.toLowerCase()}`}>{t.status}</span>
            </div>

            <div className="rating-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={`star ${i < t.rating ? 'active' : ''}`} />
              ))}
            </div>

            <p className="quote-text">"{t.text}"</p>
            <span className="course-tag">{t.course}</span>

            <div className="card-actions">
              <button className="act-btn edit" onClick={() => handleOpenEdit(t)}><FaEdit /> Edit</button>
              <button className="act-btn delete" onClick={() => handleDelete(t.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Author Full Name</label>
                  <input type="text" required value={formData.authorName || ''} onChange={e => setFormData({ ...formData, authorName: e.target.value })} placeholder="e.g. Samruddhi Lokhande" />
                </div>
                <div className="form-group">
                  <label>Author Type</label>
                  <select value={formData.type || 'Student'} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Format</label>
                  <select value={formData.format || 'Text'} onChange={e => setFormData({ ...formData, format: e.target.value as any })}>
                    <option value="Text">Text Quote</option>
                    <option value="Video">Video Testimonial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Rating (1 to 5 Stars)</label>
                  <input type="number" min={1} max={5} value={formData.rating || 5} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} />
                </div>
              </div>

              <div className="form-group">
                <label>Enrolled Course / Relationship</label>
                <input type="text" value={formData.course || ''} onChange={e => setFormData({ ...formData, course: e.target.value })} placeholder="e.g. NEET FRESHERS BATCH" />
              </div>

              <div className="form-group">
                <label>Photo URL</label>
                <input type="text" value={formData.photo || ''} onChange={e => setFormData({ ...formData, photo: e.target.value })} placeholder="Photo link" />
              </div>

              <div className="form-group">
                <label>Testimonial Content</label>
                <textarea rows={3} required value={formData.text || ''} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Detailed review text..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .testimonials-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-bar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 300px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }
        .count-badge { font-size: 0.82rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }

        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .testimonial-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 12px; }
        .card-header { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .author-meta { flex: 1; }
        .author-name { font-size: 0.95rem; font-weight: 700; margin: 0; color: #0f172a; }
        .type-badge { font-size: 0.72rem; color: #64748b; font-weight: 600; }

        .status-pill.approved { background: #dcfce7; color: #15803d; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
        .rating-row { display: flex; gap: 4px; }
        .star { color: #cbd5e1; font-size: 0.85rem; }
        .star.active { color: #f59e0b; }

        .quote-text { font-size: 0.85rem; color: #334155; font-style: italic; margin: 0; }
        .course-tag { font-size: 0.72rem; font-weight: 700; color: #0257d0; background: #eff6ff; padding: 3px 8px; border-radius: 4px; width: max-content; }

        .card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px dashed #e2e8f0; }
        .act-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .act-btn.edit { background: #e0f2fe; color: #0369a1; }
        .act-btn.delete { background: #fee2e2; color: #b91c1c; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 580px; overflow: hidden; }
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
