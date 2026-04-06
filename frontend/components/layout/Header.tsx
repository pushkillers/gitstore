"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/useSession";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { CreateMenuDropdown } from "./CreateMenuDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenuDropdown } from "./UserMenuDropdown";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const navItems = [
  { href: ROUTES.PROJECTS, label: "Projetos" },
  { href: ROUTES.TEAMS, label: "Equipes" },
  { href: ROUTES.DEVELOPERS, label: "Desenvolvedores" },
  { href: "/cursos", label: "Cursos" },
  { href: ROUTES.JOBS, label: "Trabalhos" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, hydrated } = useSession();
  const isLoggedIn = hydrated && !!user;

  const isActiveRoute = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d]/80 bg-[#0d1117]/92 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-20 items-center gap-4">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3 rounded-xl px-2 py-2 text-xl font-bold text-white transition-colors hover:text-[#58a6ff]"
          >
            <GitHubIcon className="h-7 w-7" />
            <div className="leading-none">
              <span>GitStore</span>
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.24em] text-[#7d8590]">Marketplace dev</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#161b22] text-[#e6edf3] shadow-[inset_0_0_0_1px_rgba(88,166,255,0.2)]"
                      : "text-[#7d8590] hover:bg-[#161b22] hover:text-[#e6edf3]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <div className="hidden items-center gap-3 lg:flex">
            {isLoggedIn ? (
              <>
                <NotificationsDropdown />
                <CreateMenuDropdown />
                <UserMenuDropdown />
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm font-medium text-[#e6edf3] transition-all hover:border-[#58a6ff]/40 hover:bg-[#21262d]"
              >
                Entrar
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-[#e6edf3] transition-colors hover:border-[#484f58] lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[#21262d] py-4 lg:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#161b22] text-[#e6edf3] shadow-[inset_0_0_0_1px_rgba(88,166,255,0.2)]"
                        : "text-[#7d8590] hover:bg-[#161b22] hover:text-[#e6edf3]"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <NotificationsDropdown />
                  <UserMenuDropdown />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
                >
                  Entrar
                </Link>
              )}
              {isLoggedIn && <CreateMenuDropdown />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
