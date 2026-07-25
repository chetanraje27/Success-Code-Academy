import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminNotificationsPage() {
  return (
    <AdminContentManager
      title="Announcements"
      description="Create the short notices shown near the top of the home page. Keep each message focused on one action or deadline."
      itemName="Announcement"
      resource="notifications"
      fields={[
        {
          name: "text",
          label: "Announcement text",
          kind: "textarea",
          required: true,
          full: true,
          placeholder: "Admissions open for the 2026–27 NEET batches.",
          help: "Maximum 280 characters.",
        },
        {
          name: "link",
          label: "Optional link",
          kind: "url",
          full: true,
          placeholder: "/admissions",
          help: "Use a website path such as /admissions or a full HTTPS URL.",
        },
        {
          name: "orderIndex",
          label: "Display order",
          kind: "number",
          defaultValue: 0,
          min: 0,
        },
        {
          name: "isActive",
          label: "Visible on the website",
          kind: "checkbox",
          defaultValue: true,
          help: "Turn this off to save the message without publishing it.",
        },
      ]}
      columns={[
        { label: "Announcement", key: "text" },
        { label: "Link", key: "link" },
        { label: "Order", key: "orderIndex" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
    />
  );
}
