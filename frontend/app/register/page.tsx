"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ToastHost";

type RegisterResponse = {
  accessToken?: string;
  expiresAt?: string;
  user?: { id: string; email: string; displayName?: string };
};

export default function RegisterPage() {
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

      <div className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 w-full interactive-elevated">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/60">Start tracking your tasks today</p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, full_name: displayName.trim() || email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        // Provide more specific error message for duplicate email
        const errorMessage = errorData.detail || errorData.message || "Registration failed";
        throw new Error(errorMessage);
      }

      const data = await response.json(); // Process the response which should set the cookie

      // If backend returns token, the /api/auth/register route handler will set cookies.
      if (data.accessToken) {
        toast.success("Account created.");
        router.replace("/dashboard");
      } else {
        toast.success("Account created. Please sign in.");
        router.replace("/login");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-white/90 mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full h-12 rounded-xl glass-input px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 transition-all"
          placeholder="Enter your name"
          autoComplete="nickname"
        />
      </div>

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
          placeholder="Create a password"
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
      >
        {submitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating...
          </div>
        ) : (
          "Create Account"
        )}
      </button>

      {error ? (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-red-200 font-medium">Error: {error}</p>
        </div>
      ) : null}

      <p className="mt-6 text-center text-white/60 text-sm">
        Already have an account?{" "}
        <Link className="text-accent-primary font-medium hover:text-accent-secondary transition-colors" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
