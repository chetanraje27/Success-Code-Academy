import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminStarsPage() {
  return (
    <AdminContentManager
      title="Star students"
      description="Maintain the student achievement cards shown on the home page. Enter results exactly as they should appear publicly."
      itemName="Star student"
      resource="stars"
      historyType="star"
      uploadType="star"
      fields={[
        { name: "name", label: "Student name", kind: "text", required: true },
        { name: "year", label: "Exam year", kind: "text", required: true },
        { name: "score", label: "Score", kind: "text", required: true },
        { name: "rank", label: "Rank", kind: "text", required: true },
        {
          name: "course",
          label: "Course / batch",
          kind: "text",
          required: true,
          full: true,
        },
        {
          name: "colorHex",
          label: "Card accent colour",
          kind: "color",
          defaultValue: "#2c3e7a",
        },
        {
          name: "orderIndex",
          label: "Display order",
          kind: "number",
          defaultValue: 0,
          min: 0,
        },
        {
          name: "image",
          label: "Student photo",
          kind: "image",
          required: true,
          full: true,
          help: "Use a clear portrait. JPG, PNG, WebP, or GIF; maximum 5 MB.",
        },
        {
          name: "isActive",
          label: "Visible on the website",
          kind: "checkbox",
          defaultValue: true,
          full: true,
        },
      ]}
      columns={[
        {
          label: "Photo",
          key: "image",
          kind: "image",
          roundImage: true,
        },
        { label: "Student", key: "name" },
        { label: "Score", key: "score" },
        { label: "Rank", key: "rank" },
        { label: "Year", key: "year" },
        { label: "Status", key: "isActive", kind: "status" },
      ]}
    />
  );
}
