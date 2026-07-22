"use client";

import React, { useState } from "react";
import { 
  FaGlobe, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp, 
  FaCheck, 
  FaShieldAlt,
  FaShareAlt
} from "react-icons/fa";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Success Code Academy",
    tagline: "India's Leading NEET Coaching Institute",
    logoPath: "/images/ui/logo1.png",
    faviconPath: "/favicon.ico",
    contactPhone: "+91 96990 62427",
    whatsappNumber: "+91 96990 62427",
    contactEmail: "info@successcodeacademy.com",
    address: "Success Code Academy Campus, Near City Hospital, Pune - 411001",
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=...",
    facebookUrl: "https://facebook.com/successcodeacademy",
    instagramUrl: "https://instagram.com/successcodeacademy",
    youtubeUrl: "https://youtube.com/successcodeacademy",
    analyticsId: "G-XYZ1234567",
    metaVerification: "google-site-verification=abc123xyz"
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="settings-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Global Website Settings</h1>
          <p className="cms-subtitle">Configure institute branding, phone numbers, contact emails, social links, Google Maps embeds, and analytics tracking.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* General Branding */}
        <div className="settings-card">
          <h2 className="card-title"><FaGlobe /> Branding & Identity</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Website Name</label>
              <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Tagline / Motto</label>
              <input type="text" value={settings.tagline} onChange={e => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Header Logo Path</label>
              <input type="text" value={settings.logoPath} onChange={e => setSettings({ ...settings, logoPath: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Favicon Path</label>
              <input type="text" value={settings.faviconPath} onChange={e => setSettings({ ...settings, faviconPath: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="settings-card">
          <h2 className="card-title"><FaPhoneAlt /> Official Contact Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Phone Number</label>
              <input type="text" value={settings.contactPhone} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Official WhatsApp Number</label>
              <input type="text" value={settings.whatsappNumber} onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Official Support Email</label>
            <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Campus Physical Address</label>
            <textarea rows={2} value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} />
          </div>
        </div>

        {/* Social Links */}
        <div className="settings-card">
          <h2 className="card-title"><FaShareAlt /> Social Media Links</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Instagram URL</label>
              <input type="text" value={settings.instagramUrl} onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>YouTube Channel URL</label>
              <input type="text" value={settings.youtubeUrl} onChange={e => setSettings({ ...settings, youtubeUrl: e.target.value })} />
            </div>
          </div>
        </div>

        <button type="submit" className="save-btn">
          {isSaved ? <><FaCheck /> Settings Saved Successfully</> : "Save Global Settings"}
        </button>
      </form>

      <style jsx>{`
        .settings-cms-container { display: flex; flex-direction: column; gap: 20px; max-width: 1000px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .settings-form { display: flex; flex-direction: column; gap: 20px; }
        .settings-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 10px; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; width: max-content; }
      `}</style>
    </div>
  );
}
