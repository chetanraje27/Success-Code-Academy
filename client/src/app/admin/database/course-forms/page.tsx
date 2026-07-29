"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import CourseFormEditorModal from "./CourseFormEditorModal";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";

export default function AdminCourseFormsPage() {
  const [editingForm, setEditingForm] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(formRecord: any) {
    try {
      await adminApiFetch(`/api/v1/admin/database/course-forms/${formRecord.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
    } catch (e: any) {
      alert(e.message || "Failed to delete course form");
    }
  }

  return (
    <>
    <AdminLeadTable
      key={refreshKey}
      title="Course enquiries"
      description="Review students who requested a course visit and follow up using their selected date and time."
      endpoint="database/course-forms"
      searchPlaceholder="Search student, course, email, or phone"
      exportName="course-enquiries"
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
                {String(row.studentEmail || "No email provided")}
              </span>
            </>
          ),
        },
        { key: "studentPhone", label: "Phone" },
        { key: "courseTitle", label: "Course" },
        { key: "visitingDate", label: "Visit date" },
        { key: "visitingTime", label: "Visit time" },
        { key: "createdAt", label: "Submitted" },
      ]}
      onAdd={() => setEditingForm({})}
      onEdit={setEditingForm}
      onDelete={handleDelete}
    />
    <CourseFormEditorModal
      open={!!editingForm}
      onClose={() => setEditingForm(null)}
      formRecord={editingForm}
      onSaved={() => setRefreshKey(prev => prev + 1)}
    />
    </>
  );
}
