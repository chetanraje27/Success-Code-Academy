"use client";

import "./admin.css";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  Globe2,
  ImagePlus,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  Newspaper,
  PanelLeft,
  ChevronDown,
  Settings,
  ShieldCheck,
  Star,
  Sun,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";
import type { AdminUser } from "@/lib/admin-api";
import { isAdminRole, isSuperAdminRole, adminRoleLabel } from "@/lib/roles";
import { AdminSessionProvider } from "@/components/admin/AdminSessionContext";
import { ToastProvider } from "@/components/admin/Toast";

type SessionState = "loading" | "authenticated" | "guest";
type AdminTheme = "light" | "dark";

const THEME_STORAGE_KEY = "sca-admin-theme";

const navigation = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Visual website editor", href: "/?edit=1", icon: Globe2 },
    ],
  },
  {
    label: "Website content",
    items: [
      { label: "Banners", href: "/admin/banners", icon: Images },
      { label: "Page banners", href: "/admin/page-banners", icon: ImagePlus },
      { label: "Course catalog", href: "/admin/content/courses", icon: ClipboardList },
      { label: "Announcements", href: "/admin/notifications", icon: Bell },
      { label: "News articles", href: "/admin/content/news", icon: Newspaper },
      { label: "Academy videos", href: "/admin/content/videos", icon: Video },
      { label: "Star students", href: "/admin/content/stars", icon: Star },
      { label: "Results", href: "/admin/results", icon: Trophy },
      { label: "Site settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Enquiries & records",
    items: [
      {
        label: "Student accounts",
        href: "/admin/database/students",
        icon: Users,
      },
      {
        label: "Course enquiries",
        href: "/admin/database/course-forms",
        icon: ClipboardList,
      },
      {
        label: "Scholarship forms",
        href: "/admin/database/scholarship-forms",
        icon: GraduationCap,
      },
      {
        label: "Contact messages",
        href: "/admin/database/contact-messages",
        icon: MessageSquareText,
      },
    ],
  },
  {
    label: "Access & security",
    // Managing who can sign in belongs to super administrators only. The API
    // refuses /database/admins for anyone else, so this group would be a dead
    // end for a standard administrator.
    superAdminOnly: true,
    items: [
      {
        label: "Administrators",
        href: "/admin/database/administrators",
        icon: ShieldCheck,
      },
    ],
  },
] as const;

const routeNames = new Map<string, string>(
  navigation.flatMap((group) =>
    group.items.map((item) => [item.href, item.label] as const),
  ),
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  /*
   * Routes that must render without an admin session. Sign-in obviously needs
   * one, and so does the password reset page: whoever follows a reset link is
   * by definition locked out.
   */
  const isPublicRoute =
    pathname === "/admin/login" || pathname === "/admin/reset-password";
  const [session, setSession] = useState<SessionState>(
    isPublicRoute ? "guest" : "loading",
  );
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null);
  const [scrollHint, setScrollHint] = useState({ visible: false, hasMoreBelow: false });
  const [theme, setTheme] = useState<AdminTheme | null>(null);

  /*
   * The attribute lives on <html> because admin.css is shared with the public
   * site and AdminModal portals outside .admin-shell. Adding it on mount and
   * removing it on unmount keeps dark theming confined to /admin routes.
   */
  useEffect(() => {
    const root = document.documentElement;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      saved = null;
    }
    const next: AdminTheme = saved === "dark" ? "dark" : "light";
    root.setAttribute("data-admin-theme", next);
    setTheme(next);
    return () => root.removeAttribute("data-admin-theme");
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next: AdminTheme =
      root.getAttribute("data-admin-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-admin-theme", next);
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* Private mode blocks writes; the theme still applies for this session. */
    }
  }, []);

  const showTooltip = (label: string, element: HTMLElement) => {
    if (!isSidebarCollapsed) return;
    const rect = element.getBoundingClientRect();
    setTooltip({ label, top: rect.top + rect.height / 2 });
  };

  const getTooltipHandlers = (label: string) => ({
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => showTooltip(label, event.currentTarget),
    onMouseLeave: () => setTooltip(null),
  });

  const navRef = useRef<HTMLElement>(null);

  const updateScrollThumb = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const { scrollTop, scrollHeight, clientHeight } = nav;
    const visible = scrollHeight > clientHeight + 1;
    const hasMoreBelow = scrollTop + clientHeight < scrollHeight - 1;
    if (!visible) {
      setScrollHint({ visible: false, hasMoreBelow: false });
      return;
    }
    setScrollHint({ visible: true, hasMoreBelow });
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(updateScrollThumb);
    window.addEventListener('resize', updateScrollThumb);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateScrollThumb);
    };
  }, [isSidebarCollapsed, updateScrollThumb]);

  const verifySession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        setUser(null);
        setSession("guest");
        return false;
      }
      const payload = (await response.json()) as {
        data?: { user?: AdminUser };
      };
      if (!payload.data?.user || !isAdminRole(payload.data.user.role)) {
        setUser(null);
        setSession("guest");
        return false;
      }
      setUser(payload.data.user);
      setSession("authenticated");
      return true;
    } catch {
      setUser(null);
      setSession("guest");
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isPublicRoute) {
      // Remote session verification is the external system synchronized here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void verifySession();
    }
  }, [isPublicRoute, verifySession]);

  useEffect(() => {
    const expire = () => {
      setSession("guest");
      setUser(null);
      router.replace("/admin/login");
    };
    window.addEventListener("admin-session-expired", expire);
    return () => window.removeEventListener("admin-session-expired", expire);
  }, [router]);

  useEffect(() => {
    if (!isPublicRoute && session === "guest") {
      router.replace("/admin/login");
    }
  }, [isPublicRoute, router, session]);

  const currentPage = useMemo(
    () => routeNames.get(pathname) || "Administration",
    [pathname],
  );

  const isSuperAdmin = isSuperAdminRole(user?.role);

  const visibleNavigation = useMemo(
    () =>
      navigation.filter(
        (group) =>
          !("superAdminOnly" in group && group.superAdminOnly) || isSuperAdmin,
      ),
    [isSuperAdmin],
  );

  /*
   * A standard administrator who reaches a super-admin-only page directly — a
   * bookmark, a shared link, a typed URL — is sent back to the dashboard. The
   * API would refuse the page's requests anyway; this avoids showing a screen
   * made entirely of permission errors.
   */
  useEffect(() => {
    if (session !== "authenticated" || isSuperAdmin) return;
    if (pathname.startsWith("/admin/database/administrators")) {
      router.replace("/admin");
    }
  }, [isSuperAdmin, pathname, router, session]);

  async function handleLogout() {
    await fetch("/api/admin/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
    setUser(null);
    setSession("guest");
    router.replace("/admin/login");
  }

  if (isPublicRoute) {
    return (
      <ToastProvider>{children}</ToastProvider>
    );
  }

  if (session !== "authenticated") {
    return (
      <ToastProvider>
        <div className="admin-auth-loading" role="status" aria-live="polite">
          <span className="admin-auth-spinner" aria-hidden="true" />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
    <AdminSessionProvider user={user}>
    <div className={`admin-shell ${isSidebarCollapsed ? "is-collapsed" : ""}`}>
      <button
        className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
      />

      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className={`admin-brand ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'}`}>
          {isSidebarCollapsed ? (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="admin-header-toggle is-collapsed group/header-toggle"
              aria-label="Open sidebar"
              {...getTooltipHandlers("Open sidebar")}
            >
              <Image src="/images/ui/SCA-Logo.png" alt="Logo" width={28} height={28} className="collapsed-logo" />
              <PanelLeft size={17} strokeWidth={2} className="collapsed-icon" />
            </button>
          ) : (
            <>
              <div className="admin-brand-content">
                <Image
                  src="/images/ui/SCA-Logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="admin-brand-logo"
                  priority
                />
                <strong className="admin-brand-title"></strong>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="admin-header-toggle group/header-toggle"
                aria-label="Close sidebar"
              >
                <PanelLeft size={17} strokeWidth={2} />
                <span className="tooltip">Close sidebar</span>
              </button>
            </>
          )}
        </div>

        <div className="admin-navigation-container">
          <nav ref={navRef} className="admin-navigation scrollbar-hide" aria-label="Admin navigation" onScroll={updateScrollThumb}>
            {visibleNavigation.map((group, groupIndex) => (
              <div className={`admin-nav-group ${isSidebarCollapsed && groupIndex > 0 ? 'is-collapsed-group' : ''}`} key={group.label}>
                {!isSidebarCollapsed && <p>{group.label}</p>}
                {isSidebarCollapsed && groupIndex > 0 && <div className="collapsed-divider" />}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`admin-nav-link ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      {...getTooltipHandlers(item.label)}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!isSidebarCollapsed && <span className="min-w-0 truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {scrollHint.visible && scrollHint.hasMoreBelow && (
            <div className="admin-scroll-hint">
              <div className="admin-scroll-hint-icon">
                <ChevronDown size={14} strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {/* <div className={`admin-sidebar-footer ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
          <Link href="/" className="admin-website-link" target="_blank" {...getTooltipHandlers("Live website")}>
            <ExternalLink size={17} className="shrink-0" />
            {!isSidebarCollapsed && <span>View live website</span>}
          </Link>
          <div className="admin-account-summary">
            <span className="admin-avatar" aria-hidden="true" {...getTooltipHandlers(user?.firstName || "Admin")}>
              {(user?.firstName?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </span>
            {!isSidebarCollapsed && (
              <div>
                <strong>{user?.firstName || "Administrator"}</strong>
                <span>{user?.email}</span>
                <span>{adminRoleLabel(user?.role)}</span>
              </div>
            )}
          </div>
        </div> */}
      </aside>

      {isSidebarCollapsed && tooltip && (
        <div
          className="admin-sidebar-tooltip"
          style={{ top: tooltip.top }}
        >
          {tooltip.label}
        </div>
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <button
              className="admin-icon-button admin-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div>
              <span>Admin portal</span>
              <strong>{currentPage}</strong>
            </div>
          </div>
          <div className="admin-topbar-actions">
            {/*
              Both icons are always in the DOM and CSS shows one based on the
              <html> attribute, so the correct glyph paints immediately instead
              of flipping once React hydrates.
            */}
            <button
              type="button"
              className="admin-theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
              title={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <Moon size={17} className="admin-theme-icon-dark" aria-hidden="true" />
              <Sun size={17} className="admin-theme-icon-light" aria-hidden="true" />
            </button>
            <button className="admin-logout-button" onClick={handleLogout}>
              <LogOut size={17} />
              <span>Sign out</span>
            </button>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
    </AdminSessionProvider>
    </ToastProvider>
  );
}
