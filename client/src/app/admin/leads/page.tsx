"use client";

import React, { useState } from "react";
import { 
  FaComments, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaSearch, 
  FaFilter, 
  FaUserCheck, 
  FaTimes, 
  FaDownload,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

interface InquiryLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: "Course Enquiry" | "Scholarship Reg" | "Callback Request" | "General Contact";
  targetCourse?: string;
  message: string;
  status: "New" | "In Progress" | "Resolved" | "Spam";
  assignedTo: string;
  notes: string;
  date: string;
}

export default function AdminLeadsCRMPage() {
  const [leads, setLeads] = useState<InquiryLead[]>([
    {
      id: "1",
      name: "Rajesh Kulkarni",
      phone: "+91 98230 41220",
      email: "rajesh.k@gmail.com",
      type: "Course Enquiry",
      targetCourse: "Class 11 NEET Foundation",
      message: "Interested in classroom coaching fee structure & hostel facility for my son.",
      status: "New",
      assignedTo: "Admission Desk 1",
      notes: "Called once, busy. To callback in evening.",
      date: "2026-07-21"
    },
    {
      id: "2",
      name: "Sneha Deshmukh",
      phone: "+91 94221 88900",
      email: "sneha.d@gmail.com",
      type: "Callback Request",
      message: "Requested urgent callback regarding Repeater Achievers batch schedule.",
      status: "In Progress",
      assignedTo: "Admission Desk 2",
      notes: "Counselled on phone. Sent PDF brochure on WhatsApp.",
      date: "2026-07-20"
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingLead, setEditingLead] = useState<InquiryLead | null>(null);

  const filteredLeads = leads.filter(l => {
    const matchesStatus = selectedStatus === "All" || l.status === selectedStatus;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.phone.includes(searchQuery) ||
                          l.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: any) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleNotesSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
      setEditingLead(null);
    }
  };

  const exportLeadsCSV = () => {
    const headers = ["Name", "Phone", "Email", "Type", "Status", "Assigned To", "Date", "Message"];
    const rows = filteredLeads.map(l => [
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.type}"`,
      `"${l.status}"`,
      `"${l.assignedTo}"`,
      `"${l.date}"`,
      `"${l.message.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inquiry_Leads_Export_${selectedStatus}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="leads-crm-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Contact & Inquiry CRM</h1>
          <p className="cms-subtitle">Track incoming student inquiries, callback requests, assign team members, record call logs, and trigger WhatsApp/Email responses.</p>
        </div>
        <button className="csv-btn" onClick={exportLeadsCSV}><FaDownload /> Export Leads CSV</button>
      </div>

      {/* Toolbar */}
      <div className="filter-toolbar">
        <div className="status-pills">
          {["All", "New", "In Progress", "Resolved", "Spam"].map(st => (
            <button key={st} className={`st-pill ${selectedStatus === st ? 'active' : ''}`} onClick={() => setSelectedStatus(st)}>
              {st === "All" ? "All Leads" : st}
            </button>
          ))}
        </div>

        <div className="search-wrap">
          <FaSearch className="ic" />
          <input type="text" placeholder="Search lead by name, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Leads Table */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Lead Details</th>
              <th>Enquiry Type</th>
              <th>Message / Request</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td><span className="date-tag">{lead.date}</span></td>
                <td>
                  <div className="lead-contact-cell">
                    <span className="name">{lead.name}</span>
                    <span className="phone">{lead.phone}</span>
                    {lead.email && <span className="email">{lead.email}</span>}
                  </div>
                </td>
                <td><span className="type-badge">{lead.type}</span></td>
                <td>
                  <p className="msg-text" title={lead.message}>{lead.message}</p>
                  {lead.notes && <span className="notes-text">Note: {lead.notes}</span>}
                </td>
                <td><span className="assignee">{lead.assignedTo}</span></td>
                <td>
                  <select className={`status-select ${lead.status.toLowerCase().replace(/\s+/g, '-')}`} value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}>
                    <option value="New">🔴 New</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Resolved">🟢 Resolved</option>
                    <option value="Spam">⚫ Spam</option>
                  </select>
                </td>
                <td>
                  <div className="action-row">
                    <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="act-ic wa" title="Chat on WhatsApp">
                      <FaWhatsapp />
                    </a>
                    <a href={`tel:${lead.phone}`} className="act-ic call" title="Call Student">
                      <FaPhoneAlt />
                    </a>
                    <button className="act-ic note" onClick={() => setEditingLead(lead)} title="Edit Notes & Assignee">
                      <FaComments />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Notes Modal */}
      {editingLead && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Lead Follow-up Notes ({editingLead.name})</h2>
              <button className="close-btn" onClick={() => setEditingLead(null)}><FaTimes /></button>
            </div>

            <form onSubmit={handleNotesSave} className="modal-form">
              <div className="form-group">
                <label>Assigned Staff Member</label>
                <input type="text" value={editingLead.assignedTo || ''} onChange={e => setEditingLead({ ...editingLead, assignedTo: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Follow-up Call Log / Notes</label>
                <textarea rows={4} value={editingLead.notes || ''} onChange={e => setEditingLead({ ...editingLead, notes: e.target.value })} placeholder="Record phone call conversation details..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingLead(null)}>Cancel</button>
                <button type="submit" className="save-btn">Save Notes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .leads-crm-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .csv-btn { display: flex; align-items: center; gap: 8px; background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-toolbar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; gap: 16px; }
        .status-pills { display: flex; gap: 6px; }
        .st-pill { border: 1px solid #cbd5e1; background: #ffffff; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .st-pill.active { background: #eff6ff; color: #0257d0; border-color: #0257d0; }

        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 300px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }

        .table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; font-size: 0.78rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }

        .date-tag { font-size: 0.75rem; color: #64748b; font-weight: 600; }
        .lead-contact-cell { display: flex; flex-direction: column; }
        .lead-contact-cell .name { font-weight: 700; color: #0f172a; }
        .lead-contact-cell .phone { font-size: 0.8rem; color: #0257d0; font-weight: 600; }
        .lead-contact-cell .email { font-size: 0.72rem; color: #64748b; }

        .type-badge { background: #eff6ff; color: #0257d0; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
        .msg-text { margin: 0; font-size: 0.82rem; color: #334155; max-width: 300px; }
        .notes-text { font-size: 0.72rem; color: #059669; font-weight: 600; }

        .assignee { font-size: 0.78rem; font-weight: 600; color: #475569; }
        .status-select { border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; outline: none; }

        .action-row { display: flex; gap: 8px; }
        .act-ic { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 6px; border: none; cursor: pointer; text-decoration: none; font-size: 0.85rem; }
        .act-ic.wa { background: #dcfce7; color: #16a34a; }
        .act-ic.call { background: #eff6ff; color: #0257d0; }
        .act-ic.note { background: #f1f5f9; color: #475569; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 520px; overflow: hidden; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
