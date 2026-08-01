"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig, navLinks } from "@/data/home";
import Button from "@/components/ui/Button";
import EditableSection from "@/components/admin/EditableSection";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { useSiteSettings } from "@/lib/site-settings";
import { EditableText } from "@/components/admin/EditableText";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaChevronDown
} from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editSettings, setEditSettings] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const settings = useSiteSettings();

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const isActivePath = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage("Newsletter signup is currently unavailable.");
  };

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">
                <EditableText
                  contentKey="footer.newsletter.title"
                  label="newsletter title"
                  scope="global"
                >
                  Stay Updated
                </EditableText>
              </h3>
              <p className="newsletter-desc">
                <EditableText
                  contentKey="footer.newsletter.description"
                  label="newsletter description"
                  scope="global"
                  kind="multiline"
                >
                  Subscribe to our newsletter for the latest news and updates.
                </EditableText>
              </p>
            </div>
            <div className="newsletter-form-wrap">
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address for newsletter
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  autoComplete="email"
                  required
                  onChange={() => newsletterMessage && setNewsletterMessage("")}
                />
                <Button variant="primary" type="submit">
                  Subscribe
                </Button>
              </form>
              <p className="newsletter-status" role="status" aria-live="polite">
                {newsletterMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <Link href="/" className="footer-logo">
                <Image
                  src={siteConfig.logo.src}
                  alt="Success Code Academy Logo"
                  width={siteConfig.logo.width}
                  height={siteConfig.logo.height}
                  className="logo-image"
                  unoptimized
                />
              </Link>
              <p className="footer-desc">
                <EditableText
                  contentKey="footer.brand.description"
                  label="academy footer description"
                  scope="global"
                  kind="multiline"
                >
                  {siteConfig.description}
                </EditableText>
              </p>
              <EditableSection
                label="Social Links"
                onEdit={() => setEditSettings(true)}
                className="social-links"
              >
                {[
                  { name: "Facebook", icon: <FaFacebookF size={18} />, href: settings.facebook },
                  { name: "Instagram", icon: <FaInstagram size={18} />, href: settings.instagram },
                  { name: "LinkedIn", icon: <FaLinkedinIn size={18} />, href: settings.linkedin },
                  { name: "YouTube", icon: <FaYoutube size={18} />, href: settings.youtube },
                ].filter((social) => social.href).map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </EditableSection>
            </div>

            {/* Quick Links Column (Accordion on Mobile) */}
            <div className="footer-col">
              <div className="footer-heading-row">
                <h4 className="footer-heading">
                  <EditableText
                    contentKey="footer.quick-links.title"
                    label="quick links heading"
                    scope="global"
                  >
                    Quick Links
                  </EditableText>
                </h4>
                <button
                  type="button"
                  className="accordion-toggle"
                  onClick={() => toggleSection("links")}
                  aria-expanded={expandedSection === "links"}
                  aria-controls="footer-quick-links"
                  aria-label="Toggle quick links"
                >
                  <span className={`accordion-chevron ${expandedSection === "links" ? "rotated" : ""}`}>
                    <FaChevronDown size={14} />
                  </span>
                </button>
              </div>
              <ul
                id="footer-quick-links"
                className={`footer-links ${expandedSection === "links" ? "expanded" : ""}`}
              >
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`footer-link ${isActivePath(link.href) ? "active" : ""}`}
                      aria-current={isActivePath(link.href) ? "page" : undefined}
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
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Programs Column (Accordion on Mobile) */}
            <div className="footer-col">
              <div className="footer-heading-row">
                <h4 className="footer-heading">
                  <EditableText
                    contentKey="footer.programs.title"
                    label="programs heading"
                    scope="global"
                  >
                    Our Programs
                  </EditableText>
                </h4>
                <button
                  type="button"
                  className="accordion-toggle"
                  onClick={() => toggleSection("programs")}
                  aria-expanded={expandedSection === "programs"}
                  aria-controls="footer-program-links"
                  aria-label="Toggle programs"
                >
                  <span className={`accordion-chevron ${expandedSection === "programs" ? "rotated" : ""}`}>
                    <FaChevronDown size={14} />
                  </span>
                </button>
              </div>
              <ul
                id="footer-program-links"
                className={`footer-links ${expandedSection === "programs" ? "expanded" : ""}`}
              >
                {[
                  "NEET 11th-12th Batch",
                  "NEET Reapeaters Batch",
                  "Mock Test Series - Offline",
                  "Mock Test Series - Online",
                ].map((course) => (
                  <li key={course}>
                    <Link href="/courses" className="footer-link">
                      <EditableText
                        contentKey={`footer.programs.${course.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        label={`${course} program label`}
                        scope="global"
                        showInlineControls={false}
                      >
                        {course}
                      </EditableText>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Column (Accordion on Mobile) */}
            <EditableSection label="Contact Info" onEdit={() => setEditSettings(true)}>
              <div className="footer-col">
                <div className="footer-heading-row">
                  <h4 className="footer-heading">
                    <EditableText
                      contentKey="footer.contact.title"
                      label="contact heading"
                      scope="global"
                    >
                      Contact Us
                    </EditableText>
                  </h4>
                  <button
                    type="button"
                    className="accordion-toggle"
                    onClick={() => toggleSection("contact")}
                    aria-expanded={expandedSection === "contact"}
                    aria-controls="footer-contact-links"
                    aria-label="Toggle contact information"
                  >
                    <span className={`accordion-chevron ${expandedSection === "contact" ? "rotated" : ""}`}>
                      <FaChevronDown size={14} />
                    </span>
                  </button>
                </div>
                <ul
                  id="footer-contact-links"
                  className={`footer-contact ${expandedSection === "contact" ? "expanded" : ""}`}
                >
                  <li>
                    <span className="contact-icon" style={{ marginTop: '2px' }}><FaLocationDot /></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {settings.address1 && (
                        <div>
                          <strong>Girls Branch:</strong><br />
                          {settings.address1}
                        </div>
                      )}
                      {settings.address2 && (
                        <div>
                          <strong>Boys Branch:</strong><br />
                          {settings.address2}
                        </div>
                      )}
                    </div>
                  </li>
                  <li>
                    <span className="contact-icon"><FaPhone /></span>
                    <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="footer-link">
                      {settings.phone}
                    </a>
                  </li>
                  <li>
                    <span className="contact-icon"><FaEnvelope /></span>
                    <a href={`mailto:${settings.email}`} className="footer-link">
                      {settings.email}
                    </a>
                  </li>
                </ul>
              </div>
            </EditableSection>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Success Code Academy. All rights reserved.</p>
            <div className="footer-legal">
              <Link
                href="/privacy-policy"
                className={`footer-link ${isActivePath("/privacy-policy") ? "active" : ""}`}
                aria-current={isActivePath("/privacy-policy") ? "page" : undefined}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className={`footer-link ${isActivePath("/terms") ? "active" : ""}`}
                aria-current={isActivePath("/terms") ? "page" : undefined}
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <SettingsEditor open={editSettings} onClose={() => setEditSettings(false)} />

      <style jsx>{`
        .footer {
          background: var(--color-surface);
          border-top: 1px solid var(--color-border);
          position: relative;
        }

        .footer-newsletter {
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-10) 0;
        }

        .newsletter-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        @media (min-width: 1024px) {
          .newsletter-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .newsletter-title {
          font-size: 1.5rem;
          margin-bottom: var(--space-2);
          text-align: left;
        }

        .newsletter-desc {
          color: var(--text-secondary);
          text-align: left;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: var(--space-3);
        }

        .newsletter-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        .newsletter-status {
          min-height: 1.25rem;
          margin-top: var(--space-2);
          color: var(--text-muted);
          font-size: var(--font-size-caption);
          line-height: 1.4;
          text-align: left;
        }

        @media (min-width: 480px) {
          .newsletter-form {
            flex-direction: row;
          }
        }

        .newsletter-input {
          flex: 1;
          min-width: 0;
          min-height: var(--control-height-md);
          padding: var(--space-3) var(--space-4);
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-control);
          color: var(--text-primary);
          outline: none;
          transition:
            border-color var(--duration-fast) var(--ease-standard),
            box-shadow var(--duration-fast) var(--ease-standard);
        }

        .newsletter-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .footer-main {
          padding: var(--space-12) 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-10);
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.2fr 0.9fr 1.25fr 2.5fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          margin-bottom: var(--space-5);
        }

        :global(.logo-image) {
          object-fit: contain;
          max-height: 48px;
          width: auto;
        }

        .footer-desc {
          color: var(--text-secondary);
          margin-bottom: var(--space-5);
          line-height: var(--line-height-relaxed);
          text-align: left;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .social-icon {
          width: var(--touch-target);
          height: var(--touch-target);
          border-radius: var(--radius-control);
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition:
            color var(--duration-fast) var(--ease-standard),
            background-color var(--duration-fast) var(--ease-standard),
            border-color var(--duration-fast) var(--ease-standard),
            transform var(--duration-fast) var(--ease-standard);
        }

        .social-icon:hover {
          background: var(--color-surface-hover);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .footer-heading-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-5);
        }

        .footer-heading {
          font-size: 1.125rem;
          margin: 0;
          text-align: left;
          font-weight: 700;
        }

        .accordion-toggle {
          display: none;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer-link {
          color: var(--text-secondary);
          transition: color var(--duration-fast) var(--ease-standard);
        }

        .footer-link:hover,
        .footer-link.active {
          color: var(--accent-primary);
        }

        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          color: var(--text-secondary);
        }

        .footer-contact li {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
          line-height: var(--line-height-relaxed);
          text-align: left;
        }

        .contact-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          width: 20px;
          min-width: 20px;
          height: 20px;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .footer-bottom {
          border-top: 1px solid var(--bg-surface-border);
          padding: var(--space-5) 0 max(var(--space-5), env(safe-area-inset-bottom));
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        @media (min-width: 640px) {
          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-legal {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-4);
        }
        @media (min-width: 640px) {
          .footer-legal {
            gap: var(--space-6);
          }
        }

        .accordion-chevron {
          display: flex;
        }

        /* Mobile Accordion Styles */
        @media (max-width: 767px) {
          .footer-main {
            padding: var(--space-8) 0;
          }
          .footer-grid {
            gap: 0;
          }
          .brand-col {
            padding-bottom: var(--space-6);
            border-bottom: 1px solid var(--color-border);
            margin-bottom: var(--space-2);
          }

          .footer-heading-row {
            min-height: var(--touch-target);
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0;
            padding: var(--space-2) 0 var(--space-2) var(--space-1);
            border-bottom: 1px solid var(--color-border);
          }

          .footer-heading {
            font-size: 1rem;
          }

          .accordion-toggle {
            display: flex;
            width: var(--touch-target);
            height: var(--touch-target);
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            background: transparent;
            border: 0;
            border-radius: var(--radius-control);
            cursor: pointer;
          }

          .accordion-toggle:hover {
            background: var(--color-surface-subtle);
          }

          .accordion-chevron {
            transition: transform var(--duration-normal) var(--ease-standard);
            color: var(--text-muted);
          }

          .accordion-chevron.rotated {
            transform: rotate(180deg);
            color: var(--accent-primary);
          }

          .footer-links, .footer-contact {
            max-height: 0;
            overflow: hidden;
            transition: max-height var(--duration-overlay) var(--ease-standard);
            padding-left: var(--space-1);
            margin-top: 0;
            gap: var(--space-2);
            display: flex;
            flex-direction: column;
          }

          .footer-links.expanded, .footer-contact.expanded {
            max-height: 350px;
            padding: var(--space-4) var(--space-1);
            border-bottom: 1px solid var(--color-border);
          }
        }
      `}</style>
    </footer>
  );
}
