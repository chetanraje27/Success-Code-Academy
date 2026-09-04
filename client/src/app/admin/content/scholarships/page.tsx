"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import ScholarshipProgramEditor from "./ScholarshipProgramEditor";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { useToast } from "@/components/admin/Toast";

export default function AdminScholarshipProgramsPage() {
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleDelete(program: any) {
    try {
      await adminApiFetch(`/api/v1/admin/scholarship-programs/${program.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
      toast.success("Scholarship program deleted.");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete scholarship program");
    }
  }

  return (
    <>
      <AdminLeadTable
        key={refreshKey}
        title="Scholarship Programs"
        description="Manage scholarship programs available to students on the registration form. Toggle programs on or off as needed."
        endpoint="scholarship-programs"
        searchPlaceholder="Search programs..."
        exportName="scholarship-programs"
        filters={[{ key: "isActive", label: "Status", options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }] }]}
        columns={[
          {
            key: "title",
            label: "Program",
            render: (row: any) => (
              <span className="admin-table-title">{row.title}</span>
            ),
          },
          { key: "description", label: "Description", sortable: true },
          {
            key: "isActive",
            label: "Status",
            render: (row: any) => (
              <span className={`admin-status ${row.isActive ? "" : "danger"}`}>
                {row.isActive ? "Active" : "Inactive"}
              </span>
            ),
          },
        ]}
        onAdd={() => setEditingProgram({})}
        onEdit={setEditingProgram}
        onDelete={handleDelete}
      />

      <ScholarshipProgramEditor
        open={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        program={editingProgram}
        onSaved={() => setRefreshKey(prev => prev + 1)}
      />
    </>
  );
}
