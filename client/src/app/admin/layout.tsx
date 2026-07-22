"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaChartPie,
  FaImages,
  FaBell,
  FaStar,
  FaDatabase,
  FaSignOutAlt,
  FaBars,
  FaSearch,
  FaFilm,
  FaPhotoVideo,
  FaUsersCog,
  FaHistory,
  FaGlobe,
  FaStream,
  FaSearchLocation,
  FaUserShield,
  FaFolder,
  FaComments
} from "react-icons/fa";
import { FaUserGraduate, FaWpforms, FaFileSignature, FaQuoteLeft } from "react-icons/fa6";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.mobileNumber !== '9699062427' && user.role !== 'admin') {
        alert("Unauthorized access. Admin privileges required.");
        router.push("/");
        return;
      }
      setIsLoading(false);
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  if (isLoading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#0257d0", fontWeight: 600 }}>Loading Success Code CMS...</div>;
  }

  const menuItems = [
    { type: "header", name: "OVERVIEW & DASHBOARD" },
    { name: "Analytics Dashboard", path: "/admin", icon: <FaChartPie /> },

    { type: "header", name: "CONTENT CMS MODULES" },
    { name: "Home Page CMS", path: "/admin/home", icon: <FaImages /> },
    { name: "About Page CMS", path: "/admin/about", icon: <FaFileSignature /> },
    { name: "Courses CMS", path: "/admin/courses", icon: <FaUserGraduate /> },
    { name: "Results & Rankers", path: "/admin/results", icon: <FaStar /> },
    { name: "Testimonials CMS", path: "/admin/testimonials", icon: <FaQuoteLeft /> },
    { name: "Video Library", path: "/admin/videos", icon: <FaFilm /> },
    { name: "Gallery & Albums", path: "/admin/gallery", icon: <FaPhotoVideo /> },

    { type: "header", name: "LEADS & APPLICATIONS" },
    { name: "Scholarship Exams", path: "/admin/scholarships", icon: <FaWpforms /> },
    { name: "Contact & Leads CRM", path: "/admin/leads", icon: <FaComments /> },
    { name: "Student Accounts", path: "/admin/database/students", icon: <FaDatabase /> },

    { type: "header", name: "ASSETS & MEDIA" },
    { name: "Centralized Media", path: "/admin/media", icon: <FaFolder /> },

    { type: "header", name: "SYSTEM & GOVERNANCE" },
    { name: "Website Settings", path: "/admin/settings", icon: <FaGlobe /> },
    { name: "Navigation Builder", path: "/admin/navigation", icon: <FaStream /> },
    { name: "Page SEO Manager", path: "/admin/seo", icon: <FaSearchLocation /> },
    { name: "User Roles & Auth", path: "/admin/roles", icon: <FaUserShield /> },
    { name: "Audit Activity Log", path: "/admin/audit", icon: <FaHistory /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Image src="/images/ui/logo1.png" alt="Logo" width={38} height={38} className="admin-logo" />
          {isSidebarOpen && (
            <div className="brand-text">
              <h2>Success Code</h2>
              <span className="cms-badge">HEADLESS CMS v2.0</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            if (item.type === "header") {
              return isSidebarOpen ? <h4 key={index} className="nav-header">{item.name}</h4> : <div key={index} className="nav-divider" />;
            }

            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path!));
            return (
              <Link key={index} href={item.path!} className={`admin-nav-item ${isActive ? 'active' : ''}`} title={!isSidebarOpen ? item.name : undefined}>
                <span className="admin-nav-icon">{item.icon}</span>
                {isSidebarOpen && <span className="admin-nav-text">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <div className="global-search-wrap">
              <FaSearch className="ic" />
              <input
                type="text"
                placeholder="Search CMS modules, courses, results, leads..."
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="status-indicator">
              <span className="dot online"></span>
              <span className="lbl">API Online</span>
            </div>
            <div className="user-profile-badge">
              <div className="avatar">A</div>
              <div className="user-info">
                <span className="user-name">Super Admin</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout of CMS">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="admin-content-area">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .admin-layout {
          display: flex;
          height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
        }

        .admin-sidebar {
          background: #ffffff;
          color: #1e293b;
          transition: width 0.25s ease;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          flex-shrink: 0;
          border-right: 1px solid #e2e8f0;
          box-shadow: 2px 0 8px rgba(0,0,0,0.02);
        }

        .admin-sidebar.open { width: 260px; }
        .admin-sidebar.closed { width: 70px; }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          height: 64px;
          box-sizing: border-box;
        }

        .admin-logo {
          object-fit: contain;
          width: auto;
          max-height: 34px;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-header h2 {
          font-size: 1.05rem;
          margin: 0;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }

        .cms-badge {
          font-size: 0.62rem;
          font-weight: 800;
          color: #0257d0;
          background: #eff6ff;
          padding: 1px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          width: max-content;
        }

        .sidebar-nav {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-header {
          font-size: 0.68rem;
          font-weight: 800;
          color: #94a3b8;
          margin: 16px 0 6px 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .nav-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 12px 0;
        }

        .admin-nav-item {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 12px !important;
          padding: 9px 12px !important;
          border-radius: 8px !important;
          color: #475569 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
          font-size: 0.86rem !important;
          font-weight: 500 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .admin-nav-item:hover {
          background: #f1f5f9 !important;
          color: #0f172a !important;
        }
        
        .admin-nav-item.active {
          background: #eff6ff !important;
          color: #0257d0 !important;
          font-weight: 700 !important;
        }

        .admin-nav-icon {
          font-size: 0.95rem !important;
          min-width: 22px !important;
          width: 22px !important;
          height: 22px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }

        .admin-nav-text {
          flex: 1 !important;
          font-size: 0.86rem !important;
          line-height: 1.2 !important;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-topbar {
          background: #fff;
          height: 64px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          max-width: 500px;
        }

        .toggle-sidebar-btn {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          color: #475569;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        .toggle-sidebar-btn:hover {
          background: #f1f5f9;
        }

        .global-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 8px;
          width: 100%;
        }

        .global-search-wrap .ic {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .global-search-wrap input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .status-indicator .dot.online {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
        }

        .status-indicator .lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: #15803d;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-profile-badge .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #0257d0;
          color: #fff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .user-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
        }

        .user-role {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 500;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fee2e2;
          color: #ef4444;
          border: none;
          padding: 7px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: #fca5a5;
        }

        .admin-content-area {
          flex: 1;
          padding: 24px 28px;
          overflow-y: auto;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
