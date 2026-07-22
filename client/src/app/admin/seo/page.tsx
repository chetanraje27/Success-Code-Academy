"use client";

import React, { useState } from "react";
import { 
  FaSearchLocation, 
  FaEdit, 
  FaCheck, 
  FaGlobe, 
  FaTimes, 
  FaEye 
} from "react-icons/fa";

interface SeoPageMeta {
  id: string;
  pageName: string;
  urlPath: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export default function AdminSeoManagerPage() {
  const [pagesSeo, setPagesSeo] = useState<SeoPageMeta[]>([
    {
      id: "1",
      pageName: "Home Page",
      urlPath: "/",
      title: "Success Code Academy | India's Top NEET Coaching Institute",
      description: "Join Success Code Academy for NEET classroom coaching, repeaters batch, 2-year foundation programs, and grand mock test series with top HOD faculty.",
      keywords: "NEET coaching, NEET repeaters batch, Medical entrance coaching, Success Code Academy",
      ogImage: "/images/banners/HeroPoster1.png"
    },
    {
      id: "2",
      pageName: "About Us Page",
      urlPath: "/about",
      title: "About Success Code Academy | Faculty, Vision & History",
      description: "Learn about Success Code Academy's 14-year legacy of delivering top doctor rankers in NEET UG with compassionate mentorship.",
      keywords: "Success Code faculty, Dr VK Gupta, Medical coaching history",
      ogImage: "/images/infra/classroom.jpg"
    },
    {
      id: "3",
      pageName: "Courses Page",
      urlPath: "/courses",
      title: "NEET Courses & Fee Structure | Success Code Academy",
      description: "Explore Class 11, Class 12, and Repeater NEET coaching courses with scholarship test fee waivers.",
      keywords: "NEET courses fee, NEET repeater batch fee, 2 year foundation course",
      ogImage: "/images/banners/HeroPoster2.png"
    },
    {
      id: "4",
      pageName: "Results Page",
      urlPath: "/results",
      title: "NEET Top Rankers & AIIMS Selections | Success Code Academy",
      description: "View year-wise NEET top rankers, AIR scores, and medical college admission selections.",
      keywords: "NEET toppers list, AIIMS selections, Success Code results",
      ogImage: "/images/banners/Results_Hero.png"
    }
  ]);

  const [editingPage, setEditingPage] = useState<SeoPageMeta | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      setPagesSeo(prev => prev.map(p => p.id === editingPage.id ? editingPage : p));
      setEditingPage(null);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="seo-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Page-Level SEO & Metadata Manager</h1>
          <p className="cms-subtitle">Optimize page title tags, meta descriptions, focus keywords, OpenGraph share banners, and Google search snippet previews.</p>
        </div>
      </div>

      <div className="seo-cards-grid">
        {pagesSeo.map(page => (
          <div key={page.id} className="seo-page-card">
            <div className="card-header flex-between">
              <span className="page-title">{page.pageName}</span>
              <span className="path-badge">{page.urlPath}</span>
            </div>

            {/* Google Search Snippet Live Preview */}
            <div className="google-snippet-preview">
              <span className="google-url">https://successcodeacademy.com{page.urlPath}</span>
              <h3 className="google-title">{page.title}</h3>
              <p className="google-desc">{page.description}</p>
            </div>

            <div className="keywords-wrap">
              <span className="lbl">Keywords:</span>
              <span className="val">{page.keywords}</span>
            </div>

            <button className="edit-seo-btn" onClick={() => setEditingPage(page)}>
              <FaEdit /> Edit Meta Tags
            </button>
          </div>
        ))}
      </div>

      {/* Edit SEO Modal */}
      {editingPage && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Edit SEO Meta Tags ({editingPage.pageName})</h2>
              <button className="close-btn" onClick={() => setEditingPage(null)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>SEO Title Tag (Recommended: 50-60 characters)</label>
                <input type="text" required value={editingPage.title} onChange={e => setEditingPage({ ...editingPage, title: e.target.value })} />
                <span className="char-count">{editingPage.title.length} characters</span>
              </div>

              <div className="form-group">
                <label>Meta Description (Recommended: 150-160 characters)</label>
                <textarea rows={3} required value={editingPage.description} onChange={e => setEditingPage({ ...editingPage, description: e.target.value })} />
                <span className="char-count">{editingPage.description.length} characters</span>
              </div>

              <div className="form-group">
                <label>Focus Keywords (Comma separated)</label>
                <input type="text" value={editingPage.keywords} onChange={e => setEditingPage({ ...editingPage, keywords: e.target.value })} />
              </div>

              <div className="form-group">
                <label>OpenGraph / Social Share Image Path</label>
                <input type="text" value={editingPage.ogImage} onChange={e => setEditingPage({ ...editingPage, ogImage: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setEditingPage(null)}>Cancel</button>
                <button type="submit" className="save-btn">Save Meta Tags</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .seo-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .seo-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .seo-page-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .page-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; }
        .path-badge { background: #eff6ff; color: #0257d0; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; }

        .google-snippet-preview { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
        .google-url { font-size: 0.72rem; color: #15803d; font-weight: 600; }
        .google-title { font-size: 0.95rem; font-weight: 700; color: #1a0dab; margin: 0; }
        .google-desc { font-size: 0.78rem; color: #4d5156; margin: 0; }

        .keywords-wrap { font-size: 0.75rem; color: #64748b; }
        .keywords-wrap .lbl { font-weight: 700; margin-right: 4px; }

        .edit-seo-btn { display: flex; align-items: center; justify-content: center; gap: 6px; background: #eff6ff; color: #0257d0; border: 1px solid #bfdbfe; padding: 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; margin-top: auto; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 580px; overflow: hidden; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .char-count { font-size: 0.7rem; color: #64748b; text-align: right; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
