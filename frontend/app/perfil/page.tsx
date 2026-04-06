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
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} sem. atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
}

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

  const socialLinks = [
    { label: "Website",   value: profile.website,  href: ensureUrl(profile.website),                       icon: Globe },
    { label: "GitHub",    value: profile.github,   href: ensureUrl(profile.github, "https://github.com/"), icon: FolderGit2 },
    { label: "Twitter/X", value: profile.twitter,  href: ensureUrl(profile.twitter, "https://x.com/"),     icon: AtSign },
    { label: "LinkedIn",  value: profile.linkedin, href: ensureUrl(profile.linkedin),                      icon: BriefcaseBusiness },
  ].filter((l) => l.href && l.value);

  const totalStars = importedRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = importedRepos.reduce((s, r) => s + r.forks_count, 0);

  const expColors: Record<string, string> = {
    Júnior: "#3fb950", Pleno: "#58a6ff", Sênior: "#f0b442", Especialista: "#bc8cff",
  };
  const expColor = expColors[profile.experience] ?? "#7d8590";

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#30363d] bg-[#161b22] p-6 md:p-8">
          <div className="pointer-events-none absolute -left-20 -top-10 h-64 w-64 rounded-full bg-[#58a6ff]/8 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-[#3fb950]/8 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

              {/* Avatar — usa foto do settings (que vem da sessão ou upload) */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-white/10 bg-[#238636]">
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

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-[#e6edf3]">{profile.name || "Sem nome"}</h1>
                  {profile.experience && (
                    <span className="rounded-full border px-3 py-1 text-xs font-semibold"
                      style={{ borderColor: `${expColor}40`, color: expColor, backgroundColor: `${expColor}12` }}>
                      {profile.experience}
                    </span>
                  )}
                  {profile.availability && (
                    <span className="rounded-full border border-[#3fb950]/25 bg-[#3fb950]/10 px-3 py-1 text-xs font-medium text-[#3fb950]">
                      {profile.availability}
                    </span>
                  )}
                </div>

                {profile.username && (
                  <p className="mt-1 text-sm text-[#7d8590]">@{profile.username}</p>
                )}
                {profile.bio && (
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#a9b4bf]">{profile.bio}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {profile.location && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[#c3cfdb]">
                      <MapPin className="h-3.5 w-3.5 text-[#58a6ff]" />{profile.location}
                    </span>
                  )}
                  {profile.company && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[#c3cfdb]">
                      <BriefcaseBusiness className="h-3.5 w-3.5 text-[#3fb950]" />{profile.company}
                    </span>
                  )}
                  {profile.email && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[#c3cfdb]">
                      <Mail className="h-3.5 w-3.5 text-[#f0b442]" />{profile.email}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/settings"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#58a6ff]/20 bg-[linear-gradient(135deg,#1f6feb,#3279db)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#58a6ff]/15 transition-all hover:brightness-110">
                    <PencilLine className="h-4 w-4" />Editar perfil
                  </Link>
                  <Link href="/seus-projetos"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-[#dce7f3] transition-all hover:border-[#58a6ff]/30 hover:bg-[#151f2b]">
                    <FolderKanban className="h-4 w-4" />Seus projetos
                  </Link>
                  {/* Follow — só aparece em perfis de outros usuários */}
                  <FollowButton username={profile.username} />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:min-w-[160px]">
              {[
                { label: "Repos", value: importedRepos.length },
                { label: "Stars", value: totalStars },
                { label: "Forks", value: totalForks },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center md:text-left">
                  <p className="text-xs uppercase tracking-widest text-[#7d8590]">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Repos */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#e6edf3]">Repositórios importados</h2>
              <Link href="/seus-projetos/github"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#58a6ff] transition-colors hover:text-white">
                Gerenciar<ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {importedRepos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#30363d] bg-[#161b22] py-16 text-center">
                <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                <p className="font-medium text-[#e6edf3]">Nenhum repositório importado</p>
                <p className="mt-1 text-sm text-[#7d8590]">Conecte seu GitHub e importe seus repos</p>
                <Link href="/seus-projetos/github"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#1f6feb,#3279db)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110">
                  <FolderGit2 className="h-4 w-4" />Importar do GitHub
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {importedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            {profile.github && (
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7d8590]">GitHub</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#238636] text-sm font-bold text-white">
                    {profile.github[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#e6edf3]">{profile.github}</p>
                    <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#58a6ff] hover:underline">
                      Ver no GitHub<ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7d8590]">Links</p>
                <div className="space-y-1">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition-all hover:border-[#30363d] hover:bg-[#0d1117]">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#58a6ff]/10 text-[#8ec2ff]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-[#7d8590]">{item.label}</span>
                          <span className="block truncate text-[#e6edf3]">{item.value}</span>
                        </span>
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[#7d8590] opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#7d8590]">Sobre</p>
              <div className="space-y-3 text-sm text-[#a9b4bf]">
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 flex-shrink-0 text-[#7d8590]" />
                  <span>Nível <span className="font-semibold text-[#e6edf3]">{profile.experience}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 flex-shrink-0 text-[#7d8590]" />
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ color: "#3fb950", backgroundColor: "#3fb95015", border: "1px solid #3fb95030" }}>
                    {profile.availability}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  const langColor = LANG_COLORS[repo.language ?? ""] ?? "#8b949e";
  return (
    <a href={repo.html_url} target="_blank" rel="noreferrer"
      className="group flex flex-col gap-3 rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#58a6ff]/30">
      <div className="flex items-center gap-2">
        <FolderGit2 className="h-4 w-4 flex-shrink-0 text-[#7d8590]" />
        <span className="font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">{repo.name}</span>
        <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-[#7d8590] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-[#7d8590]">{repo.description ?? "Sem descrição"}</p>
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#7d8590]">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: langColor }} />{repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{repo.stargazers_count}</span>
        <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{repo.forks_count}</span>
        <span>Atualizado {timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  );
}
