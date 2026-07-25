"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks, siteConfig } from "@/data/home";
import Button from "@/components/ui/Button";
import SignInModal from "@/components/ui/SignInModal";
import ProfileModal from "@/components/ui/ProfileModal";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { FaPen, FaDatabase } from "react-icons/fa6";
import { EditableText } from "@/components/admin/EditableText";

type HeaderUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  age?: number;
  role?: string;
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null);
  const { isAdmin, editMode, toggleEditMode, setLeadsOpen } = useEditModeOptional();

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

          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                <EditableText
                  contentKey={`navigation.${link.href === "/" ? "home" : link.href.slice(1).replace(/\//g, "-")}`}
                  label={`${link.label} navigation label`}
                  scope="global"
                  showInlineControls={false}
                >
                  {link.label}
                </EditableText>
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
              <div className="user-profile-container" style={{ position: 'relative', zIndex: 45 }}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="user-profile-trigger"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: '8px 4px'
                  }}
                >
                  <span className="user-greeting" style={{ fontSize: '0.88rem', fontWeight: 750, color: 'var(--text-primary)', fontFamily: "'Outfit', sans-serif" }}>
                    Hi, {currentUser.firstName || "Student"}
                  </span>
                  <svg 
                    viewBox="0 0 24 24" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="var(--text-primary)" 
                    strokeWidth="2.5"
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div 
                    className="user-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '8px 0',
                      width: '160px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      zIndex: 46
                    }}
                  >
                    <button 
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item"
                      style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        borderRadius: 0
                      }}
                    >
                      Profile
                    </button>
                    {isAdmin && (
                      <Link 
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="dropdown-item"
                        style={{
                          display: 'block',
                          padding: '10px 16px',
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#4f46e5',
                          textDecoration: 'none'
                        }}
                      >
                        Admin Portal
                      </Link>
                    )}
                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item"
                      style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        borderRadius: 0
                      }}
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
            onClick={() => setIsMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'transparent'
          }}
        />
      )}

      {/* Mobile Menu Slide-in Drawer Backdrop */}
      <div 
        className={`drawer-overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${isMenuOpen ? "open" : ""}`}>
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
              className="mobile-nav-link"
            >
              <EditableText
                contentKey={`navigation.${link.href === "/" ? "home" : link.href.slice(1).replace(/\//g, "-")}`}
                label={`${link.label} navigation label`}
                scope="global"
                showInlineControls={false}
              >
                {link.label}
              </EditableText>
            </Link>
          ))}
          <div className="mobile-actions">
            {currentUser ? (
              <div className="mobile-user-profile w-full" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <div className="mobile-user-greeting" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'left' }}>
                  Hi, {currentUser.firstName || "Student"}
                </div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button
                      onClick={() => { toggleEditMode(); setIsMenuOpen(false); }}
                      className={`edit-site-toggle ${editMode ? 'active' : ''}`}
                      style={{ flex: 1 }}
                    >
                      <FaPen size={12} />
                      <span>{editMode ? 'Editing' : 'Edit Site'}</span>
                    </button>
                    {editMode && (
                      <button
                        onClick={() => { setLeadsOpen(true); setIsMenuOpen(false); }}
                        className="edit-site-toggle"
                        style={{ flex: 1 }}
                      >
                        <FaDatabase size={12} />
                        <span>Leads</span>
                      </button>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <Button 
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Profile
                  </Button>
                  {isAdmin && (
                    <Button 
                      href="/admin"
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
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
                    className="w-full"
                    style={{ borderColor: '#fca5a5', color: '#dc2626' }}
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
                className="w-full"
              >
                Sign In
              </Button>
            )}
            <Button 
              href="/courses" 
              variant="primary" 
              size="sm" 
              className="w-full" 
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
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
          transition: height 0.3s ease;
        }

        .header.scrolled .header-container {
          height: 64px;
        }

        .logo-group {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: transform 0.3s ease;
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
            gap: var(--spacing-8);
          }
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          position: relative;
          padding: var(--spacing-2) 0;
        }

        .nav-link:hover {
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
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
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
          display: block;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--spacing-2);
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
          transition: all 0.3s ease;
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
          transition: all 0.3s ease;
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
          background: #ffffff;
          box-shadow: -10px 0 30px rgba(15, 23, 42, 0.15);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
          padding: 20px 24px;
          border-bottom: 1px solid var(--bg-surface-border);
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
          width: 32px;
          height: 32px;
          line-height: 32px;
          transition: color 0.2s;
        }

        .drawer-close-btn:hover {
          color: var(--accent-primary);
        }

        .mobile-nav-links {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-link {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 8px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          transition: all 0.2s ease;
          text-align: left;
        }

        .mobile-nav-link:hover {
          color: var(--accent-secondary);
          padding-left: 4px;
        }

        .mobile-actions {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .w-full {
          width: 100%;
        }

        /* User Profile Nav Styling */
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-greeting {
          font-size: 0.88rem;
          font-weight: 750;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
        }

        .dropdown-item:hover {
          background-color: #f8fafc !important;
        }

        .mobile-user-profile {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
          margin-bottom: 8px;
        }

        .mobile-user-greeting {
          font-size: 1.05rem;
          font-weight: 750;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
          margin-bottom: 4px;
        }

        .edit-site-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 999px;
          background: #fff;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Outfit', sans-serif;
        }

        .edit-site-toggle:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .edit-site-toggle.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
      `}</style>
    </>
  );
}
