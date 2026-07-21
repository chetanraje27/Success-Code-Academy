"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaImages, 
  FaBell, 
  FaStar, 
  FaNewspaper, 
  FaVideo, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
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
  FaUserGraduate,
  FaTrophy
} from "react-icons/fa";

type TabType = "banners" | "notifications" | "stars" | "articles" | "videos";

interface BannerItem {
  id: string;
  orderNo: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
}

interface StarItem {
  id: string;
  name: string;
  year: string;
  course: string;
  rank: string;
  score: string;
  photo: string;
  active?: boolean;
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
  { name: "Star Achiever Spotlight", path: "/images/banners/ShravaniKudaleHero.png" },
];

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("banners");

  // State for Banners with actual poster paths
  const [banners, setBanners] = useState<BannerItem[]>([
    {
      id: "1",
      orderNo: 1,
      title: "NEET 2027 Admissions Open",
      subtitle: "Join India's Top Medical Coaching Institute",
      image: "/images/banners/HeroPoster1.png",
      link: "/courses",
      active: true
    },
    {
      id: "2",
      orderNo: 2,
      title: "NEET Repeater & Achievers Batch",
      subtitle: "Intensive 1-Year Rank Improvement Program",
      image: "/images/banners/HeroPoster2.png",
      link: "/courses",
      active: true
    },
    {
      id: "3",
      orderNo: 3,
      title: "Class 11 & 12 Two-Year Foundation Program",
      subtitle: "School + NEET Prep with Top HOD Faculty",
      image: "/images/banners/HeroPoster3.png",
      link: "/courses",
      active: true
    },
    {
      id: "4",
      orderNo: 4,
      title: "Grand NEET Mock Test Series",
      subtitle: "All India Rank Predictor & NCERT Question Bank",
      image: "/images/banners/HeroPoster4.png",
      link: "/admissions",
      active: true
    },
    {
      id: "5",
      orderNo: 5,
      title: "Success Code Scholarship Test 2026",
      subtitle: "Appear Test & Win Up to 100% Fee Waiver",
      image: "/images/banners/ScholorshipHero.png",
      link: "/scholarships",
      active: true
    }
  ]);

  // State for Notifications
  const [notifications, setNotifications] = useState([
    { id: "1", text: "Registrations closing soon for Grand NEET Mock Test Series!", tag: "URGENT", type: "urgent", active: true, date: "2026-07-20" },
    { id: "2", text: "New Physics Revision Notes uploaded in Student Hub.", tag: "NEW", type: "info", active: true, date: "2026-07-18" },
  ]);

  // State for Meet Our Stars matching exact website cards
  const [stars, setStars] = useState<StarItem[]>([
    { id: "1", name: "Mahesh Bhosale", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "-", score: "550/720", photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Mahesh+Bhosale", active: true },
    { id: "2", name: "Samruddhi Lokhande", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1204", score: "602/720", photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Samruddhi+Lokhande", active: true },
    { id: "3", name: "Aprupa Patil", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1610", score: "547/720", photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Aprupa+Patil", active: true },
    { id: "4", name: "Darshana Dhoka", year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1980", score: "533/720", photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Darshana+Dhoka", active: true },
    { id: "5", name: "Piyush Kale", year: "NEET UG 2024", course: "NEET FRESHERS BATCH", rank: "AIR 2840", score: "681/720", photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Piyush+Kale", active: true },
  ]);

  // State for Articles
  const [articles, setArticles] = useState([
    { id: "1", title: "Top 10 High-Yield Topics in Organic Chemistry for NEET 2027", category: "Chemistry Tips", author: "Dr. V. K. Gupta", date: "2026-07-15", status: "Published", image: "/images/blogs/chem.jpg" },
    { id: "2", title: "How to Master Physics Problem Solving without Fear", category: "Strategy", author: "Prof. S. R. Verma", date: "2026-07-10", status: "Published", image: "/images/blogs/physics.jpg" },
  ]);

  // State for Videos
  const [videos, setVideos] = useState([
    { id: "1", title: "Complete Genetics One-Shot Revision | NEET Biology", subject: "Biology", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1h 45m", views: "12.4K" },
    { id: "2", title: "Electrostatics Formulas & Numerical Tricks", subject: "Physics", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "52m", views: "8.1K" },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Image input option: "library" | "url" | "upload"
  const [imageInputType, setImageInputType] = useState<"library" | "url" | "upload">("url");
  const [previewImage, setPreviewImage] = useState<string>("");

  // Form Fields State
  const [formData, setFormData] = useState<any>({});

  const openAddModal = () => {
    setEditingItem(null);
    setPreviewImage("");
    if (activeTab === "banners") {
      setImageInputType("library");
      setPreviewImage(POSTER_LIBRARY[0].path);
      setFormData({ orderNo: banners.length + 1, active: true, link: "/courses", image: POSTER_LIBRARY[0].path });
    } else if (activeTab === "stars") {
      setImageInputType("url");
      setFormData({ year: "NEET UG 2025", course: "NEET FRESHERS BATCH", rank: "AIR 1000", score: "600/720", active: true });
    } else {
      setImageInputType("url");
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setPreviewImage(item.image || item.photo || "");
    setImageInputType(item.image?.startsWith("/images/banners/") ? "library" : "url");
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData((prev: any) => ({ ...prev, image: result, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectLibraryPoster = (posterPath: string) => {
    setPreviewImage(posterPath);
    setFormData((prev: any) => ({ ...prev, image: posterPath }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = editingItem ? editingItem.id : Date.now().toString();
    const itemToSave = { id: newId, ...formData };

    if (activeTab === "banners") {
      setBanners(prev => editingItem ? prev.map(b => b.id === newId ? itemToSave : b) : [...prev, itemToSave]);
    } else if (activeTab === "notifications") {
      setNotifications(prev => editingItem ? prev.map(n => n.id === newId ? itemToSave : n) : [{ ...itemToSave, date: new Date().toISOString().split('T')[0], active: true }, ...prev]);
    } else if (activeTab === "stars") {
      setStars(prev => editingItem ? prev.map(s => s.id === newId ? itemToSave : s) : [{ ...itemToSave, active: true }, ...prev]);
    } else if (activeTab === "articles") {
      setArticles(prev => editingItem ? prev.map(a => a.id === newId ? itemToSave : a) : [{ ...itemToSave, date: new Date().toISOString().split('T')[0], status: "Published" }, ...prev]);
    } else if (activeTab === "videos") {
      setVideos(prev => editingItem ? prev.map(v => v.id === newId ? itemToSave : v) : [{ ...itemToSave, views: "0" }, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    if (activeTab === "banners") {
      setBanners(prev => prev.filter(b => b.id !== id).map((b, idx) => ({ ...b, orderNo: idx + 1 })));
    }
    if (activeTab === "notifications") setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeTab === "stars") setStars(prev => prev.filter(s => s.id !== id));
    if (activeTab === "articles") setArticles(prev => prev.filter(a => a.id !== id));
    if (activeTab === "videos") setVideos(prev => prev.filter(v => v.id !== id));
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const toggleStarStatus = (id: string) => {
    setStars(prev => prev.map(s => s.id === id ? { ...s, active: s.active === false ? true : false } : s));
  };

  const moveBannerOrder = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    const reordered = newBanners.map((b, idx) => ({ ...b, orderNo: idx + 1 }));
    setBanners(reordered);
  };

  const tabs = [
    { id: "banners", label: "Banner Management", icon: <FaImages /> },
    { id: "notifications", label: "Notifications & Ticker", icon: <FaBell /> },
    { id: "stars", label: "Meet Our Stars", icon: <FaStar /> },
    { id: "articles", label: "Articles Upload", icon: <FaNewspaper /> },
    { id: "videos", label: "Video Uploads", icon: <FaVideo /> },
  ];

  return (
    <div className="home-cms-container">
      {/* Page Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Home Page CMS Management</h1>
          <p className="cms-subtitle">Manage hero poster banners, notices, topper stars, articles, and video lectures shown on the main landing page.</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <FaPlus />
          <span>Add New {activeTab === "banners" ? "Hero Banner" : activeTab === "stars" ? "Star Achiever" : activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-bar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id as TabType); setSearchQuery(""); }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="counter-badge">
          Total: {
            activeTab === "banners" ? banners.length :
            activeTab === "notifications" ? notifications.length :
            activeTab === "stars" ? stars.length :
            activeTab === "articles" ? articles.length : videos.length
          } items
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="cms-content">
        {activeTab === "banners" && (
          <div className="vertical-banners-list">
            {banners
              .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((banner, index) => (
                <div key={banner.id} className={`banner-bar-card ${!banner.active ? 'inactive-card' : ''}`}>
                  {/* Occurrence Number Badge & Reorder Arrows */}
                  <div className="occurrence-col">
                    <span className="occurrence-badge" title="Occurrence Sequence Number">#{banner.orderNo}</span>
                    <div className="reorder-btns">
                      <button 
                        className="arrow-btn" 
                        disabled={index === 0} 
                        onClick={() => moveBannerOrder(index, "up")}
                        title="Move Up"
                      >
                        <FaArrowUp />
                      </button>
                      <button 
                        className="arrow-btn" 
                        disabled={index === banners.length - 1} 
                        onClick={() => moveBannerOrder(index, "down")}
                        title="Move Down"
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  </div>

                  {/* Banner Poster Image Preview */}
                  <div className="banner-thumb">
                    <img 
                      src={banner.image || "/images/banners/HeroPoster1.png"} 
                      alt={banner.title} 
                      onError={(e: any) => e.target.src = "/images/banners/HeroPoster1.png"} 
                    />
                  </div>

                  {/* Banner Details */}
                  <div className="banner-details">
                    <div className="banner-title-row">
                      <h3 className="banner-title">{banner.title}</h3>
                      <span className={`status-pill ${banner.active ? 'active' : 'inactive'}`}>
                        {banner.active ? 'Active on Homepage' : 'Draft / Hidden'}
                      </span>
                    </div>
                    <p className="banner-subtitle">{banner.subtitle}</p>
                    {banner.link && (
                      <div className="banner-link-row">
                        <FaLink className="ic" />
                        <span className="lbl">Click Redirects To:</span>
                        <a href={banner.link} target="_blank" rel="noreferrer" className="link-url">
                          {banner.link} <FaExternalLinkAlt className="ext" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="banner-actions">
                    <button 
                      className={`toggle-btn ${banner.active ? 'active-toggle' : 'inactive-toggle'}`} 
                      onClick={() => toggleBannerStatus(banner.id)}
                      title={banner.active ? 'Hide from Homepage' : 'Publish on Homepage'}
                    >
                      {banner.active ? <><FaEyeSlash /> Hide</> : <><FaEye /> Publish</>}
                    </button>
                    <button className="action-btn edit" onClick={() => openEditModal(banner)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(banner.id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Notification Message</th>
                  <th>Tag Badge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.filter(n => n.text.toLowerCase().includes(searchQuery.toLowerCase())).map(notif => (
                  <tr key={notif.id}>
                    <td>{notif.date}</td>
                    <td className="font-semibold">{notif.text}</td>
                    <td><span className={`tag-pill ${notif.type || 'info'}`}>{notif.tag || 'Notice'}</span></td>
                    <td>
                      <span className={`status-pill ${notif.active ? 'active' : 'inactive'}`}>
                        {notif.active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn edit" onClick={() => openEditModal(notif)}><FaEdit /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(notif.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MEET OUR STARS - MATCHING EXACT SITE CARDS DESIGN */}
        {activeTab === "stars" && (
          <div className="grid-layout cols-3">
            {stars
              .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.course.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(star => (
                <div key={star.id} className={`star-preview-card ${star.active === false ? 'inactive-star' : ''}`}>
                  {/* Photo Area with Floating Year Badge */}
                  <div className="star-photo-wrap">
                    <img 
                      src={star.photo || "https://placehold.co/300x320/e2e8f0/1e293b?text=Student+Photo"} 
                      alt={star.name} 
                      onError={(e: any) => e.target.src = "https://placehold.co/300x320/e2e8f0/1e293b?text=Student+Photo"}
                    />
                    <span className="star-year-badge">{star.year || "NEET UG 2025"}</span>
                  </div>

                  {/* Body Content */}
                  <div className="star-card-body">
                    <div className="star-name-block">
                      <h3 className="star-student-name">{star.name}</h3>
                      <span className="star-batch-tag">{star.course || "NEET FRESHERS BATCH"}</span>
                    </div>

                    {/* Rank & Score Grid */}
                    <div className="star-score-grid">
                      <div className="score-cell rank-cell">
                        <span className="lbl">RANK</span>
                        <span className="val rank-val">
                          <FaStar className="ic" /> {star.rank || "AIR -"}
                        </span>
                      </div>
                      <div className="score-cell score-cell-right">
                        <span className="lbl">NEET SCORE</span>
                        <span className="val score-val">{star.score || "-/720"}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="star-actions-bar">
                      <button 
                        className={`action-btn-sm toggle ${star.active !== false ? 'active' : 'hidden'}`}
                        onClick={() => toggleStarStatus(star.id)}
                      >
                        {star.active !== false ? <><FaEyeSlash /> Hide</> : <><FaEye /> Publish</>}
                      </button>
                      <button className="action-btn-sm edit" onClick={() => openEditModal(star)}>
                        <FaEdit /> Edit
                      </button>
                      <button className="action-btn-sm delete" onClick={() => handleDelete(star.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Publish Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(article => (
                  <tr key={article.id}>
                    <td className="font-medium text-slate-900">{article.title}</td>
                    <td><span className="category-pill">{article.category}</span></td>
                    <td>{article.author}</td>
                    <td>{article.date}</td>
                    <td><span className="status-pill active">{article.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn edit" onClick={() => openEditModal(article)}><FaEdit /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(article.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="grid-layout cols-2">
            {videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase())).map(video => (
              <div key={video.id} className="video-card">
                <div className="video-preview">
                  <iframe src={video.url} title={video.title} allowFullScreen className="iframe-preview"></iframe>
                </div>
                <div className="video-body">
                  <span className="subject-pill">{video.subject}</span>
                  <h3 className="video-title">{video.title}</h3>
                  <div className="video-meta">
                    <span>Duration: {video.duration}</span>
                    <span>Views: {video.views}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button className="action-btn edit" onClick={() => openEditModal(video)}><FaEdit /> Edit</button>
                  <button className="action-btn delete" onClick={() => handleDelete(video.id)}><FaTrash /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Dialog */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'} ({activeTab === 'banners' ? 'Hero Poster Banner' : activeTab === 'stars' ? 'Star Achiever' : activeTab})</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimesCircle /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              {activeTab === "banners" && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Occurrence Sequence No.</label>
                      <input 
                        type="number" 
                        required 
                        min={1} 
                        value={formData.orderNo || 1} 
                        onChange={e => setFormData({ ...formData, orderNo: parseInt(e.target.value) || 1 })} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Visibility Status</label>
                      <select 
                        value={formData.active ? 'active' : 'inactive'} 
                        onChange={e => setFormData({ ...formData, active: e.target.value === 'active' })}
                      >
                        <option value="active">Active (Visible on Homepage)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Banner Main Title</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.title || ''} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })} 
                      placeholder="e.g. NEET 2027 Admissions Open" 
                    />
                  </div>

                  <div className="form-group">
                    <label>Subtitle / Description</label>
                    <input 
                      type="text" 
                      value={formData.subtitle || ''} 
                      onChange={e => setFormData({ ...formData, subtitle: e.target.value })} 
                      placeholder="e.g. Apply for Intensive Program" 
                    />
                  </div>

                  {/* Click Redirect Action Link Input with Preset Buttons */}
                  <div className="form-group">
                    <label>Click Redirect Target URL (When User Clicks Poster)</label>
                    <div className="redirect-input-wrap">
                      <input 
                        type="text" 
                        required
                        value={formData.link || '/courses'} 
                        onChange={e => setFormData({ ...formData, link: e.target.value })} 
                        placeholder="/courses, /scholarships, /admissions, or /contact" 
                      />
                    </div>
                    <div className="preset-links">
                      <span className="lbl">Presets:</span>
                      {[
                        { label: "Courses Page", url: "/courses" },
                        { label: "Scholarships Page", url: "/scholarships" },
                        { label: "Admissions Page", url: "/admissions" },
                        { label: "Contact Us", url: "/contact" },
                        { label: "NEET Results", url: "/results" },
                      ].map(preset => (
                        <button
                          key={preset.url}
                          type="button"
                          className={`preset-btn ${formData.link === preset.url ? 'active' : ''}`}
                          onClick={() => setFormData({ ...formData, link: preset.url })}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Input Options */}
                  <div className="image-option-wrapper">
                    <label className="section-lbl">Banner Poster Source</label>
                    <div className="image-option-tabs">
                      <button 
                        type="button" 
                        className={`opt-btn ${imageInputType === 'library' ? 'active' : ''}`}
                        onClick={() => setImageInputType('library')}
                      >
                        Poster Library
                      </button>
                      <button 
                        type="button" 
                        className={`opt-btn ${imageInputType === 'url' ? 'active' : ''}`}
                        onClick={() => setImageInputType('url')}
                      >
                        Image URL
                      </button>
                      <button 
                        type="button" 
                        className={`opt-btn ${imageInputType === 'upload' ? 'active' : ''}`}
                        onClick={() => setImageInputType('upload')}
                      >
                        Upload File
                      </button>
                    </div>

                    {imageInputType === 'library' && (
                      <div className="poster-library-grid">
                        <label className="sub-lbl">Select Poster from `public/images/banners`:</label>
                        <div className="library-thumbs">
                          {POSTER_LIBRARY.map(poster => (
                            <div 
                              key={poster.path}
                              className={`poster-thumb-item ${formData.image === poster.path ? 'selected' : ''}`}
                              onClick={() => selectLibraryPoster(poster.path)}
                              title={poster.name}
                            >
                              <img src={poster.path} alt={poster.name} />
                              {formData.image === poster.path && (
                                <div className="selected-check"><FaCheck /></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {imageInputType === 'url' && (
                      <div className="form-group margin-top">
                        <label>Enter Banner Image URL</label>
                        <input 
                          type="text" 
                          value={formData.image || ''} 
                          onChange={e => {
                            setFormData({ ...formData, image: e.target.value });
                            setPreviewImage(e.target.value);
                          }} 
                          placeholder="https://example.com/images/banner.jpg" 
                        />
                      </div>
                    )}

                    {imageInputType === 'upload' && (
                      <div className="form-group margin-top">
                        <label>Upload Image File from Computer</label>
                        <div className="file-dropzone">
                          <FaCloudUploadAlt className="dropzone-icon" />
                          <span>Click to browse and upload image</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} />
                        </div>
                      </div>
                    )}

                    {/* Image Live Preview Box */}
                    {previewImage && (
                      <div className="image-preview-box">
                        <span className="lbl">Live Selected Poster Preview:</span>
                        <img 
                          src={previewImage} 
                          alt="Banner Preview" 
                          onError={(e: any) => e.target.src = "/images/banners/HeroPoster1.png"} 
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* MEET OUR STARS EDIT/ADD FORM MODAL */}
              {activeTab === "stars" && (
                <>
                  <div className="form-group">
                    <label>Student Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name || ''} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="e.g. Samruddhi Lokhande" 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Exam Year Badge</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.year || 'NEET UG 2025'} 
                        onChange={e => setFormData({ ...formData, year: e.target.value })} 
                        placeholder="e.g. NEET UG 2025" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Enrolled Batch</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.course || 'NEET FRESHERS BATCH'} 
                        onChange={e => setFormData({ ...formData, course: e.target.value })} 
                        placeholder="e.g. NEET FRESHERS BATCH" 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>All India Rank (AIR)</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.rank || ''} 
                        onChange={e => setFormData({ ...formData, rank: e.target.value })} 
                        placeholder="e.g. AIR 1204 or -" 
                      />
                    </div>
                    <div className="form-group">
                      <label>NEET Score</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.score || ''} 
                        onChange={e => setFormData({ ...formData, score: e.target.value })} 
                        placeholder="e.g. 602/720" 
                      />
                    </div>
                  </div>

                  {/* Student Photo Source Uploader */}
                  <div className="image-option-wrapper">
                    <label className="section-lbl">Student Photo Source</label>
                    <div className="image-option-tabs">
                      <button 
                        type="button" 
                        className={`opt-btn ${imageInputType === 'url' ? 'active' : ''}`}
                        onClick={() => setImageInputType('url')}
                      >
                        Photo URL / Path
                      </button>
                      <button 
                        type="button" 
                        className={`opt-btn ${imageInputType === 'upload' ? 'active' : ''}`}
                        onClick={() => setImageInputType('upload')}
                      >
                        Upload Photo File
                      </button>
                    </div>

                    {imageInputType === 'url' ? (
                      <div className="form-group margin-top">
                        <label>Enter Photo Image URL or Local Path</label>
                        <input 
                          type="text" 
                          value={formData.photo || ''} 
                          onChange={e => {
                            setFormData({ ...formData, photo: e.target.value });
                            setPreviewImage(e.target.value);
                          }} 
                          placeholder="https://... or /images/results/student.jpg" 
                        />
                      </div>
                    ) : (
                      <div className="form-group margin-top">
                        <label>Upload Student Photo from Device</label>
                        <div className="file-dropzone">
                          <FaCloudUploadAlt className="dropzone-icon" />
                          <span>Click to browse and upload photo</span>
                          <input type="file" accept="image/*" onChange={handleFileUpload} />
                        </div>
                      </div>
                    )}

                    {previewImage && (
                      <div className="image-preview-box">
                        <span className="lbl">Photo Preview:</span>
                        <img 
                          src={previewImage} 
                          alt="Photo Preview" 
                          style={{ maxHeight: '180px', objectFit: 'contain' }}
                          onError={(e: any) => e.target.src = "https://placehold.co/300x320/e2e8f0/1e293b?text=Student+Photo"} 
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "notifications" && (
                <>
                  <div className="form-group">
                    <label>Notification Text</label>
                    <textarea required rows={3} value={formData.text || ''} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Announcement message..." />
                  </div>
                  <div className="form-group">
                    <label>Badge Tag Label</label>
                    <input type="text" value={formData.tag || 'NEW'} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="e.g. URGENT, NEW, ALERT" />
                  </div>
                  <div className="form-group">
                    <label>Tag Color Type</label>
                    <select value={formData.type || 'info'} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                      <option value="info">Info Blue</option>
                      <option value="urgent">Urgent Red</option>
                      <option value="success">Success Green</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === "articles" && (
                <>
                  <div className="form-group">
                    <label>Article Title</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <input type="text" value={formData.category || 'NEET Tips'} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
                    </div>
                    <div className="form-group">
                      <label>Author Name</label>
                      <input type="text" value={formData.author || 'Success Code Team'} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Author" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cover Image URL</label>
                    <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="Cover photo URL" />
                  </div>
                </>
              )}

              {activeTab === "videos" && (
                <>
                  <div className="form-group">
                    <label>Video Title</label>
                    <input type="text" required value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Lecture Title..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Subject</label>
                      <select value={formData.subject || 'Biology'} onChange={e => setFormData({ ...formData, subject: e.target.value })}>
                        <option value="Biology">Biology</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="General Advice">General Advice</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Video Duration</label>
                      <input type="text" value={formData.duration || '45 mins'} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 1h 20m" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Embed Video URL (YouTube / Cloud Video)</label>
                    <input type="text" required value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
                  </div>
                </>
              )}

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
        .home-cms-container {
          padding: 8px 4px;
          color: #0f172a;
        }

        .cms-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 16px;
        }

        .cms-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .cms-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0257d0;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .add-btn:hover {
          background: #0143a3;
        }

        .tab-bar {
          display: flex;
          gap: 8px;
          background: #ffffff;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .tab-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .tab-item.active {
          background: #eff6ff;
          color: #0257d0;
          font-weight: 600;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 8px 14px;
          border-radius: 8px;
          width: 320px;
        }

        .search-icon {
          color: #94a3b8;
        }

        .search-box input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
          color: #0f172a;
        }

        .counter-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Vertical Bar Cards Layout for Banners */
        .vertical-banners-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .banner-bar-card {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          gap: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          transition: all 0.2s ease;
        }

        .banner-bar-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          border-color: #cbd5e1;
        }

        .banner-bar-card.inactive-card {
          background: #fafafa;
          opacity: 0.75;
        }

        .occurrence-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          min-width: 50px;
        }

        .occurrence-badge {
          background: #eff6ff;
          color: #0257d0;
          font-weight: 800;
          font-size: 1rem;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .reorder-btns {
          display: flex;
          gap: 4px;
        }

        .arrow-btn {
          background: #f1f5f9;
          border: none;
          color: #475569;
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .arrow-btn:hover:not(:disabled) {
          background: #e2e8f0;
          color: #0f172a;
        }

        .banner-thumb {
          width: 150px;
          height: 85px;
          border-radius: 8px;
          overflow: hidden;
          background: #f1f5f9;
          flex-shrink: 0;
          border: 1px solid #cbd5e1;
        }

        .banner-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .banner-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .banner-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }

        .banner-link-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #475569;
          margin-top: 4px;
        }

        .banner-link-row .ic {
          color: #0257d0;
        }

        .banner-link-row .link-url {
          color: #0257d0;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .banner-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-btn.active-toggle {
          background: #dcfce7;
          color: #15803d;
        }

        .toggle-btn.inactive-toggle {
          background: #fef3c7;
          color: #b45309;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .action-btn.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn.delete { background: #fee2e2; color: #b91c1c; }

        .status-pill.active { background: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; }
        .status-pill.inactive { background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

        /* Other Tab Displays */
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .grid-layout.cols-3 { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        .grid-layout.cols-2 { grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); }

        /* STAR CARDS MIRRORING SITE DESIGN EXACTLY */
        .star-preview-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
        }

        .star-preview-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .star-preview-card.inactive-star {
          opacity: 0.6;
          filter: grayscale(0.6);
        }

        .star-photo-wrap {
          position: relative;
          width: 100%;
          height: 230px;
          background: linear-gradient(180deg, #e0f2fe 0%, #eff6ff 100%);
        }

        .star-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .star-year-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #0f172a;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        .star-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .star-name-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .star-student-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .star-batch-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .star-score-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }

        .score-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .score-cell .lbl {
          font-size: 0.68rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.06em;
        }

        .score-cell .val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .rank-val {
          color: #1e40af !important;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rank-val .ic {
          color: #f59e0b;
          font-size: 0.85rem;
        }

        .score-val {
          color: #0257d0 !important;
        }

        .star-actions-bar {
          display: flex;
          gap: 6px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px dashed #e2e8f0;
        }

        .action-btn-sm {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: none;
          padding: 6px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .action-btn-sm.edit { background: #e0f2fe; color: #0369a1; }
        .action-btn-sm.delete { background: #fee2e2; color: #b91c1c; flex: 0 0 32px; }
        .action-btn-sm.toggle.active { background: #dcfce7; color: #15803d; }
        .action-btn-sm.toggle.hidden { background: #fef3c7; color: #b45309; }

        .video-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; }
        .video-body { padding: 16px; flex: 1; }
        .table-wrapper { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; font-size: 0.8rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 16px; font-size: 0.85rem; color: #334155; border-bottom: 1px solid #f1f5f9; }
        .tag-pill { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .tag-pill.urgent { background: #fee2e2; color: #dc2626; }
        .tag-pill.info { background: #dbeafe; color: #2563eb; }
        .table-actions { display: flex; gap: 8px; }
        .icon-btn { border: none; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; cursor: pointer; color: #475569; }
        .icon-btn.edit:hover { background: #e0f2fe; color: #0284c7; }
        .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; }

        .iframe-preview { width: 100%; height: 200px; border: none; }
        .subject-pill { background: #eff6ff; color: #0257d0; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .video-title { font-size: 0.95rem; font-weight: 700; margin: 6px 0; }
        .video-meta { display: flex; gap: 12px; font-size: 0.75rem; color: #64748b; }

        /* Modal & Form Inputs */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 620px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 80vh; overflow-y: auto; }

        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.margin-top { margin-top: 10px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea, .form-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .redirect-input-wrap { display: flex; gap: 8px; }
        .preset-links { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
        .preset-links .lbl { font-size: 0.75rem; font-weight: 600; color: #64748b; }
        .preset-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .preset-btn.active, .preset-btn:hover { background: #eff6ff; color: #0257d0; border-color: #0257d0; }

        /* Image Option Wrapper */
        .image-option-wrapper {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 14px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e293b;
        }

        .image-option-tabs {
          display: flex;
          gap: 8px;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 6px;
        }

        .opt-btn {
          flex: 1;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #475569;
          background: transparent;
          cursor: pointer;
        }

        .opt-btn.active {
          background: #ffffff;
          color: #0257d0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .poster-library-grid { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; }
        .sub-lbl { font-size: 0.75rem; font-weight: 600; color: #64748b; }
        .library-thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; max-height: 180px; overflow-y: auto; padding: 4px; }
        .poster-thumb-item { position: relative; border: 2px solid #e2e8f0; border-radius: 6px; overflow: hidden; height: 70px; cursor: pointer; background: #fff; transition: all 0.2s; }
        .poster-thumb-item:hover { border-color: #93c5fd; }
        .poster-thumb-item.selected { border-color: #0257d0; box-shadow: 0 0 0 2px rgba(2, 87, 208, 0.2); }
        .poster-thumb-item img { width: 100%; height: 100%; object-fit: cover; }
        .selected-check { position: absolute; top: 4px; right: 4px; background: #0257d0; color: #fff; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; }

        .file-dropzone {
          border: 2px dashed #cbd5e1;
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
          color: #64748b;
          font-size: 0.85rem;
        }

        .file-dropzone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .dropzone-icon {
          font-size: 2rem;
          color: #0257d0;
        }

        .image-preview-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 8px;
        }

        .image-preview-box .lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }

        .image-preview-box img {
          width: 100%;
          max-height: 140px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
