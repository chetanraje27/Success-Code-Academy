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
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope
} from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();
  const [editSettings, setEditSettings] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const settings = useSiteSettings();

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

            {/* Quick Links Column */}
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
              </div>
              <ul
                id="footer-quick-links"
                className="footer-links"
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

            {/* Our Programs Column */}
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
              </div>
              <ul
                id="footer-program-links"
                className="footer-links"
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

            {/* Contact Us Column */}
            <EditableSection label="Contact Info" onEdit={() => setEditSettings(true)} className="footer-contact-section">
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
                </div>
                <ul
                  id="footer-contact-links"
                  className="footer-contact"
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
              <Link
                href="/faq"
                className={`footer-link ${isActivePath("/faq") ? "active" : ""}`}
                aria-current={isActivePath("/faq") ? "page" : undefined}
              >
                FAQs
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

        /* Only the smallest phones stack the field and the button. 480px was not
           a tier, and from 381px up there is room for them side by side. */
        @media (max-width: 380px) {
          .newsletter-form {
            flex-direction: column;
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

        @media (min-width: 768px) {
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
        @media (min-width: 768px) {
          .footer-legal {
            gap: var(--space-6);
          }
        }

        /* Compact mobile footer */
        @media (max-width: 767px) {
          .footer-newsletter {
            padding: var(--space-6) 0;
          }

          .newsletter-content {
            gap: var(--space-4);
          }

          .newsletter-title {
            margin-bottom: var(--space-1);
            font-size: 1.375rem;
            letter-spacing: 0;
            line-height: 1.15;
          }

          .newsletter-desc {
            font-size: 0.82rem;
            line-height: 1.45;
          }

          .newsletter-form-wrap {
            max-width: none;
          }

          .newsletter-form {
            gap: var(--space-2);
          }

          .newsletter-input,
          .newsletter-form :global(button) {
            min-height: 2.25rem;
            border-radius: 9999px;
          }

          .newsletter-input {
            padding: 0.4rem 1rem;
            font-size: var(--font-size-small);
          }

          .newsletter-form :global(button) {
            padding-inline: 1.25rem;
            font-size: var(--font-size-caption);
          }

          .newsletter-status {
            min-height: 0;
            margin-top: var(--space-1);
          }

          .footer-main {
            padding: var(--space-8) 0 var(--space-6);
          }

          .footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: var(--space-6) var(--space-4);
          }

          .brand-col {
            grid-column: 1 / -1;
            padding-bottom: var(--space-6);
            border-bottom: 1px solid var(--color-border);
            margin-bottom: 0;
          }

          .footer-logo {
            margin-bottom: var(--space-3);
          }

          :global(.logo-image) {
            max-height: 40px;
          }

          .footer-desc {
            max-width: 34rem;
            margin-bottom: var(--space-4);
            font-size: var(--font-size-caption);
            line-height: 1.5;
          }

          .social-links {
            gap: var(--space-2);
          }

          .social-icon {
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 0.55rem;
          }

          .footer-heading-row {
            display: flex;
            align-items: center;
            margin-bottom: var(--space-3);
            padding: 0;
            border-bottom: 0;
          }

          .footer-heading {
            font-size: var(--font-size-caption);
          }

          .footer-links, .footer-contact {
            max-height: none;
            overflow: visible;
            padding: 0;
            margin-top: 0;
            gap: 0.55rem;
            display: flex;
            flex-direction: column;
          }

          .contact-icon {
            width: 24px;
            min-width: 24px;
            height: 24px;
            font-size: var(--font-size-micro);
          }

          .footer-link,
          .footer-contact {
            font-size: var(--font-size-caption);
          }

          :global(.footer-contact-section) {
            grid-column: 1 / -1;
            padding-top: var(--space-5);
            border-top: 1px solid var(--color-border);
          }

          .footer-contact li {
            gap: var(--space-2);
            line-height: 1.5;
          }

          .footer-bottom {
            padding-block: var(--space-4);
          }

          .footer-bottom-content {
            gap: var(--space-2);
            font-size: var(--font-size-micro);
            text-align: center;
          }

          .footer-legal {
            gap: var(--space-3);
          }
        }

        @media (max-width: 380px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--space-5);
          }

          .brand-col,
          :global(.footer-contact-section) {
            grid-column: auto;
          }

          :global(.footer-contact-section) {
            padding-top: var(--space-4);
          }

          .newsletter-title {
            font-size: 1.25rem;
          }

          .newsletter-desc {
            font-size: 0.78rem;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-form :global(button) {
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}
