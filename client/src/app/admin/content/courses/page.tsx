"use client";

import AdminLeadTable from "@/components/admin/AdminLeadTable";
import CourseEditor from "@/components/admin/CourseEditor";
import { useState } from "react";
import { adminApiFetch } from "@/lib/admin-api";

export default function AdminCoursesPage() {
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleDelete(course: any) {
    try {
      await adminApiFetch(`/api/v1/admin/courses/${course.id}`, { method: "DELETE" });
      setRefreshKey(prev => prev + 1);
    } catch (e: any) {
      alert(e.message || "Failed to delete course");
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
          { key: "category", label: "Category", render: (row: any) => <span style={{textTransform: 'capitalize'}}>{row.category.replace('-', ' ')}</span> },
          { key: "type", label: "Type" },
          { key: "isActive", label: "Status", render: (row: any) => (
              <span style={{ 
                color: row.isActive ? '#10b981' : '#ef4444', 
                fontWeight: 600,
                fontSize: '12px',
                padding: '4px 8px',
                backgroundColor: row.isActive ? '#10b9811a' : '#ef44441a',
                borderRadius: '999px'
              }}>
                {row.isActive ? 'Active' : 'Inactive'}
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
