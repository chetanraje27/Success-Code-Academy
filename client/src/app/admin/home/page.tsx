"use client";

import React, { useState } from "react";
import { 
  FaImages, 
  FaBell, 
  FaStar, 
  FaNewspaper, 
  FaVideo, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimesCircle, 
  FaExternalLinkAlt, 
  FaCloudUploadAlt,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaLink,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
  FaLayerGroup,
  FaSlidersH,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";

type SubTabType = "sections" | "banners" | "notifications" | "stars" | "articles" | "videos";
type DevicePreviewType = "desktop" | "tablet" | "mobile";

interface HomeSectionModule {
  id: string;
  name: string;
  key: string;
  order: number;
  enabled: boolean;
  status: "Published" | "Draft";
  lastModified: string;
}

interface HeroBannerItem {
  id: string;
  orderNo: number;
  title: string;
  highlightText: string;
  subtitle: string;
  badge: string;
  desktopImage: string;
  mobileImage: string;
  link: string;
  btnText: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  autoRotateSpeed?: number;
}

const POSTER_LIBRARY = [
  { name: "Hero Poster 1 (NEET Admissions)", path: "/images/banners/HeroPoster1.png" },
  { name: "Hero Poster 2 (Repeater Batch)", path: "/images/banners/HeroPoster2.png" },
  { name: "Hero Poster 3 (Foundation 2 Years)", path: "/images/banners/HeroPoster3.png" },
  { name: "Hero Poster 4 (Grand Mock Tests)", path: "/images/banners/HeroPoster4.png" },
  { name: "Scholarship Test Hero", path: "/images/banners/ScholorshipHero.png" },
  { name: "Scholarship Test Registration", path: "/images/banners/ScholorshipHero1.png" },
  { name: "Upcoming Batches Hero", path: "/images/banners/upcoming_batches_hero.png" },
  { name: "NEET Top Results Hero", path: "/images/banners/Results_Hero.png" },
  { name: "Contact & Enquiry Poster", path: "/images/banners/ContactPoster.png" },
];

export default function AdminHomePage() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("sections");
  const [devicePreview, setDevicePreview] = useState<DevicePreviewType>("desktop");
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);

  // 1. Modular Homepage Sections
  const [sections, setSections] = useState<HomeSectionModule[]>([
    { id: "1", name: "1. Floating Notification Ticker Bar", key: "notification_bar", order: 1, enabled: true, status: "Published", lastModified: "Today, 10:20 AM" },
    { id: "2", name: "2. Hero Poster Banner Slider", key: "hero_slider", order: 2, enabled: true, status: "Published", lastModified: "Today, 11:45 AM" },
    { id: "3", name: "3. Key Statistics & Milestones", key: "statistics", order: 3, enabled: true, status: "Published", lastModified: "Yesterday" },
    { id: "4", name: "4. Explore Courses Grid", key: "explore_courses", order: 4, enabled: true, status: "Published", lastModified: "July 18, 2026" },
    { id: "5", name: "5. Meet Our Stars / Top Rankers", key: "meet_stars", order: 5, enabled: true, status: "Published", lastModified: "July 19, 2026" },
    { id: "6", name: "6. Why Choose Success Code", key: "why_choose_us", order: 6, enabled: true, status: "Published", lastModified: "July 15, 2026" },
    { id: "7", name: "7. Parents & Student Trust Testimonials", key: "testimonials", order: 7, enabled: true, status: "Published", lastModified: "July 12, 2026" },
    { id: "8", name: "8. Video Gallery & Lecture Showcase", key: "videos", order: 8, enabled: true, status: "Published", lastModified: "July 10, 2026" },
    { id: "9", name: "9. Final Admission Call To Action", key: "final_cta", order: 9, enabled: true, status: "Published", lastModified: "July 08, 2026" },
  ]);

  // 2. Banners with Desktop + Mobile images & Scheduling
  const [banners, setBanners] = useState<HeroBannerItem[]>([
    {
      id: "1",
      orderNo: 1,
      title: "NEET 2027 Medical Admissions",
      highlightText: "Admissions Open 2026-27",
      subtitle: "Join India's Top Medical Coaching Institute with Experienced HOD Faculty",
      badge: "LIMITED SEATS",
      desktopImage: "/images/banners/HeroPoster1.png",
      mobileImage: "/images/banners/HeroPoster1.png",
      link: "/courses",
      btnText: "Explore Courses",
      active: true,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      autoRotateSpeed: 3500
    },
    {
      id: "2",
      orderNo: 2,
      title: "NEET Repeater Achievers Batch",
      highlightText: "100% Rank Improvement",
      subtitle: "Intensive 1-Year Rank Improvement Program with Daily Practice Papers",
      badge: "BATCH STARTS JULY 25",
      desktopImage: "/images/banners/HeroPoster2.png",
      mobileImage: "/images/banners/HeroPoster2.png",
      link: "/courses",
      btnText: "Join Repeater Batch",
      active: true,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      autoRotateSpeed: 3500
    },
    {
      id: "3",
      orderNo: 3,
      title: "Class 11 & 12 Foundation Program",
      highlightText: "Two-Year Integrated Prep",
      subtitle: "School Board + NEET Preparation with Dedicated Doubt Solving Sessions",
      badge: "NEW BATCH",
      desktopImage: "/images/banners/HeroPoster3.png",
      mobileImage: "/images/banners/HeroPoster3.png",
      link: "/courses",
      btnText: "Apply Now",
      active: true
    },
    {
      id: "4",
      orderNo: 4,
      title: "Grand NEET Mock Test Series",
      highlightText: "All India Rank Predictor",
      subtitle: "Full Syllabus NCERT Test Series with Detailed AI Analytics",
      badge: "TEST SERIES",
      desktopImage: "/images/banners/HeroPoster4.png",
      mobileImage: "/images/banners/HeroPoster4.png",
      link: "/admissions",
      btnText: "Enroll in Test Series",
      active: true
    },
    {
      id: "5",
      orderNo: 5,
      title: "Success Code Scholarship Test 2026",
      highlightText: "Up to 100% Fee Waiver",
      subtitle: "Appear Scholarship Test & Win Merit Scholarships for Classroom Batches",
      badge: "SCHOLARSHIP TEST",
      desktopImage: "/images/banners/ScholorshipHero.png",
      mobileImage: "/images/banners/ScholorshipHero.png",
      link: "/scholarships",
      btnText: "Register for Test",
      active: true
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [imageInputType, setImageInputType] = useState<"library" | "url" | "upload">("library");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formData, setFormData] = useState<any>({});

  const toggleSectionEnabled = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveSectionOrder = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    setSections(next.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const openAddBannerModal = () => {
    setEditingItem(null);
    setImageInputType("library");
    setPreviewImage(POSTER_LIBRARY[0].path);
    setFormData({
      orderNo: banners.length + 1,
      active: true,
      link: "/courses",
      desktopImage: POSTER_LIBRARY[0].path,
      mobileImage: POSTER_LIBRARY[0].path,
      btnText: "Learn More",
      badge: "NEW",
      autoRotateSpeed: 3500
    });
    setIsModalOpen(true);
  };

  const openEditBannerModal = (banner: HeroBannerItem) => {
    setEditingItem(banner);
    setFormData({ ...banner });
    setPreviewImage(banner.desktopImage || "");
    setImageInputType("library");
    setIsModalOpen(true);
  };

  const moveBannerOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const next = [...banners];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setBanners(next.map((b, idx) => ({ ...b, orderNo: idx + 1 })));
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = editingItem ? editingItem.id : Date.now().toString();
    const itemToSave = { id: newId, ...formData };
    setBanners(prev => editingItem ? prev.map(b => b.id === newId ? itemToSave : b) : [...prev, itemToSave]);
    setIsModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setBanners(prev => prev.filter(b => b.id !== id).map((b, i) => ({ ...b, orderNo: i + 1 })));
  };

  return (
    <div className="home-cms-wrapper">
      {/* Top Header */}
      <div className="cms-page-header">
        <div>
          <h1 className="cms-title">Home Page CMS Module</h1>
          <p className="cms-subtitle">Manage modular page sections, hero banners, live device preview, display priority, and visibility controls.</p>
        </div>
        <div className="top-action-group">
          <button className="preview-btn" onClick={() => setShowLivePreviewModal(true)}>
            <FaDesktop /> Live Website Preview
          </button>
          {activeSubTab === "banners" && (
            <button className="add-btn" onClick={openAddBannerModal}>
              <FaPlus /> Add Hero Banner
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tab-bar">
        <button 
          className={`sub-tab ${activeSubTab === 'sections' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('sections')}
        >
          <FaLayerGroup /> Homepage Modules & Reordering
        </button>
        <button 
          className={`sub-tab ${activeSubTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('banners')}
        >
          <FaImages /> Hero Banner Management ({banners.length})
        </button>
      </div>

      {/* 1. SECTIONS MODULE MANAGER */}
      {activeSubTab === "sections" && (
        <div className="sections-manager-container">
          <div className="sections-info-box">
            <span className="icon">💡</span>
            <span>Drag or click arrows to reorder homepage sections. Toggle switches enable or disable sections instantly on the website.</span>
          </div>

          <div className="sections-list">
            {sections.map((sec, idx) => (
              <div key={sec.id} className={`section-bar-card ${!sec.enabled ? 'disabled-card' : ''}`}>
                <div className="order-num-col">
                  <span className="num">#{sec.order}</span>
                  <div className="order-arrows">
                    <button disabled={idx === 0} onClick={() => moveSectionOrder(idx, "up")}><FaArrowUp /></button>
                    <button disabled={idx === sections.length - 1} onClick={() => moveSectionOrder(idx, "down")}><FaArrowDown /></button>
                  </div>
                </div>

                <div className="sec-info">
                  <h3 className="sec-name">{sec.name}</h3>
                  <div className="sec-meta">
                    <span className={`status-tag ${sec.status.toLowerCase()}`}>{sec.status}</span>
                    <span className="date-tag">Last updated: {sec.lastModified}</span>
                  </div>
                </div>

                <div className="sec-controls">
                  <label className="toggle-switch" title={sec.enabled ? 'Enabled on Homepage' : 'Disabled on Homepage'}>
                    <input type="checkbox" checked={sec.enabled} onChange={() => toggleSectionEnabled(sec.id)} />
                    <span className="slider"></span>
                  </label>
                  <button className="icon-action-btn" onClick={() => setShowLivePreviewModal(true)} title="Live Device Preview">
                    <FaEye />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HERO BANNER MANAGEMENT */}
      {activeSubTab === "banners" && (
        <div className="banners-manager-container">
          <div className="banners-vertical-list">
            {banners.map((b, idx) => (
              <div key={b.id} className={`banner-bar-card ${!b.active ? 'inactive-card' : ''}`}>
                <div className="occurrence-col">
                  <span className="occurrence-badge">#{b.orderNo}</span>
                  <div className="reorder-btns">
                    <button disabled={idx === 0} onClick={() => moveBannerOrder(idx, "up")}><FaArrowUp /></button>
                    <button disabled={idx === banners.length - 1} onClick={() => moveBannerOrder(idx, "down")}><FaArrowDown /></button>
                  </div>
                </div>

                <div className="banner-thumb">
                  <img src={b.desktopImage} alt={b.title} onError={(e: any) => e.target.src = "/images/banners/HeroPoster1.png"} />
                  {b.badge && <span className="badge-overlay">{b.badge}</span>}
                </div>

                <div className="banner-details">
                  <div className="banner-title-row">
                    <h3 className="banner-title">{b.title}</h3>
                    <span className={`status-pill ${b.active ? 'active' : 'inactive'}`}>
                      {b.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="banner-subtitle">{b.subtitle}</p>
                  <div className="banner-meta-row">
                    <span className="meta-item"><FaLink className="ic" /> Redirects to: <strong>{b.link}</strong></span>
                    {b.btnText && <span className="meta-item"><FaSlidersH className="ic" /> Button: <strong>{b.btnText}</strong></span>}
                    {b.startDate && <span className="meta-item"><FaCalendarAlt className="ic" /> Schedule: {b.startDate} to {b.endDate}</span>}
                  </div>
                </div>

                <div className="banner-actions">
                  <button className="action-btn edit" onClick={() => openEditBannerModal(b)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteBanner(b.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE DEVICE PREVIEW MODAL */}
      {showLivePreviewModal && (
        <div className="modal-overlay">
          <div className="modal-card preview-modal">
            <div className="modal-header">
              <div className="preview-title-wrap">
                <h2>Live Website Preview</h2>
                <div className="device-switcher">
                  <button className={`dev-btn ${devicePreview === 'desktop' ? 'active' : ''}`} onClick={() => setDevicePreview('desktop')}>
                    <FaDesktop /> Desktop
                  </button>
                  <button className={`dev-btn ${devicePreview === 'tablet' ? 'active' : ''}`} onClick={() => setDevicePreview('tablet')}>
                    <FaTabletAlt /> Tablet
                  </button>
                  <button className={`dev-btn ${devicePreview === 'mobile' ? 'active' : ''}`} onClick={() => setDevicePreview('mobile')}>
                    <FaMobileAlt /> Mobile
                  </button>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowLivePreviewModal(false)}><FaTimesCircle /></button>
            </div>

            <div className={`preview-iframe-wrapper ${devicePreview}`}>
              <iframe src="/" title="Website Live Preview" className="preview-iframe"></iframe>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD HERO BANNER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Hero Banner' : 'Add New Hero Banner'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimesCircle /></button>
            </div>

            <form onSubmit={handleSaveBanner} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Display Priority Order #</label>
                  <input type="number" required min={1} value={formData.orderNo || 1} onChange={e => setFormData({ ...formData, orderNo: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="form-group">
                  <label>Visibility Status</label>
                  <select value={formData.active ? 'active' : 'inactive'} onChange={e => setFormData({ ...formData, active: e.target.value === 'active' })}>
                    <option value="active">Active (Visible on Homepage)</option>
                    <option value="inactive">Hidden (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Main Banner Heading</label>
                <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. NEET 2027 Medical Admissions" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Highlighted Words</label>
                  <input type="text" value={formData.highlightText || ''} onChange={e => setFormData({ ...formData, highlightText: e.target.value })} placeholder="e.g. Admissions Open 2026-27" />
                </div>
                <div className="form-group">
                  <label>Badge Label (Optional)</label>
                  <input type="text" value={formData.badge || ''} onChange={e => setFormData({ ...formData, badge: e.target.value })} placeholder="e.g. LIMITED SEATS" />
                </div>
              </div>

              <div className="form-group">
                <label>Subtitle / Description</label>
                <textarea rows={2} value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Detailed description..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Click Target Redirect URL</label>
                  <input type="text" required value={formData.link || '/courses'} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/courses, /scholarships, etc." />
                </div>
                <div className="form-group">
                  <label>CTA Button Text</label>
                  <input type="text" value={formData.btnText || 'Explore Courses'} onChange={e => setFormData({ ...formData, btnText: e.target.value })} placeholder="e.g. Apply Now" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Schedule Start Date</label>
                  <input type="date" value={formData.startDate || ''} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Schedule End Date</label>
                  <input type="date" value={formData.endDate || ''} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>

              {/* Poster Image Source Selector */}
              <div className="image-option-wrapper">
                <label className="section-lbl">Desktop & Mobile Banner Image Source</label>
                <div className="poster-library-grid">
                  <label className="sub-lbl">Select Poster Artwork from Library:</label>
                  <div className="library-thumbs">
                    {POSTER_LIBRARY.map(poster => (
                      <div 
                        key={poster.path}
                        className={`poster-thumb-item ${formData.desktopImage === poster.path ? 'selected' : ''}`}
                        onClick={() => {
                          setPreviewImage(poster.path);
                          setFormData({ ...formData, desktopImage: poster.path, mobileImage: poster.path });
                        }}
                      >
                        <img src={poster.path} alt={poster.name} />
                        {formData.desktopImage === poster.path && <div className="selected-check"><FaCheck /></div>}
                      </div>
                    ))}
                  </div>
                </div>

                {previewImage && (
                  <div className="image-preview-box">
                    <span className="lbl">Selected Image Preview:</span>
                    <img src={previewImage} alt="Selected Banner Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .home-cms-wrapper { display: flex; flex-direction: column; gap: 20px; }
        .cms-page-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .top-action-group { display: flex; gap: 10px; }

        .preview-btn { display: flex; align-items: center; gap: 8px; background: #ffffff; color: #0257d0; border: 1px solid #93c5fd; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .preview-btn:hover { background: #eff6ff; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .sub-tab-bar { display: flex; gap: 8px; background: #ffffff; padding: 6px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .sub-tab { display: flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 8px; border: none; background: transparent; color: #475569; font-weight: 600; cursor: pointer; }
        .sub-tab.active { background: #eff6ff; color: #0257d0; }

        .sections-info-box { display: flex; align-items: center; gap: 10px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; color: #1e40af; margin-bottom: 16px; }

        .sections-list { display: flex; flex-direction: column; gap: 12px; }
        .section-bar-card { display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
        .section-bar-card.disabled-card { opacity: 0.6; background: #f8fafc; }

        .order-num-col { display: flex; align-items: center; gap: 10px; }
        .order-num-col .num { font-size: 0.95rem; font-weight: 800; color: #0257d0; background: #eff6ff; padding: 4px 10px; border-radius: 6px; }
        .order-arrows { display: flex; gap: 2px; }
        .order-arrows button { background: #f1f5f9; border: none; padding: 4px 6px; border-radius: 4px; font-size: 0.7rem; cursor: pointer; color: #475569; }
        .order-arrows button:disabled { opacity: 0.3; }

        .sec-info { flex: 1; margin: 0 20px; }
        .sec-name { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
        .sec-meta { display: flex; gap: 12px; font-size: 0.75rem; color: #64748b; }
        .status-tag { padding: 1px 6px; border-radius: 4px; font-weight: 700; }
        .status-tag.published { background: #dcfce7; color: #15803d; }

        .sec-controls { display: flex; align-items: center; gap: 16px; }
        .icon-action-btn { background: #f1f5f9; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; color: #475569; }

        /* Toggle Switch */
        .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; inset: 0; background-color: #cbd5e1; transition: .3s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background-color: #0257d0; }
        input:checked + .slider:before { transform: translateX(20px); }

        /* Banners List */
        .banners-vertical-list { display: flex; flex-direction: column; gap: 16px; }
        .banner-bar-card { display: flex; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; gap: 20px; }
        .occurrence-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .occurrence-badge { background: #eff6ff; color: #0257d0; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .reorder-btns { display: flex; gap: 4px; }
        .reorder-btns button { background: #f1f5f9; border: none; padding: 4px 6px; border-radius: 4px; font-size: 0.7rem; cursor: pointer; }

        .banner-thumb { position: relative; width: 150px; height: 85px; border-radius: 8px; overflow: hidden; background: #f1f5f9; border: 1px solid #cbd5e1; flex-shrink: 0; }
        .banner-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .badge-overlay { position: absolute; top: 4px; left: 4px; background: #0f172a; color: #fff; font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 3px; }

        .banner-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .banner-title-row { display: flex; align-items: center; gap: 12px; }
        .banner-title { font-size: 1.05rem; font-weight: 700; margin: 0; color: #0f172a; }
        .banner-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .banner-meta-row { display: flex; gap: 16px; font-size: 0.78rem; color: #475569; margin-top: 4px; }

        .banner-actions { display: flex; gap: 10px; }
        .action-btn { display: flex; align-items: center; gap: 6px; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .action-btn.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn.delete { background: #fee2e2; color: #b91c1c; }

        .status-pill.active { background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .status-pill.inactive { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

        /* Preview Modal & Device Switcher */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 650px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .modal-card.preview-modal { max-width: 1100px; height: 85vh; display: flex; flex-direction: column; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }

        .preview-title-wrap { display: flex; align-items: center; gap: 24px; }
        .preview-title-wrap h2 { font-size: 1.1rem; font-weight: 800; margin: 0; }
        .device-switcher { display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 6px; }
        .dev-btn { display: flex; align-items: center; gap: 6px; border: none; padding: 5px 12px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; color: #475569; background: transparent; cursor: pointer; }
        .dev-btn.active { background: #ffffff; color: #0257d0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        .preview-iframe-wrapper { flex: 1; background: #f8fafc; padding: 20px; display: flex; justify-content: center; overflow: hidden; }
        .preview-iframe-wrapper.desktop .preview-iframe { width: 100%; height: 100%; border: 1px solid #cbd5e1; border-radius: 8px; }
        .preview-iframe-wrapper.tablet .preview-iframe { width: 768px; height: 100%; border: 1px solid #cbd5e1; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .preview-iframe-wrapper.mobile .preview-iframe { width: 375px; height: 100%; border: 1px solid #cbd5e1; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
        .preview-iframe { background: #ffffff; }

        /* Form Modal */
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 75vh; overflow-y: auto; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea, .form-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .image-option-wrapper { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px; }
        .section-lbl { font-size: 0.8rem; font-weight: 700; color: #1e293b; }
        .sub-lbl { font-size: 0.75rem; font-weight: 600; color: #64748b; }
        .library-thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px; max-height: 140px; overflow-y: auto; }
        .poster-thumb-item { position: relative; border: 2px solid #e2e8f0; border-radius: 6px; overflow: hidden; height: 60px; cursor: pointer; }
        .poster-thumb-item.selected { border-color: #0257d0; }
        .poster-thumb-item img { width: 100%; height: 100%; object-fit: cover; }
        .selected-check { position: absolute; top: 2px; right: 2px; background: #0257d0; color: #fff; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; }
        .image-preview-box img { width: 100%; max-height: 120px; object-fit: cover; border-radius: 6px; margin-top: 4px; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
