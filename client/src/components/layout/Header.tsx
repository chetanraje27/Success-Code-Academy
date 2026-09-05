"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/data/home";
import Button from "@/components/ui/Button";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { FaPen, FaDatabase } from "react-icons/fa6";
import {
  Award,
  BookOpen,
  ChevronDown,
  CircleUserRound,
  GraduationCap,
  Home,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import { getConsoleDashboardHref } from "@/lib/admin-routing";

type HeaderUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  age?: number;
  role?: string;
};

const mobileNavIcons = {
  "/": Home,
  "/about": GraduationCap,
  "/courses": BookOpen,
  "/admissions": Award,
  "/results": Trophy,
  "/contact": Mail,
};

export default function Header() {
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null);
  const { isAdmin, editMode, toggleEditMode, setEditMode, setLeadsOpen } = useEditModeOptional();
  const isActivePath = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const userDisplayName = currentUser
    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ").trim() ||
      currentUser.email?.split("@")[0] ||
      "Account"
    : "";

  const userInitial = currentUser
    ? (currentUser.firstName?.[0] || currentUser.email?.[0] || "A").toUpperCase()
    : "A";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    
    const syncStoredUser = () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setCurrentUser(null);
        return;
      }
      try {
        setCurrentUser(JSON.parse(savedUser) as HeaderUser);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    };
    const storageTimer = window.setTimeout(syncStoredUser, 0);

    window.addEventListener("auth-changed", syncStoredUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth-changed", syncStoredUser);
      window.clearTimeout(storageTimer);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButtonRef.current;
    const drawer = drawerRef.current;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      drawer?.querySelector<HTMLElement>(".drawer-close-btn")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const wasAdmin = isAdmin;
    try {
      if (isAdmin) {
        await fetch("/api/admin/session", {
          method: "DELETE",
          credentials: "same-origin",
        });
      }
    } catch {
      // Ignore network errors
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLeadsOpen(false);
      // setEditMode also updates the context state synchronously and prevents
      // editor controls from surviving the auth state transition.
      if (wasAdmin) {
        setEditMode(false);
        try {
          sessionStorage.removeItem("sca_edit_mode");
        } catch {
          /* Session storage is optional. */
        }
      }
      setCurrentUser(null);
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      window.dispatchEvent(new Event("auth-changed"));
      if (wasAdmin) {
        window.dispatchEvent(new Event("admin-session-expired"));
      }
    }
  };



  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container header-container">
          <Link href="/" className="logo-group">
            <Image
              src={siteConfig.logo.src}
              alt="Success Code Academy Logo"
              width={siteConfig.logo.width}
              height={siteConfig.logo.height}
              className="logo-image"
              priority
            />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActivePath(link.href) ? "active" : ""}`}
                aria-current={isActivePath(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-right-actions">
            <div className="desktop-actions">
              {isAdmin && (
                <>
                  <button
                    onClick={toggleEditMode}
                    className={`edit-site-toggle ${editMode ? 'active' : ''}`}
                    title={editMode ? 'Exit Edit Mode' : 'Edit Site'}
                  >
                    <FaPen size={12} />
                    <span>{editMode ? 'Editing' : 'Edit Site'}</span>
                  </button>
                  {editMode && (
                    <button
                      onClick={() => setLeadsOpen(true)}
                      className="edit-site-toggle"
                      title="View Leads"
                    >
                      <FaDatabase size={12} />
                      <span>Leads</span>
                    </button>
                  )}
                </>
              )}
              {!currentUser && (
                <Button href="/login" variant="outline" size="sm">
                  Sign In
                </Button>
              )}
              <Button href="/courses" variant="primary" size="sm">
                Explore Courses
              </Button>
            </div>

            {currentUser && (
              <div className="user-profile-container" ref={profileMenuRef}>
                <button 
                  type="button"
                  className={`user-profile-trigger ${isDropdownOpen ? "is-active" : ""}`}
                  onClick={() => setIsDropdownOpen((open) => !open)}
                  aria-expanded={isDropdownOpen}
                  aria-controls="user-account-menu"
                >
                  <span className="user-profile-trigger-avatar" aria-hidden="true">
                    {userInitial}
                  </span>
                  <span className="user-profile-trigger-name">
                    {userDisplayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`user-profile-trigger-chevron ${isDropdownOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isDropdownOpen && (
                  <div 
                    id="user-account-menu"
                    className="user-profile-dropdown"
                    role="menu"
                  >
                    <div className="user-profile-header">
                      <div className="user-profile-header-avatar" aria-hidden="true">
                        {userInitial}
                      </div>
                      <div className="user-profile-header-meta">
                        <span className="user-profile-name" title={userDisplayName}>
                          {userDisplayName}
                        </span>
                        <span className="user-profile-email" title={currentUser?.email || currentUser?.mobileNumber}>
                          {currentUser?.email || currentUser?.mobileNumber}
                        </span>
                        {isAdmin && (
                          <div className="user-profile-badge">
                            <ShieldCheck size={11} aria-hidden="true" />
                            <span>Administrator</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <>
                        <div className="user-profile-divider" />
                        
                        <div className="user-profile-menu">
                          <Link 
                            href={getConsoleDashboardHref()}
                            onClick={() => setIsDropdownOpen(false)}
                            className="user-profile-menu-item admin"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <CircleUserRound size={16} aria-hidden="true" style={{ display: "block", flexShrink: 0 }} />
                            <span>Admin Portal</span>
                          </Link>
                        </div>
                      </>
                    )}
                    
                    <div className={`user-profile-footer ${isAdmin ? "" : "no-border"}`}>
                      <button 
                        onClick={handleLogout}
                        className="user-profile-logout-btn"
                        disabled={isLoggingOut}
                      >
                        <LogOut size={15} aria-hidden="true" />
                        <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          <button
            ref={menuButtonRef}
            onClick={() => setIsMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Open menu"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
          >
            <Menu aria-hidden="true" />
          </button>
          </div>
        </div>
      </header>



      {isDropdownOpen && (
        <div 
          className="dropdown-backdrop-click"
          onClick={() => setIsDropdownOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Slide-in Drawer Backdrop */}
      <div 
        className={`drawer-overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        ref={drawerRef}
        id="mobile-navigation"
        className={`mobile-drawer ${isMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Website navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
      >
        <div className="drawer-header">
          <Link href="/" className="logo-group" onClick={() => setIsMenuOpen(false)}>
            <Image
              src={siteConfig.logo.src}
              alt="Success Code Academy Logo"
              width={65}
              height={68}
              className="logo-image"
            />
          </Link>
          <button 
            className="drawer-close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="mobile-nav-links">
          <nav className="mobile-nav-list" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const NavIcon = mobileNavIcons[link.href as keyof typeof mobileNavIcons] || BookOpen;
              const active = isActivePath(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`mobile-nav-link ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="mobile-nav-icon" aria-hidden="true">
                    <NavIcon />
                  </span>
                  <span className="mobile-nav-label">{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mobile-actions">
            {currentUser ? (
              <div className="mobile-user-profile">
                {isAdmin && (
                  <div className="mobile-editor-actions">
                    <button
                      type="button"
                      onClick={() => { toggleEditMode(); setIsMenuOpen(false); }}
                      className={`edit-site-toggle ${editMode ? 'active' : ''}`}
                    >
                      <FaPen size={12} />
                      <span>{editMode ? 'Editing' : 'Edit Site'}</span>
                    </button>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => { setLeadsOpen(true); setIsMenuOpen(false); }}
                        className="edit-site-toggle"
                      >
                        <FaDatabase size={12} />
                        <span>Leads</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Button 
                href="/login"
                variant="outline" 
                size="sm" 
                className="mobile-action-button"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Button>
            )}
            <Button 
              href="/courses" 
              variant="primary" 
              size="sm" 
              className="mobile-action-button"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          transition:
            background-color var(--duration-normal) var(--ease-standard),
            border-color var(--duration-normal) var(--ease-standard),
            box-shadow var(--duration-normal) var(--ease-standard);
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        .header.scrolled {
          background: var(--bg-surface);
          border-bottom: 1px solid var(--bg-surface-border);
          box-shadow: var(--shadow-subtle);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          /* Single source of truth (tokens.css): 68px on tablet/phone, 76px on
             desktop. public.css used to override this with its own 76px/68px
             literals, so the 80px/64px written here never actually applied. */
          height: var(--header-h);
          transition: height var(--duration-normal) var(--ease-standard);
        }

        .logo-group {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: transform var(--duration-fast) var(--ease-standard);
        }

        .logo-group:hover {
          transform: scale(1.02);
        }

        :global(.logo-image) {
          object-fit: contain;
          max-height: clamp(34px, 6.5vw, 48px);
          width: auto;
        }

        .desktop-nav {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex;
            align-items: center;
            gap: clamp(var(--space-4), 1.8vw, var(--space-8));
          }
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
          position: relative;
          padding: var(--space-2) 0;
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent-primary);
          transition: width var(--duration-normal) var(--ease-standard);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .desktop-actions {
          display: none;
        }

        @media (min-width: 1024px) {
          .desktop-actions {
            display: flex;
            align-items: center;
            gap: var(--spacing-3);
          }
        }

        .mobile-menu-btn {
          position: relative;
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-primary);
          background: #f8fafc;
          border: 1px solid var(--color-border);
          cursor: pointer;
          padding: 0;
          border-radius: 9px;
          box-shadow: var(--shadow-xs);
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard),
            transform var(--duration-fast) var(--ease-standard);
        }

        .mobile-menu-btn:hover {
          color: #fff;
          background: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        .mobile-menu-btn::before {
          position: absolute;
          inset: -4px;
          content: "";
        }

        .mobile-menu-btn:active {
          transform: scale(0.96);
        }

        .mobile-menu-btn :global(svg) {
          width: 18px;
          height: 18px;
          stroke-width: 2;
        }

        @media (min-width: 1024px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        /* Drawer Overlay Backdrop */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 29, 52, 0.34);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          opacity: 0;
          visibility: hidden;
          transition:
            opacity var(--duration-overlay) var(--ease-standard),
            visibility var(--duration-overlay) var(--ease-standard);
          z-index: 900;
        }

        .drawer-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Drawer Box */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(240px, calc(100vw - 48px));
          max-width: none;
          overflow: hidden;
          background: #fff;
          border-left: 1px solid var(--color-border);
          border-radius: 18px 0 0 18px;
          box-shadow: -18px 0 50px rgba(16, 47, 94, 0.16);
          transform: translateX(100%);
          transition: transform var(--duration-overlay) var(--ease-standard);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 68px;
          padding: 0.75rem 0.9rem 0.75rem 1rem;
          border-bottom: 1px solid var(--color-border);
          background: linear-gradient(135deg, #fff, #f4f8fc);
        }

        .drawer-header .logo-group {
          min-width: 0;
        }

        .drawer-header :global(.logo-image) {
          width: auto;
          max-width: 108px;
          max-height: 38px;
        }

        .drawer-close-btn {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          padding: 0;
          color: var(--text-secondary);
          background: #fff;
          border: 1px solid var(--color-border);
          cursor: pointer;
          display: grid;
          align-items: center;
          justify-content: center;
          line-height: 1;
          border-radius: 8px;
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
        }

        .drawer-close-btn:hover {
          color: #fff;
          background: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        .drawer-close-btn :global(svg) {
          width: 16px;
          height: 16px;
        }

        .mobile-nav-links {
          min-height: 0;
          padding: 0.9rem 0.8rem max(0.9rem, env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: 0;
          flex: 1;
          overflow-y: auto;
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .mobile-nav-link {
          position: relative;
          display: flex !important;
          width: 100%;
          min-height: 44px;
          box-sizing: border-box;
          align-items: center !important;
          justify-content: flex-start;
          gap: 0.75rem !important;
          overflow: hidden;
          font-size: 0.84rem;
          font-weight: 650;
          color: var(--text-primary);
          padding: 0.5rem 0.75rem !important;
          border: 1px solid transparent;
          border-radius: 9px;
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
          line-height: 1.2;
          text-align: left;
        }

        .mobile-nav-link:hover {
          color: var(--brand-primary);
          background: #f3f7fb;
          border-color: #dce6f0;
        }

        .mobile-nav-link.active {
          color: #fff;
          background: linear-gradient(110deg, #102f5e, #184a78) !important;
          border-color: #102f5e;
          box-shadow: 0 7px 16px rgba(16, 47, 94, 0.16);
        }

        .mobile-nav-icon {
          display: grid !important;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          color: var(--brand-primary);
          background: var(--color-brand-primary-soft);
          border: 0;
          border-radius: 6px;
          place-items: center;
        }

        .mobile-nav-icon :global(svg) {
          width: 14px;
          height: 14px;
          stroke-width: 1.9;
        }

        .mobile-nav-link.active .mobile-nav-icon {
          color: #fff;
          background: transparent !important;
          box-shadow: none;
        }

        .mobile-nav-label {
          display: block;
          min-width: 0;
          flex: 1;
          line-height: 1.2;
          text-align: left;
        }

        .mobile-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          padding: 0.75rem;
          background: #f5f8fb;
          border: 1px solid var(--color-border);
          border-radius: 11px;
        }

        :global(.mobile-action-button) {
          width: 100%;
          min-height: 36px;
          border-radius: 8px;
          font-size: 0.76rem;
          box-shadow: none;
        }

        .user-profile-container {
          position: relative;
          z-index: 45;
        }

        .user-profile-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 36px;
          padding: 0 12px 0 4px;
          border: 1px solid var(--color-border);
          border-radius: 999px;
          background: var(--color-surface);
          color: var(--text-primary);
          font: inherit;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          user-select: none;
          transition:
            border-color var(--duration-fast) var(--ease-standard),
            background var(--duration-fast) var(--ease-standard),
            box-shadow var(--duration-fast) var(--ease-standard);
        }

        .user-profile-trigger:hover {
          border-color: var(--color-border-strong);
          background: var(--color-surface-hover);
        }

        .user-profile-trigger.is-active {
          border-color: var(--brand-primary);
          background: var(--color-surface-hover);
          box-shadow: 0 0 0 3px rgba(16, 47, 94, 0.08);
        }

        .user-profile-trigger-avatar {
          display: grid;
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #102f5e, #087f83);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .user-profile-trigger-name {
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-profile-trigger-chevron {
          color: var(--text-secondary);
          flex-shrink: 0;
          transition: transform var(--duration-normal) var(--ease-standard);
        }

        .user-profile-trigger-chevron.is-open {
          transform: rotate(180deg);
          color: var(--brand-primary);
        }

        .user-profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 284px;
          box-sizing: border-box;
          padding: 16px;
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
          border-radius: 18px;
          box-shadow:
            0 6px 20px -4px rgba(15, 31, 54, 0.08),
            0 2px 6px rgba(15, 31, 54, 0.03);
          backdrop-filter: saturate(180%) blur(16px);
          z-index: 100;
          animation: user-profile-pop 160ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }

        @media (max-width: 1023px) {
          .user-profile-trigger {
            padding: 3px;
            gap: 0;
            width: 36px;
            height: 36px;
            justify-content: center;
          }
          .user-profile-trigger-name,
          .user-profile-trigger-chevron {
            display: none;
          }
          .user-profile-dropdown {
            right: -48px;
            width: calc(100vw - 28px);
            max-width: 300px;
          }
        }

        @keyframes user-profile-pop {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .user-profile-header-avatar {
          display: grid;
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #102f5e, #087f83);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          box-shadow: 0 0 0 2px var(--color-surface, #ffffff), 0 0 0 3px var(--color-border, #e2e8f0);
        }

        .user-profile-header-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .user-profile-name {
          color: var(--text-primary, #0f172a);
          font-size: 0.88rem;
          font-weight: 600;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-profile-email {
          margin-top: 2px;
          color: var(--text-secondary, #64748b);
          font-size: 0.74rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-profile-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 5px;
          align-self: flex-start;
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(16, 47, 94, 0.08);
          color: var(--brand-primary, #102f5e);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .user-profile-divider {
          height: 1px;
          background: var(--color-border, #e2e8f0);
          margin: 10px 0;
        }

        .user-profile-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        :global(.user-profile-menu-item) {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 8px 12px !important;
          border-radius: 10px !important;
          color: var(--text-primary, #0f172a) !important;
          text-decoration: none !important;
          font-size: 0.82rem !important;
          font-weight: 500 !important;
          line-height: 1.2 !important;
          cursor: pointer !important;
          transition:
            background-color var(--duration-fast) var(--ease-standard),
            color var(--duration-fast) var(--ease-standard) !important;
        }

        :global(.user-profile-menu-item svg) {
          display: block !important;
          flex-shrink: 0 !important;
          color: var(--brand-primary, #102f5e) !important;
          transition: transform var(--duration-fast) var(--ease-standard) !important;
        }

        :global(.user-profile-menu-item:hover) {
          background: #f1f5f9 !important;
          color: var(--brand-primary, #102f5e) !important;
        }

        :global(.user-profile-menu-item:hover svg) {
          transform: scale(1.08);
        }

        :global(.user-profile-menu-item.admin) {
          color: var(--brand-primary, #102f5e) !important;
          font-weight: 600 !important;
        }

        .user-profile-footer {
          padding-top: 10px;
          margin-top: 6px;
          border-top: 1px solid var(--color-border, #e2e8f0);
        }

        .user-profile-footer.no-border {
          border-top: none;
          padding-top: 0;
          margin-top: 14px;
        }

        .user-profile-logout-btn {
          display: flex;
          width: 100%;
          height: 36px;
          box-sizing: border-box;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 0 14px;
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 999px;
          background: transparent;
          color: var(--text-secondary, #64748b);
          font: inherit;
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition:
            background-color var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard),
            color var(--duration-fast) var(--ease-standard);
        }

        .user-profile-logout-btn:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #f6c9c9;
          color: var(--color-danger, #dc2626);
        }

        .user-profile-logout-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dropdown-backdrop-click {
          position: fixed;
          inset: 0;
          z-index: 40;
          background: transparent;
        }

        .mobile-user-profile {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 0.05rem;
        }

        .mobile-user-greeting {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          font-weight: 650;
          color: var(--text-primary);
          font-family: var(--font-sans);
          text-align: left;
        }

        .mobile-user-greeting :global(svg) {
          width: 18px;
          height: 18px;
          color: var(--brand-primary);
        }

        .mobile-editor-actions,
        .mobile-account-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.45rem;
          width: 100%;
        }

        .mobile-editor-actions .edit-site-toggle {
          flex: 1;
          justify-content: center;
        }

        :global(.mobile-account-actions .mobile-action-button) {
          min-width: 0;
          width: 100%;
          padding-inline: 0.45rem;
        }

        :global(.mobile-account-actions .mobile-signout-button:last-child:nth-child(3)) {
          grid-column: 1 / -1;
        }

        :global(.mobile-admin-button) {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
        }

        :global(.mobile-signout-button) {
          color: var(--color-danger);
          border-color: color-mix(in srgb, var(--color-danger) 35%, transparent);
        }

        .edit-site-toggle {
          min-height: 36px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1px solid var(--color-border-strong);
          border-radius: 999px;
          background: var(--color-surface);
          color: var(--text-secondary);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            color var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
          font-family: var(--font-sans);
        }

        .edit-site-toggle:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .edit-site-toggle.active {
          background: var(--brand-primary);
          border-color: var(--brand-primary);
          color: #fff;
          box-shadow: var(--shadow-subtle);
        }

        @media (max-width: 380px) {
          .mobile-drawer {
            width: min(268px, calc(100vw - 36px));
          }

          .drawer-header {
            min-height: 62px;
            padding-inline: 0.8rem;
          }

          .drawer-header :global(.logo-image) {
            max-width: 98px;
            max-height: 34px;
          }

          .mobile-nav-links {
            padding: 0.75rem 0.65rem max(0.75rem, env(safe-area-inset-bottom));
          }

          .mobile-nav-link {
            min-height: 40px;
            gap: 0.65rem !important;
            padding: 0.45rem 0.65rem !important;
            font-size: 0.8rem;
          }

          .mobile-nav-icon {
            width: 26px;
            height: 26px;
          }

          .mobile-account-actions {
            grid-template-columns: 1fr;
          }

          :global(.mobile-account-actions .mobile-signout-button:last-child:nth-child(3)) {
            grid-column: auto;
          }
        }
      `}</style>
    </>
  );
}
