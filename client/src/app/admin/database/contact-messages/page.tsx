"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";

export default function AdminContactMessagesPage() {
  return (
    <AdminLeadTable
      title="Contact messages"
      description="Read enquiries submitted through the contact page and use the supplied phone or email to follow up."
      endpoint="database/contact-messages"
      searchPlaceholder="Search name, email, phone, or message"
      exportName="contact-messages"
      columns={[
        {
          key: "name",
          label: "Contact",
          render: (row) => (
            <>
              <span className="admin-table-title">
                {String(row.name || "Unnamed contact")}
              </span>
              <span className="admin-table-subtitle">
                {String(row.email || "No email provided")}
              </span>
            </>
          ),
        },
        { key: "phone", label: "Phone" },
        {
          key: "message",
          label: "Message",
          render: (row) => (
            <span title={String(row.message || "")}>
              {String(row.message || "—").slice(0, 120)}
              {String(row.message || "").length > 120 ? "…" : ""}
            </span>
          ),
        },
        { key: "createdAt", label: "Submitted" },
      ]}
    />
  );
}
