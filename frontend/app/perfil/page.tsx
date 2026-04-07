"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  AtSign,
  Award,
  BriefcaseBusiness,
  Edit,
  FolderGit2,
  FolderKanban,
  GitFork,
  Globe,
  Mail,
  MapPin,
  PencilLine,
  Star,
  Trash2,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useProfile } from "@/hooks/useProfile";
import { FollowButton } from "@/components/ui/FollowButton";
import { getProjects, deleteProject, updateProject } from "@/lib/api/projects";
import { EditProjectModal } from "@/components/features/projects/EditProjectModal";
import { NewProjectModal } from "@/components/features/projects/NewProjectModal";
import { Project } from "@/types";

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}

interface GithubUser {
  followers: number;
  following: number;
  bio: string | null;
  public_repos: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
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
  const [activeTab, setActiveTab] = useState<"repos" | "published" | "teams">("repos");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<Project[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [githubUser, setGithubUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Mock de equipes do usuário
  const MOCK_USER_TEAMS = [
    {
      id: 1,
      name: "DevSquad Elite",
      logo: "🚀",
      role: "Líder",
      memberCount: 12,
      projectCount: 8,
      level: 15,
      banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop"
    },
    {
      id: 2,
      name: "Code Warriors",
      logo: "⚔️",
      role: "Membro",
      memberCount: 8,
      projectCount: 15,
      level: 22,
      banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop"
    },
    {
      id: 3,
      name: "Frontend Masters",
      logo: "💎",
      role: "Senior Dev",
      memberCount: 15,
      projectCount: 12,
      level: 18,
      banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&h=1080&fit=crop"
    }
  ];
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  useEffect(() => {
    const fetchGithubData = async () => {
      if (!profile.github) {
        setRepos([]);
        setGithubUser(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Buscar dados do usuário
        const userResponse = await fetch(`https://api.github.com/users/${profile.github}`);
        
        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            setError("Usuário do GitHub não encontrado");
          } else if (userResponse.status === 403) {
            setError("Limite de requisições da API do GitHub excedido");
          } else {
            setError("Erro ao carregar dados do GitHub");
          }
          setRepos([]);
          setGithubUser(null);
          return;
        }

        const userData = await userResponse.json();
        setGithubUser({
          followers: userData.followers,
          following: userData.following,
          bio: userData.bio,
          public_repos: userData.public_repos,
        });

        // Buscar repositórios
        const reposResponse = await fetch(`https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=30`);
        
        if (reposResponse.ok) {
          const reposData = await reposResponse.json();
          setRepos(reposData);
        }
      } catch (err) {
        setError("Erro ao conectar com o GitHub");
        setRepos([]);
        setGithubUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (profileHydrated) {
      fetchGithubData();
    }
  }, [profile.github, profileHydrated]);

  const loadPublishedProjects = async () => {
    try {
      const allProjects = await getProjects();
      const userProjects = allProjects.filter((p) => p.author === profile.username);
      setPublishedProjects(userProjects);
    } catch (error) {
      console.error("Erro ao carregar projetos publicados:", error);
    }
  };

  useEffect(() => {
    if (profileHydrated && profile.username) {
      loadPublishedProjects();
      // Carregar equipes do usuário
      setUserTeams(MOCK_USER_TEAMS);
    }
  }, [profileHydrated, profile.username]);

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject);
      await loadPublishedProjects();
      setEditModalOpen(false);
      setProjectToEdit(null);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      alert("Erro ao atualizar projeto");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      await deleteProject(id);
      await loadPublishedProjects();
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Erro ao excluir projeto");
    }
  };

  const handleProjectCreated = () => {
    loadPublishedProjects();
    setNewProjectModalOpen(false);
  };

  if (!authHydrated || !profileHydrated) return null;

