"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="maintenance-wrapper">
      <main className="maintenance-main">
        <Image
          src="/images/ui/logo2.png"
          alt="Success Code Academy"
          width={260}
          height={80}
          className="maintenance-logo"
          priority
        />


        <h1 className="main-title">We're upgrading our platform.</h1>
        
        <p className="main-subtitle">
          Success Code Academy is currently unavailable as we roll out essential updates to improve your learning experience. We expect to be back online shortly.
        </p>

        <div className="action-group">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Refresh Page
          </button>
          
          <a href="https://wa.me/919422055620" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <FaWhatsapp className="wa-icon" />
            Support
          </a>
        </div>
      </main>

      <style jsx>{`
        .maintenance-wrapper {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #ffffff;
          font-family: var(--font-inter), -apple-system, sans-serif;
          color: #0f172a;
          overflow: hidden;
        }

        .maintenance-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          max-width: 650px;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .maintenance-logo {
          object-fit: contain;
          margin-bottom: 4rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 1rem;
          background: #f1f5f9;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #475569;
          margin-bottom: 1.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #0ea5e9;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }

        .main-title {
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #020617;
          margin-top: 3rem;
          margin-bottom: 1rem;
        }

        .main-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }

        .action-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
        }

        .btn-primary:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.2);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: transparent;
          color: #334155;
          border: 1px solid #e2e8f0;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .wa-icon {
          font-size: 1.25rem;
          color: #22c55e;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .action-group {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
