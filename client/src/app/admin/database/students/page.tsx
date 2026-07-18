"use client";

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function StudentAccounts() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/database/users`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setStudents(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(searchLower);
    const mobileMatch = (s.mobileNumber || '').includes(searchTerm);
    const emailMatch = (s.email || '').toLowerCase().includes(searchLower);
    return nameMatch || mobileMatch || emailMatch;
  });

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Registered Student Accounts</h1>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, mobile, or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="toolbar-stats">
            Total Students: <strong>{filteredStudents.length}</strong>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading students...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Mobile Number</th>
                  <th>Email Address</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan={7} className="empty-state">No students found.</td></tr>
                ) : (
                  filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td><strong>{student.firstName} {student.lastName}</strong></td>
                      <td>{student.mobileNumber}</td>
                      <td>{student.email || '-'}</td>
                      <td>{student.age || '-'}</td>
                      <td><span className="badge role">{student.role}</span></td>
                      <td>{new Date(student.createdAt).toLocaleString()}</td>
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
        .admin-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .admin-table th { text-align: left; padding: 14px 20px; background: #fff; color: #475569; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 20px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 0.95rem; }
        
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: #e2e8f0; color: #475569; }
        
        .empty-state { text-align: center; padding: 40px; color: #64748b; }
        .loading-state { text-align: center; padding: 40px; color: #64748b; }
      `}</style>
    </div>
  );
}
