"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import ScholarshipFormEditorModal from "./ScholarshipFormEditorModal";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { useToast } from "@/components/admin/Toast";

export default function AdminScholarshipFormsPage() {
  const [editingForm, setEditingForm] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleDelete(formRecord: any) {
    try {
      await adminApiFetch(`/api/v1/admin/database/scholarship-forms/${formRecord.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
      toast.success("Scholarship form deleted.");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete scholarship form");
    }
  }

  return (
    <>
    <AdminLeadTable
      key={refreshKey}
      title="Scholarship forms"
      description="Review scholarship registrations with the student, parent, school, city, and preferred course details together."
      endpoint="database/scholarship-forms"
      searchPlaceholder="Search student, phone, school, city, or course"
      exportName="scholarship-forms"
      filters={[{ key: "course", label: "Course" }, { key: "program", label: "Program" }, { key: "class", label: "Class" }, { key: "city", label: "City" }, { key: "school", label: "School" }, { key: "dateFrom", label: "From", type: "date" }, { key: "dateTo", label: "To", type: "date" }]}
      columns={[
        {
          key: "studentName",
          label: "Student",
          render: (row) => (
            <>
              <span className="admin-table-title">
                {String(row.studentName || "Unnamed student")}
              </span>
              <span className="admin-table-subtitle">
                Class {String(row.studentClass || "—")}
              </span>
              {row.studentEmail && <span className="admin-table-subtitle">{String(row.studentEmail)}</span>}
            </>
          ),
        },
        { key: "studentPhone", label: "Student phone" },
        { key: "preferredCourse", label: "Preferred course" },
        { key: "scholarshipProgram", label: "Program" },
        { key: "createdAt", label: "Submitted", sortable: true },
      ]}
      onAdd={() => setEditingForm({})}
      onEdit={setEditingForm}
      onDelete={handleDelete}
      supplementalFields={[
        { key: "studentPhone", label: "Student phone", isPhone: true },
        { key: "studentEmail", label: "Student email", isEmail: true, fullWidth: true },
        { key: "parentPhone", label: "Parent phone", isPhone: true },
        { key: "studentClass", label: "Student class" },
        { key: "schoolName", label: "School name", fullWidth: true },
        { key: "city", label: "City" },
        { key: "preferredCourse", label: "Preferred course", fullWidth: true },
        { key: "scholarshipProgram", label: "Scholarship program", fullWidth: true },
        { key: "createdAt", label: "Created" },
        { key: "updatedAt", label: "Updated" },
      ]}
    />
    <ScholarshipFormEditorModal
      open={!!editingForm}
      onClose={() => setEditingForm(null)}
      formRecord={editingForm}
      onSaved={() => setRefreshKey(prev => prev + 1)}
    />
    </>
  );
}
