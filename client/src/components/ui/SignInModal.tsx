"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function SignInModal({ isOpen, onClose, onLoginSuccess }: SignInModalProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSignupFields, setShowSignupFields] = useState(false);

  // New user registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    // If we are showing signup fields, proceed with registration
    if (showSignupFields) {
      if (!firstName || !lastName || !email || !age) {
        setErrorMessage("Please fill in all registration fields.");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/auth/verify-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber,
            firstName,
            lastName,
            email,
            age: parseInt(age, 10),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to register profile.");
        }

        // Save token and user details in local storage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        onLoginSuccess(data.data.user);
        handleClose();
      } catch (err: any) {
        setErrorMessage(err.message || "Registration failed. Please check details.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Otherwise, check if user exists (first click)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification request failed.");
      }

      if (data.data.exists) {
        // User exists: server logged them in directly (skipped OTP)
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        onLoginSuccess(data.data.user);
        handleClose();
      } else {
        // User is new: show signup form elements
        setShowSignupFields(true);
        setInfoMessage("Mobile number is not registered. Please fill in your profile details to create an account.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setMobileNumber("");
    setShowSignupFields(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAge("");
    setErrorMessage(null);
    setInfoMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="signin-modal-overlay"
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
            onClick={handleClose} 
          />

          <motion.div
            className="signin-modal-card"
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
              onClick={handleClose} 
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 className="modal-title" style={{ fontSize: "1.35rem", fontWeight: 850, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                {showSignupFields ? "Complete Registration" : "Sign In to Success Code"}
              </h3>
              <p className="modal-subtitle" style={{ fontSize: "0.92rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                {showSignupFields 
                  ? "Finish creating your student profile to sign in successfully."
                  : "Enter your mobile number to sign in or register instantly."
                }
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

            {infoMessage && (
              <div 
                className="modal-alert-info"
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #dbeafe",
                  color: "#1e40af",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  marginBottom: "20px",
                  textAlign: "left"
                }}
              >
                {infoMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form" style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", textAlign: "left" }}>
                <label className="form-label" style={{ fontSize: "0.88rem", fontWeight: 750, color: "#1e293b" }}>Mobile Number</label>
                <div className="input-icon-wrap" style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
                  <svg 
                    className="field-icon" 
                    viewBox="0 0 24 24" 
                    width="18" 
                    height="18" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="2"
                    style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    required
                    disabled={showSignupFields}
                    pattern="[0-9]{10}"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 48px",
                      border: "1.5px solid #cbd5e1",
                      borderRadius: "10px",
                      fontSize: "0.95rem",
                      color: "#0f172a",
                      backgroundColor: showSignupFields ? "#f8fafc" : "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "'Outfit', sans-serif"
                    }}
                  />
                </div>
              </div>

              {/* Dynamic signup fields revealed for new users */}
              {showSignupFields && (
                <motion.div 
                  className="new-user-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", flexDirection: "column" }}
                >
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
                </motion.div>
              )}

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Processing..." 
                  : showSignupFields 
                    ? "Register & Sign In →" 
                    : "Sign In →"
                }
              </Button>

              {showSignupFields && (
                <button 
                  type="button" 
                  onClick={() => {
                    setShowSignupFields(false);
                    setErrorMessage(null);
                    setInfoMessage(null);
                  }}
                  className="modal-back-btn"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    marginTop: "16px",
                    cursor: "pointer",
                    alignSelf: "center"
                  }}
                >
                  Change Mobile Number
                </button>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
