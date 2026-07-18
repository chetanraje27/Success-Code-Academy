"use client";

import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaWpforms, FaFileSignature } from "react-icons/fa6";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourseForms: 0,
    totalScholarshipForms: 0,
    recentStudents: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/admin/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <div className="loading-state">Loading dashboard data...</div>;

  const statCards = [
    { 
      label: "Registered Students", 
      value: stats.totalStudents, 
      icon: <FaUserGraduate />, 
      color: "#0257d0",
      bg: "#eff6ff"
    },
    { 
      label: "Course Enquiries", 
      value: stats.totalCourseForms, 
      icon: <FaWpforms />, 
      color: "#059669",
      bg: "#ecfdf5"
    },
    { 
      label: "Scholarship Apps", 
      value: stats.totalScholarshipForms, 
      icon: <FaFileSignature />, 
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Dashboard Overview</h1>
      
      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="stat-icon-wrap" style={{ backgroundColor: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-details">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-label">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-sections">
        {/* Recent Registrations */}
        <div className="recent-activity-panel">
          <div className="panel-header">
            <h2>Recent Student Registrations</h2>
            <Link href="/admin/database/students" className="view-all-link">View All</Link>
          </div>
          <div className="panel-body">
            {stats.recentStudents.length > 0 ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.firstName} {student.lastName}</td>
                      <td>{student.mobileNumber}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No students registered yet.</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-title {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 24px;
          font-weight: 700;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid #e2e8f0;
        }

        .stat-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .stat-label {
          color: #64748b;
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .recent-activity-panel {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 1.1rem;
          color: #1e293b;
          font-weight: 600;
        }

        .view-all-link {
          color: #0257d0;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
        }
        
        .view-all-link:hover { text-decoration: underline; }

        .panel-body {
          padding: 0;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          text-align: left;
          padding: 12px 24px;
          background: #f8fafc;
          color: #475569;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 0.95rem;
        }

        .empty-state {
          padding: 32px;
          text-align: center;
          color: #64748b;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 300px;
          color: #64748b;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
