"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSiteSettings } from "@/lib/site-settings";
import { EditableText } from "@/components/admin/EditableText";
import EditableSection from "@/components/admin/EditableSection";
import SettingsEditor from "@/components/admin/SettingsEditor";

const CAMPUS_NAME = "Success Code Academy, NEET Specialist, Baramati.";
const DEFAULT_ADDRESS =
  "2nd Floor, Nanaware- Gadhave Pride, Baramati-Bhigwan Rd, near Pandharpur Bank, Pushpak Apartment, Baramati, Maharashtra 413102, India";

/* ─── Math CAPTCHA ─── */
type Op = "+" | "−" | "×";
function generateCaptcha(): { question: string; answer: number } {
  const ops: Op[] = ["+", "−", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a + b;
  } else if (op === "−") {
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

const INITIAL_CAPTCHA = { question: "1 + 1 = ?", answer: 2 };

export default function ContactClient() {
  const settings = useSiteSettings();
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [captcha, setCaptcha] = useState(INITIAL_CAPTCHA);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [editSettings, setEditSettings] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refreshCaptcha, 0);
    return () => window.clearTimeout(timer);
  }, [refreshCaptcha]);

  const mapQuery = `${CAMPUS_NAME} ${settings.address1 || DEFAULT_ADDRESS}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=17&ie=UTF8&iwloc=near&output=embed`;

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCaptchaError("");
    const val = parseInt(captchaInput.trim(), 10);
    if (isNaN(val) || val !== captcha.answer) {
      setCaptchaError("Wrong answer — please try again.");
      refreshCaptcha();
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    setFormStatus("submitting");
    try {
      const response = await fetch("/api/public/forms/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormStatus("success");
    } catch (error) {
      console.error(error);
      setCaptchaError("Failed to send message. Please try again.");
      setFormStatus("idle");
    } finally {
      refreshCaptcha();
    }
  }

  return (
    <section className="contact-page">
      <h1 className="sr-only">Contact Success Code Academy</h1>

      {/* ══════════════════════════════════════════
          HERO BANNER — Contact Poster Section
          ══════════════════════════════════════════ */}
      <div className="contact-hero-banner">
        <div className="contact-hero-container">
          <motion.div
            className="contact-poster-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="poster-img-container">
              <Image
                src="/images/banners/ContactPoster.png"
                alt="Contact Success Code Academy Poster"
                width={800}
                height={500}
                className="contact-poster-img"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN RE-DESIGNED CONTACT SECTION
          ══════════════════════════════════════════ */}
      <div className="contact-premium-section">
        <div className="insights-premium-container">
          <div className="contact-grid-wrap">
            {/* Left side: Premium Contact Information List */}
            <div className="contact-left-details">
              <div className="contact-title-group">
                <div className="title-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h2 className="contact-info-title">
                  <EditableText
                    contentKey="contact.heading"
                    label="contact information heading"
                  >
                    Contact
                  </EditableText>
                  <span className="blue-title-highlight"> Information</span>
                </h2>
              </div>

              <p className="contact-info-subtitle-desc">
                <EditableText
                  contentKey="contact.description"
                  label="contact introduction"
                  kind="multiline"
                >
                  Have questions about admissions, courses, or scheduling? Reach out directly to our team.
                </EditableText>
              </p>

              <EditableSection
                label="Contact Details"
                onEdit={() => setEditSettings(true)}
              >
                <div className="enhanced-contact-list">
                  {/* Address Item */}
                  <div className="premium-contact-card">
                    <div className="contact-icon-circle">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="contact-text-block">
                      <h4 className="contact-item-title">
                        <EditableText contentKey="contact.address-label" label="address label">
                          Address
                        </EditableText>
                      </h4>
                      <div className="contact-item-desc" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {settings.address1 && (
                          <div>
                            <strong style={{ color: '#0f172a' }}>Girls Branch:</strong><br />
                            {settings.address1}
                          </div>
                        )}
                        {settings.address2 && (
                          <div>
                            <strong style={{ color: '#0f172a' }}>Boys Branch:</strong><br />
                            {settings.address2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Phone Item */}
                  <div className="premium-contact-card">
                    <div className="contact-icon-circle">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="contact-text-block">
                      <h4 className="contact-item-title">
                        <EditableText contentKey="contact.phone-label" label="phone label">
                          Phone
                        </EditableText>
                      </h4>
                      <p className="contact-item-desc">
                        <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="contact-link">{settings.phone}</a>
                      </p>
                    </div>
                  </div>

                  {/* Email Item */}
                  <div className="premium-contact-card">
                    <div className="contact-icon-circle">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className="contact-text-block">
                      <h4 className="contact-item-title">
                        <EditableText contentKey="contact.email-label" label="email label">
                          Email
                        </EditableText>
                      </h4>
                      <p className="contact-item-desc">
                        <a href={`mailto:${settings.email}`} className="contact-link">
                          {settings.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Working Hours Item */}
                  <div className="premium-contact-card">
                    <div className="contact-icon-circle">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="contact-text-block">
                      <h4 className="contact-item-title">
                        <EditableText contentKey="contact.hours-label" label="working hours label">
                          Working Hours
                        </EditableText>
                      </h4>
                      <p className="contact-item-desc">
                        <EditableText contentKey="contact.hours" label="working hours">
                          Monday - Saturday: 9:00 AM - 6:00 PM
                        </EditableText>
                      </p>
                    </div>
                  </div>
                </div>
              </EditableSection>
            </div>

            {/* Right side: Glassmorphic form container with grid mesh pattern */}
            <div className="contact-right-form">
              <div className="form-grid-mesh"></div>

              <div className="form-inner-content">
                {formStatus === "success" ? (
                  <div className="dark-success-view">
                    <div className="success-icon-wrap">✓</div>
                    <h3 className="success-heading">Message Sent!</h3>
                    <p className="success-desc">Our academic support team will get in touch with you shortly.</p>
                    <button className="dark-reset-btn" onClick={() => setFormStatus("idle")}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="dark-form-element">
                    <div className="form-card-header">
                      <div className="form-header-icon">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3 className="form-card-title">
                        Send us a message and we&apos;ll get back to you shortly.
                      </h3>
                    </div>
                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-name">Full name</label>
                      <div className="input-with-icon">
                        <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <input
                          id="cf-name"
                          name="name"
                          type="text"
                          placeholder="Manoj Kumar"
                          className="dark-form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-email">Email Address</label>
                      <div className="input-with-icon">
                        <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                          id="cf-email"
                          name="email"
                          type="email"
                          placeholder="example@gmail.com"
                          className="dark-form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-phone">Contact Number</label>
                      <div className="input-with-icon">
                        <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <input
                          id="cf-phone"
                          name="phone"
                          type="tel"
                          placeholder="E.g. +91 XXXXXXXXXX"
                          className="dark-form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-message">Message</label>
                      <textarea
                        id="cf-message"
                        name="message"
                        rows={4}
                        placeholder="Type your message here"
                        className="dark-form-input dark-form-textarea"
                        required
                      />
                    </div>

                    {/* Math CAPTCHA inside Form */}
                    <div className="dark-captcha-box">
                      <div className="dark-captcha-header">
                        <span className="captcha-label-txt">Human Verification</span>
                        <button type="button" onClick={refreshCaptcha} className="dark-captcha-reload" aria-label="Reload Captcha">
                          ⟳
                        </button>
                      </div>
                      <div className="dark-captcha-row">
                        <span
                          className="dark-captcha-q"
                          id="captcha-question"
                          aria-live="polite"
                        >
                          {captcha.question}
                        </span>
                        <input
                          id="captcha-answer"
                          type="number"
                          placeholder="Answer"
                          aria-labelledby="captcha-question"
                          aria-describedby={captchaError ? "captcha-error" : undefined}
                          aria-invalid={Boolean(captchaError)}
                          value={captchaInput}
                          onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(""); }}
                          className="dark-form-input dark-captcha-input"
                          min={0}
                          required
                        />
                      </div>
                      {captchaError && (
                        <p
                          className="dark-captcha-error-msg"
                          id="captcha-error"
                          role="alert"
                        >
                          ⚠ {captchaError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="dark-submit-btn"
                      disabled={formStatus === "submitting"}
                    >
                      {formStatus === "submitting" ? "Sending…" : "Submit"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAP & DISTANCE CALCULATOR CONTAINER
          ══════════════════════════════════════════ */}
      <div className="contact-container">
        <motion.div
          className="map-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >

          <div className="map-frame">
            <iframe
              title="Success Code Academy location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>

      <SettingsEditor
        open={editSettings}
        onClose={() => setEditSettings(false)}
      />

      <style jsx>{`
        .contact-page {
          position: relative;
          z-index: 1;
          background: #ffffff;
        }

        /* Set consistent site font for all elements */
        .contact-page,
        .contact-premium-section,
        .contact-premium-section :where(h1, h2, h3, h4, p, span, label, input, textarea, button),
        .map-tooltip-bubble {
          font-family: var(--font-sans), "Inter", "Segoe UI", system-ui, sans-serif !important;
        }

        /* ════════════════════════════════
           HERO BANNER — full-bleed, no gutters
           ════════════════════════════════ */
        :global(.public-shell .contact-page .contact-hero-banner) {
          position: relative;
          left: 50%;
          width: 100vw;
          margin-left: -50vw;
          margin-right: -50vw;
          padding: 76px 0 0 0 !important;
          background: #ffffff !important;
          overflow: hidden;
        }
        :global(.public-shell .contact-page .contact-hero-container) {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        :global(.public-shell .contact-page .contact-poster-wrapper) {
          width: 100% !important;
          border-radius: 0 !important;
          overflow: hidden;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        :global(.public-shell .contact-page .poster-img-container) {
          width: 100%;
          line-height: 0;
          aspect-ratio: 1916 / 821;
          overflow: hidden;
        }
        :global(.public-shell .contact-page .contact-poster-img) {
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          display: block !important;
          object-fit: cover !important;
          object-position: center center !important;
        }

        /* ════════════════════════════════
           ACETERNITY STYLE CONTACT
           ════════════════════════════════ */
        .contact-premium-section {
          background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
          padding: 64px 0;
          position: relative;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid #e2e8f0;
        }

        .insights-premium-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        .contact-grid-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: stretch;
        }

        /* Left details */
        .contact-left-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .contact-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .title-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #1e3a8a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(30, 58, 138, 0.25);
        }
        .contact-info-title {
          font-size: clamp(1.75rem, 3.2vw, 2.25rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .blue-title-highlight {
          color: #1e3a8a;
        }
        .contact-info-subtitle-desc {
          font-size: 1rem;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 32px;
          max-width: 520px;
        }

        .enhanced-contact-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .premium-contact-card {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 22px 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .premium-contact-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 24px -8px rgba(15, 23, 42, 0.08);
          transform: translateY(-2px);
        }
        .contact-icon-circle {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1e3a8a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ffffff;
        }
        .contact-text-block {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .contact-item-title {
          margin: 0 0 6px 0;
          color: #0f172a;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
        }
        .contact-item-desc {
          margin: 0;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .contact-link {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 600;
        }
        .contact-link:hover {
          color: #1e3a8a;
        }

        @media (max-width: 640px) {
          .contact-title-group {
            gap: 12px;
          }
          .title-icon-wrapper {
            width: 44px;
            height: 44px;
            border-radius: 12px;
          }
          .title-icon-wrapper svg {
            width: 24px;
            height: 24px;
          }
          .premium-contact-card {
            padding: 18px;
          }
        }

        /* Right Form: consistent with admissions form */
        .contact-right-form {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 30px;
          color: #10233f;
          background: linear-gradient(180deg, #eef1f6 0, #fff 11rem);
          border: 1px solid #d4dbe6;
          border-radius: 16px;
          box-sizing: border-box;
        }
        .contact-right-form::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, #0257d0, #102f5e);
          pointer-events: none;
          z-index: 2;
        }
        .contact-right-form .form-card-header,
        .contact-right-form .form-inner-content,
        .contact-right-form .dark-success-view {
          position: relative;
          z-index: 1;
        }
        .form-card-header {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          gap: 14px;
          align-items: center;
          margin-bottom: 23px;
        }
        .form-header-icon {
          display: grid;
          width: 48px;
          height: 48px;
          margin: 0;
          place-items: center;
          color: #fff;
          background: #10233f;
          border: 1px solid #1d3a63;
          border-radius: 11px;
        }
        .form-header-icon svg {
          width: 25px;
          height: 25px;
          stroke: #fff;
        }
        .form-card-title {
          margin: 0;
          color: #10233f;
          font-size: 1.05rem;
          font-weight: 650;
          letter-spacing: -0.025em;
          line-height: 1.35;
        }

        .form-grid-mesh {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(15,23,42,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.02) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 1;
        }

        .form-inner-content {
          position: relative;
          z-index: 5;
        }

        .dark-form-element {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .form-input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          pointer-events: none;
        }
        .input-with-icon input,
        .input-with-icon textarea {
          width: 100%;
          padding: 11px 13px 11px 46px;
          box-sizing: border-box;
        }

        .dark-form-label {
          font-size: 0.72rem;
          font-weight: 650;
          color: #41536a;
        }

        .dark-form-input {
          background: #ffffff !important;
          border: 1px solid #cdd9e4 !important;
          border-radius: 9px;
          padding: 11px 13px;
          color: #10233f !important;
          font-size: 0.9rem;
          width: 100%;
          box-sizing: border-box;
          min-height: 46px;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .dark-form-input:focus {
          outline: none;
          border-color: #0257d0 !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          background: #ffffff !important;
        }

        .dark-form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        /* CAPTCHA box */
        .dark-captcha-box {
          background: #f8fafc;
          border: 1px solid #cdd9e4;
          border-radius: 9px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dark-captcha-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .captcha-label-txt {
          font-size: 0.72rem;
          font-weight: 750;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dark-captcha-reload {
          background: none;
          border: none;
          color: #102f5e;
          font-size: 1.15rem;
          cursor: pointer;
          padding: 0;
          transition: transform 0.3s;
        }
        .dark-captcha-reload:hover {
          transform: rotate(180deg);
        }

        .dark-captcha-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dark-captcha-q {
          background: #ffffff;
          border: 1px solid #cdd9e4;
          border-radius: 8px;
          color: #10233f;
          font-size: 1.05rem;
          font-weight: 800;
          padding: 8px 16px;
        }

        .dark-captcha-input {
          max-width: 120px !important;
          text-align: center;
        }

        .dark-captcha-error-msg {
          font-size: 0.82rem;
          color: #a21f2d;
          margin: 0;
          font-weight: 600;
        }

        .dark-submit-btn {
          width: 100%;
          background: #102f5e;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 14px 20px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          min-height: 49px;
          box-shadow: none;
          transition: background 160ms ease, box-shadow 160ms ease, transform 160ms ease;
          margin-top: 10px;
        }

        .dark-submit-btn:hover {
          background: #1b4f86;
          box-shadow: 0 12px 24px -12px rgba(16, 47, 94, 0.45);
          transform: translateY(-1px);
        }

        /* Success View */
        .dark-success-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 0;
        }

        .success-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          border: 1.5px solid #10b981;
          color: #10b981;
          font-size: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .success-heading {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .success-desc {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .dark-reset-btn {
          background: #f1f5f9;
          color: #0f172a;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dark-reset-btn:hover {
          background: #e2e8f0;
        }

        /* ════════════════════════════════
           MAP — full-bleed, no gutters
           ════════════════════════════════ */
        :global(.public-shell .contact-page .contact-container) {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        :global(.public-shell .contact-page .map-container) {
          padding: 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }

        .map-heading {
          text-align: center;
          padding: 40px 16px 24px;
          margin-bottom: 0;
        }

        .map-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 750;
          color: #102f5e;
          background: rgba(16, 47, 94, 0.06);
          padding: 4px 12px;
          border-radius: 99px;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .map-heading h3 {
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          color: #10233f;
          margin: 0;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .map-addr {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0;
        }

        .map-frame {
          border-radius: 0;
          overflow: hidden;
          border: none;
          box-shadow: none;
        }
        .map-frame iframe {
          width: 100%;
          height: 460px;
          border: 0;
          display: block;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .contact-grid-wrap {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          :global(.public-shell .contact-page .contact-hero-banner) {
            padding-top: 72px !important;
          }
          .contact-poster-wrapper {
            border-radius: 0 !important;
          }
          .contact-right-form {
            padding: 30px 20px;
          }
        }

        @media (max-width: 640px) {
          .contact-premium-section {
            padding: 50px 0;
          }
          .map-frame iframe {
            height: 360px;
          }
        }
      `}</style>
    </section>
  );
}
