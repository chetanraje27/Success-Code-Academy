"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Globe2, LayoutGrid, Lock, LogIn, Mail, MessageSquareText } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

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

  if (isCheckingSession) {
    return (
      <div className="app-login-loading" role="status" aria-live="polite">
        <span className="app-login-spinner" aria-hidden="true" />
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
          </div>
        </div>
      </div>
    </main>
  );
}