"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

type LoginFailure = {
  status?: string;
  message?: string;
  errors?: Array<{ field?: string; message?: string }>;
};

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/public/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      
      if (!response.ok) {
        throw new Error(payload.message || "Unable to sign in.");
      }

      // Store token and user data
      if (payload.data?.token) {
        localStorage.setItem("token", payload.data.token);
      }
      if (payload.data?.user) {
        localStorage.setItem("user", JSON.stringify(payload.data.user));
      }
      
      // Dispatch event to sync Header
      window.dispatchEvent(new Event("auth-changed"));
      
      toast.success("Successfully signed in!");
      router.push("/");
    } catch (caught) {
      toast.error(
        caught instanceof Error
          ? caught.message
          : "Unable to sign in. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="app-login" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
      <style>{`
        .public-shell .app-login-field input:focus-visible {
          outline: none !important;
        }
      `}</style>
      <div className="app-login-frame" style={{ width: '100%', maxWidth: '420px', margin: '0' }}>
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

            <p className="app-login-frame-label">Student sign in</p>
            <form className="app-login-form" onSubmit={handleSubmit} noValidate>
              <div className="app-login-field">
                <label className="sr-only" htmlFor="email">Email address</label>
                <div className="app-login-control">
                  <Mail size={15} className="app-login-control-icon" aria-hidden="true" />
                  <input
                    id="email"
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
                <label className="sr-only" htmlFor="password">Password</label>
                <div className="app-login-control">
                  <Lock size={15} className="app-login-control-icon" aria-hidden="true" />
                  <input
                    id="password"
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
                disabled={submitting || !email || !password}
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

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
              <Link href="/signup" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
                Sign up
              </Link>
            </div>
      </div>
    </div>
  );
}
