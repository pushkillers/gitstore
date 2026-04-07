"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Auth3DScene } from "@/components/auth/Auth3DScene";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117]">
      {/* Left side - Brand/Visual */}
      <div className="relative hidden h-full w-[45%] flex-col justify-center items-center overflow-hidden border-r border-[#21262d] bg-[#161b22] xl:flex">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-[#1f6feb]/10 via-transparent to-[#3fb950]/8" />
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#1f6feb]/20 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#a371f7]/15 blur-[100px]" />
        </div>

        {/* 3D Animated Scene */}
        <Auth3DScene />

        {/* Top logo */}
        <div className="absolute top-0 left-0 z-10 flex items-center gap-2 p-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117]">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#e6edf3]">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-[#e6edf3]">GitStore</span>
        </div>

        {/* Center content - Simplified */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-xl font-bold text-[#e6edf3]">
            Onde o código
            <span className="block bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
              ganha vida
            </span>
          </h1>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex h-full w-full flex-col xl:w-[55%] overflow-hidden">
        {/* Mobile header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#21262d] bg-[#161b22] p-3 xl:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-[#30363d] bg-[#0d1117]">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-[#e6edf3]">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-[#e6edf3]">GitStore</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
