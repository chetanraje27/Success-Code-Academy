import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminResultsPage() {
  return (
    <AdminContentManager
      title="Results"
      description="Manage the CMS-backed topper results used on the results page. Hidden entries stay saved but are not shown publicly."
      itemName="Result"
      resource="results"
      historyType="result"
      uploadType="result"
      fields={[
        { name: "name", label: "Student name", kind: "text", required: true },
        {
          name: "year",
          label: "Result year",
          kind: "number",
          required: true,
          min: 2000,
          max: 2100,
          defaultValue: new Date().getFullYear(),
        },
        {
          name: "marks",
          label: "Marks (optional)",
          kind: "number",
          defaultValue: "",
          min: 0,
          max: 720,
        },
        { name: "college", label: "College (optional)", kind: "text" },
        { name: "city", label: "City (optional)", kind: "text" },
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
        { label: "Student", key: "name", sortable: true },
        { label: "Year", key: "year", sortable: true },
        { label: "Marks", key: "marks" },
        { label: "College", key: "college" },
        { label: "Status", key: "isActive", kind: "status", sortable: true },
      ]}
    />
  );
}
