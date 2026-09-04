"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import CourseEditor from "@/components/admin/CourseEditor";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";
import { useToast } from "@/components/admin/Toast";

export default function AdminCoursesPage() {
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  async function handleDelete(course: any) {
    try {
      await adminApiFetch(`/api/v1/admin/courses/${course.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete course");
    }
  }

  return (
    <>
      <AdminLeadTable
        key={refreshKey}
        title="Course Catalog"
        description="Manage the dynamic courses displayed on your website."
        endpoint="courses"
        searchPlaceholder="Search courses..."
        exportName="course-catalog"
        columns={[
          {
            key: "title",
            label: "Course",
            render: (row: any) => (
              <>
                <span className="admin-table-title">{row.title}</span>
                <span className="admin-table-subtitle">/{row.slug}</span>
              </>
            ),
          },
          { key: "category", label: "Category", sortable: true, render: (row: any) => <span style={{textTransform: 'capitalize'}}>{row.category.replace('-', ' ')}</span> },
          { key: "type", label: "Type", sortable: true },
          { key: "isActive", label: "Status", render: (row: any) => (
              <span className={`admin-status ${row.isActive ? "" : "danger"}`}>
                {row.isActive ? "Active" : "Inactive"}
              </span>
            )
          }
        ]}
        onAdd={() => setEditingCourse({})} // empty object triggers isNew
        onEdit={setEditingCourse}
        onDelete={handleDelete}
      />
      
      <CourseEditor
        open={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        course={editingCourse}
        onSaved={() => setRefreshKey(prev => prev + 1)}
      />
    </>
  );
}
