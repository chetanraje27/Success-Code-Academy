"use client";

import React, { useState } from "react";
import { 
  FaUserShield, 
  FaPlus, 
  FaUserCheck, 
  FaLock, 
  FaEdit, 
  FaTrash, 
  FaSearch 
} from "react-icons/fa";

interface UserRoleItem {
  id: string;
  name: string;
  mobile: string;
  role: "Super Admin" | "Content Manager" | "Admission Team" | "Read Only";
  status: "Active" | "Inactive";
  permissions: string[];
}

export default function AdminRolesPage() {
  const [users, setUsers] = useState<UserRoleItem[]>([
    { id: "1", name: "Super Administrator", mobile: "9699062427", role: "Super Admin", status: "Active", permissions: ["Full System Access", "Publish Content", "Manage Database", "Export Leads"] },
    { id: "2", name: "Admission Desk 1", mobile: "9823011223", role: "Admission Team", status: "Active", permissions: ["View & Process Leads", "Export Applicants"] },
    { id: "3", name: "Marketing Editor", mobile: "9422100998", role: "Content Manager", status: "Active", permissions: ["Edit Homepage Banners", "Update Courses", "Upload Videos"] }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="roles-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">User Roles & Access Permissions</h1>
          <p className="cms-subtitle">Grant role-based access for Super Admin, Content Managers, Admission Desk Teams, and Read Only staff.</p>
        </div>
        <button className="add-btn" onClick={() => alert("To invite new staff member, enter mobile number & assign role.")}>
          <FaPlus /> Add Staff Account
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Mobile Number</th>
              <th>Assigned Role</th>
              <th>Permissions Granted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong className="name">{u.name}</strong></td>
                <td>{u.mobile}</td>
                <td><span className="role-pill">{u.role}</span></td>
                <td>
                  <div className="perm-chips">
                    {u.permissions.map((p, i) => <span key={i} className="chip">{p}</span>)}
                  </div>
                </td>
                <td><span className="status-badge active">{u.status}</span></td>
                <td>
                  <button className="icon-btn edit" title="Edit Permissions"><FaEdit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .roles-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; font-size: 0.78rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }

        .name { font-weight: 700; color: #0f172a; }
        .role-pill { background: #eff6ff; color: #0257d0; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
        .perm-chips { display: flex; gap: 4px; flex-wrap: wrap; }
        .chip { background: #f1f5f9; color: #475569; font-size: 0.7rem; font-weight: 600; padding: 2px 6px; border-radius: 4px; }
        .status-badge.active { background: #dcfce7; color: #15803d; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        .icon-btn { border: none; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; cursor: pointer; color: #475569; }
      `}</style>
    </div>
  );
}
