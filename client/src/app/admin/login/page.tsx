"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Globe2,
  LayoutGrid,
  Lock,
  LogIn,
  Mail,
  MessageSquareText,
  RefreshCw,
  Send,
} from "lucide-react";
import { isAdminRole } from "@/lib/roles";
import { useToast } from "@/components/admin/Toast";

type LoginFailure = {
  status?: string;
  message?: string;
  errors?: Array<{ field?: string; message?: string }>;
};

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: { user?: { role?: string } } } | null) => {
        if (isAdminRole(payload?.data?.user?.role)) {
          window.location.replace("/admin");
        } else {
          setIsCheckingSession(false);
        }
      })
      .catch(() => {
        setIsCheckingSession(false);
      });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as LoginFailure;
      if (!response.ok) {
        // Surface the real per-field issue ("Enter a valid email address",
        // "Password is required") instead of the generic "Validation failed".
        const firstIssue = payload.errors?.[0]?.message;
        throw new Error(firstIssue || payload.message || "Unable to sign in.");
      }
      window.location.replace("/admin");
      // Do NOT setSubmitting(false) here. Keep it loading while the browser navigates.
    } catch (caught) {
      toast.error(
        caught instanceof Error
          ? caught.message
          : "Unable to sign in. Please try again.",
      );
      setSubmitting(false); // Only clear on error
    }
  }

  async function handleForgotSubmit(event?: React.FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    if (cooldown > 0 || forgotSubmitting) return;

    const targetEmail = forgotEmail.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      toast.error("Please enter a valid administrator email address.");
      return;
    }

    setForgotSubmitting(true);
    try {
      const response = await fetch("/api/public/auth/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        status?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || "Unable to send reset link.");
      }

      setForgotSuccess(true);
      setCooldown(60);
      toast.success(`Password reset link sent to ${targetEmail}.`);
    } catch (caught) {
      const errMsg =
        caught instanceof Error ? caught.message : "Unable to send reset link.";
      toast.error(errMsg);
    } finally {
      setForgotSubmitting(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="admin-auth-loading" role="status" aria-live="polite">
        <span className="admin-auth-spinner" aria-hidden="true" />
      </div>
    );
  }

  return (
    <main className="app-login">
      <div className="app-login-layout">
        <aside className="app-login-aside" aria-label="What you can manage">

          <div className="app-login-aside-copy">
            <h1>Admin console</h1>
            <p>Keep the academy&apos;s website current from one focused workspace.</p>
          </div>

          <ul className="app-login-aside-list">
            <li>
              <span className="app-login-aside-icon" aria-hidden="true"><Globe2 size={16} /></span>
              <div>
                <strong>Edit the website</strong>
                <small>Pages, banners and live content</small>
              </div>
            </li>
            <li>
              <span className="app-login-aside-icon" aria-hidden="true"><LayoutGrid size={16} /></span>
              <div>
                <strong>Manage content</strong>
                <small>Courses, results, news and media</small>
              </div>
            </li>
            <li>
              <span className="app-login-aside-icon" aria-hidden="true"><MessageSquareText size={16} /></span>
              <div>
                <strong>Review enquiries</strong>
                <small>Student accounts and contact records</small>
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

            {mode === "login" ? (
              <>
                <p className="app-login-frame-label">Admin sign in</p>
                <form className="app-login-form" onSubmit={handleSubmit} noValidate>
                  <div className="app-login-field">
                    <label className="sr-only" htmlFor="admin-email">Email address</label>
                    <div className="app-login-control">
                      <Mail size={15} className="app-login-control-icon" aria-hidden="true" />
                      <input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="app-login-field">
                    <label className="sr-only" htmlFor="admin-password">Password</label>
                    <div className="app-login-control">
                      <Lock size={15} className="app-login-control-icon" aria-hidden="true" />
                      <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        className="app-login-password-toggle"
                        onClick={() => setShowPassword((open) => !open)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="app-login-forgot-row">
                    <button
                      type="button"
                      className="app-login-forgot-link"
                      onClick={() => {
                        setMode("forgot");
                        setForgotEmail(email);
                        setForgotSuccess(false);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    className="app-login-submit"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="app-login-spinner" aria-hidden="true" />
                        Signing in
                      </>
                    ) : (
                      <>
                        Sign in
                        <LogIn size={15} />
                      </>
                    )}
                  </button>
                </form>

                <Link href="/" className="app-login-back">
                  Return to the website
                </Link>
              </>
            ) : (
              <>
                <p className="app-login-frame-label">Reset your password</p>
                <p className="app-login-frame-desc">
                  Enter your administrator email address. We&apos;ll send you a secure link to choose a new password.
                </p>

                <form className="app-login-form" onSubmit={handleForgotSubmit} noValidate>
                  <div className="app-login-field">
                    <label className="sr-only" htmlFor="forgot-email">Email address</label>
                    <div className="app-login-control">
                      <Mail size={15} className="app-login-control-icon" aria-hidden="true" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        value={forgotEmail}
                        onChange={(event) => setForgotEmail(event.target.value)}
                        placeholder="Administrator email address"
                        required
                        disabled={forgotSubmitting || forgotSuccess}
                      />
                    </div>
                  </div>

                  {forgotSuccess && (
                    <div className="app-login-success-box">
                      <div className="app-login-success-header">
                        <CheckCircle2 size={16} className="app-login-success-icon" />
                        <span>Link sent</span>
                      </div>
                      <p>
                        A password reset link was sent to <strong>{forgotEmail}</strong>. It expires automatically in 60 minutes.
                      </p>
                    </div>
                  )}

                  {forgotSuccess ? (
                    <button
                      type="button"
                      className="app-login-submit secondary"
                      onClick={() => handleForgotSubmit()}
                      disabled={forgotSubmitting || cooldown > 0}
                    >
                      {forgotSubmitting ? (
                        <>
                          <span className="app-login-spinner" aria-hidden="true" />
                          Sending link...
                        </>
                      ) : cooldown > 0 ? (
                        <>
                          <Clock size={14} aria-hidden="true" />
                          Resend link in {cooldown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} aria-hidden="true" />
                          Resend reset link
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      className="app-login-submit"
                      type="submit"
                      disabled={forgotSubmitting || cooldown > 0}
                    >
                      {forgotSubmitting ? (
                        <>
                          <span className="app-login-spinner" aria-hidden="true" />
                          Sending link...
                        </>
                      ) : (
                        <>
                          Send reset link
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  )}
                </form>

                <button
                  type="button"
                  className="app-login-back-btn"
                  onClick={() => {
                    setMode("login");
                    setForgotSuccess(false);
                  }}
                >
                  <ArrowLeft size={14} />
                  Back to sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}