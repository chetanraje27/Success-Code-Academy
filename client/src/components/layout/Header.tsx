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

type HeaderUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  age?: number;
  role?: string;
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
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
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
            &times;
          </button>
        </div>

        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`mobile-nav-link ${isActivePath(link.href) ? "active" : ""}`}
              aria-current={isActivePath(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-actions">
            {currentUser ? (
              <div className="mobile-user-profile">
                <div className="mobile-user-greeting">
                  Hi, {currentUser.firstName || "Student"}
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
              Courses
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
          height: 80px;
          transition: height var(--duration-normal) var(--ease-standard);
        }

        .header.scrolled .header-container {
          height: 64px;
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
          max-height: 48px;
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
          width: var(--touch-target);
          height: var(--touch-target);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-control);
        }

        @media (min-width: 1024px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .hamburger {
          width: 24px;
          height: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--text-primary);
          transition:
            background-color var(--duration-fast) var(--ease-standard),
            transform var(--duration-fast) var(--ease-standard);
          border-radius: 2px;
        }

        /* Drawer Overlay Backdrop */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
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
          width: 300px;
          max-width: calc(100vw - 32px);
          background: var(--color-surface);
          box-shadow: var(--shadow-md);
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
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .drawer-close-btn {
          background: transparent;
          border: none;
          font-size: 2.2rem;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--touch-target);
          height: var(--touch-target);
          line-height: var(--touch-target);
          border-radius: var(--radius-control);
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
        }

        .drawer-close-btn:hover {
          color: var(--accent-primary);
          background: var(--color-surface-muted);
        }

        .mobile-nav-links {
          padding: var(--space-5) var(--space-6) max(var(--space-6), env(safe-area-inset-bottom));
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          overflow-y: auto;
        }

        .mobile-nav-link {
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-control);
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard);
          text-align: left;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--brand-primary);
          background: var(--color-surface-muted);
        }

        .mobile-actions {
          margin-top: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }

        :global(.mobile-action-button) {
          width: 100%;
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
          gap: var(--space-3);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-1);
        }

        .mobile-user-greeting {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-sans);
          text-align: left;
        }

        .mobile-editor-actions,
        .mobile-account-actions {
          display: flex;
          gap: var(--space-2);
          width: 100%;
        }

        .mobile-editor-actions .edit-site-toggle {
          flex: 1;
          justify-content: center;
        }

        :global(.mobile-account-actions .mobile-action-button) {
          min-width: 0;
          flex: 1;
          padding-inline: var(--space-2);
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

        @media (max-width: 360px) {
          .mobile-account-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}
