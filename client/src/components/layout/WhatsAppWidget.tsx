"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppWidget() {
  const phoneNumber = "918600470850"; // With country code, no +
  const message = encodeURIComponent("Hi! I'm interested in learning more about Success Code Academy programs.");

  return (
    <>
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
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
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 40;
          width: 3.5rem;
          height: 3.5rem;
          background-color: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .whatsapp-widget:hover {
          background-color: var(--accent-secondary);
          transform: scale(1.1);
        }

        :global(.whatsapp-icon) {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}