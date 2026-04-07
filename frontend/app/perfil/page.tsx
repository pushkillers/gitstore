"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AtSign,
  BriefcaseBusiness,
  FolderGit2,
  FolderKanban,
  GitFork,
  Globe,
  Mail,
  MapPin,
  PencilLine,
  Star,
} from "lucide-react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { useProfile } from "@/lib/useProfile";
import { FollowButton } from "@/components/ui/FollowButton";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  imported: boolean;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
  CSS: "#563d7c", HTML: "#e34c26", Ruby: "#701516",
  "C#": "#178600", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF",
};

function ensureUrl(value: string, base?: string) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (base) return `${base}${value.replace(/^@/, "").replace(/^\//, "")}`;
  return `https://${value}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days}d atrás`;
  if (days < 30) return `${Math.floor(days / 7)}sem atrás`;
  if (days < 365) return `${Math.floor(days / 30)}m atrás`;
  return `${Math.floor(days / 365)}a atrás`;
}

const expColors: Record<string, { text: string; bg: string; border: string }> = {
  Júnior:      { text: "#3fb950", bg: "#3fb95012", border: "#3fb95030" },
  Pleno:       { text: "#58a6ff", bg: "#58a6ff12", border: "#58a6ff30" },
  Sênior:      { text: "#f0b442", bg: "#f0b44212", border: "#f0b44230" },
  Especialista:{ text: "#bc8cff", bg: "#bc8cff12", border: "#bc8cff30" },
};

export default function PerfilPage() {
  const { hydrated: authHydrated } = useRequireAuth();
  const { profile, hydrated: profileHydrated } = useProfile();
  const [importedRepos, setImportedRepos] = useState<GithubRepo[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gitstore.github.connection");
      if (raw) {
        const { repos } = JSON.parse(raw);
        setImportedRepos((repos ?? []).filter((r: GithubRepo) => r.imported));
      }
    } catch { /* ignore */ }
  }, []);

  if (!authHydrated || !profileHydrated) return null;

  const zoom = Math.min(Math.max(profile.avatarZoom || 100, 80), 200);
  const initials = profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";
  const exp = expColors[profile.experience] ?? { text: "#7d8590", bg: "#7d859012", border: "#7d859030" };

  const socialLinks = [
    { label: "Website",   value: profile.website,  href: ensureUrl(profile.website),                       icon: Globe },
    { label: "GitHub",    value: profile.github,   href: ensureUrl(profile.github, "https://github.com/"), icon: FolderGit2 },
    { label: "Twitter/X", value: profile.twitter,  href: ensureUrl(profile.twitter, "https://x.com/"),     icon: AtSign },
    { label: "LinkedIn",  value: profile.linkedin, href: ensureUrl(profile.linkedin),                      icon: BriefcaseBusiness },
  ].filter((l) => l.href && l.value);

  const totalStars = importedRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = importedRepos.reduce((s, r) => s + r.forks_count, 0);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Cover strip */}
      <div className="relative h-32 overflow-hidden bg-[#161b22]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,111,235,0.15),rgba(63,185,80,0.08),rgba(163,113,247,0.1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(48,54,61,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(48,54,61,0.2)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-12 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar */}
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-[#0d1117] bg-[#238636] shadow-xl">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  style={{ transform: `scale(${zoom / 100})` }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#161b22] px-3.5 py-2 text-sm font-medium text-[#c9d1d9] transition-all duration-150 hover:border-[#484f58] hover:text-[#e6edf3]"
            >
              <PencilLine className="h-3.5 w-3.5" />
              Editar perfil
            </Link>
            <Link
              href="/seus-projetos"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#30363d] bg-[#161b22] px-3.5 py-2 text-sm font-medium text-[#c9d1d9] transition-all duration-150 hover:border-[#484f58] hover:text-[#e6edf3]"
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Projetos
            </Link>
            <FollowButton username={profile.username} />
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#e6edf3]">{profile.name || "Sem nome"}</h1>
            {profile.experience && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ color: exp.text, backgroundColor: exp.bg, border: `1px solid ${exp.border}` }}
              >
                {profile.experience}
              </span>
            )}
          </div>
          {profile.username && (
            <p className="mt-0.5 text-sm text-[#7d8590]">@{profile.username}</p>
          )}
          {profile.bio && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8b949e]">{profile.bio}</p>
          )}

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#8b949e]">
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#484f58]" />{profile.location}
              </span>
            )}
            {profile.company && (
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-[#484f58]" />{profile.company}
              </span>
            )}
            {profile.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#484f58]" />{profile.email}
              </span>
            )}
            {profile.availability && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3fb950]/20 bg-[#3fb950]/8 px-2.5 py-0.5 text-[#3fb950]">
                ● {profile.availability}
              </span>
            )}
          </div>

          {/* Social links inline */}
          {socialLinks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.value}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="mb-8 flex gap-6 border-b border-[#21262d] pb-6 text-sm">
          {[
            { label: "Repositórios", value: importedRepos.length },
            { label: "Stars totais", value: totalStars },
            { label: "Forks totais", value: totalForks },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className="font-bold text-[#e6edf3]">{s.value}</span>
              <span className="text-[#7d8590]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          {/* Repos */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#e6edf3]">Repositórios importados</h2>
              <Link
                href="/seus-projetos/github"
                className="inline-flex items-center gap-1 text-xs text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
              >
                Gerenciar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {importedRepos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#30363d] py-14 text-center">
                <FolderGit2 className="mx-auto mb-3 h-10 w-10 text-[#30363d]" />
                <p className="text-sm font-medium text-[#8b949e]">Nenhum repositório importado</p>
                <p className="mt-1 text-xs text-[#484f58]">Conecte seu GitHub e importe seus repos</p>
                <Link
                  href="/seus-projetos/github"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2ea043]"
                >
                  <FolderGit2 className="h-4 w-4" />
                  Importar do GitHub
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {importedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* About */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Sobre</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <BriefcaseBusiness className="h-4 w-4 flex-shrink-0 text-[#484f58]" />
                  <span>Nível <span className="font-medium text-[#e6edf3]">{profile.experience}</span></span>
                </div>
                {profile.github && (
                  <div className="flex items-center gap-2 text-[#8b949e]">
                    <FolderGit2 className="h-4 w-4 flex-shrink-0 text-[#484f58]" />
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                    >
                      {profile.github}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Links</p>
                <div className="space-y-1">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[#0d1117]"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-[#484f58] transition-colors group-hover:text-[#58a6ff]" />
                        <span className="truncate text-[#8b949e] transition-colors group-hover:text-[#e6edf3]">{item.value}</span>
                        <ArrowUpRight className="ml-auto h-3 w-3 flex-shrink-0 text-[#484f58] opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  const langColor = LANG_COLORS[repo.language ?? ""] ?? "#8b949e";
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col gap-2.5 rounded-xl border border-[#21262d] bg-[#161b22] p-4 transition-all duration-200 hover:border-[#30363d] hover:bg-[#161b22]"
    >
      <div className="flex items-center gap-2">
        <FolderGit2 className="h-4 w-4 flex-shrink-0 text-[#484f58]" />
        <span className="text-sm font-semibold text-[#58a6ff] transition-colors group-hover:text-[#79c0ff]">
          {repo.name}
        </span>
        <ArrowUpRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[#484f58] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {repo.description && (
        <p className="line-clamp-2 text-xs leading-5 text-[#7d8590]">{repo.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#484f58]">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3" />{repo.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3 w-3" />{repo.forks_count}
        </span>
        <span>{timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  );
}