  const zoom = Math.min(Math.max(profile.avatarZoom || 100, 80), 200);
  const initials = profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";
  const exp = expColors[profile.experience] ?? { text: "#7d8590", bg: "#7d859012", border: "#7d859030" };

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  // Conquistas baseadas em dados reais
  const achievements: Achievement[] = [
    {
      id: "first-repo",
      title: "Primeiro Repositório",
      description: "Criou seu primeiro repositório público",
      icon: <FolderGit2 className="h-5 w-5" />,
      color: "#3fb950",
      unlocked: repos.length > 0,
    },
    {
      id: "star-collector",
      title: "Colecionador de Stars",
      description: "Recebeu 10+ stars em seus repositórios",
      icon: <Star className="h-5 w-5" />,
      color: "#f0b442",
      unlocked: totalStars >= 10,
    },
    {
      id: "popular",
      title: "Popular",
      description: "Possui 50+ seguidores no GitHub",
      icon: <Users className="h-5 w-5" />,
      color: "#58a6ff",
      unlocked: (githubUser?.followers ?? 0) >= 50,
    },
    {
      id: "prolific",
      title: "Prolífico",
      description: "Criou 10+ repositórios públicos",
      icon: <Zap className="h-5 w-5" />,
      color: "#bc8cff",
      unlocked: repos.length >= 10,
    },
    {
      id: "influencer",
      title: "Influenciador",
      description: "Recebeu 100+ stars totais",
      icon: <Trophy className="h-5 w-5" />,
      color: "#ff8a84",
      unlocked: totalStars >= 100,
    },
    {
      id: "community",
      title: "Membro da Comunidade",
      description: "Possui forks em seus repositórios",
      icon: <GitFork className="h-5 w-5" />,
      color: "#3fb950",
      unlocked: totalForks > 0,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const socialLinks = [
    { label: "Website",   value: profile.website,  href: ensureUrl(profile.website),                       icon: Globe },
    { label: "GitHub",    value: profile.github,   href: ensureUrl(profile.github, "https://github.com/"), icon: FolderGit2 },
    { label: "Twitter/X", value: profile.twitter,  href: ensureUrl(profile.twitter, "https://x.com/"),     icon: AtSign },
    { label: "LinkedIn",  value: profile.linkedin, href: ensureUrl(profile.linkedin),                      icon: BriefcaseBusiness },
  ].filter((l) => l.href && l.value);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Banner Cover - Tamanho convencional */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-[#161b22]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,111,235,0.15),rgba(63,185,80,0.08),rgba(163,113,247,0.1))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(48,54,61,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(48,54,61,0.2)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar - Tamanho maior */}
          <div className="flex items-end gap-4">
            <div className="relative h-32 w-32 sm:h-36 sm:w-36 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-[#0d1117] bg-[#238636] shadow-xl">
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
                <div className="flex h-full w-full items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2.5 text-sm font-medium text-[#c9d1d9] transition-all duration-150 hover:border-[#484f58] hover:text-[#e6edf3]"
            >
              <PencilLine className="h-4 w-4" />
              Editar perfil
            </Link>
            <FollowButton username={profile.username} />
          </div>
        </div>

        {/* Name + meta */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#e6edf3]">{profile.name || "Sem nome"}</h1>
            {profile.experience && (
              <span
                className="rounded-full px-3 py-1 text-sm font-semibold"
                style={{ color: exp.text, backgroundColor: exp.bg, border: `1px solid ${exp.border}` }}
              >
                {profile.experience}
              </span>
            )}
          </div>
          {profile.username && (
            <p className="mt-1 text-base text-[#7d8590]">@{profile.username}</p>
          )}
          
          {/* Bio do perfil local ou do GitHub */}
          {(profile.bio || githubUser?.bio) && (
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#8b949e]">
              {profile.bio || githubUser?.bio}
            </p>
          )}

          {/* Seguidos e Seguindo do GitHub */}
          {githubUser && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <button className="inline-flex items-center gap-2 text-[#e6edf3] transition-colors hover:text-[#58a6ff]">
                <Users className="h-4 w-4 text-[#484f58]" />
                <span className="font-semibold">{githubUser.followers}</span>
                <span className="text-[#7d8590]">seguidores</span>
              </button>
              <span className="text-[#30363d]">·</span>
              <button className="inline-flex items-center gap-2 text-[#e6edf3] transition-colors hover:text-[#58a6ff]">
                <span className="font-semibold">{githubUser.following}</span>
                <span className="text-[#7d8590]">seguindo</span>
              </button>
            </div>
          )}

          {/* Meta chips */}
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#8b949e]">
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#484f58]" />{profile.location}
              </span>
            )}
            {profile.company && (
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4 text-[#484f58]" />{profile.company}
              </span>
            )}
            {profile.email && (
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#484f58]" />{profile.email}
              </span>
            )}
            {profile.availability && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#3fb950]/20 bg-[#3fb950]/8 px-3 py-1 text-[#3fb950]">
                ● {profile.availability}
              </span>
            )}
          </div>

          {/* Social links inline */}
          {socialLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                  >
                    <Icon className="h-4 w-4" />
                    {item.value}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="mb-10 flex gap-8 border-b border-[#21262d] pb-8 text-base">
          {[
            { label: "Repositórios", value: repos.length },
            { label: "Publicados", value: publishedProjects.length },
            { label: "Equipes", value: userTeams.length },
            { label: "Stars totais", value: totalStars },
            { label: "Forks totais", value: totalForks },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#e6edf3]">{s.value}</span>
              <span className="text-[#7d8590]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Tabs Section */}
          <section>
            {/* Tabs Header */}
            <div className="mb-5 flex items-center justify-between border-b border-[#21262d]">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("repos")}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    activeTab === "repos"
                      ? "text-[#e6edf3]"
                      : "text-[#7d8590] hover:text-[#e6edf3]"
                  }`}
                >
                  Repositórios
                  {activeTab === "repos" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f0883e]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    activeTab === "published"
                      ? "text-[#e6edf3]"
                      : "text-[#7d8590] hover:text-[#e6edf3]"
                  }`}
                >
                  Publicados
                  {activeTab === "published" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f0883e]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("teams")}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    activeTab === "teams"
                      ? "text-[#e6edf3]"
                      : "text-[#7d8590] hover:text-[#e6edf3]"
                  }`}
                >
                  Equipes
                  {activeTab === "teams" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#f0883e]" />
                  )}
                </button>
              </div>
              {activeTab === "repos" && profile.github && (
                <a
                  href={`https://github.com/${profile.github}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                >
                  Ver no GitHub <ArrowUpRight className="h-4 w-4" />
                </a>
              )}

            </div>

            {/* Tab Content */}
            {activeTab === "repos" ? (
              <>
                {loading ? (
                  <div className="rounded-2xl border border-[#30363d] py-16 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#30363d] border-t-[#58a6ff]" />
                    <p className="text-base font-medium text-[#8b949e]">Carregando repositórios...</p>
                  </div>
                ) : error ? (
                  <div className="rounded-2xl border border-[#f85149]/20 bg-[#f8514915] py-16 text-center">
                    <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-[#f85149]" />
                    <p className="text-base font-medium text-[#ff8a84]">{error}</p>
                    <p className="mt-2 text-sm text-[#7d8590]">
                      {!profile.github 
                        ? "Configure seu username do GitHub nas configurações"
                        : "Verifique se o username está correto nas configurações"
                      }
                    </p>
                    <Link
                      href="/settings"
                      className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-5 py-2.5 text-sm font-medium text-[#c9d1d9] transition-all hover:border-[#484f58] hover:text-[#e6edf3]"
                    >
                      <PencilLine className="h-4 w-4" />
                      Ir para Configurações
                    </Link>
                  </div>
                ) : repos.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
                    <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                    <p className="text-base font-medium text-[#8b949e]">
                      {profile.github ? "Nenhum repositório público encontrado" : "Configure seu GitHub"}
                    </p>
                    <p className="mt-2 text-sm text-[#484f58]">
                      {profile.github 
                        ? "Este usuário ainda não possui repositórios públicos"
                        : "Adicione seu username do GitHub nas configurações para exibir seus repositórios"
                      }
                    </p>
                    {!profile.github && (
                      <Link
                        href="/settings"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2ea043]"
                      >
                        <PencilLine className="h-4 w-4" />
                        Configurar GitHub
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
                  </div>
                )}
              </>
            ) : activeTab === "published" ? (
              <>
                {publishedProjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
                    <FolderKanban className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                    <p className="text-base font-medium text-[#8b949e]">Nenhum projeto publicado</p>
                    <p className="mt-2 text-sm text-[#484f58]">
                      Publique seus projetos na plataforma GitStore
                    </p>
                    <button
                      onClick={() => setNewProjectModalOpen(true)}
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2ea043]"
                    >
                      <FolderKanban className="h-4 w-4" />
                      Publicar Projeto
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {publishedProjects.map((project) => (
                      <PublishedProjectCard
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {userTeams.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-[#30363d]" />
                    <p className="text-base font-medium text-[#8b949e]">Nenhuma equipe</p>
                    <p className="mt-2 text-sm text-[#484f58]">
                      Você ainda não faz parte de nenhuma equipe
                    </p>
                    <Link
                      href="/teams"
                      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2ea043]"
                    >
                      <Users className="h-4 w-4" />
                      Explorar Equipes
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {userTeams.map((team) => (
                      <Link
                        key={team.id}
                        href={`/teams/${team.id}`}
                        className="group block overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#388bfd]/30 hover:shadow-[0_0_0_1px_rgba(56,139,253,0.1),0_8px_32px_-8px_rgba(0,0,0,0.6)]"
                      >
                        {/* Banner */}
                        <div className="relative h-24 overflow-hidden bg-gradient-to-br from-[#1f6feb]/20 to-[#8957e5]/20">
                          {team.banner && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={team.banner}
                              alt={team.name}
                              className="h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative -mt-8 px-4 pb-4">
                          {/* Logo */}
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#161b22] bg-[#0d1117] text-3xl shadow-lg">
                            {team.logo}
                          </div>

                          {/* Team info */}
                          <div className="mb-3">
                            <h3 className="mb-1 text-base font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
                              {team.name}
                            </h3>
                            <p className="text-sm text-[#7d8590]">{team.role}</p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 border-t border-[#21262d] pt-3 text-sm">
                            <div className="flex items-center gap-1.5 text-[#7d8590]">
                              <Users className="h-4 w-4" />
                              <span className="font-medium text-[#e6edf3]">{team.memberCount}</span>
                              <span className="text-xs">membros</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#7d8590]">
                              <FolderKanban className="h-4 w-4" />
                              <span className="font-medium text-[#e6edf3]">{team.projectCount}</span>
                              <span className="text-xs">projetos</span>
                            </div>
                            <div className="ml-auto flex items-center gap-1.5 text-[#7d8590]">
                              <Trophy className="h-4 w-4 text-[#f0b442]" />
                              <span className="font-medium text-[#e6edf3]">Nv {team.level}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* About */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Sobre</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-[#8b949e]">
                  <BriefcaseBusiness className="h-4 w-4 flex-shrink-0 text-[#484f58]" />
                  <span>Nível <span className="font-medium text-[#e6edf3]">{profile.experience}</span></span>
                </div>
                {profile.github && (
                  <div className="flex items-center gap-2.5 text-[#8b949e]">
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
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Links</p>
                <div className="space-y-1">
                  {socialLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[#0d1117]"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-[#484f58] transition-colors group-hover:text-[#58a6ff]" />
                        <span className="truncate text-[#8b949e] transition-colors group-hover:text-[#e6edf3]">{item.value}</span>
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[#484f58] opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conquistas */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Conquistas</p>
                <span className="text-xs text-[#7d8590]">{unlockedAchievements.length}/{achievements.length}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`group relative flex aspect-square items-center justify-center rounded-lg border transition-all ${
                      achievement.unlocked
                        ? "border-transparent bg-[#0d1117] hover:scale-105"
                        : "border-[#30363d] bg-[#161b22] opacity-40"
                    }`}
                    title={achievement.unlocked ? `${achievement.title}: ${achievement.description}` : "Bloqueado"}
                  >
                    <div style={{ color: achievement.unlocked ? achievement.color : "#484f58" }}>
                      {achievement.icon}
                    </div>
                    {achievement.unlocked && (
                      <div className="pointer-events-none absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#238636] text-white">
                        <Award className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {unlockedAchievements.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-[#30363d] pt-4">
                  {unlockedAchievements.slice(0, 2).map((achievement) => (
                    <div key={achievement.id} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0" style={{ color: achievement.color }}>
                        {achievement.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#e6edf3]">{achievement.title}</p>
                        <p className="text-xs text-[#7d8590]">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  {unlockedAchievements.length > 2 && (
                    <p className="text-xs text-[#7d8590]">
                      +{unlockedAchievements.length - 2} conquistas desbloqueadas
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {projectToEdit && (
        <EditProjectModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setProjectToEdit(null);
          }}
          project={projectToEdit}
          onSave={handleSaveEdit}
        />
      )}

      <NewProjectModal
        open={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
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
      className="group flex flex-col gap-3 rounded-xl border border-[#21262d] bg-[#161b22] p-5 transition-all duration-200 hover:border-[#30363d] hover:bg-[#1c2128]"
    >
      <div className="flex items-center gap-2.5">
        <FolderGit2 className="h-5 w-5 flex-shrink-0 text-[#484f58]" />
        <span className="text-base font-semibold text-[#58a6ff] transition-colors group-hover:text-[#79c0ff]">
          {repo.name}
        </span>
        <ArrowUpRight className="ml-auto h-4 w-4 flex-shrink-0 text-[#484f58] opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {repo.description && (
        <p className="line-clamp-2 text-sm leading-6 text-[#7d8590]">{repo.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-5 text-sm text-[#484f58]">
        {repo.language && (
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5" />{repo.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitFork className="h-3.5 w-3.5" />{repo.forks_count}
        </span>
        <span>{timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  );
}

function PublishedProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}) {
  const langColor = LANG_COLORS[project.language ?? ""] ?? "#7d8590";
  
  const typeBadge = {
    free: { label: "Grátis", cls: "text-[#3fb950] border-[#3fb950]/20 bg-[#3fb950]/8" },
    paid: { label: `$${project.price}`, cls: "text-[#e6edf3] border-[#30363d] bg-[#21262d]" },
  }[project.type];

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#388bfd]/30 hover:shadow-[0_0_0_1px_rgba(56,139,253,0.1),0_8px_32px_-8px_rgba(0,0,0,0.6)]">
      {/* Thumbnail */}
      <div
        className="relative h-36 flex-shrink-0 overflow-hidden"
        style={{ 
          background: project.thumbnail 
            ? `linear-gradient(135deg, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.1) 100%)`
            : `linear-gradient(135deg, ${langColor}14 0%, ${langColor}06 100%)`
        }}
      >
        {/* Background image */}
        {project.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-60" />

        {/* Dot grid - só aparece se não tiver thumbnail */}
        {!project.thumbnail && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${langColor}20 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(circle at 50% 100%, ${langColor}15, transparent 70%)` }}
        />

        {/* Type Badge */}
        <div className="absolute right-3 top-3 z-10">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${typeBadge.cls}`}>
            {typeBadge.label}
          </span>
        </div>

        {/* Language icon - só aparece se não tiver thumbnail */}
        {!project.thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-[#0d1117]/75 backdrop-blur-sm transition-all duration-200 group-hover:scale-105 group-hover:border-white/12">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16" style={{ color: langColor }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title row */}
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-[#e6edf3]">
            {project.name}
          </h3>
          <div className="flex flex-shrink-0 items-center gap-0.5 text-[11px] font-semibold text-[#d29922]">
            <svg className="h-3 w-3 fill-current" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            {project.rating}
          </div>
        </div>

        <p className="mb-1 text-[10px] text-[#484f58]">{project.category}</p>

        <p className="mb-3 line-clamp-2 flex-1 text-xs leading-5 text-[#7d8590]">
          {project.description}
        </p>

        {/* Footer */}
        <div className="border-t border-[#21262d] pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-[#484f58]">
              <span className="inline-flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {project.downloads}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
                {project.language}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(project); }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#484f58] transition-all duration-150 hover:bg-[#58a6ff]/8 hover:text-[#58a6ff] active:scale-95"
                title="Editar projeto"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(project.id); }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[#484f58] transition-all duration-150 hover:bg-[#f85149]/8 hover:text-[#f85149] active:scale-95"
                title="Excluir projeto"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
    </Link>
  );
}
