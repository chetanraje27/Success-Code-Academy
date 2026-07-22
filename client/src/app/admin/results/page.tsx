"use client";

import React, { useState } from "react";
import { 
  FaStar, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTrophy, 
  FaGraduationCap, 
  FaTimes, 
  FaDownload, 
  FaUpload, 
  FaSearch, 
  FaFilter,
  FaVideo,
  FaQuoteLeft,
  FaCheckCircle,
  FaThList,
  FaThLarge
} from "react-icons/fa";

interface ResultItem {
  id: string;
  studentName: string;
  year: string;
  neetScore: string;
  marks: number;
  rank: string;
  air: number;
  categoryRank: string;
  category: string;
  college: string;
  branch: string;
  course: string;
  admissionType: string;
  achievementTags: string[];
  photo: string;
  parentPhoto?: string;
  videoUrl?: string;
  quote?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  status: "Published" | "Draft";
  featured: boolean;
  topper: boolean;
  sortOrder: number;
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([
    {
      id: "1",
      studentName: "Aarav Sharma",
      year: "2026",
      neetScore: "715 / 720",
      marks: 715,
      rank: "AIR 14",
      air: 14,
      categoryRank: "AIR 4 (OBC)",
      category: "OBC",
      college: "AIIMS New Delhi",
      branch: "MBBS",
      course: "Two Year Classroom Program",
      admissionType: "All India Quota",
      achievementTags: ["TOP 20 AIR", "PHYSICS 180/180", "1ST ATTEMPT"],
      photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Aarav+Sharma",
      quote: "Success Code Academy gave me the exact NCERT mock tests needed for AIIMS Delhi!",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      status: "Published",
      featured: true,
      topper: true,
      sortOrder: 1
    },
    {
      id: "2",
      studentName: "Samruddhi Lokhande",
      year: "2025",
      neetScore: "602 / 720",
      marks: 602,
      rank: "AIR 1204",
      air: 1204,
      categoryRank: "AIR 312",
      category: "General",
      college: "BJ Medical College Pune",
      branch: "MBBS",
      course: "NEET FRESHERS BATCH",
      admissionType: "State Merit",
      achievementTags: ["1ST ATTEMPT", "BIOLOGY 350/360"],
      photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Samruddhi+Lokhande",
      quote: "Personal mentorship from faculty helped me clear NEET on my first attempt.",
      status: "Published",
      featured: true,
      topper: true,
      sortOrder: 2
    },
    {
      id: "3",
      studentName: "Piyush Kale",
      year: "2024",
      neetScore: "681 / 720",
      marks: 681,
      rank: "AIR 2840",
      air: 2840,
      categoryRank: "AIR 640",
      category: "General",
      college: "GMC Nagpur",
      branch: "MBBS",
      course: "NEET FRESHERS BATCH",
      admissionType: "State Merit",
      achievementTags: ["TOP RANKER"],
      photo: "https://placehold.co/300x320/e2e8f0/1e293b?text=Piyush+Kale",
      status: "Published",
      featured: true,
      topper: false,
      sortOrder: 3
    }
  ]);

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResultItem | null>(null);
  const [formData, setFormData] = useState<Partial<ResultItem>>({});

