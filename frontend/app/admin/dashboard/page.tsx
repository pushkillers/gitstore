"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Package, Trash2, LogOut, RefreshCw, ShieldAlert,
  TrendingUp, DollarSign, Gift, Layers, Loader2, AlertTriangle,
  ChevronRight, Search, X
} from "lucide-react";
import {
  isAdminLoggedIn, getAdminName, adminLogout,
  fetchAdminStats, fetchAdminUsers, deleteAdminUser,
  fetchAdminProjects, deleteAdminProject,
} from "@/lib/admin";
import { toast } from "@/lib/toast";

type Tab = "overview" | "users" | "projects";

interface Stats {
  users: number;
  projects: number;
  byType: { free: number; paid: number; freemium: number };
}

interface AdminUser {
  id: string; name: string; username: string; email: string;
  experience: string; availability: string; createdAt: string;
  hasGoogle: boolean; hasPassword: boolean;
}

interface AdminProject {
  id: number; name: string; description: string; author: string;
  language: string; type: string; price: number; category: string;
  rating: number; downloads: number; createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | number | null>(null);
  const adminName = getAdminName();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u, p] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
        fetchAdminProjects(),
      ]);
      setStats(s);
      setUsers(u.users ?? []);
      setProjects(p.projects ?? []);
    } catch {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.replace("/admin"); return; }
    load();
  }, [router, load]);

  const handleLogout = () => {
    adminLogout();
    router.replace("/admin");
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Excluir usuário "${name}"? Esta ação é irreversível.`)) return;
    setDeleting(id);
    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (stats) setStats({ ...stats, users: stats.users - 1 });
      toast.success(`Usuário ${name} removido.`);
    } catch {
      toast.error("Erro ao excluir usuário.");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteProject = async (id: number, name: string) => {
    if (!confirm(`Excluir projeto "${name}"? Esta ação é irreversível.`)) return;
    setDeleting(id);
    try {
      await deleteAdminProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (stats) setStats({ ...stats, projects: stats.projects - 1 });
      toast.success(`Projeto "${name}" removido.`);
    } catch {
      toast.error("Erro ao excluir projeto.");
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const STAT_CARDS = stats
    ? [
        { icon: Users,     label: "Usuários",  value: stats.users,    color: "#58a6ff" },
        { icon: Package,   label: "Projetos",  value: stats.projects, color: "#3fb950" },
        { icon: Gift,      label: "Gratuitos", value: stats.byType.free,     color: "#d29922" },
        { icon: DollarSign,label: "Pagos",     value: stats.byType.paid,     color: "#a371f7" },
        { icon: Layers,    label: "Freemium",  value: stats.byType.freemium, color: "#f0b442" },
        { icon: TrendingUp,label: "Conversão", value: stats.projects > 0 ? `${Math.round((stats.byType.paid / stats.projects) * 100)}%` : "0%", color: "#ff7b72" },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-[#010409]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#21262d] bg-[#010409]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f85149]/10 border border-[#f85149]/20">
              <ShieldAlert className="h-4 w-4 text-[#f85149]" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold text-[#e6edf3]">GitStore</span>
              <span className="ml-1.5 rounded-full border border-[#f85149]/25 bg-[#f85149]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f85149]">
                Admin
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#484f58] sm:block">
              Logado como <span className="font-semibold text-[#7d8590]">{adminName}</span>
            </span>
            <button
              onClick={load}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#30363d] text-[#7d8590] transition-colors hover:border-[#484f58] hover:text-[#e6edf3] disabled:opacity-50"
              title="Recarregar"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#f85149]/20 bg-[#f85149]/8 px-3 py-1.5 text-xs font-medium text-[#f85149] transition-all hover:bg-[#f85149]/15"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 border-b border-[#21262d] pb-0">
          {(["overview", "users", "projects"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); }}
              className={[
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t ? "text-[#e6edf3]" : "text-[#7d8590] hover:text-[#c9d1d9]",
              ].join(" ")}
            >
              {t === "overview" ? "Visão geral" : t === "users" ? `Usuários (${users.length})` : `Projetos (${projects.length})`}
              {tab === t && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f85149]" />
              )}
            </button>
          ))}
        </div>

        {loading && !stats ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-[#f85149]" />
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {STAT_CARDS.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[#21262d] bg-[#0d1117] p-5 transition-colors hover:border-[#30363d]"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <s.icon className="h-4 w-4" style={{ color: s.color }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#484f58]">{s.label}</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick tables */}
                <div className="grid gap-4 lg:grid-cols-2">
                  {/* Recent users */}
                  <div className="rounded-xl border border-[#21262d] bg-[#0d1117]">
                    <div className="flex items-center justify-between border-b border-[#21262d] px-5 py-3">
                      <h3 className="text-sm font-semibold text-[#e6edf3]">Últimos usuários</h3>
                      <button onClick={() => setTab("users")} className="flex items-center gap-1 text-xs text-[#484f58] hover:text-[#7d8590]">
                        Ver todos <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="divide-y divide-[#21262d]">
                      {users.slice(0, 5).map((u) => (
                        <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#388bfd] text-xs font-bold text-white">
                            {u.name[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#e6edf3]">{u.name}</p>
                            <p className="truncate text-xs text-[#484f58]">@{u.username} · {u.email}</p>
                          </div>
                          <div className="flex gap-1">
                            {u.hasGoogle && <span className="rounded-full border border-[#388bfd]/20 bg-[#388bfd]/8 px-1.5 py-0.5 text-[9px] text-[#58a6ff]">Google</span>}
                            {u.hasPassword && <span className="rounded-full border border-[#3fb950]/20 bg-[#3fb950]/8 px-1.5 py-0.5 text-[9px] text-[#3fb950]">Senha</span>}
                          </div>
                        </div>
                      ))}
                      {users.length === 0 && (
                        <p className="px-5 py-6 text-center text-xs text-[#484f58]">Nenhum usuário cadastrado.</p>
                      )}
                    </div>
                  </div>

                  {/* Recent projects */}
                  <div className="rounded-xl border border-[#21262d] bg-[#0d1117]">
                    <div className="flex items-center justify-between border-b border-[#21262d] px-5 py-3">
                      <h3 className="text-sm font-semibold text-[#e6edf3]">Últimos projetos</h3>
                      <button onClick={() => setTab("projects")} className="flex items-center gap-1 text-xs text-[#484f58] hover:text-[#7d8590]">
                        Ver todos <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="divide-y divide-[#21262d]">
                      {projects.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#21262d] bg-[#161b22] text-xs font-bold text-[#7d8590]">
                            {p.language.slice(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#e6edf3]">{p.name}</p>
                            <p className="truncate text-xs text-[#484f58]">@{p.author} · {p.category}</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                            p.type === "free" ? "bg-[#3fb950]/10 text-[#3fb950]"
                            : p.type === "paid" ? "bg-[#a371f7]/10 text-[#a371f7]"
                            : "bg-[#58a6ff]/10 text-[#58a6ff]"
                          }`}>
                            {p.type === "paid" ? `$${p.price}` : p.type}
                          </span>
                        </div>
                      ))}
                      {projects.length === 0 && (
                        <p className="px-5 py-6 text-center text-xs text-[#484f58]">Nenhum projeto publicado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#484f58]" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, username ou email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-8 text-sm text-[#e6edf3] outline-none placeholder:text-[#484f58] focus:border-[#f85149]/40 transition-colors"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#7d8590]">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-[#484f58]">{filteredUsers.length} usuário{filteredUsers.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#21262d] bg-[#0d1117]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#21262d]">
                        {["Usuário", "Email", "Nível", "Auth", "Cadastro", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#484f58]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="group transition-colors hover:bg-[#161b22]/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#388bfd] text-[10px] font-bold text-white">
                                {u.name[0]?.toUpperCase() ?? "?"}
                              </div>
                              <div>
                                <p className="font-medium text-[#e6edf3]">{u.name}</p>
                                <p className="text-[10px] text-[#484f58]">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#7d8590]">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-[#7d8590]">{u.experience}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {u.hasGoogle && <span className="rounded-full border border-[#388bfd]/20 bg-[#388bfd]/8 px-1.5 py-0.5 text-[9px] text-[#58a6ff]">Google</span>}
                              {u.hasPassword && <span className="rounded-full border border-[#3fb950]/20 bg-[#3fb950]/8 px-1.5 py-0.5 text-[9px] text-[#3fb950]">Senha</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#484f58]">
                            {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              disabled={deleting === u.id}
                              className="rounded-lg border border-[#f85149]/15 p-1.5 text-[#f85149]/50 opacity-0 transition-all group-hover:opacity-100 hover:border-[#f85149]/40 hover:bg-[#f85149]/8 hover:text-[#f85149] disabled:opacity-30"
                              title="Excluir usuário"
                            >
                              {deleting === u.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                              }
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-xs text-[#484f58]">
                      {search ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado."}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── PROJECTS ── */}
            {tab === "projects" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#484f58]" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, autor ou categoria..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2 pl-9 pr-8 text-sm text-[#e6edf3] outline-none placeholder:text-[#484f58] focus:border-[#f85149]/40 transition-colors"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#7d8590]">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-[#484f58]">{filteredProjects.length} projeto{filteredProjects.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#21262d] bg-[#0d1117]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#21262d]">
                        {["Projeto", "Autor", "Linguagem", "Tipo", "Downloads", "Criado em", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#484f58]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#21262d]">
                      {filteredProjects.map((p) => (
                        <tr key={p.id} className="group transition-colors hover:bg-[#161b22]/50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#e6edf3]">{p.name}</p>
                            <p className="mt-0.5 line-clamp-1 text-[10px] text-[#484f58]">{p.description}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#7d8590]">@{p.author}</td>
                          <td className="px-4 py-3 text-xs text-[#7d8590]">{p.language}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                              p.type === "free" ? "bg-[#3fb950]/10 text-[#3fb950]"
                              : p.type === "paid" ? "bg-[#a371f7]/10 text-[#a371f7]"
                              : "bg-[#58a6ff]/10 text-[#58a6ff]"
                            }`}>
                              {p.type === "paid" ? `$${p.price}` : p.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#7d8590]">{p.downloads.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-[#484f58]">
                            {p.createdAt}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteProject(p.id, p.name)}
                              disabled={deleting === p.id}
                              className="rounded-lg border border-[#f85149]/15 p-1.5 text-[#f85149]/50 opacity-0 transition-all group-hover:opacity-100 hover:border-[#f85149]/40 hover:bg-[#f85149]/8 hover:text-[#f85149] disabled:opacity-30"
                              title="Excluir projeto"
                            >
                              {deleting === p.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                              }
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProjects.length === 0 && (
                    <div className="py-12 text-center text-xs text-[#484f58]">
                      {search ? "Nenhum projeto encontrado." : "Nenhum projeto publicado."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#21262d] px-6 py-3">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <p className="text-[10px] text-[#30363d]">GitStore Admin Panel · Acesso restrito</p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#30363d]">
            <AlertTriangle className="h-3 w-3" />
            Não compartilhe esta URL
          </div>
        </div>
      </footer>
    </div>
  );
}
