"use client";

import React, { useEffect, useState } from "react";
import { 
  FaUserGraduate, 
  FaWpforms, 
  FaFileSignature, 
  FaBookOpen, 
  FaTrophy, 
  FaUsers, 
  FaEye, 
  FaClipboardList, 
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaPlus,
  FaHistory,
  FaArrowUp,
  FaRegCheckCircle
} from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 12,
    totalResults: 48,
    totalStudents: 1240,
    totalAdmissions: 310,
    totalScholarships: 850,
    websiteVisitors: "45.2K",
    formEnquiries: 194,
    activeBatches: 18,
    upcomingExams: 4,
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
        if (data.status === 'success' && data.data) {
          setStats(prev => ({
            ...prev,
            totalStudents: data.data.totalStudents || prev.totalStudents,
            totalAdmissions: data.data.totalCourseForms || prev.totalAdmissions,
            totalScholarships: data.data.totalScholarshipForms || prev.totalScholarships,
            recentStudents: data.data.recentStudents || [],
          }));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpiCards = [
    { label: "Total Courses", value: stats.totalCourses, trend: "+2 this month", icon: <FaBookOpen />, color: "#0257d0", bg: "#eff6ff" },
    { label: "Total Results / Rankers", value: stats.totalResults, trend: "+14 NEET 2025", icon: <FaTrophy />, color: "#d97706", bg: "#fffbeb" },
    { label: "Registered Students", value: stats.totalStudents, trend: "+18% growth", icon: <FaUserGraduate />, color: "#059669", bg: "#ecfdf5" },
    { label: "Total Admissions", value: stats.totalAdmissions, trend: "32 pending review", icon: <FaWpforms />, color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Scholarship Apps", value: stats.totalScholarships, trend: "Exam July 28", icon: <FaFileSignature />, color: "#2563eb", bg: "#eff6ff" },
    { label: "Website Visitors", value: stats.websiteVisitors, trend: "+24% live traffic", icon: <FaEye />, color: "#0891b2", bg: "#ecfeff" },
    { label: "Form Enquiries", value: stats.formEnquiries, trend: "12 unassigned", icon: <FaClipboardList />, color: "#dc2626", bg: "#fef2f2" },
    { label: "Active Batches", value: stats.activeBatches, trend: "Classroom + Hybrid", icon: <FaChalkboardTeacher />, color: "#4f46e5", bg: "#eef2ff" },
    { label: "Upcoming Exams", value: stats.upcomingExams, trend: "Next: NST 2026", icon: <FaCalendarAlt />, color: "#db2777", bg: "#fdf2f8" },
  ];

  const recentActivities = [
    { action: "Published New Hero Banner", detail: "NEET 2027 Medical Admissions", user: "Admin", time: "10 mins ago" },
    { action: "Added Topper Achievement", detail: "Samruddhi Lokhande (AIR 1204)", user: "Admin", time: "42 mins ago" },
    { action: "New Scholarship Registration", detail: "Rohan Deshmukh enrolled for NST 2026", user: "System", time: "1 hour ago" },
    { action: "Course Information Updated", detail: "Repeater Achievers Batch timing changed", user: "Admin", time: "3 hours ago" },
    { action: "Course Enquiry Submitted", detail: "Callback request from +91 98230 41220", user: "Lead CRM", time: "5 hours ago" },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Banner Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">CMS Command Center & Analytics</h1>
          <p className="page-subtitle">Real-time stats, website performance metrics, activity logs, and quick actions.</p>
        </div>
        <div className="quick-actions-row">
          <Link href="/admin/home" className="btn-primary">
            <FaPlus /> <span>New Banner</span>
          </Link>
          <Link href="/admin/results" className="btn-secondary">
            <FaTrophy /> <span>Add Result</span>
          </Link>
          <Link href="/admin/courses" className="btn-secondary">
            <FaBookOpen /> <span>Manage Courses</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {kpiCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            className="kpi-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <div className="kpi-top">
              <div className="kpi-icon-box" style={{ backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <span className="kpi-trend"><FaArrowUp className="ic" /> {card.trend}</span>
            </div>
            <div className="kpi-body">
              <h2 className="kpi-val">{card.value}</h2>
              <p className="kpi-lbl">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts & Visual Trends */}
      <div className="charts-grid">
        {/* Admissions & Registration Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Admissions & Registration Trend</h3>
              <p className="chart-desc">Monthly growth in student course enrolments & scholarship registrations.</p>
            </div>
            <div className="chart-legend">
              <span className="lg-item admissions"><span className="dot"></span> Admissions</span>
              <span className="lg-item scholarships"><span className="dot"></span> Scholarships</span>
            </div>
          </div>
          <div className="chart-visual">
            <svg viewBox="0 0 500 150" className="trend-svg">
              <path d="M 0 120 Q 80 80, 160 90 T 320 40 T 500 20" fill="none" stroke="#0257d0" strokeWidth="4" />
              <path d="M 0 135 Q 80 110, 160 100 T 320 70 T 500 45" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="4 4" />
              <circle cx="160" cy="90" r="5" fill="#0257d0" />
              <circle cx="320" cy="40" r="5" fill="#0257d0" />
              <circle cx="500" cy="20" r="5" fill="#0257d0" />
            </svg>
            <div className="chart-months">
              <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul (Current)</span>
            </div>
          </div>
        </div>

        {/* Website Traffic & Lead Performance Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Website Visits & Enquiries</h3>
              <p className="chart-desc">Weekly traffic volume and form conversion metrics.</p>
            </div>
          </div>
          <div className="traffic-bars">
            {[
              { day: "Mon", visits: 85, enquiries: 24 },
              { day: "Tue", visits: 92, enquiries: 31 },
              { day: "Wed", visits: 78, enquiries: 18 },
              { day: "Thu", visits: 110, enquiries: 42 },
              { day: "Fri", visits: 95, enquiries: 29 },
              { day: "Sat", visits: 130, enquiries: 56 },
              { day: "Sun", visits: 145, enquiries: 64 },
            ].map((d, i) => (
              <div key={i} className="bar-group">
                <div className="bar-stack">
                  <div className="bar visits" style={{ height: `${d.visits}%` }} title={`${d.visits * 100} Visits`}></div>
                  <div className="bar enquiries" style={{ height: `${d.enquiries}%` }} title={`${d.enquiries} Enquiries`}></div>
                </div>
                <span className="bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Log & Recent Enrolments Split Section */}
      <div className="split-grid">
        {/* Recent Audit Activity Feed */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <FaHistory className="ic" />
              <h3>Recent CMS Activity Log</h3>
            </div>
            <Link href="/admin/audit" className="view-link">View Full Audit Log</Link>
          </div>
          <div className="activity-list">
            {recentActivities.map((act, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon"><FaRegCheckCircle /></div>
                <div className="activity-body">
                  <span className="activity-action">{act.action}</span>
                  <span className="activity-detail">{act.detail}</span>
                  <div className="activity-meta">
                    <span>By: {act.user}</span> • <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Student Registrations Table */}
        <div className="panel-card">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <FaUserGraduate className="ic" />
              <h3>Latest Registered Students</h3>
            </div>
            <Link href="/admin/database/students" className="view-link">View All Students</Link>
          </div>
          <div className="table-responsive">
            {stats.recentStudents.length > 0 ? (
              <table className="mini-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Mobile</th>
                    <th>Date Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentStudents.map((s) => (
                    <tr key={s.id}>
                      <td className="font-semibold">{s.firstName} {s.lastName}</td>
                      <td>{s.mobileNumber}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-panel">
                <p>No new student registrations recorded today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styled JSX */}
      <style jsx>{`
        .dashboard-container {
          max-width: 1300px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .page-title {
          font-size: 1.6rem;
          color: #0f172a;
          margin: 0 0 4px 0;
          font-weight: 800;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .quick-actions-row {
          display: flex;
          gap: 10px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0257d0;
          color: #fff;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: #0143a3; }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-secondary:hover { background: #f8fafc; color: #0257d0; border-color: #93c5fd; }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 18px;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: transform 0.2s;
        }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kpi-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
        }

        .kpi-trend {
          font-size: 0.72rem;
          font-weight: 700;
          color: #16a34a;
          background: #f0fdf4;
          padding: 3px 8px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .kpi-trend .ic { font-size: 0.65rem; }

        .kpi-body { display: flex; flex-direction: column; gap: 2px; }
        .kpi-val { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0; }
        .kpi-lbl { font-size: 0.82rem; font-weight: 600; color: #64748b; margin: 0; }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .chart-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .chart-title { font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 2px 0; }
        .chart-desc { font-size: 0.8rem; color: #64748b; margin: 0; }
        .chart-legend { display: flex; gap: 12px; font-size: 0.75rem; font-weight: 600; }
        .lg-item { display: flex; align-items: center; gap: 4px; }
        .lg-item.admissions { color: #0257d0; }
        .lg-item.admissions .dot { width: 8px; height: 8px; border-radius: 50%; background: #0257d0; }
        .lg-item.scholarships { color: #7c3aed; }
        .lg-item.scholarships .dot { width: 8px; height: 8px; border-radius: 50%; background: #7c3aed; }

        .chart-visual { display: flex; flex-direction: column; gap: 10px; }
        .trend-svg { width: 100%; height: 130px; }
        .chart-months { display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

        .traffic-bars { display: flex; justify-content: space-between; align-items: flex-end; height: 130px; padding-top: 10px; }
        .bar-group { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; height: 100%; justify-content: flex-end; }
        .bar-stack { display: flex; gap: 4px; align-items: flex-end; width: 60%; height: 100px; }
        .bar { width: 50%; border-radius: 4px 4px 0 0; transition: height 0.3s; }
        .bar.visits { background: #3b82f6; }
        .bar.enquiries { background: #10b981; }
        .bar-label { font-size: 0.72rem; color: #64748b; font-weight: 600; }

        .split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .panel-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .panel-title-wrap { display: flex; align-items: center; gap: 8px; color: #0257d0; }
        .panel-title-wrap h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; }
        .view-link { font-size: 0.8rem; font-weight: 600; color: #0257d0; text-decoration: none; }

        .activity-list { display: flex; flex-direction: column; gap: 12px; }
        .activity-item { display: flex; gap: 10px; align-items: flex-start; font-size: 0.85rem; }
        .activity-icon { color: #16a34a; font-size: 0.95rem; margin-top: 2px; }
        .activity-body { display: flex; flex-direction: column; gap: 2px; }
        .activity-action { font-weight: 700; color: #0f172a; }
        .activity-detail { color: #475569; }
        .activity-meta { font-size: 0.72rem; color: #94a3b8; }

        .table-responsive { overflow-x: auto; }
        .mini-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .mini-table th { background: #f8fafc; padding: 8px 12px; color: #64748b; font-size: 0.75rem; text-transform: uppercase; }
        .mini-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .empty-panel { padding: 30px; text-align: center; color: #94a3b8; font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