  const filteredResults = results.filter(r => {
    const matchesYear = selectedYear === "All" || r.year === selectedYear;
    const matchesQuery = r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.rank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFeatured = !filterFeatured || r.featured;
    return matchesYear && matchesQuery && matchesFeatured;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      year: "2026",
      category: "General",
      branch: "MBBS",
      admissionType: "All India Quota",
      status: "Published",
      featured: true,
      topper: false,
      sortOrder: results.length + 1,
      achievementTags: ["NEET RANKER"]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ResultItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem ? editingItem.id : Date.now().toString();
    const itemToSave = { id, ...formData } as ResultItem;

    if (editingItem) {
      setResults(prev => prev.map(r => r.id === id ? itemToSave : r));
    } else {
      setResults(prev => [itemToSave, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this result entry?")) {
      setResults(prev => prev.filter(r => r.id !== id));
    }
  };

  const exportCSV = () => {
    const headers = ["Student Name", "Year", "AIR", "NEET Score", "College", "Branch", "Course", "Category"];
    const rows = filteredResults.map(r => [
      `"${r.studentName}"`,
      r.year,
      `"${r.rank}"`,
      `"${r.neetScore}"`,
      `"${r.college}"`,
      `"${r.branch}"`,
      `"${r.course}"`,
      `"${r.category}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NEET_Results_Export_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="results-cms-container">
      {/* Header */}
      <div className="cms-header">
        <div>
          <h1 className="cms-title">NEET Results & Ranker CMS</h1>
          <p className="cms-subtitle">Comprehensive management of student ranks, NEET scores, college admissions, testimonials, and achievement badges.</p>
        </div>
        <div className="header-actions">
          <button className="csv-btn" onClick={exportCSV}><FaDownload /> Export CSV</button>
          <button className="add-btn" onClick={handleOpenAdd}><FaPlus /> Add Ranker Result</button>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="filter-toolbar">
        <div className="toolbar-left">
          <div className="year-pills">
            {["All", "2026", "2025", "2024"].map(yr => (
              <button
                key={yr}
                className={`yr-pill ${selectedYear === yr ? 'active' : ''}`}
                onClick={() => setSelectedYear(yr)}
              >
                {yr === "All" ? "All Years" : `NEET ${yr}`}
              </button>
            ))}
          </div>

          <div className="search-input-wrap">
            <FaSearch className="ic" />
            <input 
              type="text" 
              placeholder="Search student, college, AIR..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <label className="checkbox-filter">
            <input type="checkbox" checked={filterFeatured} onChange={e => setFilterFeatured(e.target.checked)} />
            <span>Show Featured Stars Only</span>
          </label>
        </div>

        <div className="toolbar-right">
          <span className="total-count">{filteredResults.length} Results</span>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')} title="Table View"><FaThList /></button>
            <button className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')} title="Cards View"><FaThLarge /></button>
          </div>
        </div>
      </div>

      {/* Table Display */}
      {viewMode === "table" ? (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Student Profile</th>
                <th>Exam Year</th>
                <th>AIR Rank & Score</th>
                <th>College Allotted</th>
                <th>Course Enrolled</th>
                <th>Featured Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(r => (
                <tr key={r.id}>
                  <td><strong>#{r.sortOrder || 1}</strong></td>
                  <td>
                    <div className="student-profile-cell">
                      <img src={r.photo} alt={r.studentName} className="avatar" onError={(e: any) => e.target.src = "https://placehold.co/100x100/e2e8f0/1e293b?text=Student"} />
                      <div className="details">
                        <span className="name">{r.studentName}</span>
                        <span className="category">{r.category} • {r.admissionType || 'State Merit'}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="year-pill">NEET {r.year}</span></td>
                  <td>
                    <div className="rank-cell">
                      <span className="rank"><FaStar className="star-ic" /> {r.rank}</span>
                      <span className="score">{r.neetScore}</span>
                    </div>
                  </td>
                  <td>
                    <div className="college-cell">
                      <span className="college-name">{r.college}</span>
                      <span className="branch">{r.branch}</span>
                    </div>
                  </td>
                  <td><span className="course-name">{r.course}</span></td>
                  <td>
                    <span className={`status-badge ${r.status.toLowerCase()}`}>
                      {r.featured ? '★ Featured Star' : r.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-btn edit" onClick={() => handleOpenEdit(r)}><FaEdit /></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(r.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards Display */
        <div className="cards-grid">
          {filteredResults.map(r => (
            <div key={r.id} className="ranker-card">
              <div className="card-top">
                <img src={r.photo} alt={r.studentName} className="photo" />
                <span className="yr-badge">NEET {r.year}</span>
                {r.topper && <span className="topper-badge">TOP RANKER</span>}
              </div>
              <div className="card-body">
                <h3 className="name">{r.studentName}</h3>
                <p className="course">{r.course}</p>
                <div className="metrics-box">
                  <div className="metric">
                    <span className="lbl">RANK</span>
                    <span className="val rank"><FaStar /> {r.rank}</span>
                  </div>
                  <div className="metric">
                    <span className="lbl">SCORE</span>
                    <span className="val score">{r.neetScore}</span>
                  </div>
                </div>
                <div className="college-info">
                  <FaGraduationCap className="ic" /> {r.college} ({r.branch})
                </div>
                <div className="tags-row">
                  {r.achievementTags?.map((tag, i) => (
                    <span key={i} className="tag-chip">{tag}</span>
                  ))}
                </div>
                <div className="card-actions">
                  <button className="act-btn edit" onClick={() => handleOpenEdit(r)}><FaEdit /> Edit</button>
                  <button className="act-btn delete" onClick={() => handleDelete(r.id)}><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Ranker Result' : 'Add New Ranker Result'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Student Full Name</label>
                  <input type="text" required value={formData.studentName || ''} onChange={e => setFormData({ ...formData, studentName: e.target.value })} placeholder="e.g. Samruddhi Lokhande" />
                </div>
                <div className="form-group">
                  <label>NEET Exam Year</label>
                  <select value={formData.year || '2026'} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>All India Rank (AIR)</label>
                  <input type="text" required value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} placeholder="e.g. AIR 1204" />
                </div>
                <div className="form-group">
                  <label>NEET Marks / Score</label>
                  <input type="text" required value={formData.neetScore || ''} onChange={e => setFormData({ ...formData, neetScore: e.target.value })} placeholder="e.g. 602 / 720" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category Rank</label>
                  <input type="text" value={formData.categoryRank || ''} onChange={e => setFormData({ ...formData, categoryRank: e.target.value })} placeholder="e.g. AIR 312 (OBC)" />
                </div>
                <div className="form-group">
                  <label>Student Category</label>
                  <select value={formData.category || 'General'} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="General">General / Open</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Medical College Allotted</label>
                  <input type="text" value={formData.college || ''} onChange={e => setFormData({ ...formData, college: e.target.value })} placeholder="e.g. AIIMS New Delhi or BJMC Pune" />
                </div>
                <div className="form-group">
                  <label>Branch / Program</label>
                  <input type="text" value={formData.branch || 'MBBS'} onChange={e => setFormData({ ...formData, branch: e.target.value })} placeholder="e.g. MBBS, BDS, BAMS" />
                </div>
              </div>

              <div className="form-group">
                <label>Enrolled Course / Batch Name</label>
                <input type="text" required value={formData.course || ''} onChange={e => setFormData({ ...formData, course: e.target.value })} placeholder="e.g. NEET FRESHERS BATCH" />
              </div>

              <div className="form-group">
                <label>Student Photo URL or Path</label>
                <input type="text" value={formData.photo || ''} onChange={e => setFormData({ ...formData, photo: e.target.value })} placeholder="https://... or /images/results/student.jpg" />
              </div>

              <div className="form-group">
                <label>Success Story Quote / Testimonial</label>
                <textarea rows={2} value={formData.quote || ''} onChange={e => setFormData({ ...formData, quote: e.target.value })} placeholder="Student mentorship experience..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Featured Star on Homepage</label>
                  <select value={formData.featured ? 'true' : 'false'} onChange={e => setFormData({ ...formData, featured: e.target.value === 'true' })}>
                    <option value="true">Yes (Show in Meet Our Stars Carousel)</option>
                    <option value="false">No (Results Page Only)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Sort Order #</label>
                  <input type="number" min={1} value={formData.sortOrder || 1} onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })} />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx>{`
        .results-cms-container { display: flex; flex-direction: column; gap: 20px; }
        .cms-header { display: flex; justify-content: space-between; align-items: center; }
        .cms-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .cms-subtitle { font-size: 0.85rem; color: #64748b; margin: 0; }
        .header-actions { display: flex; gap: 10px; }

        .csv-btn { display: flex; align-items: center; gap: 8px; background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .csv-btn:hover { background: #f8fafc; border-color: #93c5fd; color: #0257d0; }
        .add-btn { display: flex; align-items: center; gap: 8px; background: #0257d0; color: #ffffff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        .filter-toolbar { display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 12px; gap: 16px; }
        .toolbar-left { display: flex; align-items: center; gap: 16px; flex: 1; }
        .year-pills { display: flex; gap: 6px; }
        .yr-pill { border: 1px solid #cbd5e1; background: #ffffff; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .yr-pill.active { background: #eff6ff; color: #0257d0; border-color: #0257d0; }

        .search-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 8px; width: 260px; }
        .search-input-wrap .ic { color: #94a3b8; font-size: 0.85rem; }
        .search-input-wrap input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.85rem; }

        .checkbox-filter { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: #475569; cursor: pointer; }

        .toolbar-right { display: flex; align-items: center; gap: 14px; }
        .total-count { font-size: 0.82rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }
        .view-toggle { display: flex; gap: 4px; background: #f1f5f9; padding: 3px; border-radius: 6px; }
        .view-btn { border: none; background: transparent; color: #64748b; padding: 5px 8px; border-radius: 4px; cursor: pointer; }
        .view-btn.active { background: #ffffff; color: #0257d0; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        /* Table */
        .table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; }
        .admin-table th { background: #f8fafc; padding: 12px 16px; font-size: 0.78rem; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; }

        .student-profile-cell { display: flex; align-items: center; gap: 12px; }
        .student-profile-cell .avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #cbd5e1; }
        .student-profile-cell .details { display: flex; flex-direction: column; }
        .student-profile-cell .name { font-weight: 700; color: #0f172a; font-size: 0.9rem; }
        .student-profile-cell .category { font-size: 0.75rem; color: #64748b; }

        .year-pill { background: #f1f5f9; color: #334155; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .rank-cell { display: flex; flex-direction: column; }
        .rank-cell .rank { font-weight: 800; color: #1e40af; display: flex; align-items: center; gap: 4px; }
        .rank-cell .star-ic { color: #f59e0b; }
        .rank-cell .score { font-size: 0.8rem; font-weight: 700; color: #0257d0; }

        .college-cell { display: flex; flex-direction: column; }
        .college-cell .college-name { font-weight: 700; color: #0f172a; }
        .college-cell .branch { font-size: 0.75rem; color: #64748b; }

        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; }
        .status-badge.published { background: #dcfce7; color: #15803d; }

        .table-actions { display: flex; gap: 6px; }
        .icon-btn { border: none; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; cursor: pointer; color: #475569; }
        .icon-btn.edit:hover { background: #e0f2fe; color: #0284c7; }
        .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; }

        /* Cards Grid */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .ranker-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .card-top { position: relative; height: 200px; background: #e0f2fe; }
        .card-top .photo { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .yr-badge { position: absolute; bottom: 10px; right: 10px; background: #0f172a; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; }
        .topper-badge { position: absolute; top: 10px; left: 10px; background: #f59e0b; color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }

        .card-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .card-body .name { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; }
        .card-body .course { font-size: 0.75rem; color: #64748b; margin: 0; text-transform: uppercase; font-weight: 700; }

        .metrics-box { display: flex; justify-content: space-between; background: #f8fafc; padding: 8px 12px; border-radius: 8px; }
        .metric { display: flex; flex-direction: column; gap: 2px; }
        .metric .lbl { font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
        .metric .val { font-size: 0.9rem; font-weight: 800; }
        .metric .val.rank { color: #1e40af; }
        .metric .val.score { color: #0257d0; }

        .college-info { font-size: 0.8rem; font-weight: 600; color: #334155; display: flex; align-items: center; gap: 6px; }
        .tags-row { display: flex; gap: 4px; flex-wrap: wrap; }
        .tag-chip { background: #eff6ff; color: #0257d0; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; }

        .card-actions { display: flex; gap: 6px; margin-top: auto; padding-top: 10px; border-top: 1px dashed #e2e8f0; }
        .act-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
        .act-btn.edit { background: #e0f2fe; color: #0369a1; }
        .act-btn.delete { background: #fee2e2; color: #b91c1c; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-card { background: #ffffff; border-radius: 12px; width: 100%; max-width: 620px; overflow: hidden; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
        .modal-form { padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 75vh; overflow-y: auto; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 0.8rem; font-weight: 600; color: #334155; }
        .form-group input, .form-group textarea, .form-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .cancel-btn { background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
        .save-btn { background: #0257d0; color: #ffffff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
