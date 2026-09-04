"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { AdminNotice } from "@/components/admin/AdminUi";
import { useToast } from "@/components/admin/Toast";

type TokenState = "checking" | "valid" | "invalid" | "missing";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [token, setToken] = useState("");
  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fromUrl =
      new URLSearchParams(window.location.search).get("token") || "";
    setToken(fromUrl);

    if (!fromUrl) {
      setTokenState("missing");
      return;
    }

    let active = true;
    fetch(
      `/api/public/auth/admin/reset-password?token=${encodeURIComponent(fromUrl)}`,
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
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Both passwords must match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/public/auth/admin/reset-password", {
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
    <main className="app-login">
      <div className="app-login-layout">
        <aside className="app-login-aside" aria-label="Security overview">
          <div className="app-login-aside-copy">
            <h1>Admin security</h1>
            <p>Set a new password for your administrator account.</p>
          </div>

          <ul className="app-login-aside-list">
            <li>
              <span className="app-login-aside-icon" aria-hidden="true">
                <ShieldCheck size={16} />
              </span>
              <div>
                <strong>Single-use link</strong>
                <small>Becomes invalid immediately once redeemed</small>
              </div>
            </li>
            <li>
              <span className="app-login-aside-icon" aria-hidden="true">
                <Timer size={16} />
              </span>
              <div>
                <strong>Time limited</strong>
                <small>Expires automatically after 60 minutes</small>
              </div>
            </li>
            <li>
              <span className="app-login-aside-icon" aria-hidden="true">
                <Lock size={16} />
              </span>
              <div>
                <strong>Cryptographically secure</strong>
                <small>Stored only as a SHA-256 hash</small>
              </div>
            </li>
          </ul>
        </aside>

        <div className="app-login-stage">
          <div className="app-login-frame">
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
                <div className="app-login-success-box">
                  <div className="app-login-success-header">
                    <CheckCircle2 size={16} className="app-login-success-icon" />
                    <span>Password changed</span>
                  </div>
                  <p>
                    Your administrator password has been updated successfully. You
                    can now sign in with your new password.
                  </p>
                </div>
                <button
                  type="button"
                  className="app-login-submit"
                  onClick={() => router.replace("/admin/login")}
                >
                  <LogIn size={15} />
                  Go to sign in
                </button>
              </>
            ) : tokenState === "checking" ? (
              <>
                <p className="app-login-frame-label">Verifying reset link</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px 0",
                    gap: "12px",
                    color: "var(--login-muted)",
                    fontSize: "0.82rem",
                  }}
                >
                  <span className="app-login-spinner" aria-hidden="true" />
                  <span>Checking link validity…</span>
                </div>
              </>
            ) : tokenState === "valid" ? (
              <>
                <p className="app-login-frame-label">Set a new password</p>
                <p className="app-login-frame-desc">
                  Choose a secure password of at least 6 characters.
                </p>

                {error && <AdminNotice>{error}</AdminNotice>}

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
                        minLength={6}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="New password (min 6 characters)"
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
                      Confirm new password
                    </label>
                    <div className="app-login-control">
                      <Lock
                        size={15}
                        className="app-login-control-icon"
                        aria-hidden="true"
                      />
                      <input
                        id="confirm-password"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={6}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Confirm new password"
                        required
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        className="app-login-password-toggle"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    className="app-login-submit"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="app-login-spinner" aria-hidden="true" />
                        Updating password…
                      </>
                    ) : (
                      <>
                        <KeyRound size={15} />
                        Update password
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="app-login-frame-label">
                  {tokenState === "missing"
                    ? "Reset link required"
                    : "Link invalid or expired"}
                </p>
                <p className="app-login-frame-desc">
                  {tokenState === "missing"
                    ? "This page requires a valid reset link from your email inbox."
                    : error ||
                      "This password reset link is invalid or has expired. Please request a new one."}
                </p>

                <button
                  type="button"
                  className="app-login-submit"
                  onClick={() => router.replace("/admin/login")}
                >
                  <ArrowLeft size={15} />
                  Back to sign in
                </button>
              </>
            )}

            <Link href="/" className="app-login-back">
              Return to the website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
