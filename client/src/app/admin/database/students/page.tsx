"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import StudentEditorModal from "./StudentEditorModal";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { useToast } from "@/components/admin/Toast";

export default function AdminStudentsPage() {
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleDelete(student: any) {
    try {
      await adminApiFetch(`/api/v1/admin/database/users/${student.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete student");
    }
  }

  return (
    <>
    <AdminLeadTable
      key={refreshKey}
      title="Student accounts"
      description="View and manage registered student profiles. Students sign in with their mobile number and a one-time code, so no password is stored for them."
      endpoint="database/users"
      searchPlaceholder="Search name, email, or mobile number"
      exportName="student-accounts"
      columns={[
        {
          key: "firstName",
          label: "Student",
          render: (row) => (
            <>
              <span className="admin-table-title">
                {[row.firstName, row.lastName].filter(Boolean).join(" ") ||
                  "Unnamed student"}
              </span>
              <span className="admin-table-subtitle">
                {String(row.email || "No email provided")}
              </span>
            </>
          ),
        },
        { key: "mobileNumber", label: "Mobile", sortable: true },
        { key: "age", label: "Age", sortable: true },
        { key: "createdAt", label: "Registered", sortable: true },
      ]}
      onAdd={() => setEditingStudent({})}
      onEdit={setEditingStudent}
      onDelete={handleDelete}
    />
    <StudentEditorModal
      open={!!editingStudent}
      onClose={() => setEditingStudent(null)}
      student={editingStudent}
      onSaved={() => setRefreshKey(prev => prev + 1)}
    />
    </>
  );
}
