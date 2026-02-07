"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { useToast } from "@/components/ToastHost";

import { ParamsClient } from "./paramsClient";

type LoginResponse = {
  accessToken: string;
  expiresAt?: string;
  user: { id: string; email: string; displayName?: string };
};

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] -z-10"></div>
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-[20%] right-[5%] w-80 h-80 bg-accent-secondary/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-accent-tertiary/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent, next: string | null) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }

      // Process the response to ensure the cookie is set
      const data = await response.json();

      // Store token and user ID in localStorage for client-side use
      if (data.accessToken) {
        localStorage.setItem('access_token', data.accessToken);
      }
      if (data.user?.id) {
        localStorage.setItem('user_id', data.user.id.toString());
      }

      toast.success("Logged in.");
      router.replace(next ?? "/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ParamsClient>
      {(next) => (
        <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 w-full interactive-elevated">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/60">Sign in to your account</p>
            </div>

            <form onSubmit={(e) => onSubmit(e, next)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl glass-input px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl glass-input px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {error ? (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                  <p className="text-sm text-red-200 font-medium">Error: {error}</p>
                </div>
              ) : null}
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <Link className="text-accent-primary font-medium hover:text-accent-secondary transition-colors" href="/register">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </ParamsClient>
  );
}
