"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import AdministratorEditorModal from "./AdministratorEditorModal";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { adminRoleLabel } from "@/lib/roles";

export default function AdminAdministratorsPage() {
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");

  async function handleDelete(admin: any) {
    const label = admin.name || admin.email || "this administrator";
    if (
      !window.confirm(
        `Remove ${label}? They will lose access to the admin dashboard immediately.`,
      )
    ) {
      return;
    }
    setError("");
    try {
      await adminApiFetch(`/api/v1/admin/database/admins/${admin.id}`, {
        method: "DELETE",
      });
      setRefreshKey((prev) => prev + 1);
    } catch (e: any) {
      setError(e.message || "Failed to remove administrator");
    }
  }

  return (
    <>
      {error && (
        <div className="sca-admin-error" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}
      <AdminLeadTable
        key={refreshKey}
        eyebrow="Access & security"
        title="Administrators"
        description="Accounts that can sign in to this dashboard. Passwords are never shown or typed here — send a reset link instead."
        endpoint="database/admins"
        searchPlaceholder="Search name, email, or mobile number"
        exportName="administrators"
        columns={[
          {
            key: "name",
            label: "Administrator",
            render: (row) => (
              <>
                <span className="admin-table-title">
                  {String(row.name || "Unnamed administrator")}
                </span>
                <span className="admin-table-subtitle">
                  {String(row.email || "No email provided")}
                </span>
              </>
            ),
          },
          { key: "mobileNumber", label: "Mobile" },
          {
            key: "role",
            label: "Access level",
            render: (row) => (
              <span className="admin-status">{adminRoleLabel(row.role)}</span>
            ),
          },
          { key: "createdAt", label: "Added" },
        ]}
        onAdd={() => setEditingAdmin({})}
        onEdit={setEditingAdmin}
        onDelete={handleDelete}
      />
      <AdministratorEditorModal
        open={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        admin={editingAdmin}
        onSaved={() => setRefreshKey((prev) => prev + 1)}
      />
    </>
  );
}
