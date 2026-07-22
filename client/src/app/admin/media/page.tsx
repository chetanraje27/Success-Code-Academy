"use client";

import React, { useState } from "react";
import { 
  FaFolder, 
  FaFolderPlus, 
  FaCloudUploadAlt, 
  FaSearch, 
  FaTrash, 
  FaCopy, 
  FaEdit, 
  FaCheck, 
  FaImage, 
  FaFilePdf, 
  FaFilm,
  FaTimes
} from "react-icons/fa";

interface MediaAsset {
  id: string;
  name: string;
  folder: "Banners" | "Results" | "Brochures" | "Gallery" | "Faculty";
  type: "Image" | "PDF" | "Video";
  size: string;
  dimensions?: string;
  url: string;
  altText: string;
  uploadedAt: string;
  usageCount: number;
}

export default function AdminMediaManagerPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [assets, setAssets] = useState<MediaAsset[]>([
    { id: "1", name: "HeroPoster1.png", folder: "Banners", type: "Image", size: "1.8 MB", dimensions: "1920x800", url: "/images/banners/HeroPoster1.png", altText: "NEET 2027 Admissions Hero Poster", uploadedAt: "2026-07-20", usageCount: 3 },
    { id: "2", name: "HeroPoster2.png", folder: "Banners", type: "Image", size: "1.5 MB", dimensions: "1920x800", url: "/images/banners/HeroPoster2.png", altText: "NEET Repeater Achievers Batch Poster", uploadedAt: "2026-07-20", usageCount: 2 },
    { id: "3", name: "ScholorshipHero.png", folder: "Banners", type: "Image", size: "1.8 MB", dimensions: "1920x800", url: "/images/banners/ScholorshipHero.png", altText: "Scholarship Test 2026 Poster", uploadedAt: "2026-07-20", usageCount: 4 },
    { id: "4", name: "Results_Hero.png", folder: "Results", type: "Image", size: "1.8 MB", dimensions: "1920x800", url: "/images/banners/Results_Hero.png", altText: "NEET Top Rankers Banner", uploadedAt: "2026-07-19", usageCount: 2 },
    { id: "5", name: "neet-2-year-program.pdf", folder: "Brochures", type: "PDF", size: "2.4 MB", url: "/brochures/neet-2-year-program.pdf", altText: "Syllabus Brochure PDF", uploadedAt: "2026-07-15", usageCount: 5 }
  ]);

  const folders = ["All", "Banners", "Results", "Brochures", "Gallery", "Faculty"];

  const filteredAssets = assets.filter(a => {
    const matchesFolder = selectedFolder === "All" || a.folder === selectedFolder;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.altText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const copyUrlToClipboard = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media asset permanently?")) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="media-cms-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Centralized Media & Assets Manager</h1>
          <p className="cms-subtitle">Upload, organize into folders, compress, crop, set alt text, and copy CDN URLs for reuse across website pages.</p>
        </div>
        <div className="header-actions">
          <label className="upload-btn">
            <FaCloudUploadAlt /> Upload Files
            <input type="file" multiple accept="image/*,application/pdf,video/*" style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Folders Bar & Search */}
      <div className="filter-toolbar">
        <div className="folder-pills">
          {folders.map(f => (
            <button key={f} className={`fld-pill ${selectedFolder === f ? 'active' : ''}`} onClick={() => setSelectedFolder(f)}>
              <FaFolder className="ic" /> {f}
            </button>
          ))}
        </div>

        <div className="search-wrap">
          <FaSearch className="ic" />
          <input type="text" placeholder="Search files by name or alt text..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Media Assets Grid */}
      <div className="media-grid">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="asset-card">
            <div className="asset-preview">
              {asset.type === "Image" ? (
                <img src={asset.url} alt={asset.altText} onError={(e: any) => e.target.src = "/images/banners/HeroPoster1.png"} />
              ) : (
                <div className="document-preview">
                  <FaFilePdf className="doc-ic" />
                  <span>{asset.name}</span>
                </div>
              )}
              <span className="folder-tag">{asset.folder}</span>
            </div>

            <div className="asset-info">
              <h4 className="asset-name" title={asset.name}>{asset.name}</h4>
              <div className="asset-meta">
                <span>{asset.size}</span> • <span>{asset.dimensions || 'PDF'}</span>
              </div>
              <span className="usage-count">Used in {asset.usageCount} places</span>

              <div className="asset-actions">
                <button className={`copy-btn ${copiedId === asset.id ? 'copied' : ''}`} onClick={() => copyUrlToClipboard(asset)}>
                  {copiedId === asset.id ? <><FaCheck /> Copied URL</> : <><FaCopy /> Copy URL</>}
                </button>
                <button className="del-btn" onClick={() => handleDelete(asset.id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Styled JSX */}
      <style jsx>{`
        .media-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .upload-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-toolbar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; gap: 16px; }
        .folder-pills { display: flex; gap: 6px; overflow-x: auto; }
        .fld-pill { display: flex; align-items: center; gap: 6px; border: 1px solid #cbd5e1; background: #ffffff; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .fld-pill.active { background: #eff6ff; color: #0257d0; border-color: #0257d0; }

        .search-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 300px; }
        .search-wrap .ic { color: #94a3b8; }
        .search-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }

        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
        .asset-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
        .asset-preview { position: relative; height: 140px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .asset-preview img { width: 100%; height: 100%; object-fit: cover; }
        .folder-tag { position: absolute; top: 6px; left: 6px; background: rgba(15, 23, 42, 0.85); color: #ffffff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }

        .document-preview { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #dc2626; font-size: 0.8rem; font-weight: 700; padding: 10px; text-align: center; }
        .doc-ic { font-size: 2.2rem; }

        .asset-info { padding: 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .asset-name { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .asset-meta { font-size: 0.72rem; color: #64748b; }
        .usage-count { font-size: 0.68rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; width: max-content; }

        .asset-actions { display: flex; gap: 6px; margin-top: auto; padding-top: 8px; border-top: 1px dashed #e2e8f0; }
        .copy-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; border: none; background: #eff6ff; color: #0257d0; padding: 6px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .copy-btn.copied { background: #dcfce7; color: #15803d; }
        .del-btn { background: #fee2e2; color: #dc2626; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
      `}</style>
    </div>
  );
}
