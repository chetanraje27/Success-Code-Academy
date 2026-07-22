"use client";

import React, { useState } from "react";
import { 
  FaHistory, 
  FaUndo, 
  FaUser, 
  FaSearch, 
  FaCheckCircle, 
  FaExclamationTriangle 
} from "react-icons/fa";

interface AuditLogEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([
    {
      id: "1",
      user: "Super Admin (9699062427)",
      role: "Super Admin",
      action: "UPDATED_HERO_BANNER",
      module: "Home Page CMS",
      oldValue: "NEET 2026 Admissions Open",
      newValue: "NEET 2027 Medical Admissions Open",
      timestamp: "Today, 11:45:20 AM",
      ipAddress: "103.21.24.12"
    },
    {
      id: "2",
      user: "Super Admin (9699062427)",
      role: "Super Admin",
      action: "CREATED_RESULT_ENTRY",
      module: "Results CMS",
      newValue: "Added Samruddhi Lokhande (AIR 1204)",
      timestamp: "Today, 10:20:15 AM",
      ipAddress: "103.21.24.12"
    },
    {
      id: "3",
      user: "Admission Desk 1",
      role: "Admission Team",
      action: "UPDATED_LEAD_STATUS",
      module: "Contact CRM",
      oldValue: "New",
      newValue: "In Progress",
      timestamp: "Yesterday, 04:15 PM",
      ipAddress: "103.21.24.18"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filtered = logs.filter(l => 
    l.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="audit-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Audit Activity & History Log</h1>
          <p className="cms-subtitle">Track every change across the CMS: who edited what, exact old vs new values, timestamps, and rollback capability.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <FaSearch className="ic" />
          <input type="text" placeholder="Search user, action, or module..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <span className="count-badge">Total Audit Entries: {filtered.length}</span>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Timestamp & IP</th>
              <th>User & Role</th>
              <th>Action Type</th>
              <th>Target Module</th>
              <th>Old Value vs New Value</th>
              <th>Rollback</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td>
                  <div className="time-cell">
                    <span className="time">{l.timestamp}</span>
                    <span className="ip">{l.ipAddress}</span>
                  </div>
                </td>
                <td>
                  <div className="user-cell">
                    <span className="user">{l.user}</span>
                    <span className="role">{l.role}</span>
                  </div>
                </td>
                <td><span className="action-tag">{l.action}</span></td>
                <td><span className="module-tag">{l.module}</span></td>
                <td>
                  <div className="diff-box">
                    {l.oldValue && <span className="old-val">OLD: {l.oldValue}</span>}
                    {l.newValue && <span className="new-val">NEW: {l.newValue}</span>}
                  </div>
                </td>
                <td>
                  <button className="rollback-btn" onClick={() => alert("Reverting to previous value...")}>
                    <FaUndo /> Rollback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .audit-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .filter-bar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; }
        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 320px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }
        .count-badge { font-size: 0.82rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }

        .table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; font-size: 0.78rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }

        .time-cell { display: flex; flex-direction: column; }
        .time-cell .time { font-weight: 700; color: #0f172a; }
        .time-cell .ip { font-size: 0.72rem; color: #64748b; }

        .user-cell { display: flex; flex-direction: column; }
        .user-cell .user { font-weight: 700; color: #0f172a; }
        .user-cell .role { font-size: 0.72rem; color: #0257d0; font-weight: 600; }

        .action-tag { background: #eff6ff; color: #0257d0; font-size: 0.72rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        .module-tag { font-weight: 700; color: #475569; font-size: 0.8rem; }

        .diff-box { display: flex; flex-direction: column; gap: 2px; font-size: 0.75rem; }
        .old-val { color: #dc2626; text-decoration: line-through; }
        .new-val { color: #16a34a; font-weight: 700; }

        .rollback-btn { display: flex; align-items: center; gap: 4px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; padding: 5px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .rollback-btn:hover { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }
      `}</style>
    </div>
  );
}
