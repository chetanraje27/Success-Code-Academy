"use client";

import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

type AdminModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
  footer?: React.ReactNode;
};

export default function AdminModal({
  open,
  title,
  onClose,
  children,
  width = 560,
  footer,
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sca-admin-modal-root" role="dialog" aria-modal="true">
      <div className="sca-admin-modal-backdrop" onClick={onClose} />
      <div
        className="sca-admin-modal-panel"
        style={{ maxWidth: typeof width === "number" ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sca-admin-modal-header">
          <h3>{title}</h3>
          <button type="button" className="sca-admin-icon-btn" onClick={onClose} aria-label="Close">
            <FaXmark />
          </button>
        </div>
        <div className="sca-admin-modal-body">{children}</div>
        {footer ? <div className="sca-admin-modal-footer">{footer}</div> : null}
      </div>

      <style jsx global>{`
        .sca-admin-modal-root {
          position: fixed;
          inset: 0;
          z-index: 10050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .sca-admin-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
        }
        .sca-admin-modal-panel {
          position: relative;
          width: 100%;
          max-height: min(90vh, 860px);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sca-admin-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid #e2e8f0;
        }
        .sca-admin-modal-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          font-family: "Outfit", sans-serif;
        }
        .sca-admin-modal-body {
          padding: 16px 18px;
          overflow-y: auto;
          flex: 1;
        }
        .sca-admin-modal-footer {
          padding: 12px 18px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          background: #f8fafc;
        }
        .sca-admin-icon-btn {
          border: none;
          background: #f1f5f9;
          color: #334155;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .sca-admin-icon-btn:hover {
          background: #e2e8f0;
        }
        .sca-admin-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sca-admin-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sca-admin-field label {
          font-size: 0.8rem;
          font-weight: 650;
          color: #475569;
        }
        .sca-admin-field input,
        .sca-admin-field textarea,
        .sca-admin-field select {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.92rem;
          color: #0f172a;
          background: #fff;
          outline: none;
        }
        .sca-admin-field input:focus,
        .sca-admin-field textarea:focus,
        .sca-admin-field select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .sca-admin-field textarea {
          min-height: 88px;
          resize: vertical;
        }
        .sca-admin-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 560px) {
          .sca-admin-row {
            grid-template-columns: 1fr;
          }
        }
        .sca-admin-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #334155;
          font-weight: 600;
        }
        .sca-admin-btn {
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-weight: 650;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .sca-admin-btn.primary {
          background: #2563eb;
          color: #fff;
        }
        .sca-admin-btn.primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .sca-admin-btn.ghost {
          background: #e2e8f0;
          color: #0f172a;
        }
        .sca-admin-btn.danger {
          background: #fee2e2;
          color: #b91c1c;
        }
        .sca-admin-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sca-admin-list-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #f8fafc;
        }
        .sca-admin-list-item .meta {
          flex: 1;
          min-width: 0;
        }
        .sca-admin-list-item .meta strong {
          display: block;
          font-size: 0.92rem;
          color: #0f172a;
        }
        .sca-admin-list-item .meta span {
          display: block;
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sca-admin-list-actions {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .sca-admin-thumb {
          width: 56px;
          height: 40px;
          border-radius: 6px;
          object-fit: cover;
          background: #e2e8f0;
          flex-shrink: 0;
        }
        .sca-admin-empty {
          text-align: center;
          color: #64748b;
          padding: 24px 8px;
          font-size: 0.9rem;
        }
        .sca-admin-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
