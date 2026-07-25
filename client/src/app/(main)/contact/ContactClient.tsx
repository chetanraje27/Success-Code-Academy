"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useSiteSettings } from "@/lib/site-settings";
import { EditableText } from "@/components/admin/EditableText";

const DESTINATION = {
  address:
    "Success Code Academy, NEET Specialist, Baramati., 2nd Floor, Nanaware- Gadhave Pride, Baramati-Bhigwan Rd, near Pandharpur Bank, Pushpak Apartment, Baramati, Maharashtra 413102",
  lat: 17.9183,
  lng: 74.5814,
};

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

export default function ContactClient() {
  const settings = useSiteSettings();
  const [origin, setOrigin] = useState("");
  const [distanceText, setDistanceText] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [isFindingDistance, setIsFindingDistance] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(settings.address || DESTINATION.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  async function handleDistanceCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDistanceText(""); setDistanceError("");
    const trimmed = origin.trim();
    if (!trimmed) { setDistanceError("Please enter your starting location."); return; }
    setIsFindingDistance(true);
    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}`,
        { headers: { Accept: "application/json" } }
      ).then(r => r.json());
      if (!Array.isArray(geo) || geo.length === 0) throw new Error("Location not found.");
      const { lat, lon } = geo[0];
      const route = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${lon},${lat};${DESTINATION.lng},${DESTINATION.lat}?overview=false&alternatives=false`,
        { headers: { Accept: "application/json" } }
      ).then(r => r.json());
      if (!route.routes?.length) throw new Error("Unable to calculate route.");
      const km = (route.routes[0].distance / 1000).toFixed(1);
      setDistanceText(`Distance from "${trimmed}" to Success Code Academy: ${km} km`);
    } catch (err) {
      setDistanceError(err instanceof Error ? err.message : "Could not calculate distance.");
    } finally { setIsFindingDistance(false); }
  }

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/forms/contact`, {
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
          MAIN RE-DESIGNED CONTACT SECTION (THEME MATCHED LIGHT THEME)
          ══════════════════════════════════════════ */}
      <div className="contact-premium-section">
        <div className="insights-premium-container">

          <div className="contact-grid-wrap">
            {/* Left side: Premium Contact Information List */}
            <div className="contact-left-details">
              <h2 className="contact-info-title">
                <EditableText
                  contentKey="contact.heading"
                  label="contact information heading"
                >
                  Contact Information
                </EditableText>
              </h2>
              <p className="contact-info-subtitle-desc">
                <EditableText
                  contentKey="contact.description"
                  label="contact introduction"
                  kind="multiline"
                >
                  Have questions about admissions, courses, or scheduling? Reach out directly to our team.
                </EditableText>
              </p>

              <div className="enhanced-contact-list">
                
                {/* Address Item */}
                <div className="contact-detail-item">
                  <div className="detail-icon-box contact-bg-blue">
                    <Image src="/images/ui/location.png" alt="Location" width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                  <div className="detail-content-box">
                    <h4 className="detail-item-label">Address</h4>
                    <p className="detail-item-text">
                      {settings.address}
                    </p>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="contact-detail-item">
                  <div className="detail-icon-box contact-bg-blue">
                    <Image src="/images/ui/phone-ringing.png" alt="Phone" width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                  <div className="detail-content-box">
                    <h4 className="detail-item-label">Phone</h4>
                    <p className="detail-item-text">
                      <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="detail-link">{settings.phone}</a>
                    </p>
                  </div>
                </div>

                {/* Email Item */}
                <div className="contact-detail-item">
                  <div className="detail-icon-box contact-bg-blue">
                    <Image src="/images/ui/email.png" alt="Email" width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                  <div className="detail-content-box">
                    <h4 className="detail-item-label">Email</h4>
                    <p className="detail-item-text">
                      <a href={`mailto:${settings.email}`} className="detail-link">{settings.email}</a>
                    </p>
                  </div>
                </div>

                {/* Working Hours Item */}
                <div className="contact-detail-item">
                  <div className="detail-icon-box contact-bg-blue">
                    <Image src="/images/ui/clock (1).png" alt="Working Hours" width={24} height={24} style={{ objectFit: "contain" }} />
                  </div>
                  <div className="detail-content-box">
                    <h4 className="detail-item-label">Working Hours</h4>
                    <p className="detail-item-text">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Glassmorphic form container with grid mesh pattern (Theme Matched) */}
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
                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-name">Full name</label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        placeholder="Manu Arora"
                        className="dark-form-input"
                        required
                      />
                    </div>

                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-email">Email Address</label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        placeholder="support@aceternity.com"
                        className="dark-form-input"
                        required
                      />
                    </div>

                    <div className="form-input-group">
                      <label className="dark-form-label" htmlFor="cf-phone">Contact Number</label>
                      <input
                        id="cf-phone"
                        name="phone"
                        type="tel"
                        placeholder="E.g. +91 98765 43210"
                        className="dark-form-input"
                        required
                      />
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
                        <span className="dark-captcha-q">{captcha.question}</span>
                        <input
                          id="captcha-answer"
                          type="number"
                          placeholder="Answer"
                          value={captchaInput}
                          onChange={e => { setCaptchaInput(e.target.value); setCaptchaError(""); }}
                          className="dark-form-input dark-captcha-input"
                          min={0}
                          required
                        />
                      </div>
                      {captchaError && <p className="dark-captcha-error-msg">⚠ {captchaError}</p>}
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
          <div className="map-heading">
            <span className="map-badge">📍 CAMPUS LOCATION</span>
            <h3>
              <EditableText
                contentKey="map.heading"
                label="campus map heading"
              >
                Visit our campus or book a guided tour.
              </EditableText>
            </h3>
            <p className="map-addr">{DESTINATION.address}</p>
          </div>

          <div className="distance-box">
            <form className="distance-form" onSubmit={handleDistanceCheck}>
              <div className="field-group" style={{ flex: 1 }}>
                <label htmlFor="dist-origin" className="dist-label-text">Check distance from your location</label>
                <input id="dist-origin" value={origin} onChange={e => setOrigin(e.target.value)}
                  type="text" placeholder="E.g. Pune, Mumbai, Satara" className="dist-input-box" />
              </div>
              <Button type="submit" variant="secondary" size="md">Calculate Distance</Button>
            </form>
            {isFindingDistance && <p className="dist-status">Calculating route distance…</p>}
            {distanceText && <p className="dist-result">🚘 {distanceText}</p>}
            {distanceError && <p className="dist-error">⚠ {distanceError}</p>}
          </div>

          <div className="map-frame">
            <iframe title="Success Code Academy location" src={mapSrc}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </motion.div>
      </div>

      {/* ══ STYLES ══ */}
      <style jsx>{`
        .contact-page {
          position: relative;
          z-index: 1;
          background: #ffffff;
        }

        /* Set Outfit font style for all elements */
        .contact-page,
        .contact-premium-section,
        .contact-premium-section h2,
        .contact-premium-section p,
        .contact-premium-section span,
        .contact-premium-section label,
        .contact-premium-section input,
        .contact-premium-section textarea,
        .contact-premium-section button,
        .map-tooltip-bubble {
          font-family: 'Outfit', sans-serif !important;
        }

        /* ════════════════════════════════
           HERO BANNER
           ════════════════════════════════ */
        .contact-hero-banner {
          position: relative;
          padding: 80px 0 0 0 !important;
          background: #ffffff;
          width: 100%;
        }
        .contact-hero-container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .contact-poster-wrapper {
          width: 100% !important;
          border-radius: 0 !important;
          overflow: hidden;
          box-shadow: none !important;
          border: none !important;
          background: #f8fafc;
        }
        .poster-img-container {
          position: relative;
          width: 100%;
          display: block;
        }
        :global(.contact-poster-img) {
          width: 100% !important;
          height: auto !important;
          display: block !important;
        }

        /* ════════════════════════════════
           ACETERNITY STYLE CONTACT (THEME MATCHED LIGHT THEME)
           ════════════════════════════════ */
        .contact-premium-section {
          background: linear-gradient(180deg, #ffffff 0%, #f1f7fe 100%);
          padding: 80px 0;
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

        .mail-badge-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(30, 64, 175, 0.06);
          border: 1px solid rgba(30, 64, 175, 0.15);
          box-shadow: 0 4px 14px rgba(30, 64, 175, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .badge-mail-svg {
          font-size: 1.15rem;
          color: #1e40af;
        }

        /* Enhanced Left-side Contact details list styling */
        .contact-info-title {
          font-size: clamp(2rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          letter-spacing: -0.025em;
        }
        .contact-info-subtitle-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 36px;
          max-width: 480px;
        }
        .enhanced-contact-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
          width: 100%;
        }
        .contact-detail-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          text-align: left;
        }
        .detail-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .detail-icon-box:hover {
          transform: scale(1.05);
        }
        .detail-icon-svg {
          width: 20px;
          height: 20px;
        }
        .contact-bg-blue {
          background: #e0f2fe;
          color: #0284c7;
        }
        .contact-bg-green {
          background: #dcfce7;
          color: #15803d;
        }
        .contact-bg-purple {
          background: #f3e8ff;
          color: #7e22ce;
        }
        .contact-bg-orange {
          background: #ffedd5;
          color: #ea580c;
        }
        .detail-content-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-item-label {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }
        .detail-item-text {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.6;
          margin: 0;
          max-width: 440px;
        }
        .detail-link {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 700;
        }
        .detail-link:hover {
          color: #0284c7;
        }

        @keyframes pulseRingPin {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }

        /* Right Form: Glassmorphic with grid background pattern (Theme Matched) */
        .contact-right-form {
          position: relative;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 30px;
          overflow: hidden;
          padding: 40px;
          box-sizing: border-box;
          box-shadow: 
            0 20px 40px rgba(15, 23, 42, 0.05),
            0 1px 3px rgba(0, 0, 0, 0.01);
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

        .dark-form-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .dark-form-input {
          background: #f8fafc !important;
          border: 1.5px solid #cbd5e1 !important;
          border-radius: 10px;
          padding: 12px 16px;
          color: #0f172a !important;
          font-size: 0.93rem;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .dark-form-input:focus {
          outline: none;
          border-color: #40b5c1 !important;
          box-shadow: 0 0 0 3px rgba(64, 181, 193, 0.15);
          background: #ffffff !important;
        }

        .dark-form-textarea {
          min-height: 110px;
          resize: vertical;
        }

        /* CAPTCHA box inside light form */
        .dark-captcha-box {
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
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
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dark-captcha-reload {
          background: none;
          border: none;
          color: #40b5c1;
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
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          color: #0f172a;
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
          color: #dc2626;
          margin: 0;
          font-weight: 600;
        }

        .dark-submit-btn {
          width: 100%;
          background: #40b5c1;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 800;
          padding: 14px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(64, 181, 193, 0.25);
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .dark-submit-btn:hover {
          background: #35a5b0;
          box-shadow: 0 6px 20px rgba(64, 181, 193, 0.4);
        }

        /* success container */
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
           MAP & DISTANCE BOX (LIGHT DESIGN COHESION)
           ════════════════════════════════ */
        .contact-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          box-sizing: border-box;
        }

        .map-heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .map-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          color: #1e40af;
          background: rgba(30, 64, 175, 0.06);
          padding: 4px 12px;
          border-radius: 99px;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }

        .map-heading h3 {
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          color: #0f172a;
          margin: 0 0 8px;
          font-weight: 800;
        }

        .map-addr {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0;
        }

        .distance-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.01);
          text-align: left;
        }
        .distance-form {
          display: flex;
          gap: 16px;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .dist-label-text {
          font-size: 0.82rem;
          font-weight: 750;
          color: #64748b;
          margin-bottom: 8px;
          display: block;
        }

        .dist-input-box {
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.92rem;
          min-height: 42px;
          box-sizing: border-box;
          background: #ffffff;
        }

        .dist-status { color: #64748b; font-size: 0.88rem; margin-top: 12px; font-weight: 600; }
        .dist-result { color: #1e40af; font-size: 0.88rem; margin-top: 12px; font-weight: 750; }
        .dist-error  { color: #dc2626; font-size: 0.88rem; margin-top: 12px; font-weight: 600; }

        .map-frame {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.02);
        }
        .map-frame iframe {
          width: 100%;
          height: 420px;
          border: 0;
          display: block;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .contact-grid-wrap {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .contact-big-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .contact-hero-banner {
            padding-top: 72px !important;
            padding-bottom: 0 !important;
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
          .contact-big-title {
            font-size: 2.1rem;
          }
          .contact-info-capsules {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            width: 100%;
          }
          .info-capsule {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
    </section>
  );
}
