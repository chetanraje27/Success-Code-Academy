"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";

export default function AdminCourseFormsPage() {
  return (
    <AdminLeadTable
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
    />
  );
}
