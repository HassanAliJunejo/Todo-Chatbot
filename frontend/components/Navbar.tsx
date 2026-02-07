"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar({ user }: { user?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.assign("/login");
  }

  return (
    <header className={`bg-glass-light backdrop-blur-sm border-b border-white/10 transition-all duration-300 ${isScrolled ? "shadow-lg" : "shadow-none"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="font-bold text-white text-xl flex items-center gap-2">
          <svg className="w-8 h-8 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Todo App
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/tasks" 
            className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-glass backdrop-blur-sm"
          >
            Tasks
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white/80 text-sm">
                {user.displayName || user.email}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-white hover:text-accent-primary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-glass backdrop-blur-sm">
          <nav className="px-4 py-4 space-y-3">
            <Link 
              href="/tasks" 
              className="block text-white/80 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-glass backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Tasks
            </Link>
            
            {user ? (
              <div className="space-y-3">
                <div className="text-sm text-white/60">
                  {user.displayName || user.email}
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="block w-full text-left bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-3 rounded-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-4 py-3 rounded-lg hover:scale-105 transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
