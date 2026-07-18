"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="global-loader">
      <motion.div
        className="loader-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="loader-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        Loading Academy...
      </motion.p>

      <style jsx>{`
        .global-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: var(--bg-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-4);
        }

        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--bg-surface-border);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
        }

        .loader-text {
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
