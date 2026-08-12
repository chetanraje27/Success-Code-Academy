"use client";

import "./admin.css";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Moon,
  Newspaper,
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
  /*
   * Starts null so the first client render matches the server exactly; the
   * mount effect below fills it in. The visible icon never waits for this --
   * it is swapped by CSS off the data-admin-theme attribute that the root
   * layout script applies before first paint. This state only feeds the
   * button's label and the next-value calculation.
   */
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
      if (!payload.data?.user || payload.data.user.role !== "admin") {
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
    return <>{children}</>;
  }

  if (session !== "authenticated") {
    return (
      <div className="admin-auth-loading" role="status" aria-live="polite">
        <span className="admin-spinner" aria-hidden="true" />
        <strong>Checking your admin session</strong>
        <span>This only takes a moment.</span>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <button
        className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
      />

      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <Image
            src="/images/ui/SCA-Logo.png"
            alt="Success Code Academy"
            width={48}
            height={48}
            className="admin-brand-logo"
            priority
          />
          <div>
            <strong>Success Code</strong>
            <span>Website admin</span>
          </div>
          <button
            className="admin-icon-button admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p>{group.label}</p>
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
                  >
                    <Icon size={18} strokeWidth={1.9} />
                    <span>{item.label}</span>
                    {active && <ChevronRight size={15} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-website-link" target="_blank">
            <ExternalLink size={17} />
            View live website
          </Link>
          <div className="admin-account-summary">
            <span className="admin-avatar" aria-hidden="true">
              {(user?.firstName?.[0] || user?.email?.[0] || "A").toUpperCase()}
            </span>
            <div>
              <strong>{user?.firstName || "Administrator"}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </aside>

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
  );
}
