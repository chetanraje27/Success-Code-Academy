"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useEditModeOptional } from "@/components/admin/EditModeContext";
import { useSiteSettings, whatsappHref } from "@/lib/site-settings";

export default function WhatsAppWidget() {
  const settings = useSiteSettings();
  const { editMode } = useEditModeOptional();
  const message = encodeURIComponent("Hi! I'm interested in learning more about Success Code Academy programs.");
  const href = `${whatsappHref(settings)}?text=${message}`;

  if (editMode) return null;

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-widget"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="whatsapp-icon" />
      </a>
      <style jsx>{`
        .whatsapp-widget {
          position: fixed;
          bottom: max(var(--space-4), env(safe-area-inset-bottom));
          right: max(var(--space-4), env(safe-area-inset-right));
          z-index: 40;
          width: 3.25rem;
          height: 3.25rem;
          background-color: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          transition:
            background-color var(--duration-fast) var(--ease-standard),
            transform var(--duration-fast) var(--ease-standard);
          animation: fadeIn var(--duration-overlay) var(--ease-standard) forwards;
        }
        
        .whatsapp-widget:hover {
          background-color: var(--accent-secondary);
          transform: scale(1.1);
        }

        :global(.whatsapp-icon) {
          width: 1.75rem;
          height: 1.75rem;
          color: white;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 767px) {
          .whatsapp-widget {
            bottom: max(5.5rem, calc(1.5rem + env(safe-area-inset-bottom)));
            right: max(1rem, env(safe-area-inset-right));
            width: 3.5rem;
            height: 3.5rem;
            z-index: 90;
          }
        }
      `}</style>
    </>
  );
}
