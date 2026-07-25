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
  Settings,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";
import type { AdminUser } from "@/lib/admin-api";

type SessionState = "loading" | "authenticated" | "guest";

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
      { label: "Announcements", href: "/admin/notifications", icon: Bell },
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
  const isLogin = pathname === "/admin/login";
  const [session, setSession] = useState<SessionState>(
    isLogin ? "guest" : "loading",
  );
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (!isLogin) {
      // Remote session verification is the external system synchronized here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void verifySession();
    }
  }, [isLogin, verifySession]);

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
    if (!isLogin && session === "guest") {
      router.replace("/admin/login");
    }
  }, [isLogin, router, session]);

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

  if (isLogin) {
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
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
