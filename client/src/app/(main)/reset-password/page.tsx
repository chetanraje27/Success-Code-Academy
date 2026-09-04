"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  LogIn,
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";

type TokenState = "checking" | "valid" | "invalid" | "missing";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  const [token, setToken] = useState("");
  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fromUrl = searchParams.get("token") || "";
    setToken(fromUrl);

    if (!fromUrl) {
      setTokenState("missing");
      return;
    }

    let active = true;
    fetch(
      `/api/public/auth/reset-password?token=${encodeURIComponent(fromUrl)}`,
      { cache: "no-store" },
    )
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        if (!active) return;
        if (response.ok) {
          setTokenState("valid");
          return;
        }
        setTokenState("invalid");
        setError(payload.message || "This reset link is no longer valid.");
      })
      .catch(() => {
        if (!active) return;
        setTokenState("invalid");
        setError("Unable to check this reset link. Please try again.");
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Both passwords must match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/public/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload.message || "Unable to update your password.");
      }
      toast.success("Password updated successfully! Please sign in.");
      setDone(true);
    } catch (caught) {
      const msg =
        caught instanceof Error
          ? caught.message
          : "Unable to update your password. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-login-frame" style={{ width: '100%', maxWidth: '420px', margin: 'auto' }}>
      <div className="app-login-logo">
        <Image
          src="/images/ui/logo2.png"
          alt="Success Code Academy"
          width={212}
          height={68}
          priority
          style={{ width: "auto", height: 42, objectFit: "contain" }}
        />
      </div>

      {done ? (
        <>
          <p className="app-login-frame-label">Password updated</p>
          <div className="app-login-success-box" style={{ background: 'var(--brand-primary-light)', color: 'var(--brand-primary-dark)', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            <div className="app-login-success-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px' }}>
              <CheckCircle2 size={16} className="app-login-success-icon" />
              <span>Password changed</span>
            </div>
            <p style={{ margin: 0 }}>
              Your password has been updated successfully. You
              can now sign in with your new password.
            </p>
          </div>
          <button
            type="button"
            className="app-login-submit"
            onClick={() => router.replace("/login")}
          >
            <LogIn size={15} />
            Go to sign in
          </button>
        </>
      ) : tokenState === "missing" || tokenState === "invalid" ? (
        <>
          <p className="app-login-frame-label">Invalid reset link</p>
          <div style={{
            background: 'var(--error-light, #fee2e2)',
            color: 'var(--error-dark, #991b1b)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}>
            {error || "This password reset link is invalid or has expired."}
          </div>
          <button
            type="button"
            className="app-login-submit"
            onClick={() => router.replace("/login")}
          >
            Back to sign in
          </button>
        </>
      ) : (
        <>
          <p className="app-login-frame-label">Set a new password</p>
          <p className="app-login-frame-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
            Choose a secure password of at least 8 characters.
          </p>

          {error && (
            <div style={{
              background: 'var(--error-light, #fee2e2)',
              color: 'var(--error-dark, #991b1b)',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '0.85rem'
            }}>
              {error}
            </div>
          )}

          <form className="app-login-form" onSubmit={handleSubmit} noValidate>
            <div className="app-login-field">
              <label className="sr-only" htmlFor="new-password">
                New password
              </label>
              <div className="app-login-control">
                <Lock
                  size={15}
                  className="app-login-control-icon"
                  aria-hidden="true"
                />
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="New password (min 8 characters)"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="app-login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="app-login-field">
              <label className="sr-only" htmlFor="confirm-password">
                Confirm password
              </label>
              <div className="app-login-control">
                <Lock
                  size={15}
                  className="app-login-control-icon"
                  aria-hidden="true"
                />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              className="app-login-submit"
              type="submit"
              disabled={submitting || !password || !confirmPassword}
            >
              {submitting ? (
                <>
                  <span className="app-login-spinner" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  Save password
                  <CheckCircle2 size={15} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function StudentResetPasswordPage() {
  return (
    <div className="app-login" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', paddingTop: '120px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <style>{`
        .public-shell .app-login-field input:focus-visible {
          outline: none !important;
        }
      `}</style>
      <Suspense fallback={<div className="app-login-spinner" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
