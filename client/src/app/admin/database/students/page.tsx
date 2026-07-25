"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";

export default function AdminStudentsPage() {
  return (
    <AdminLeadTable
      title="Student accounts"
      description="View registered student profiles. Password and authentication data are never exposed in this table."
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
        { key: "mobileNumber", label: "Mobile" },
        { key: "age", label: "Age" },
        { key: "createdAt", label: "Registered" },
      ]}
    />
  );
}
