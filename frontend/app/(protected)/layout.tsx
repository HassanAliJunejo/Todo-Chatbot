"use client";

import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import ClientWrapper from "@/components/ClientWrapper";
import { User } from "@/types/user";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Mock user session for now - initialized synchronously
  const [user] = useState<User | null>({
    id: "1",
    email: "user@example.com",
    displayName: "User"
  });

  return (
    <div className="min-h-screen relative">
      {/* Animated vibrant background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] -z-10"></div>
      
      {/* Animated floating orbs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Primary accent orb - Sky blue */}
        <div className="absolute top-[-10%] left-[10%] w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl animate-float"></div>
        
        {/* Secondary orb - Cyan */}
        <div className="absolute top-[20%] right-[5%] w-80 h-80 bg-accent-secondary/20 rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Tertiary orb - Indigo */}
        <div className="absolute bottom-[10%] left-[20%] w-72 h-72 bg-accent-tertiary/15 rounded-full blur-3xl animate-float"></div>
        
        {/* Gradient mesh effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Additional accent spots */}
        <div className="absolute top-[30%] left-[60%] w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-[20%] right-[20%] w-56 h-56 bg-accent-tertiary/10 rounded-full blur-3xl animate-float"></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-secondary/5"></div>
      </div>
      
      <Navbar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6 relative z-0">
        {children}
      </main>
      <ClientWrapper />
    </div>
  );
}
