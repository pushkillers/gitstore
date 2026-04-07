"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "@/lib/useSession";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { CreateMenuDropdown } from "./CreateMenuDropdown";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenuDropdown } from "./UserMenuDropdown";

const navItems = [
  { href: ROUTES.PROJECTS,   label: "Projetos",        icon: "⬡" },
  { href: ROUTES.TEAMS,      label: "Equipes",          icon: "◈" },
  { href: ROUTES.DEVELOPERS, label: "Desenvolvedores",  icon: "◉" },
  { href: "/cursos",         label: "Cursos",           icon: "◎" },
  { href: ROUTES.JOBS,       label: "Trabalhos",        icon: "◆" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, hydrated } = useSession();
  const isLoggedIn = hydrated && !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[#21262d] bg-[#0d1117]/98 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
          : "border-b border-transparent bg-[#0d1117]/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-4">

          {/* Logo */}
          <Link href={ROUTES.HOME} className="group flex items-center gap-2.5 flex-shrink-0">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#161b22] border border-[#30363d] transition-all duration-200 group-hover:border-[#388bfd]/50 group-hover:bg-[#1c2128]">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-[#e6edf3] transition-colors group-hover:fill-[#58a6ff]" style={{width:18,height:18}}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold tracking-tight text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">GitStore</span>
              <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#484f58]">Marketplace</div>
            </div>
          </Link>

          <div className="hidden h-4 w-px bg-[#30363d] lg:block" />

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                    active
                      ? "text-[#e6edf3] bg-[#161b22]"
                      : "text-[#7d8590] hover:text-[#c9d1d9] hover:bg-[#161b22]/50"
                  )}
                >
                  {active && (
                    <span className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-[#388bfd] to-transparent" />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {isLoggedIn ? (
              <>
                <NotificationsDropdown />
                <CreateMenuDropdown />
                <div className="ml-1">
                  <UserMenuDropdown />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-[#7d8590] transition-colors hover:text-[#e6edf3]"
                >
                  Entrar
                </Link>
                <Link
                  href="/login"
                  className="rounded-md bg-[#238636] px-3.5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] active:scale-[0.97]"
                >
                  Começar grátis
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#30363d] text-[#7d8590] transition-colors hover:text-[#e6edf3] lg:hidden"
            aria-label="Menu"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-[#21262d] pb-4 pt-3 lg:hidden">
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-[#161b22] text-[#e6edf3]"
                      : "text-[#7d8590] hover:bg-[#161b22]/50 hover:text-[#c9d1d9]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex items-center gap-2 border-t border-[#21262d] pt-4">
              {isLoggedIn ? (
                <>
                  <NotificationsDropdown />
                  <UserMenuDropdown />
                  <div className="ml-auto"><CreateMenuDropdown /></div>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-md bg-[#238636] py-2 text-center text-sm font-semibold text-white"
                >
                  Começar grátis
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
