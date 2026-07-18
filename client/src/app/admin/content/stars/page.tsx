"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaStar } from 'react-icons/fa';
import Image from 'next/image';

export default function AdminStars() {
  const [stars, setStars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    score: '',
    rank: '',
    course: '',
    year: '',
    colorHex: '#0257d0',
    isActive: true,
    orderIndex: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/stars`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStars(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  const handleOpenModal = (star?: any) => {
    if (star) {
      setEditingId(star.id);
      setFormData({
        name: star.name,
        score: star.score,
        rank: star.rank,
        course: star.course,
        year: star.year,
        colorHex: star.colorHex || '#0257d0',
        isActive: star.isActive,
        orderIndex: star.orderIndex
      });
      setPreviewUrl(star.image);
    } else {
      setEditingId(null);
      setFormData({ name: '', score: '', rank: '', course: 'NEET Freshers Batch', year: 'NEET UG 2025', colorHex: '#0ca678', isActive: true, orderIndex: stars.length });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      let imageUrl = previewUrl; 
      
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);
        
        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/upload?type=star`, {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` },
          body: formDataUpload
        });
        const uploadData = await uploadRes.json();
        if (uploadData.status === 'success') {
          imageUrl = uploadData.data.url; // /images/stars/filename.ext
        } else {
          throw new Error('Image upload failed');
        }
      }

      if (!imageUrl && !editingId) {
        alert("Please select a student photo");
        setIsSubmitting(false);
        return;
      }

      const payload = { ...formData, image: imageUrl };
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/stars${editingId ? `/${editingId}` : ''}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchStars();
      } else {
        alert("Failed to save student record");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/stars/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchStars();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Meet Our Stars</h1>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Student
        </button>
      </div>

      <div className="table-card">
        {isLoading ? (
          <div className="loading-state">Loading records...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name & Course</th>
                <th>Score & Rank</th>
                <th>Year</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stars.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No student records found.</td></tr>
              ) : (
                stars.map(star => (
                  <tr key={star.id}>
                    <td>
                      <div className="avatar-preview">
                        <Image src={star.image} alt={star.name} fill style={{ objectFit: 'cover' }} unoptimized />
                      </div>
                    </td>
                    <td>
                      <strong>{star.name}</strong><br/>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{star.course}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="score-badge">{star.score}</span>
                        <span className="rank-badge"><FaStar size={10}/> {star.rank}</span>
                      </div>
                    </td>
                    <td>{star.year}</td>
                    <td>{star.orderIndex}</td>
                    <td>
                      <span className={`status-dot ${star.isActive ? 'active' : 'inactive'}`}></span>
                      {star.isActive ? 'Active' : 'Disabled'}
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => handleOpenModal(star)}><FaEdit /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(star.id)}><FaTrash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              backgroundColor: '#ffffff', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
              border: '1px solid #e2e8f0',
              width: '100%',
              maxWidth: '900px',
              minHeight: '600px',
              padding: '32px',
              borderRadius: '12px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Student Photo (No background preferred)</label>
                  <div className="image-upload-box small-upload">
                    {previewUrl ? (
                      <div className="preview-container">
                        <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'contain' }} unoptimized />
                        <button type="button" className="change-img-btn" onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}>Change</button>
                      </div>
                    ) : (
                      <label className="upload-placeholder">
                        <FaImage size={24} color="#94a3b8" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                      </label>
                    )}
                  </div>
                </div>
                
                <div className="form-group flex-1" style={{ alignSelf: 'flex-end' }}>
                  <label>Accent Color (Hex)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="color" 
                      value={formData.colorHex} 
                      onChange={e => setFormData({...formData, colorHex: e.target.value})}
                      style={{ width: '50px', height: '42px', padding: '0', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                    <input 
                      type="text" 
                      value={formData.colorHex} 
                      onChange={e => setFormData({...formData, colorHex: e.target.value})}
                      placeholder="#0ca678"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Student Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>NEET Score (e.g., 665/720)</label>
                  <input 
                    type="text" 
                    value={formData.score} 
                    onChange={e => setFormData({...formData, score: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Rank (e.g., AIR 26)</label>
                  <input 
                    type="text" 
                    value={formData.rank} 
                    onChange={e => setFormData({...formData, rank: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Course / Batch</label>
                  <input 
                    type="text" 
                    value={formData.course} 
                    onChange={e => setFormData({...formData, course: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Year</label>
                  <input 
                    type="text" 
                    value={formData.year} 
                    onChange={e => setFormData({...formData, year: e.target.value})} 
                    required
                    placeholder="NEET UG 2025"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Order Index (0 is first)</label>
                <input 
                  type="number" 
                  value={formData.orderIndex} 
                  onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value)})}
                  required 
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive} 
                    onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                  />
                  Is Active (Show on website)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Shared CSS */}
      <style jsx>{`
        .admin-page { max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; color: #1e293b; font-weight: 700; margin: 0; }
        
        .primary-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .primary-btn:hover { background: #0146a8; }
        
        .table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 14px 20px; background: #f8fafc; color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: middle; }
        
        .avatar-preview { width: 48px; height: 48px; border-radius: 50%; position: relative; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; }
        
        .score-badge { background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
        .rank-badge { background: #fef9c3; color: #ca8a04; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
        .status-dot.active { background: #22c55e; }
        .status-dot.inactive { background: #ef4444; }
        
        .actions-cell { display: flex; gap: 8px; }
        .action-btn { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: 0.2s; }
        .action-btn.edit:hover { background: #e0f2fe; color: #0284c7; }
        .action-btn.delete:hover { background: #fee2e2; color: #ef4444; }
        
        .empty-state { text-align: center; padding: 40px; color: #64748b; }
        .loading-state { text-align: center; padding: 40px; color: #64748b; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: #fff; width: 100%; max-width: 900px; min-height: 600px; border-radius: 12px; padding: 32px; max-height: 90vh; overflow-y: auto; }
        .modal-content h2 { margin: 0 0 24px 0; font-size: 1.5rem; color: #1e293b; }
        
        .admin-form .form-group { margin-bottom: 20px; }
        .admin-form .form-row { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }
        .admin-form label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #475569; }
        .admin-form input[type="text"], .admin-form input[type="number"], .admin-form select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; }
        
        .image-upload-box { border: 2px dashed #cbd5e1; border-radius: 8px; height: 200px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; position: relative; }
        .small-upload { height: 120px; }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #64748b; width: 100%; height: 100%; justify-content: center; }
        .preview-container { width: 100%; height: 100%; position: relative; background: #e2e8f0; }
        .change-img-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; z-index: 10; font-size: 0.8rem; }
        
        .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .cancel-btn { background: #fff; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 6px; font-weight: 500; color: #475569; cursor: pointer; }
        .save-btn { background: #0257d0; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; color: #fff; cursor: pointer; }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
