"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminVideosPage() {
  return (
    <AdminContentManager
      title="Academy Videos"
      description="Manage the 'Get to know Success Code Academy' videos displayed on the homepage."
      itemName="Video"
      resource="videos"
      uploadType="video"
      historyType="video"
      columns={[
        { label: "Thumbnail", key: "image", kind: "image" },
        { label: "Title", key: "title", kind: "text" },
        { label: "Category", key: "category", kind: "text" },
        { label: "Duration", key: "duration", kind: "text" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
      fields={[
        {
          name: "image",
          label: "Video Thumbnail",
          kind: "image",
          required: true,
          full: true,
        },
        {
          name: "category",
          label: "Category",
          kind: "text",
          required: true,
          placeholder: "e.g., Campus Tour",
        },
        {
          name: "title",
          label: "Video Title",
          kind: "text",
          required: true,
          full: true,
        },
        {
          name: "excerpt",
          label: "Description / Excerpt",
          kind: "textarea",
          required: true,
          full: true,
        },
        {
          name: "date",
          label: "Date",
          kind: "text",
          required: true,
          placeholder: "e.g., June 15, 2026",
        },
        {
          name: "duration",
          label: "Duration",
          kind: "text",
          required: true,
          placeholder: "e.g., 4:02",
        },
        {
          name: "videoUrl",
          label: "Video URL",
          kind: "url",
          required: true,
          full: true,
          help: "URL to the video file (.mp4) or YouTube embed URL.",
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
