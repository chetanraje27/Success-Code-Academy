"use client";

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function CourseForms() {
  const [forms, setForms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/database/course-forms`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setForms(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredForms = forms.filter(f => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (f.studentName || '').toLowerCase().includes(searchLower);
    const phoneMatch = (f.studentPhone || '').includes(searchTerm);
    const courseMatch = (f.courseTitle || '').toLowerCase().includes(searchLower);
    return nameMatch || phoneMatch || courseMatch;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Course Registration Forms</h1>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-stats">
            Total Forms: <strong>{filteredForms.length}</strong>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading forms...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Contact Details</th>
                  <th>Course Intended</th>
                  <th>Visiting Preference</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredForms.length === 0 ? (
                  <tr><td colSpan={6} className="empty-state">No forms found.</td></tr>
                ) : (
                  filteredForms.map(form => (
                    <tr key={form.id}>
                      <td>{form.id}</td>
                      <td><strong>{form.studentName}</strong></td>
                      <td>
                        {form.studentPhone}<br/>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{form.studentEmail}</span>
                      </td>
                      <td><span className="badge course">{form.courseTitle}</span></td>
                      <td>
                        Date: {form.visitingDate}<br/>
                        Time: {form.visitingTime}
                      </td>
                      <td>{new Date(form.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-page { max-width: 1200px; margin: 0 auto; }
        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; color: #1e293b; font-weight: 700; margin: 0; }
        
        .table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .table-toolbar { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .search-box { position: relative; width: 300px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-box input { width: 100%; padding: 8px 12px 8px 36px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; }
        .toolbar-stats { font-size: 0.9rem; color: #475569; }
        
        .table-responsive { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; min-width: 900px; }
        .admin-table th { text-align: left; padding: 14px 20px; background: #fff; color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 0.95rem; }
        
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .badge.course { background: #e0f2fe; color: #0284c7; }
        
        .empty-state { text-align: center; padding: 40px; color: #64748b; }
        .loading-state { text-align: center; padding: 40px; color: #64748b; }
      `}</style>
    </div>
  );
}
