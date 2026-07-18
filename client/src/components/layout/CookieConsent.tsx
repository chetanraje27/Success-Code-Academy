"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { FaCookieBite } from "react-icons/fa6";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="cookie-wrapper">
          <motion.div 
            className="cookie-card"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <div className="cookie-header">
              <span className="cookie-icon"><FaCookieBite /></span>
              <h3 className="cookie-title">Cookie Consent</h3>
            </div>
            <p className="cookie-text">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. By clicking "Accept All", you consent to our use
              of cookies. Visit our{" "}
              <a href="/privacy-policy" className="cookie-link">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
            <div className="cookie-actions">
              <div className="btn-wrapper" onClick={acceptEssential}>
                <span className="btn-outline">Essential Only</span>
              </div>
              <Button variant="primary" onClick={acceptAll}>
                Accept All
              </Button>
            </div>
          </motion.div>

          <style jsx>{`
            .cookie-wrapper {
              position: fixed;
              bottom: var(--spacing-6);
              left: var(--spacing-6);
              right: var(--spacing-6);
              z-index: 9999;
              display: flex;
              justify-content: flex-start;
              pointer-events: none;
            }

            @media (min-width: 768px) {
              .cookie-wrapper {
                right: auto;
                max-width: 420px;
                bottom: var(--spacing-8);
                left: var(--spacing-8);
              }
            }

            :global(.cookie-card) {
              background: rgba(255, 255, 255, 0.85);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.5);
              border-radius: var(--radius-lg);
              padding: var(--spacing-6);
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05);
              pointer-events: auto;
              display: flex;
              flex-direction: column;
              gap: var(--spacing-4);
            }

            .cookie-header {
              display: flex;
              align-items: center;
              gap: var(--spacing-3);
            }

            .cookie-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.5rem;
              color: var(--accent-primary);
              background: var(--accent-glow);
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }

            .cookie-title {
              font-size: 1.125rem;
              font-weight: 700;
              color: var(--text-primary);
              margin: 0;
            }

            .cookie-text {
              font-size: 0.875rem;
              color: var(--text-secondary);
              line-height: 1.6;
              margin: 0;
            }

            .cookie-link {
              color: var(--accent-primary);
              font-weight: 600;
              text-decoration: none;
              transition: opacity 0.2s ease;
            }

            .cookie-link:hover {
              opacity: 0.8;
              text-decoration: underline;
            }

            .cookie-actions {
              display: flex;
              align-items: center;
              gap: var(--spacing-3);
              margin-top: var(--spacing-2);
            }

            .btn-wrapper {
              cursor: pointer;
            }

            .btn-outline {
              display: inline-block;
              font-size: 0.875rem;
              font-weight: 600;
              color: var(--text-secondary);
              padding: 10px 16px;
              border-radius: var(--radius-full);
              background: transparent;
              transition: all 0.2s ease;
            }

            .btn-outline:hover {
              background: rgba(0,0,0,0.04);
              color: var(--text-primary);
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}