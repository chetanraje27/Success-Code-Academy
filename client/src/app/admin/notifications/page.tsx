"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    link: '',
    isActive: true,
    orderIndex: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/notifications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleOpenModal = (notif?: any) => {
    if (notif) {
      setEditingId(notif.id);
      setFormData({
        text: notif.text,
        link: notif.link || '',
        isActive: notif.isActive,
        orderIndex: notif.orderIndex
      });
    } else {
      setEditingId(null);
      setFormData({ text: '', link: '', isActive: true, orderIndex: notifications.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/notifications${editingId ? `/${editingId}` : ''}`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchNotifications();
      } else {
        alert("Failed to save notification");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Notification Bar</h1>
        <button className="primary-btn" onClick={() => handleOpenModal()}>
          <FaPlus /> Add Notification
        </button>
      </div>

      <div className="table-card">
        {isLoading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Link</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">No notifications found.</td></tr>
              ) : (
                notifications.map(notif => (
                  <tr key={notif.id}>
                    <td><strong>{notif.text}</strong></td>
                    <td>{notif.link || '-'}</td>
                    <td>{notif.orderIndex}</td>
                    <td>
                      <span className={`status-dot ${notif.isActive ? 'active' : 'inactive'}`}></span>
                      {notif.isActive ? 'Active' : 'Disabled'}
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn edit" onClick={() => handleOpenModal(notif)}><FaEdit /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(notif.id)}><FaTrash /></button>
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
              maxWidth: '700px',
              minHeight: '400px',
              padding: '32px',
              borderRadius: '12px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2>{editingId ? 'Edit Notification' : 'Add Notification'}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              
              <div className="form-group">
                <label>Announcement Text</label>
                <input 
                  type="text" 
                  value={formData.text} 
                  onChange={e => setFormData({...formData, text: e.target.value})} 
                  required
                  placeholder="e.g. 🎉 Admissions Open 2026-27 for NEET & JEE batches!"
                />
              </div>

              <div className="form-group">
                <label>Link (Optional, where should it click to?)</label>
                <input 
                  type="text" 
                  value={formData.link} 
                  onChange={e => setFormData({...formData, link: e.target.value})} 
                  placeholder="/admissions or https://example.com"
                />
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
                  {isSubmitting ? 'Saving...' : 'Save Notification'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reusing the same CSS from banners page via global or copy-paste for speed. Here copied. */}
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
        .modal-content { background: #fff; width: 100%; max-width: 700px; min-height: 400px; border-radius: 12px; padding: 32px; max-height: 90vh; overflow-y: auto; }
        .modal-content h2 { margin: 0 0 24px 0; font-size: 1.5rem; color: #1e293b; }
        
        .admin-form .form-group { margin-bottom: 20px; }
        .admin-form label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #475569; }
        .admin-form input[type="text"], .admin-form input[type="number"] { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.95rem; }
        
        .checkbox-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        .cancel-btn { background: #fff; border: 1px solid #cbd5e1; padding: 10px 20px; border-radius: 6px; font-weight: 500; color: #475569; cursor: pointer; }
        .save-btn { background: #0257d0; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; color: #fff; cursor: pointer; }
        .save-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
