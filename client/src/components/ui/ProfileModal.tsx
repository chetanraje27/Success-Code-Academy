"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdateSuccess: (updatedUser: any) => void;
}

export default function ProfileModal({ isOpen, onClose, user, onUpdateSuccess }: ProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize fields when user prop changes or modal opens
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setAge(user.age?.toString() || "");
    }
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !age) {
      setErrorMessage("Please fill in all profile fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/public/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          age: parseInt(age, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      const updatedUser = data.data.user;

      // Update localStorage with updated details
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setSuccessMessage("Profile updated successfully!");
      onUpdateSuccess(updatedUser);

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .profile-modal-card {
            padding: 32px 20px !important;
            border-radius: 20px !important;
            max-height: calc(100vh - 32px);
            overflow-y: auto;
          }
          .modal-close-btn {
            top: 12px !important;
            right: 16px !important;
          }
          .form-row-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
        }
      `}</style>
      <AnimatePresence>
      {isOpen && (
        <div 
          className="profile-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            boxSizing: "border-box",
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)"
          }}
        >
          {/* Backdrop Click */}
          <div 
            className="modal-backdrop-click" 
            style={{ position: "absolute", inset: 0 }}
            onClick={onClose} 
          />

          <motion.div
            className="profile-modal-card"
            style={{
              position: "relative",
              backgroundColor: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "440px",
              padding: "40px 32px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
              zIndex: 1010,
              boxSizing: "border-box",
              color: "#0f172a",
              fontFamily: "'Outfit', sans-serif"
            }}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button */}
            <button 
              className="modal-close-btn" 
              onClick={onClose} 
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "20px",
                right: "24px",
                background: "transparent",
                border: "none",
                fontSize: "2.2rem",
                lineHeight: 1,
                color: "#94a3b8",
                cursor: "pointer",
                padding: 0
              }}
            >
              &times;
            </button>

            <div className="modal-header" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "24px" }}>
              <div 
                className="modal-icon-circle"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px"
                }}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0257d0" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="modal-title" style={{ fontSize: "1.35rem", fontWeight: 850, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                My Student Profile
              </h3>
              <p className="modal-subtitle" style={{ fontSize: "0.92rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                View and edit your personal information profile below.
              </p>
            </div>

            {/* Alerts */}
            {errorMessage && (
              <div 
                className="modal-alert-error"
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fee2e2",
                  color: "#dc2626",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                  textAlign: "left"
                }}
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div 
                className="modal-alert-success"
                style={{
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #d1fae5",
                  color: "#059669",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                  textAlign: "left"
                }}
              >
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              {/* Mobile number - locked */}
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>Mobile Number (Locked)</label>
                <div className="input-icon-wrap" style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                  <svg 
                    className="field-icon" 
                    viewBox="0 0 24 24" 
                    width="18" 
                    height="18" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2"
                    style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={user?.mobileNumber || ""}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 48px",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      color: "#64748b",
                      backgroundColor: "#f1f5f9",
                      cursor: "not-allowed",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  />
                </div>
              </div>

              <div className="form-row-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                  <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  />
                </div>
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                  <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      backgroundColor: "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>Email ID</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    backgroundColor: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Outfit', sans-serif"
                  }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>Age</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    color: "#0f172a",
                    backgroundColor: "#ffffff",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "'Outfit', sans-serif"
                  }}
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving Changes..." : "Save Changes →"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
