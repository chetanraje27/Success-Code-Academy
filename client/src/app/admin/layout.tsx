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
  FaBars
} from "react-icons/fa";
import { FaUserGraduate, FaWpforms, FaFileSignature } from "react-icons/fa6";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
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
      // Let backend authorize based on token, but do a quick frontend check
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
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Admin Portal...</div>;
  }

  const menuItems = [
    { type: "header", name: "OVERVIEW & CMS" },
    { name: "Dashboard", path: "/admin", icon: <FaChartPie /> },
    { name: "Home Page", path: "/admin/home", icon: <FaImages /> },
    { name: "About Page", path: "/admin/about", icon: <FaFileSignature /> },
    { name: "Courses", path: "/admin/courses", icon: <FaUserGraduate /> },
    { name: "Scholarships", path: "/admin/scholarships", icon: <FaWpforms /> },
    { name: "Results", path: "/admin/results", icon: <FaStar /> },
    { type: "header", name: "DATABASE & LEADS" },
    { name: "Student Accounts", path: "/admin/database/students", icon: <FaDatabase /> },
    { name: "Course Forms", path: "/admin/database/course-forms", icon: <FaWpforms /> },
    { name: "Scholarship Forms", path: "/admin/database/scholarship-forms", icon: <FaFileSignature /> },
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
          <Image src="/images/ui/logo1.png" alt="Logo" width={45} height={45} className="admin-logo" />
          {isSidebarOpen && <h2>Admin Portal</h2>}
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
          <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>

          <div className="topbar-right">
            <span className="admin-greeting">Welcome, Admin</span>
            <button className="logout-btn" onClick={handleLogout}>
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
          transition: width 0.3s ease;
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
          max-height: 32px;
        }

        .sidebar-header h2 {
          font-size: 1.15rem;
          margin: 0;
          font-weight: 700;
          color: #0f172a;
        }

        .sidebar-nav {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: #94a3b8;
          margin: 16px 0 6px 12px;
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
          padding: 10px 14px !important;
          border-radius: 8px !important;
          color: #475569 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          white-space: nowrap !important;
          font-size: 0.9rem !important;
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
          font-weight: 600 !important;
        }

        .admin-nav-icon {
          font-size: 1rem !important;
          min-width: 24px !important;
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }

        .admin-nav-icon svg {
          display: inline-block !important;
          width: 1em !important;
          height: 1em !important;
        }

        .admin-nav-text {
          flex: 1 !important;
          font-size: 0.9rem !important;
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
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .toggle-sidebar-btn {
          background: transparent;
          border: none;
          font-size: 1.2rem;
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

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .admin-greeting {
          font-weight: 500;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fee2e2;
          color: #ef4444;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: #fca5a5;
        }

        .admin-content-area {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
