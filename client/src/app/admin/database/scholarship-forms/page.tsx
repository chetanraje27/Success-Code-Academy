"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";

export default function AdminScholarshipFormsPage() {
  return (
    <AdminLeadTable
      title="Scholarship forms"
      description="Review scholarship registrations with the student, parent, school, city, and preferred course details together."
      endpoint="database/scholarship-forms"
      searchPlaceholder="Search student, phone, school, city, or course"
      exportName="scholarship-forms"
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
            </>
          ),
        },
        { key: "studentPhone", label: "Student phone" },
        { key: "parentPhone", label: "Parent phone" },
        { key: "schoolName", label: "School" },
        { key: "city", label: "City" },
        { key: "preferredCourse", label: "Preferred course" },
        { key: "createdAt", label: "Submitted" },
      ]}
    />
  );
}
