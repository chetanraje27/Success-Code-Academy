"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/data/home";
import Button from "@/components/ui/Button";
import SignInModal from "@/components/ui/SignInModal";
import ProfileModal from "@/components/ui/ProfileModal";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { FaPen, FaDatabase } from "react-icons/fa6";
import {
  Award,
  BookOpen,
  CircleUserRound,
  GraduationCap,
  Home,
  Mail,
  Menu,
  Trophy,
  X,
} from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null);
  const { isAdmin, editMode, toggleEditMode, setLeadsOpen } = useEditModeOptional();
  const isActivePath = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    
    const syncStoredUser = () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;
      try {
        setCurrentUser(JSON.parse(savedUser) as HeaderUser);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };
    const storageTimer = window.setTimeout(syncStoredUser, 0);

    const openSignInModal = () => setIsSignInOpen(true);
    window.addEventListener("open-signin-modal", openSignInModal);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-signin-modal", openSignInModal);
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleLoginSuccess = (user: HeaderUser) => {
    setCurrentUser(user);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleProfileUpdate = (user: HeaderUser) => {
    setCurrentUser(user);
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
            {currentUser ? (
              <div className="user-profile-container">
                <button 
                  type="button"
                  onClick={() => setIsDropdownOpen((open) => !open)}
                  className="user-profile-trigger"
                  aria-expanded={isDropdownOpen}
                  aria-controls="user-account-menu"
                >
                  <span className="user-greeting">
                    Hi, {currentUser.firstName || "Student"}
                  </span>
                  <svg 
                    className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`}
                    viewBox="0 0 24 24" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="var(--text-primary)" 
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div 
                    id="user-account-menu"
                    className="user-dropdown-menu"
                  >
                    <button 
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item"
                    >
                      Profile
                    </button>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="dropdown-item admin"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <div className="dropdown-separator" role="separator" />
                    <button 
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item danger"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setIsSignInOpen(true)} variant="outline" size="sm">
                Sign In
              </Button>
            )}
            <Button href="/courses" variant="primary" size="sm">
              Explore Courses
            </Button>
          </div>

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
      </header>

      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onUpdateSuccess={handleProfileUpdate}
      />

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
                <div className="mobile-user-greeting">
                  <CircleUserRound aria-hidden="true" />
                  <span>Hi, {currentUser.firstName || "Student"}</span>
                </div>
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
                <div className="mobile-account-actions">
                  <Button 
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="mobile-action-button"
                  >
                    Profile
                  </Button>
                  {isAdmin && (
                    <Button 
                      href="/admin"
                      variant="primary" 
                      size="sm" 
                      className="mobile-action-button mobile-admin-button"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Portal
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="mobile-action-button mobile-signout-button"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  setIsSignInOpen(true);
                  setIsMenuOpen(false);
                }} 
                variant="outline" 
                size="sm" 
                className="mobile-action-button"
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
          width: min(288px, calc(100vw - 48px));
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
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2);
          color: var(--text-primary);
          background: transparent;
          border: 0;
          border-radius: var(--radius-control);
          cursor: pointer;
          transition: background-color var(--duration-fast) var(--ease-standard);
        }

        .user-profile-trigger:hover {
          background: var(--color-surface-muted);
        }

        .user-greeting {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-sans);
        }

        .dropdown-chevron {
          transition: transform var(--duration-fast) var(--ease-standard);
        }

        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 46;
          width: 180px;
          display: flex;
          flex-direction: column;
          margin-top: var(--space-2);
          padding: var(--space-2) 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-md);
        }

        .dropdown-item {
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
          width: 100%;
          padding: var(--space-2) var(--space-4);
          color: var(--text-primary);
          background: transparent;
          border: 0;
          border-radius: 0;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          text-align: left;
          text-decoration: none;
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
        }

        .dropdown-item.admin {
          color: var(--brand-primary);
        }

        .dropdown-item.danger {
          color: var(--color-danger);
        }

        .dropdown-item:hover {
          background: var(--color-surface-muted);
        }

        .dropdown-separator {
          height: 1px;
          margin: var(--space-1) 0;
          background: var(--color-border);
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
