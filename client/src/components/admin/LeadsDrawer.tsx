"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useEditMode } from "./EditModeContext";
import { FaXmark, FaMagnifyingGlass } from "react-icons/fa6";

export default function LeadsDrawer() {
  const { leadsOpen, setLeadsOpen } = useEditMode();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "courses" | "scholarships" | "messages">("users");
  
  const [data, setData] = useState<any>({
    users: [],
    courseForms: [],
    scholarshipForms: [],
    contactMessages: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (leadsOpen) {
      loadData();
    }
  }, [leadsOpen, debouncedSearch]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const qs = debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await apiFetch(`/api/v1/admin/leads${qs}`, { auth: true });
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || "Failed to load leads data");
      }
    } catch (e: any) {
      setError(e.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  }

  if (!leadsOpen) return null;

  const tabs = [
    { id: "users", label: `Users (${data.users?.length || 0})` },
    { id: "courses", label: `Courses (${data.courseForms?.length || 0})` },
    { id: "scholarships", label: `Scholarships (${data.scholarshipForms?.length || 0})` },
    { id: "messages", label: `Messages (${data.contactMessages?.length || 0})` }
  ];

  return (
    <>
      <div 
        className="leads-backdrop"
        onClick={() => setLeadsOpen(false)}
      />
      <div className="leads-drawer">
        <div className="leads-header">
          <h2>Leads & Data</h2>
          <button className="close-btn" onClick={() => setLeadsOpen(false)}>
            <FaXmark />
          </button>
        </div>

        <div className="leads-search">
          <FaMagnifyingGlass className="search-icon" />
          <input 
            type="text" 
            placeholder="Search leads..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="leads-tabs">
          {tabs.map(t => (
            <button 
              key={t.id} 
              className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id as any)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="leads-content sca-admin-list">
          {loading && <div style={{ padding: 16 }}>Loading...</div>}
          {error && <div className="sca-admin-error" style={{ margin: 16 }}>{error}</div>}
          
          {!loading && !error && (
            <>
              {activeTab === "users" && (
                data.users?.length > 0 ? data.users.map((u: any) => (
                  <div key={u.id} className="sca-admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{u.email} | {u.mobileNumber}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="sca-admin-empty">No users found.</div>
              )}

              {activeTab === "courses" && (
                data.courseForms?.length > 0 ? data.courseForms.map((c: any) => (
                  <div key={c.id} className="sca-admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>{c.studentName}</div>
                    <div style={{ fontSize: 13, color: '#333' }}>Course: {c.courseTitle}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Phone: {c.studentPhone}</div>
                    {c.visitingDate && <div style={{ fontSize: 12, color: '#999' }}>Visiting: {new Date(c.visitingDate).toLocaleDateString()}</div>}
                  </div>
                )) : <div className="sca-admin-empty">No course queries found.</div>
              )}

              {activeTab === "scholarships" && (
                data.scholarshipForms?.length > 0 ? data.scholarshipForms.map((s: any) => (
                  <div key={s.id} className="sca-admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>{s.studentName}</div>
                    <div style={{ fontSize: 13, color: '#333' }}>Course: {s.preferredCourse}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>School: {s.schoolName}, {s.city}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>Phone: {s.studentPhone}</div>
                  </div>
                )) : <div className="sca-admin-empty">No scholarship forms found.</div>
              )}

              {activeTab === "messages" && (
                data.contactMessages?.length > 0 ? data.contactMessages.map((m: any) => (
                  <div key={m.id} className="sca-admin-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>{m.email} | {m.phone}</div>
                    <div style={{ fontSize: 13, marginTop: 4, background: '#f5f5f5', padding: 8, borderRadius: 4, width: '100%' }}>
                      {m.message?.length > 100 ? m.message.substring(0, 100) + "..." : m.message}
                    </div>
                  </div>
                )) : <div className="sca-admin-empty">No contact messages found.</div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .leads-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          z-index: 10039;
        }
        .leads-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 420px;
          background: #fff;
          z-index: 10040;
          box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }
        .leads-header {
          padding: 20px;
          border-bottom: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .leads-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #333;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #666;
          cursor: pointer;
          display: flex;
        }
        .close-btn:hover { color: #000; }
        
        .leads-search {
          padding: 16px 20px;
          border-bottom: 1px solid #eaeaea;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: 32px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        .leads-search input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          outline: none;
        }
        .leads-search input:focus {
          border-color: #0070f3;
        }

        .leads-tabs {
          display: flex;
          border-bottom: 1px solid #eaeaea;
          overflow-x: auto;
        }
        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 12px 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }
        .tab-btn:hover { background: #f9f9f9; }
        .tab-btn.active {
          color: #0070f3;
          border-bottom-color: #0070f3;
        }

        .leads-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #fcfcfc;
        }
      `}</style>
    </>
  );
}
