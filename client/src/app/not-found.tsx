"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div 
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-desc">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="error-actions">
            <Button href="/" variant="primary" size="lg">
              Return Home
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-24) 0;
          background-color: var(--bg-surface);
          position: relative;
          overflow: hidden;
        }
        
        .not-found-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(64,181,193,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .error-code {
          font-size: 10rem;
          font-weight: 900;
          line-height: 1;
          color: var(--accent-primary);
          opacity: 0.1;
          margin-bottom: var(--spacing-4);
          letter-spacing: -0.05em;
        }

        .error-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: var(--spacing-4);
          letter-spacing: -0.02em;
        }

        .error-desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-8);
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-4);
        }

        @media (max-width: 480px) {
          .error-code {
            font-size: 6rem;
          }
          .error-title {
            font-size: 2rem;
          }
          .error-actions {
            flex-direction: column;
            width: 100%;
          }
          .error-actions :global(.btn) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
