"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Users, FolderGit, Trophy, MessageCircle, Settings,
  Plus, ChevronRight, Star, GitBranch, Mail, MapPin, Calendar,
  Clock
} from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { formatNumber } from "@/lib/utils/cn";
import { InviteMemberModal } from "@/components/features/teams";
import { NewProjectModal } from "@/components/features/projects/NewProjectModal";

interface TeamMember {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  joinedAt: string;
  isOnline?: boolean;
}

interface TeamProject {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  logo: string;
  banner: string;
  members: TeamMember[];
  memberCount: number;
  projectCount: number;
  projects: TeamProject[];
  tags: string[];
  isPublic: boolean;
  level: number;
  xp: number;
  maxXp: number;
  joinType: 'instant' | 'request';
  createdAt: string;
  location: string;
  website?: string;
  stats: {
    totalCommits: number;
    totalStars: number;
    activeProjects: number;
    completedTasks: number;
  };
}

const MOCK_TEAMS: Record<string, Team> = {
  "1": {
    id: 1,
    name: "DevSquad Elite",
    description: "Equipe focada em desenvolvimento full-stack com React, Node.js e TypeScript.",
    fullDescription: "Somos uma equipe apaixonada por criar soluções inovadoras. Trabalhamos com as tecnologias mais modernas do mercado e buscamos sempre entregar código de alta qualidade. Nossa cultura valoriza colaboração, aprendizado contínuo e excelência técnica.",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop",
    logo: "🚀",
    members: [
      { id: 1, name: "João Silva", username: "joaosilva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao", role: "Líder", joinedAt: "2024-01-15", isOnline: true },
      { id: 2, name: "Maria Santos", username: "mariasantos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria", role: "Senior Dev", joinedAt: "2024-02-01" },
      { id: 3, name: "Pedro Costa", username: "pedrodev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro", role: "Full-stack", joinedAt: "2024-03-10", isOnline: true },
      { id: 4, name: "Ana Pereira", username: "anapereira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana", role: "Frontend", joinedAt: "2024-04-05" },
      { id: 5, name: "Carlos Lima", username: "carloslima", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos", role: "Backend", joinedAt: "2024-05-20" },
      { id: 6, name: "Julia Rocha", username: "juliarocha", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=julia", role: "Designer", joinedAt: "2024-06-01", isOnline: true },
    ],
    memberCount: 12,
    projectCount: 8,
    projects: [
      { id: 1, name: "E-commerce Pro", description: "Plataforma de e-commerce completa", stars: 245, forks: 34, language: "TypeScript", updatedAt: "2024-12-20" },
      { id: 2, name: "Dashboard Analytics", description: "Painel de analytics em tempo real", stars: 189, forks: 22, language: "React", updatedAt: "2024-12-18" },
      { id: 3, name: "API Gateway", description: "Gateway de API microservices", stars: 156, forks: 18, language: "Node.js", updatedAt: "2024-12-15" },
    ],
    tags: ["React", "Node.js", "TypeScript", "MongoDB", "Docker", "AWS"],
    isPublic: true,
    level: 15,
    xp: 12500,
    maxXp: 15000,
    joinType: 'instant',
    createdAt: "2024-01-10",
    location: "São Paulo, Brasil",
    website: "https://devsquad.dev",
    stats: {
      totalCommits: 12540,
      totalStars: 2847,
      activeProjects: 8,
      completedTasks: 342
    }
  },
  "2": {
    id: 2,
    name: "Code Warriors",
    description: "Guerreiros do código unidos para dominar o mundo do desenvolvimento.",
    fullDescription: "Code Warriors é uma equipe elite de desenvolvedores focada em arquitetura de software escalável. Trabalhamos com Python, Django e cloud technologies para entregar soluções robustas para clientes enterprise.",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop",
    logo: "⚔️",
    members: [
      { id: 1, name: "Lucas Ferreira", username: "lucasdev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas", role: "Tech Lead", joinedAt: "2024-01-20" },
      { id: 2, name: "Fernanda Alves", username: "fernanda", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda", role: "Senior", joinedAt: "2024-02-15", isOnline: true },
      { id: 3, name: "Rafael Mendes", username: "rafael", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rafael", role: "DevOps", joinedAt: "2024-03-01" },
    ],
    memberCount: 8,
    projectCount: 15,
    projects: [
      { id: 1, name: "CRM System", description: "Sistema CRM enterprise", stars: 312, forks: 45, language: "Python", updatedAt: "2024-12-19" },
      { id: 2, name: "ML Pipeline", description: "Pipeline de machine learning", stars: 278, forks: 38, language: "Python", updatedAt: "2024-12-17" },
    ],
    tags: ["Python", "Django", "AWS", "Docker", "Kubernetes"],
    isPublic: true,
    level: 22,
    xp: 18400,
    maxXp: 20000,
    joinType: 'request',
    createdAt: "2023-12-01",
    location: "Rio de Janeiro, Brasil",
    stats: {
      totalCommits: 15680,
      totalStars: 3420,
      activeProjects: 15,
      completedTasks: 512
    }
  }
};

const LEVEL_COLORS = [
  { min: 0, max: 10, color: "#3fb950", label: "Iniciante" },
  { min: 10, max: 20, color: "#58a6ff", label: "Intermediário" },
  { min: 20, max: 30, color: "#d29922", label: "Avançado" },
  { min: 30, max: Infinity, color: "#a371f7", label: "Elite" },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  React: "#61dafb", "Node.js": "#339933", "C++": "#f34b7d",
};

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'projects'>('overview');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundTeam = MOCK_TEAMS[id] || null;
    setTeam(foundTeam);
    // Mock: verificar se usuário é membro
    setIsMember(id === "1");
  }, [id]);

  if (!team) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-[#e6edf3]">Equipe não encontrada</h2>
          <Link href="/teams" className="mt-4 inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Voltar para equipes
          </Link>
        </div>
      </div>
    );
  }

  const lvl = LEVEL_COLORS.find((l) => team.level >= l.min && team.level < l.max) ?? LEVEL_COLORS[0];
  const xpPct = (team.xp / team.maxXp) * 100;

  const handleJoin = () => {
    if (team.joinType === 'instant') {
      toast.success(`Você entrou na equipe ${team.name}! 🎉`);
    } else {
      setHasRequested(true);
      toast.success(`Solicitação enviada para ${team.name}! Aguarde aprovação.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={team.banner}
          alt={team.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f6feb]/20 to-[#8957e5]/20" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#2ea043]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        {/* Settings (se for membro) */}
        {isMember && (
          <div className="absolute top-4 right-4">
            <button className="rounded-lg border border-[#30363d] bg-[#161b22]/80 p-2 text-[#e6edf3] transition-all hover:bg-[#21262d]">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          {/* Logo */}
          <div className="relative h-32 w-32 flex-shrink-0 rounded-2xl border-4 border-[#0d1117] bg-[#161b22] overflow-hidden shadow-xl">
            <div className="flex h-full w-full items-center justify-center text-5xl bg-gradient-to-br from-[#1f6feb]/20 to-[#8957e5]/20">
              {team.logo}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#e6edf3]">{team.name}</h1>
              <span
                className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                style={{ color: lvl.color, borderColor: `${lvl.color}40`, backgroundColor: `${lvl.color}15` }}
              >
                Nível {team.level}
              </span>
              {team.isPublic ? (
                <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-2 py-0.5 text-xs text-[#3fb950]">
                  Pública
                </span>
              ) : (
                <span className="rounded-full border border-[#484f58]/30 bg-[#21262d] px-2 py-0.5 text-xs text-[#7d8590]">
                  Privada
                </span>
              )}
            </div>
            <p className="text-[#7d8590] max-w-2xl">{team.description}</p>
            
            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#7d8590]">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {team.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Criada em {new Date(team.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {team.memberCount} membros
              </span>
              <span className="flex items-center gap-1.5">
                <FolderGit className="h-4 w-4" /> {team.projectCount} projetos
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-2">
            {isMember ? (
              <button className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-5 py-2.5 text-sm font-semibold text-[#e6edf3] transition-all hover:bg-[#30363d]">
                <MessageCircle className="h-4 w-4" />
                Chat da equipe
              </button>
            ) : hasRequested ? (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-[#d29922]/40 bg-[#d29922]/20 px-5 py-2.5 text-sm font-semibold text-[#d29922] cursor-default"
              >
                <Clock className="h-4 w-4" />
                Solicitado
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                  team.joinType === 'instant'
                    ? 'bg-[#238636] text-white hover:bg-[#2ea043]'
                    : 'border border-[#388bfd]/40 bg-[#388bfd]/10 text-[#58a6ff] hover:bg-[#388bfd]/20'
                }`}
              >
                <Plus className="h-4 w-4" />
                {team.joinType === 'instant' ? 'Entrar na equipe' : 'Solicitar entrada'}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 rounded-xl border border-[#21262d] bg-[#161b22] p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#7d8590]">Progresso para nível {team.level + 1}</span>
            <span className="text-[#e6edf3] font-medium">{team.xp.toLocaleString()} / {team.maxXp.toLocaleString()} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#21262d]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1f6feb] to-[#8b5cf6] transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
          {/* Left Sidebar - Stats */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Estatísticas</h3>
              <div className="space-y-4">
                {[
                  { icon: GitBranch, label: "Commits", value: formatNumber(team.stats.totalCommits), color: "#58a6ff" },
                  { icon: Star, label: "Stars", value: formatNumber(team.stats.totalStars), color: "#d29922" },
                  { icon: FolderGit, label: "Projetos ativos", value: team.stats.activeProjects, color: "#3fb950" },
                  { icon: Trophy, label: "Tarefas concluídas", value: formatNumber(team.stats.completedTasks), color: "#a371f7" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#7d8590]">
                      <s.icon className="h-4 w-4" style={{ color: s.color }} />
                      <span className="text-sm">{s.label}</span>
                    </div>
                    <span className="font-semibold text-[#e6edf3]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {team.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {team.website && (
              <a
                href={team.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#21262d] bg-[#161b22] p-4 text-sm text-[#58a6ff] transition-all hover:bg-[#21262d]"
              >
                <Mail className="h-4 w-4" />
                Visitar website
                <ChevronRight className="h-4 w-4 ml-auto" />
              </a>
            )}
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-[#21262d] bg-[#161b22] p-1">
              {[
                { id: 'overview', label: 'Visão geral' },
                { id: 'members', label: `Membros (${team.memberCount})` },
                { id: 'projects', label: `Projetos (${team.projectCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#21262d] text-[#e6edf3]'
                      : 'text-[#7d8590] hover:text-[#e6edf3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* About */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Sobre a equipe</h3>
                  <p className="text-sm leading-6 text-[#8b949e]">{team.fullDescription}</p>
                </div>

                {/* Featured Members */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#e6edf3]">Membros em destaque</h3>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="text-xs text-[#58a6ff] hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {team.members.slice(0, 4).map((member) => (
                      <Link
                        key={member.id}
                        href={`/perfil?user=${member.username}`}
                        className="flex items-center gap-3 rounded-xl border border-[#21262d] bg-[#0d1117] p-3 transition-all hover:border-[#30363d]"
                      >
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                          />
                          {member.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0d1117] bg-[#3fb950]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#e6edf3]">{member.name}</p>
                          <p className="truncate text-xs text-[#7d8590]">{member.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Projects */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#e6edf3]">Projetos recentes</h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs text-[#58a6ff] hover:underline"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {team.projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 rounded-xl border border-[#21262d] bg-[#0d1117] p-4"
                      >
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${LANG_COLORS[project.language] || '#484f58'}20`, color: LANG_COLORS[project.language] || '#8b949e' }}
                        >
                          {project.language === 'TypeScript' ? 'TS' : project.language.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#e6edf3]">{project.name}</p>
                          <p className="text-xs text-[#7d8590] truncate">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#7d8590]">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5" /> {formatNumber(project.stars)}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3.5 w-3.5" /> {project.forks}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Todos os membros</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {team.members.map((member) => (
                    <Link
                      key={member.id}
                      href={`/perfil?user=${member.username}`}
                      className="flex items-center gap-3 rounded-xl border border-[#21262d] bg-[#0d1117] p-4 transition-all hover:border-[#30363d]"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="rounded-full object-cover"
                        />
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0d1117] bg-[#3fb950]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#e6edf3]">{member.name}</p>
                        <p className="text-xs text-[#7d8590]">@{member.username}</p>
                      </div>
                      <span className="rounded-full border border-[#30363d] bg-[#21262d] px-2.5 py-1 text-xs text-[#8b949e]">
                        {member.role}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Projetos da equipe</h3>
                <div className="grid gap-4">
                  {team.projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl border border-[#21262d] bg-[#0d1117] p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: `${LANG_COLORS[project.language] || '#484f58'}20`, color: LANG_COLORS[project.language] || '#8b949e' }}
                          >
                            {project.language === 'TypeScript' ? 'TS' : project.language.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#e6edf3]">{project.name}</p>
                            <p className="text-sm text-[#7d8590]">{project.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-[#7d8590]">{project.updatedAt}</span>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-[#7d8590]">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-4 w-4" /> {formatNumber(project.stars)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GitBranch className="h-4 w-4" /> {project.forks} forks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            {/* Leader */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Líder</h3>
              {team.members.filter(m => m.role === 'Líder' || m.role === 'Tech Lead').slice(0, 1).map((leader) => (
                <Link
                  key={leader.id}
                  href={`/perfil?user=${leader.username}`}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-14 w-14">
                    <Image
                      src={leader.avatar}
                      alt={leader.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#161b22] bg-[#d29922]">
                      <Trophy className="h-3 w-3 text-[#0d1117]" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#e6edf3]">{leader.name}</p>
                    <p className="text-sm text-[#7d8590]">@{leader.username}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Online Members */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Membros online</h3>
              <div className="flex -space-x-2">
                {team.members.filter(m => m.isOnline).map((member) => (
                  <div key={member.id} className="relative">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-[#161b22]"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#161b22] bg-[#3fb950]" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#7d8590]">
                {team.members.filter(m => m.isOnline).length} membros online
              </p>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Ações rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setPublishModalOpen(true)}
                  className="flex w-full items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2.5 text-sm text-[#e6edf3] transition-all hover:bg-[#30363d]"
                >
                  <Plus className="h-4 w-4" />
                  Novo projeto
                </button>
                <button 
                  onClick={() => setInviteModalOpen(true)}
                  className="w-full rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2.5 text-sm text-[#e6edf3] transition-all hover:bg-[#30363d]"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <Users className="h-4 w-4" />
                    Convidar membro
                  </span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16" />

      {/* Modal de convite */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        teamName={team.name}
        teamId={team.id}
      />

      {/* Modal de publicar projeto */}
      <NewProjectModal
        open={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
      />
    </div>
  );
}
