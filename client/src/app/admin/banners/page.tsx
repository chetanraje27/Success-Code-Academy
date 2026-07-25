import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminBannersPage() {
  return (
    <AdminContentManager
      title="Banners"
      description="Manage the large images shown on the home and results pages. Use short, meaningful alternative text for accessibility."
      itemName="Banner"
      resource="banners"
      uploadType="banner"
      fields={[
        {
          name: "type",
          label: "Shown on",
          kind: "select",
          defaultValue: "HOME",
          required: true,
          options: [
            { label: "Home page", value: "HOME" },
            { label: "Results page", value: "RESULTS" },
          ],
        },
        {
          name: "orderIndex",
          label: "Display order",
          kind: "number",
          defaultValue: 0,
          min: 0,
          help: "Lower numbers appear first.",
        },
        {
          name: "altText",
          label: "Image description",
          kind: "text",
          required: true,
          full: true,
          placeholder: "Example: NEET 2026 achievers",
          help: "Describe what the image communicates in one short sentence.",
        },
        {
          name: "targetUrl",
          label: "Click destination (optional)",
          kind: "url",
          full: true,
          placeholder: "/courses or https://example.com",
        },
        {
          name: "image",
          label: "Banner image",
          kind: "image",
          required: true,
          full: true,
          help: "JPG, PNG, WebP, or GIF. Maximum file size: 5 MB.",
        },
        {
          name: "isActive",
          label: "Visible on the website",
          kind: "checkbox",
          defaultValue: true,
          full: true,
          help: "Turn this off to keep the banner saved without publishing it.",
        },
      ]}
      columns={[
        { label: "Preview", key: "image", kind: "image" },
        { label: "Description", key: "altText" },
        { label: "Page", key: "type" },
        { label: "Order", key: "orderIndex" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
    />
  );
}
