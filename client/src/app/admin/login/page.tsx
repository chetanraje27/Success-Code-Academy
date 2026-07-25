"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" }).then((response) => {
      if (response.ok) router.replace("/admin");
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "Unable to sign in.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to sign in. Please try again.",
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
              alt=""
              width={54}
              height={54}
            />
          </div>
          <h1>Keep the website current, without touching code.</h1>
          <p>
            Update the academy&apos;s key content, review enquiries, and keep
            contact information accurate from one focused workspace.
          </p>
          <div className="admin-login-benefits">
            <span>
              <CheckCircle2 size={17} /> Clear, guided editing forms
            </span>
            <span>
              <CheckCircle2 size={17} /> Secure role-checked access
            </span>
            <span>
              <CheckCircle2 size={17} /> Mobile-friendly administration
            </span>
          </div>
        </div>
      </section>

      <section className="admin-login-panel">
        <div className="admin-login-card">
          <span>Staff access</span>
          <h2>Sign in to the admin portal</h2>
          <p>
            Use the admin email and password provided by the website owner.
          </p>

          {error && (
            <div className="admin-notice" role="alert">
              {error}
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="admin-email">Admin email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="admin-button" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="admin-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign in securely
                </>
              )}
            </button>
          </form>

          <div className="admin-login-help">
            <LockKeyhole size={15} aria-hidden="true" /> Your session is stored
            in a protected browser cookie and expires automatically.{" "}
            <Link href="/">Return to the website</Link>.
          </div>
        </div>
      </section>
    </main>
  );
}
