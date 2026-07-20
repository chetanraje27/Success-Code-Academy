"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import Image from 'next/image';

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 'HOME',
    altText: '',
    isActive: true,
    orderIndex: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/banners`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setBanners(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (banner?: any) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        type: banner.type,
        altText: banner.altText || '',
        isActive: banner.isActive,
        orderIndex: banner.orderIndex
      });
      setPreviewUrl(banner.image);
    } else {
      setEditingId(null);
      setFormData({ type: 'HOME', altText: '', isActive: true, orderIndex: banners.length });
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
      let imageUrl = previewUrl; // Use existing if not changed

      // Upload new image if selected
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/upload?type=banner`, {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` },
          body: formDataUpload
        });
        const uploadData = await uploadRes.json();
        if (uploadData.status === 'success') {
          imageUrl = uploadData.data.url; // /images/banners/filename.ext
        } else {
          throw new Error('Image upload failed');
        }
      }

      if (!imageUrl && !editingId) {
        alert("Please select an image");
        setIsSubmitting(false);
        return;
      }

      // Save Banner
      const payload = { ...formData, image: imageUrl };
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/banners${editingId ? `/${editingId}` : ''}`;
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
        fetchBanners();
      } else {
        alert("Failed to save banner");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Banner Management</h1>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <FaPlus /> Add New Banner
        </button>
      </div>

      <div className="banner-sections">
        <div className="section-block">
          <h2 className="section-title">Home Banners</h2>
          <div className="table-card">
            {isLoading ? (
              <div className="loading-state">Loading banners...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Type</th>
                    <th>Alt Text</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.filter(b => b.type === 'HOME').length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">No home banners found.</td></tr>
                  ) : (
                    banners.filter(b => b.type === 'HOME').map(banner => (
                      <tr key={banner.id}>
                        <td>
                          <div className="banner-preview">
                            <Image src={banner.image} alt={banner.altText || 'Banner'} fill style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${banner.type.toLowerCase()}`}>{banner.type}</span>
                        </td>
                        <td>{banner.altText || '-'}</td>
                        <td>{banner.orderIndex}</td>
                        <td>
                          <span className={`status-dot ${banner.isActive ? 'active' : 'inactive'}`}></span>
                          {banner.isActive ? 'Active' : 'Disabled'}
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn edit" onClick={() => handleOpenModal(banner)}><FaEdit /></button>
                          <button className="action-btn delete" onClick={() => handleDelete(banner.id)}><FaTrash /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="section-block mt-8">
          <h2 className="section-title">Result Banners</h2>
          <div className="table-card">
            {isLoading ? (
              <div className="loading-state">Loading banners...</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Type</th>
                    <th>Alt Text</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.filter(b => b.type === 'RESULTS').length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">No result banners found.</td></tr>
                  ) : (
                    banners.filter(b => b.type === 'RESULTS').map(banner => (
                      <tr key={banner.id}>
                        <td>
                          <div className="banner-preview">
                            <Image src={banner.image} alt={banner.altText || 'Banner'} fill style={{ objectFit: 'cover' }} unoptimized />
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${banner.type.toLowerCase()}`}>{banner.type}</span>
                        </td>
                        <td>{banner.altText || '-'}</td>
                        <td>{banner.orderIndex}</td>
                        <td>
                          <span className={`status-dot ${banner.isActive ? 'active' : 'inactive'}`}></span>
                          {banner.isActive ? 'Active' : 'Disabled'}
                        </td>
                        <td className="actions-cell">
                          <button className="action-btn edit" onClick={() => handleOpenModal(banner)}><FaEdit /></button>
                          <button className="action-btn delete" onClick={() => handleDelete(banner.id)}><FaTrash /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
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
              maxWidth: '800px',
              minHeight: '500px',
              padding: '32px',
              borderRadius: '12px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2>{editingId ? 'Edit Banner' : 'Add New Banner'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">

              <div className="form-group">
                <label>Banner Image</label>
                <div className="image-upload-box">
                  {previewUrl ? (
                    <div className="preview-container">
                      <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'contain' }} unoptimized />
                      <button type="button" className="change-img-btn" onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <FaImage size={32} color="#94a3b8" />
                      <span>Click to upload image</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Banner Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="HOME">Home Page Hero</option>
                    <option value="RESULTS">Results Page Hero</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Order Index (0 is first)</label>
                  <input
                    type="number"
                    value={formData.orderIndex}
                    onChange={e => setFormData({ ...formData, orderIndex: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Alt Text (SEO)</label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={e => setFormData({ ...formData, altText: e.target.value })}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  Is Active (Show on website)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .admin-page { max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; color: #1e293b; font-weight: 700; margin: 0; }
        
        .section-title { font-size: 1.25rem; color: #334155; font-weight: 600; margin-bottom: 12px; margin-top: 0; }
        .mt-8 { margin-top: 32px; }

        .primary-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .primary-btn:hover { background: #0146a8; }
        
        .table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { text-align: left; padding: 14px 20px; background: #f8fafc; color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: middle; }
        
        .banner-preview { width: 120px; height: 60px; position: relative; border-radius: 4px; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .badge.home { background: #e0f2fe; color: #0284c7; }
        .badge.results { background: #f3e8ff; color: #9333ea; }
        
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
        .modal-content { background: #fff; width: 100%; max-width: 800px; min-height: 500px; border-radius: 12px; padding: 32px; max-height: 90vh; overflow-y: auto; }
        .modal-content h2 { margin: 0 0 24px 0; font-size: 1.5rem; color: #1e293b; }
        
        .admin-form .form-group { margin-bottom: 20px; }
        .admin-form .form-row { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }
        .admin-form label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #475569; }
        .admin-form input[type="text"], .admin-form input[type="number"], .admin-form select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; }
        
        .image-upload-box { border: 2px dashed #cbd5e1; border-radius: 8px; height: 200px; display: flex; align-items: center; justify-content: center; background: #f8fafc; overflow: hidden; position: relative; }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; color: #64748b; width: 100%; height: 100%; justify-content: center; }
        .preview-container { width: 100%; height: 100%; position: relative; background: #000; }
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
