"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, navLinks } from "@/data/home";
import Button from "@/components/ui/Button";
import EditableSection from "@/components/admin/EditableSection";
import SettingsEditor from "@/components/admin/SettingsEditor";
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editSettings, setEditSettings] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Stay Updated</h3>
              <p className="newsletter-desc">
                Subscribe to our newsletter for the latest news and updates.
              </p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </form>
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
              <p className="footer-desc">{siteConfig.description}</p>
              <div className="social-links">
                {[
                  { name: "Facebook", icon: <FaFacebookF size={18} />, href: siteConfig.social.facebook },
                  { name: "Twitter", icon: <FaXTwitter size={18} />, href: siteConfig.social.twitter },
                  { name: "Instagram", icon: <FaInstagram size={18} />, href: siteConfig.social.instagram },
                  { name: "LinkedIn", icon: <FaLinkedinIn size={18} />, href: siteConfig.social.linkedin },
                  { name: "YouTube", icon: <FaYoutube size={18} />, href: siteConfig.social.youtube },
                ].map((social) => (
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
              </div>
            </div>

            {/* Quick Links Column (Accordion on Mobile) */}
            <div className="footer-col">
              <h4 className="footer-heading" onClick={() => toggleSection("links")}>
                Quick Links
                <span className={`accordion-chevron ${expandedSection === "links" ? "rotated" : ""}`}>
                  <FaChevronDown size={14} />
                </span>
              </h4>
              <ul className={`footer-links ${expandedSection === "links" ? "expanded" : ""}`}>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Programs Column (Accordion on Mobile) */}
            <div className="footer-col">
              <h4 className="footer-heading" onClick={() => toggleSection("programs")}>
                Our Programs
                <span className={`accordion-chevron ${expandedSection === "programs" ? "rotated" : ""}`}>
                  <FaChevronDown size={14} />
                </span>
              </h4>
              <ul className={`footer-links ${expandedSection === "programs" ? "expanded" : ""}`}>
                {[
                  "NEET Dropper Batch",
                  "NEET Target Batch",
                  "NEET Foundation",
                  "NEET Crash Course",
                  "Mock Test Series",
                ].map((course) => (
                  <li key={course}>
                    <Link href="/courses" className="footer-link">
                      {course}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Column (Accordion on Mobile) */}
            <EditableSection label="Contact Info" onEdit={() => setEditSettings(true)}>
            <div className="footer-col">
              <h4 className="footer-heading" onClick={() => toggleSection("contact")}>
                Contact Us
                <span className={`accordion-chevron ${expandedSection === "contact" ? "rotated" : ""}`}>
                  <FaChevronDown size={14} />
                </span>
              </h4>
              <ul className={`footer-contact ${expandedSection === "contact" ? "expanded" : ""}`}>
                <li>
                  <span className="contact-icon"><FaLocationDot /></span>
                  <span>{siteConfig.address}</span>
                </li>
                <li>
                  <span className="contact-icon"><FaPhone /></span>
                  <a href={`tel:${siteConfig.phone}`} className="footer-link">
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <span className="contact-icon"><FaEnvelope /></span>
                  <a href={`mailto:${siteConfig.email}`} className="footer-link">
                    {siteConfig.email}
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
              <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>

      <SettingsEditor open={editSettings} onClose={() => setEditSettings(false)} />

      <style jsx>{`
        .footer {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          position: relative;
        }

        .footer-newsletter {
          border-bottom: 1px solid var(--bg-surface-border);
          padding: var(--spacing-12) 0;
        }

        .newsletter-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
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
          margin-bottom: var(--spacing-2);
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
          max-width: 400px;
          gap: var(--spacing-3);
        }

        @media (min-width: 480px) {
          .newsletter-form {
            flex-direction: row;
          }
        }

        .newsletter-input {
          flex: 1;
          padding: var(--spacing-3) var(--spacing-4);
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.3s ease;
        }

        .newsletter-input:focus {
          border-color: var(--accent-primary);
        }

        .footer-main {
          padding: var(--spacing-16) 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-12);
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-6);
        }

        :global(.logo-image) {
          object-fit: contain;
          max-height: 48px;
          width: auto;
        }

        .footer-desc {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-6);
          line-height: 1.6;
          text-align: left;
        }

        .social-links {
          display: flex;
          gap: var(--spacing-4);
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: var(--bg-surface);
          border: 1px solid var(--bg-surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: var(--bg-surface-hover);
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }

        .footer-heading {
          font-size: 1.125rem;
          margin-bottom: var(--spacing-6);
          text-align: left;
          font-weight: 700;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }

        .footer-link {
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: var(--accent-primary);
        }

        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          color: var(--text-secondary);
        }

        .footer-contact li {
          display: flex;
          gap: var(--spacing-3);
          align-items: flex-start;
          line-height: 1.6;
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
          padding: var(--spacing-6) 0;
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-4);
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
          gap: var(--spacing-4);
        }
        @media (min-width: 640px) {
          .footer-legal {
            gap: var(--spacing-6);
          }
        }

        .accordion-chevron {
          display: none;
        }

        /* Mobile Accordion Styles */
        @media (max-width: 768px) {
          .footer-main {
            padding: var(--spacing-8) 0;
          }
          .footer-grid {
            gap: 0;
          }
          .brand-col {
            padding-bottom: 24px;
            border-bottom: 1px solid var(--bg-surface-border);
            margin-bottom: 16px;
          }
          .footer-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            padding: 16px 0;
            margin-bottom: 0;
            border-bottom: 1px solid rgba(226, 232, 240, 0.6);
            font-size: 1rem;
          }
          .accordion-chevron {
            display: flex;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: var(--text-muted);
          }
          .accordion-chevron.rotated {
            transform: rotate(180deg);
            color: var(--accent-primary);
          }
          .footer-links, .footer-contact {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            padding-left: 4px;
            margin-top: 0;
            gap: 8px;
            display: flex;
            flex-direction: column;
          }
          .footer-links.expanded, .footer-contact.expanded {
            max-height: 350px;
            padding: 16px 0;
            border-bottom: 1px solid rgba(226, 232, 240, 0.6);
          }
        }
      `}</style>
    </footer>
  );
}
