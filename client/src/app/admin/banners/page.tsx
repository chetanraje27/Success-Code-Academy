"use client";

import { useState } from "react";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<"HOME" | "RESULTS">("HOME");

  return (
    <div>
      <div className="admin-tabs" style={{ marginBottom: "24px", display: "flex", gap: "8px", borderBottom: "1px solid var(--admin-border)", paddingBottom: "8px" }}>
        <button
          type="button"
          className={`admin-tab ${activeTab === "HOME" ? "active" : ""}`}
          onClick={() => setActiveTab("HOME")}
          style={{
            background: activeTab === "HOME" ? "var(--admin-brand)" : "var(--admin-surface)",
            color: activeTab === "HOME" ? "#ffffff" : "var(--admin-muted)",
            border: activeTab === "HOME" ? "1px solid var(--admin-brand)" : "1px solid var(--admin-border)",
            padding: "8px 16px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: "var(--admin-radius)",
            boxShadow: activeTab === "HOME" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          Home Page Banners
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "RESULTS" ? "active" : ""}`}
          onClick={() => setActiveTab("RESULTS")}
          style={{
            background: activeTab === "RESULTS" ? "var(--admin-brand)" : "var(--admin-surface)",
            color: activeTab === "RESULTS" ? "#ffffff" : "var(--admin-muted)",
            border: activeTab === "RESULTS" ? "1px solid var(--admin-brand)" : "1px solid var(--admin-border)",
            padding: "8px 16px",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: "pointer",
            borderRadius: "var(--admin-radius)",
            boxShadow: activeTab === "RESULTS" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          Results Page Banners
        </button>
      </div>

      <AdminContentManager
        key={activeTab}
        title={activeTab === "HOME" ? "Home Page Banners" : "Results Page Banners"}
        description={
          activeTab === "HOME" 
            ? "Manage the large images shown on the home page. Use short, meaningful alternative text for accessibility."
            : "Manage the large images shown on the results page. Use short, meaningful alternative text for accessibility."
        }
        itemName="Banner"
        resource="banners"
        historyType="banner"
        uploadType="banner"
        filterItems={(item) => item.type === activeTab}
        fields={[
          {
            name: "type",
            label: "Shown on",
            kind: "select",
            defaultValue: activeTab,
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
    </div>
  );
}
