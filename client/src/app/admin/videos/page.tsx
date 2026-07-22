"use client";

import React, { useState } from "react";
import { 
  FaFilm, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaPlay, 
  FaYoutube, 
  FaInstagram, 
  FaFacebook, 
  FaSearch, 
  FaTimes,
  FaEye
} from "react-icons/fa";

interface VideoItem {
  id: string;
  title: string;
  platform: "YouTube" | "Instagram" | "Facebook" | "MP4 File";
  subject: "Biology" | "Physics" | "Chemistry" | "Motivation";
  url: string;
  thumbnail?: string;
  duration: string;
  views: string;
  featured: boolean;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: "1",
      title: "Complete Genetics One-Shot Revision | NEET Biology",
      platform: "YouTube",
      subject: "Biology",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "1h 45m",
      views: "12.4K",
      featured: true
    },
    {
      id: "2",
      title: "Electrostatics Formulas & Short Tricks | NEET Physics",
      platform: "YouTube",
      subject: "Physics",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: "52m",
      views: "8.1K",
      featured: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
  const [formData, setFormData] = useState<Partial<VideoItem>>({});

  const filtered = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ platform: "YouTube", subject: "Biology", featured: true, duration: "45m", views: "0" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: VideoItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : Date.now().toString();
    const itemToSave = { id, ...formData } as VideoItem;
    setVideos(prev => editingItem ? prev.map(v => v.id === id ? itemToSave : v) : [itemToSave, ...prev]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete video entry?")) {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="videos-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Video Library CMS</h1>
          <p className="cms-subtitle">Organize one-shot lecture videos, topper interviews, revision clips, and YouTube/Instagram embeds.</p>
        </div>
        <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add New Video</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <FaSearch className="ic" />
          <input type="text" placeholder="Search video title or subject..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <span className="count-badge">Total: {filtered.length} Videos</span>
      </div>

      <div className="grid-layout">
        {filtered.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-embed">
              <iframe src={video.url} title={video.title} allowFullScreen className="iframe"></iframe>
            </div>

            <div className="card-body">
              <div className="pills-row">
                <span className="subject-pill">{video.subject}</span>
                <span className="platform-pill"><FaYoutube /> {video.platform}</span>
              </div>
              <h3 className="video-title">{video.title}</h3>
              <div className="video-meta">
                <span>Duration: {video.duration}</span> • <span>Views: {video.views}</span>
              </div>

              <div className="card-actions">
                <button className="act-btn edit" onClick={() => handleOpenEdit(video)}><FaEdit /> Edit</button>
                <button className="act-btn delete" onClick={() => handleDelete(video.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Video' : 'Add Video'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Video Title</label>
                <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Complete Genetics Revision" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject Category</label>
                  <select value={formData.subject || 'Biology'} onChange={e => setFormData({ ...formData, subject: e.target.value as any })}>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Motivation">Motivation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform Source</label>
                  <select value={formData.platform || 'YouTube'} onChange={e => setFormData({ ...formData, platform: e.target.value as any })}>
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="MP4 File">MP4 File</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Embed Video URL</label>
                <input type="text" required value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={formData.duration || '45m'} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 1h 20m" />
                </div>
                <div className="form-group">
                  <label>Homepage Featured</label>
                  <select value={formData.featured ? 'true' : 'false'} onChange={e => setFormData({ ...formData, featured: e.target.value === 'true' })}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .videos-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-bar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 300px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }
        .count-badge { font-size: 0.82rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }

        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px; }
        .video-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
        .video-embed { height: 200px; background: #000000; }
        .iframe { width: 100%; height: 100%; border: none; }

        .card-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .pills-row { display: flex; gap: 8px; }
        .subject-pill { background: #eff6ff; color: #0257d0; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; }
        .platform-pill { background: #fee2e2; color: #dc2626; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }

        .video-title { font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0; }
        .video-meta { font-size: 0.75rem; color: #64748b; }

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
