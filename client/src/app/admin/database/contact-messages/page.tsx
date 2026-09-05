"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import ContactMessageEditorModal from "./ContactMessageEditorModal";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { useToast } from "@/components/admin/Toast";

export default function AdminContactMessagesPage() {
  const [editingMessage, setEditingMessage] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleDelete(messageRecord: any) {
    try {
      await adminApiFetch(`/api/v1/admin/database/contact-messages/${messageRecord.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
      toast.success("Contact message deleted.");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete contact message");
    }
  }

  return (
    <>
    <AdminLeadTable
      key={refreshKey}
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
          render: (row) => {
            // Compact preview only — the full text lives in the detail
            // drawer's message card and the cell tooltip.
            const text = String(row.message || "—");
            return (
              <span className="admin-table-message" title={text}>
                {text.slice(0, 60)}
                {text.length > 60 ? "…" : ""}
              </span>
            );
          },
        },
        { key: "createdAt", label: "Submitted", sortable: true },
      ]}
      onAdd={() => setEditingMessage({})}
      onEdit={setEditingMessage}
      onDelete={handleDelete}
    />
    <ContactMessageEditorModal
      open={!!editingMessage}
      onClose={() => setEditingMessage(null)}
      messageRecord={editingMessage}
      onSaved={() => setRefreshKey(prev => prev + 1)}
    />
    </>
  );
}
