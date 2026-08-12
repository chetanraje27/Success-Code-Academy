"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaInstagram, FaExternalLinkAlt } from "react-icons/fa";

interface InstagramEmbedProps {
  url: string;
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  // Normalize URL to standard reel / post link (without embed suffix for blockquote)
  const cleanUrl = url
    .replace(/\/embed\/?.*$/i, "/")
    .replace(/\?.*$/, "");

  useEffect(() => {
    setLoadError(false);

    const loadScript = () => {
      if (typeof window !== "undefined" && (window as any).instgrm) {
        try {
          (window as any).instgrm.Embeds.process();
        } catch (e) {
          console.error("Instagram embed process error:", e);
        }
        return;
      }

      const existingScript = document.getElementById("instagram-embed-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          if (typeof window !== "undefined" && (window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
          }
        };
        script.onerror = () => {
          setLoadError(true);
        };
        document.body.appendChild(script);
      } else {
        if (typeof window !== "undefined" && (window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      }
    };

    // Small delay to ensure DOM element is mounted
    const timer = setTimeout(loadScript, 100);

    return () => clearTimeout(timer);
  }, [cleanUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        borderRadius: "12px",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={cleanUrl}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: "0",
          borderRadius: "12px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px auto",
          maxWidth: "540px",
          minWidth: "300px",
          padding: "0",
          width: "99.375%",
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#FFFFFF",
              lineHeight: "0",
              padding: "0 0",
              textAlign: "center",
              textDecoration: "none",
              width: "100%",
              color: "#0095f6",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <FaInstagram size={20} /> View post on Instagram
          </a>
        </div>
      </blockquote>

      {loadError && (
        <div style={{ marginTop: "12px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
          <p style={{ margin: "0 0 8px 0" }}>Unable to load embed directly in browser frame.</p>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#e1306c",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Open on Instagram <FaExternalLinkAlt size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
