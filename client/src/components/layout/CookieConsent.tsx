"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaCookieBite } from "react-icons/fa6";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { editMode } = useEditModeOptional();

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
        <div className={`cookie-wrapper ${editMode ? "editing" : ""}`}>
          <motion.div 
            className="cookie-card"
            role="region"
            aria-labelledby="cookie-consent-title"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="cookie-header">
              <span className="cookie-icon"><FaCookieBite /></span>
              <h3 id="cookie-consent-title" className="cookie-title">Cookie Consent</h3>
            </div>
            <p className="cookie-text">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. By clicking &quot;Accept All&quot;, you consent to our use
              of cookies. Visit our{" "}
              <a href="/privacy-policy" className="cookie-link">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
            <div className="cookie-actions">
              <Button variant="ghost" size="sm" onClick={acceptEssential}>
                Essential Only
              </Button>
              <Button variant="primary" size="sm" onClick={acceptAll}>
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

            .cookie-wrapper.editing {
              bottom: 10rem;
            }

            @media (min-width: 768px) {
              .cookie-wrapper {
                right: auto;
                max-width: 420px;
                bottom: var(--spacing-8);
                left: var(--spacing-8);
              }

              .cookie-wrapper.editing {
                bottom: 6.5rem;
              }
            }

            :global(.cookie-card) {
              background: var(--color-surface);
              border: 1px solid var(--color-border);
              border-radius: var(--radius-dialog);
              padding: var(--space-5);
              box-shadow: var(--shadow-md);
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
              transition: opacity var(--duration-fast) var(--ease-standard);
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
              flex-wrap: wrap;
            }

            @media (max-width: 767px) {
              .cookie-wrapper {
                bottom: calc(5.5rem + env(safe-area-inset-bottom));
                left: var(--space-4);
                right: var(--space-4);
              }

              .cookie-wrapper.editing {
                bottom: calc(10rem + env(safe-area-inset-bottom));
              }

              :global(.cookie-card) {
                padding: var(--space-4);
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
