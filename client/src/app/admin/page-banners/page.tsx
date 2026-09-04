"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { adminApiFetch, uploadAdminImage } from "@/lib/admin-api";
import { ImagePlus, Upload, Loader2 } from "lucide-react";

type PageBannerSlot = {
  key: string;
  label: string;
  pageName: string;
  fallback: string;
  width: number;
  height: number;
};

const PAGE_SLOTS: PageBannerSlot[] = [
  {
    key: "page_banner_scholarships",
    label: "Scholarships page",
    pageName: "Scholarships",
    fallback: "/images/banners/ScholorshipHero.png",
    width: 1672,
    height: 941,
  },
  {
    key: "page_banner_contact",
    label: "Contact page",
    pageName: "Contact",
    fallback: "/images/banners/ContactPoster.png",
    width: 1672,
    height: 941,
  },
  {
    key: "page_banner_results",
    label: "Results page",
    pageName: "Results",
    fallback: "/images/results/heroes/NeetUG2026AchiversShravani.png",
    width: 1916,
    height: 821,
  },
];

export default function AdminPageBannersPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await adminApiFetch<Record<string, string>>("settings");
      setSettings(res.data || {});
    } catch {
      /* keep existing state */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  async function handleUpload(slot: PageBannerSlot, file: File) {
    setError(null);
    setSuccessKey(null);
    setUploading(slot.key);

    try {
      // Upload the file via the admin upload endpoint
      const imageUrl = await uploadAdminImage(file, "banner");

      // Save the URL into site_settings
      await adminApiFetch("settings", {
        method: "PUT",
        body: JSON.stringify({ [slot.key]: imageUrl }),
      });

      setSettings((prev) => ({ ...prev, [slot.key]: imageUrl }));
      setSuccessKey(slot.key);

      // Notify the live site to refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("admin-content-changed"));
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessKey(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setUploading(null);
    }
  }

  function handleFileSelect(slot: PageBannerSlot) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError("File size must be under 5 MB.");
          return;
        }

        // Validate image resolution
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          
          // Strictly enforce exact resolution based on the slot's specific dimensions
          if (img.width !== slot.width || img.height !== slot.height) {
             setError(`Image resolution must be exactly ${slot.width}x${slot.height} pixels. Your image is ${img.width}x${img.height}.`);
             return;
          }
          
          void handleUpload(slot, file);
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          setError("Invalid image file.");
        };
        
        img.src = objectUrl;
      }
    };
    input.click();
  }

  function getImageSrc(slot: PageBannerSlot): string {
    return settings[slot.key]?.trim() || slot.fallback;
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Page banners</h1>
          <p>
            Upload a single hero banner image for each page. Changes appear on the
            live website immediately. Images <strong>must match the exact required resolution</strong> for each slot.
          </p>
        </div>
      </header>

      {error && (
        <div className="pb-error-banner">
          <span>⚠</span> {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="pb-grid">
        {PAGE_SLOTS.map((slot) => {
          const isUploading = uploading === slot.key;
          const isSuccess = successKey === slot.key;
          const src = getImageSrc(slot);

          return (
            <section className="admin-card pb-card" key={slot.key}>
              <header className="admin-card-header">
                <div>
                  <strong>{slot.label}</strong>
                  <span className="pb-card-sub">Required: {slot.width}×{slot.height}px</span>
                </div>
              </header>

              <div className="pb-preview-wrap">
                {loading ? (
                  <div className="pb-placeholder">
                    <Loader2 size={24} className="pb-spin" />
                    <span>Loading…</span>
                  </div>
                ) : (
                  <div className="pb-preview">
                    <Image
                      src={src}
                      alt={`${slot.pageName} page banner`}
                      width={960}
                      height={412}
                      className="pb-preview-img"
                      unoptimized
                    />
                    {isUploading && (
                      <div className="pb-uploading-overlay">
                        <Loader2 size={28} className="pb-spin" />
                        <span>Uploading…</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pb-card-footer">
                {isSuccess && (
                  <span className="pb-success-msg">✓ Banner updated</span>
                )}
                <button
                  type="button"
                  className="admin-button primary"
                  disabled={isUploading || loading}
                  onClick={() => handleFileSelect(slot)}
                >
                  {settings[slot.key] ? (
                    <>
                      <Upload size={15} /> Replace image
                    </>
                  ) : (
                    <>
                      <ImagePlus size={15} /> Upload image
                    </>
                  )}
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <style jsx>{`
        /* ── Grid of 3 banner cards ── */
        .pb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 4px;
          min-width: 0;
        }

        .pb-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .pb-card-sub {
          display: block;
          font-size: 0.78rem;
          font-weight: 500;
          opacity: 0.55;
          margin-top: 2px;
        }

        /* ── Preview area ── */
        .pb-preview-wrap {
          padding: 16px;
          flex: 1;
        }

        .pb-preview {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--admin-border, #e2e8f0);
          line-height: 0;
        }

        .pb-preview :global(.pb-preview-img) {
          width: 100% !important;
          height: auto !important;
          object-fit: cover;
          display: block;
        }

        .pb-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 180px;
          color: var(--admin-text-muted, #94a3b8);
          font-size: 0.85rem;
        }

        .pb-uploading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.85);
          color: var(--admin-accent, #0257d0);
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 10px;
        }

        .pb-spin {
          animation: pb-spin 1s linear infinite;
        }
        @keyframes pb-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── Footer with button ── */
        .pb-card-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 12px 16px;
          border-top: 1px solid var(--admin-border, #e2e8f0);
          flex-wrap: wrap;
        }

        .pb-success-msg {
          font-size: 0.82rem;
          font-weight: 600;
          color: #16a34a;
        }

        /* ── Error banner ── */
        .pb-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          margin-bottom: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #991b1b;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .pb-error-banner button {
          margin-left: auto;
          background: none;
          border: none;
          color: inherit;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0 4px;
        }
      `}</style>
    </div>
  );
}
