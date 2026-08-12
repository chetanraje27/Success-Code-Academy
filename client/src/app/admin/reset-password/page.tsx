"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { AdminNotice } from "@/components/admin/AdminUi";

type TokenState = "checking" | "valid" | "invalid" | "missing";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /*
   * The token is read from window.location rather than useSearchParams so the
   * page needs no Suspense boundary: it is a fully client-rendered form and
   * there is nothing to prerender around the query string.
   */
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("token") || "";
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
      setDone(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update your password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand" aria-label="Admin portal overview">
        <div className="admin-login-brand-content">
          <div className="admin-login-brand-mark">
            <Image
              src="/images/ui/logo2.png"
              alt="Success Code Academy"
              width={200}
              height={60}
              style={{ width: "auto", height: "100%", objectFit: "contain" }}
            />
          </div>
          <h1>Choose a new admin password.</h1>
          <p>
            This link was issued for a single password change and expires on its
            own. Pick something you have not used elsewhere.
          </p>
          <div className="admin-login-benefits">
            <span>
              <CheckCircle2 size={17} /> Works only once
            </span>
            <span>
              <CheckCircle2 size={17} /> Expires automatically
            </span>
            <span>
              <CheckCircle2 size={17} /> Stored only as a secure hash
            </span>
          </div>
        </div>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-card">
          <span>Staff access</span>
          <h2>Set a new password</h2>

          {done ? (
            <>
              <p>
                Your password has been updated. Sign in with your email address
                and the new password.
              </p>
              <AdminNotice tone="success">
                Password changed successfully.
              </AdminNotice>
              <button
                className="admin-button"
                type="button"
                onClick={() => router.replace("/admin/login")}
              >
                <KeyRound size={18} />
                Go to sign in
              </button>
            </>
          ) : tokenState === "checking" ? (
            <div className="admin-loading" role="status" aria-live="polite">
              <span className="admin-spinner" aria-hidden="true" />
              Checking your reset link
            </div>
          ) : tokenState === "valid" ? (
            <>
              <p>
                Choose a password of at least 6 characters for your admin
                account.
              </p>

              {error && <AdminNotice>{error}</AdminNotice>}

              <form className="admin-login-form" onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label htmlFor="admin-new-password">New password</label>
                  <input
                    id="admin-new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="admin-confirm-password">
                    Confirm new password
                  </label>
                  <input
                    id="admin-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat the password"
                    required
                  />
                </div>
                <button
                  className="admin-button"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="admin-spinner" aria-hidden="true" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <KeyRound size={18} />
                      Update password
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <p>
                {tokenState === "missing"
                  ? "This page needs the reset link that was sent to you."
                  : "This reset link cannot be used."}
              </p>
              <AdminNotice>
                {error ||
                  "Open the most recent reset link, or ask an administrator to send a new one."}
              </AdminNotice>
              <Link className="admin-button" href="/admin/login">
                Back to sign in
              </Link>
            </>
          )}

          <div className="admin-login-help">
            <LockKeyhole size={15} aria-hidden="true" /> Reset links expire on
            their own and can only be used once.{" "}
            <Link href="/">Return to the website</Link>.
          </div>
        </div>
      </section>
    </main>
  );
}
