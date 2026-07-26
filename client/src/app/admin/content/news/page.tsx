"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminNewsPage() {
  return (
    <AdminContentManager
      title="News Articles"
      description="Manage the 'Success Code Achievers in the News' articles displayed on the homepage."
      itemName="Article"
      resource="news"
      uploadType="news"
      historyType="news"
      columns={[
        { label: "Image", key: "image", kind: "image" },
        { label: "Title", key: "title", kind: "text" },
        { label: "Category", key: "category", kind: "text" },
        { label: "Date", key: "date", kind: "text" },
        { label: "Author", key: "author", kind: "text" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
      fields={[
        {
          name: "image",
          label: "Article Image",
          kind: "image",
          required: true,
          full: true,
        },
        {
          name: "category",
          label: "Category",
          kind: "text",
          required: true,
          placeholder: "e.g., TOI Feature",
        },
        {
          name: "title",
          label: "Full Title",
          kind: "textarea",
          required: true,
          full: true,
        },
        {
          name: "shortTitle",
          label: "Short Title (Mobile)",
          kind: "text",
          required: false,
          help: "Shorter title for mobile screens.",
        },
        {
          name: "excerpt",
          label: "Excerpt",
          kind: "textarea",
          required: true,
          full: true,
        },
        {
          name: "date",
          label: "Date",
          kind: "text",
          required: true,
          placeholder: "e.g., 18 JUL 2026",
        },
        {
          name: "author",
          label: "Author",
          kind: "text",
          required: true,
          placeholder: "e.g., TOI DESK",
        },
        {
          name: "readTime",
          label: "Read Time",
          kind: "text",
          required: true,
          placeholder: "e.g., 4 min read",
        },
        {
          name: "slug",
          label: "Slug",
          kind: "text",
          required: true,
          help: "URL friendly name (e.g., shravani-kudale-toi-feature)",
        },
        {
          name: "externalUrl",
          label: "External URL (Optional)",
          kind: "url",
          required: false,
          full: true,
          help: "Link to the external news article. If provided, the card will link here instead of the internal blog page.",
        },
        {
          name: "orderIndex",
          label: "Display Order",
          kind: "number",
          defaultValue: 0,
          help: "Lower numbers appear first.",
        },
        {
          name: "isActive",
          label: "Active (Visible on website)",
          kind: "checkbox",
          defaultValue: true,
        },
      ]}
    />
  );
}
