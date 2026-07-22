"use client";

import React, { useState } from "react";
import { 
  FaStream, 
  FaPlus, 
  FaTrash, 
  FaArrowUp, 
  FaArrowDown, 
  FaExternalLinkAlt, 
  FaCheck 
} from "react-icons/fa";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  target: "_self" | "_blank";
  order: number;
  location: "Header" | "Footer" | "Both";
}

export default function AdminNavigationPage() {
  const [menus, setMenus] = useState<MenuItem[]>([
    { id: "1", label: "Home", path: "/", target: "_self", order: 1, location: "Both" },
    { id: "2", label: "About Us", path: "/about", target: "_self", order: 2, location: "Both" },
    { id: "3", label: "NEET Courses", path: "/courses", target: "_self", order: 3, location: "Both" },
    { id: "4", label: "Scholarships", path: "/scholarships", target: "_self", order: 4, location: "Both" },
    { id: "5", label: "Results & Rankers", path: "/results", target: "_self", order: 5, location: "Both" },
    { id: "6", label: "Contact Us", path: "/contact", target: "_self", order: 6, location: "Both" },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const moveMenu = (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= menus.length) return;
    const next = [...menus];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setMenus(next.map((m, i) => ({ ...m, order: i + 1 })));
  };

  const handleAddMenu = () => {
    const label = prompt("Enter Menu Label (e.g. Test Series):");
    const path = prompt("Enter Target Path (e.g. /courses):");
    if (label && path) {
      setMenus(prev => [...prev, { id: Date.now().toString(), label, path, target: "_self", order: prev.length + 1, location: "Both" }]);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this menu item?")) {
      setMenus(prev => prev.filter(m => m.id !== id).map((m, i) => ({ ...m, order: i + 1 })));
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="nav-cms-container">
      <div className="cms-header">
        <div>
          <h1 className="cms-title">Navigation Menu Builder</h1>
          <p className="cms-subtitle">Customize header navbar, footer quick links, display sequence, dropdowns, and target URLs.</p>
        </div>
        <button className="add-btn" onClick={handleAddMenu}><FaPlus /> Add Menu Item</button>
      </div>

      <div className="menu-list-card">
        {menus.map((item, idx) => (
          <div key={item.id} className="menu-bar-card">
            <div className="order-badge">#{item.order}</div>
            <div className="reorder-btns">
              <button disabled={idx === 0} onClick={() => moveMenu(idx, "up")}><FaArrowUp /></button>
              <button disabled={idx === menus.length - 1} onClick={() => moveMenu(idx, "down")}><FaArrowDown /></button>
            </div>

            <div className="menu-info">
              <span className="label">{item.label}</span>
              <span className="path"><FaExternalLinkAlt className="ic" /> {item.path}</span>
            </div>

            <span className="loc-pill">{item.location} Menu</span>

            <button className="del-btn" onClick={() => handleDelete(item.id)}><FaTrash /></button>
          </div>
        ))}

        <button className="save-btn" onClick={handleSave}>
          {isSaved ? <><FaCheck /> Navigation Saved</> : "Save Navigation Hierarchy"}
        </button>
      </div>

      <style jsx>{`
        .nav-cms-container { display: flex; flex-direction: column; gap: 20px; max-width: 900px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }

        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .menu-list-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .menu-bar-card { display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; }
        .order-badge { background: #eff6ff; color: #0257d0; font-weight: 800; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; }

        .reorder-btns { display: flex; gap: 2px; }
        .reorder-btns button { background: #ffffff; border: 1px solid #cbd5e1; padding: 4px 6px; border-radius: 4px; font-size: 0.7rem; cursor: pointer; }
        .reorder-btns button:disabled { opacity: 0.3; }

        .menu-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .menu-info .label { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
        .menu-info .path { font-size: 0.78rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
        .loc-pill { background: #e0f2fe; color: #0369a1; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }

        .del-btn { background: #fee2e2; color: #dc2626; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 10px; width: max-content; }
      `}</style>
    </div>
  );
}
