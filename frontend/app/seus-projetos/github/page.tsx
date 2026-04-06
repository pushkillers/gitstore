"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "gitstore.github.connection";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  FolderGit2,
  GitFork,
  Globe,
  Lock,
  LogIn,
  RefreshCw,
  Search,
  Star,
  Unlink,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  updated_at: string;
  html_url: string;
  imported: boolean;
}

interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string | null;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Ruby: "#701516",
  "C#": "#178600",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
};

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  if (days < 365) return `${Math.floor(days / 30)} meses atrás`;
  return `${Math.floor(days / 365)} anos atrás`;
}

// ─── Connect Screen ───────────────────────────────────────────────────────────
function ConnectScreen({
  onConnect,
}: {
  onConnect: (username: string) => Promise<void>;
}) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError("");
    setLoading(true);
    try {
      await onConnect(username.trim());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#30363d] bg-[#161b22]">
            <svg viewBox="0 0 24 24" className="h-10 w-10 fill-[#e6edf3]">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
        </div>

        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-8">
          <h1 className="text-center text-2xl font-bold text-[#e6edf3]">
            Conectar ao GitHub
          </h1>
          <p className="mt-2 text-center text-sm text-[#7d8590]">
            Digite seu username do GitHub para carregar seus repositórios públicos
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#e6edf3]">
                Username do GitHub
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">
                  github.com/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="seu-username"
                  autoFocus
                  className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-3 pl-[100px] pr-4 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#f85149]/20 bg-[#f8514915] px-4 py-3 text-sm text-[#ff8a84]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!username.trim() || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Conectar conta
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#7d8590]">
            Apenas repositórios públicos serão carregados via API do GitHub
          </p>
        </div>

        {/* Info */}
        <div className="mt-4 rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#58a6ff]" />
            <p className="text-xs text-[#7d8590] leading-5">
              Seus repositórios importados aparecem na sua vitrine pública com nome, descrição, linguagem e estrelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GithubImportPage() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justImported, setJustImported] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { user: savedUser, repos: savedRepos } = JSON.parse(raw);
        if (savedUser) setUser(savedUser);
        if (savedRepos) setRepos(savedRepos);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to localStorage whenever user/repos change
  useEffect(() => {
    if (!hydrated) return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, repos }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, repos, hydrated]);

  const fetchGithubData = async (username: string) => {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error("Usuário não encontrado no GitHub");
      if (userRes.status === 403) throw new Error("Limite de requisições da API atingido. Tente novamente em alguns minutos.");
      throw new Error("Erro ao buscar dados do GitHub");
    }

    const userData: GithubUser = await userRes.json();
    const reposData: GithubRepo[] = await reposRes.json();

    setUser(userData);
    setRepos(reposData.map((r) => ({ ...r, imported: false })));
  };

  const handleRefresh = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      await fetchGithubData(user.login);
    } catch {
      // silently fail on refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDisconnect = () => {
    setUser(null);
    setRepos([]);
    setSearch("");
    setFilterLang("");
  };

  const handleImport = (id: number) => {
    setJustImported(id);
    setRepos((prev) => prev.map((r) => (r.id === id ? { ...r, imported: true } : r)));
    setTimeout(() => setJustImported(null), 2000);
  };

  const handleRemove = (id: number) => {
    setRepos((prev) => prev.map((r) => (r.id === id ? { ...r, imported: false } : r)));
  };

  const languages = Array.from(new Set(repos.map((r) => r.language).filter(Boolean))) as string[];

  const filtered = repos.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchLang = !filterLang || r.language === filterLang;
    return matchSearch && matchLang;
  });

  const importedCount = repos.filter((r) => r.imported).length;

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#7d8590]">
          <Link href="/seus-projetos" className="transition-colors hover:text-[#e6edf3]">
            Seus Projetos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#e6edf3]">Importar do GitHub</span>
        </nav>

        {!user ? (
          <ConnectScreen onConnect={fetchGithubData} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 rounded-2xl border border-[#30363d] bg-[#161b22] p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#58a6ff]/20 bg-[#58a6ff]/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8ec2ff]">
                    <FolderGit2 className="h-3.5 w-3.5" />
                    GitHub
                  </div>
                  <h1 className="text-3xl font-bold text-[#e6edf3] md:text-4xl">
                    Importar repositórios
                  </h1>
                  <p className="mt-2 max-w-xl text-[#7d8590]">
                    Selecione os repositórios que deseja exibir na sua vitrine pública.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-center">
                      <p className="text-2xl font-bold text-[#e6edf3]">{repos.length}</p>
                      <p className="text-xs text-[#7d8590]">repositórios</p>
                    </div>
                    <div className="rounded-xl border border-[#3fb950]/20 bg-[#3fb950]/8 px-4 py-3 text-center">
                      <p className="text-2xl font-bold text-[#3fb950]">{importedCount}</p>
                      <p className="text-xs text-[#7d8590]">importados</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
                  >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    Sincronizar
                  </button>
                </div>
              </div>

              {/* Connected account */}
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[#3fb950]/20 bg-[#3fb950]/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="h-9 w-9 rounded-full border border-white/10"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#e6edf3]">
                      {user.name ?? user.login}
                      <span className="ml-2 rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs text-[#3fb950]">
                        Conectado
                      </span>
                    </p>
                    <p className="text-xs text-[#7d8590]">
                      github.com/{user.login} · {user.public_repos} repositórios públicos · {user.followers} seguidores
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#f85149]/20 px-3 py-2 text-xs font-medium text-[#ff8a84] transition-all hover:bg-[#f8514915]"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  Desconectar
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar repositório..."
                  className="w-full rounded-xl border border-[#30363d] bg-[#161b22] py-2.5 pl-10 pr-4 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <select
                value={filterLang}
                onChange={(e) => setFilterLang(e.target.value)}
                className="rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-sm text-[#e6edf3] outline-none focus:border-[#58a6ff] transition-all"
              >
                <option value="">Todas as linguagens</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <p className="mb-4 text-sm text-[#7d8590]">
              {filtered.length} {filtered.length === 1 ? "repositório" : "repositórios"} encontrados
            </p>

            {/* Repo list */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-[#30363d] bg-[#161b22] py-16 text-center">
                  <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                  <p className="font-medium text-[#e6edf3]">Nenhum repositório encontrado</p>
                  <p className="mt-1 text-sm text-[#7d8590]">Tente ajustar os filtros de busca</p>
                </div>
              ) : (
                filtered.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    isJustImported={justImported === repo.id}
                    onImport={handleImport}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Repo Card ────────────────────────────────────────────────────────────────
function RepoCard({
  repo,
  isJustImported,
  onImport,
  onRemove,
}: {
  repo: GithubRepo;
  isJustImported: boolean;
  onImport: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const langColor = LANG_COLORS[repo.language ?? ""] ?? "#8b949e";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-all",
        repo.imported
          ? "border-[#3fb950]/20 bg-[#3fb950]/5"
          : "border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/30"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 font-semibold text-[#e6edf3] transition-colors hover:text-[#58a6ff]"
            >
              {repo.private ? (
                <Lock className="h-4 w-4 text-[#7d8590]" />
              ) : (
                <Globe className="h-4 w-4 text-[#7d8590]" />
              )}
              {repo.name}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            {repo.private && (
              <span className="rounded-full border border-[#7d8590]/30 px-2 py-0.5 text-xs text-[#7d8590]">
                Privado
              </span>
            )}
            {repo.imported && (
              <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs font-medium text-[#3fb950]">
                Importado
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-[#7d8590] leading-6">
            {repo.description ?? "Sem descrição"}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#7d8590]">
            {repo.language && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: langColor }} />
                {repo.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {repo.stargazers_count}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="h-3.5 w-3.5" />
              {repo.forks_count}
            </span>
            <span>Atualizado {timeAgo(repo.updated_at)}</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          {repo.imported ? (
            <button
              type="button"
              onClick={() => onRemove(repo.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#f85149]/20 px-4 py-2 text-sm font-medium text-[#ff8a84] transition-all hover:bg-[#f8514915]"
            >
              <X className="h-4 w-4" />
              Remover
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onImport(repo.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                isJustImported
                  ? "bg-[#3fb950]/20 text-[#3fb950]"
                  : "bg-[linear-gradient(135deg,#1f6feb,#3279db)] text-white hover:brightness-110"
              )}
            >
              {isJustImported ? (
                <>
                  <Check className="h-4 w-4" />
                  Importado
                </>
              ) : (
                <>
                  <FolderGit2 className="h-4 w-4" />
                  Importar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
