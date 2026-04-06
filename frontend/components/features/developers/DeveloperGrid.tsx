"use client";

import { useEffect, useState } from "react";
import { DeveloperCard } from "./DeveloperCard";
import { useProfile } from "@/lib/useProfile";
import { getXP, calcLevel, XP_EVENT_NAME } from "@/lib/xp";
import { getPublishedProjects } from "@/lib/projects";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const MOCK_DEVELOPERS = [
  { id: 1, name: "Ana Silva", username: "anasilva", avatar: "👩‍💻", avatarIsImage: false, bio: "Full-stack developer apaixonada por criar soluções inovadoras.", xpTotal: 8500, level: 42, xp: 8500, maxXp: 10000, stats: { projects: 28, contributions: 1250, followers: 342, stars: 1840 }, skills: ["React", "Node.js", "TypeScript"], badges: ["🏆", "⭐", "🔥", "💎"], isVerified: true, isTopContributor: true },
  { id: 2, name: "Carlos Mendes", username: "carlosdev", avatar: "👨‍💻", avatarIsImage: false, bio: "DevOps engineer e cloud architect. Construindo infraestruturas escaláveis.", xpTotal: 7200, level: 38, xp: 7200, maxXp: 9000, stats: { projects: 22, contributions: 980, followers: 289, stars: 1520 }, skills: ["Kubernetes", "AWS", "Terraform"], badges: ["🥈", "☁️", "🚀"], isVerified: true, isTopContributor: true },
  { id: 3, name: "Beatriz Costa", username: "biacosta", avatar: "👩‍🎨", avatarIsImage: false, bio: "UI/UX Designer e Frontend Developer. Criando experiências digitais.", xpTotal: 6800, level: 35, xp: 6800, maxXp: 8500, stats: { projects: 19, contributions: 850, followers: 256, stars: 1320 }, skills: ["React", "Tailwind", "Figma"], badges: ["🥉", "🎨", "✨"], isVerified: true, isTopContributor: true },
  { id: 4, name: "Rafael Santos", username: "rafaeldev", avatar: "🧑‍💻", avatarIsImage: false, bio: "Backend specialist focado em microsserviços e APIs escaláveis.", xpTotal: 5400, level: 32, xp: 5400, maxXp: 7500, stats: { projects: 16, contributions: 720, followers: 198, stars: 980 }, skills: ["Java", "Spring", "PostgreSQL"], badges: ["⚡", "🔧"], isVerified: true, isTopContributor: false },
  { id: 5, name: "Julia Oliveira", username: "juliaoliv", avatar: "👩‍🔬", avatarIsImage: false, bio: "Data Scientist e ML Engineer. Transformando dados em insights.", xpTotal: 4900, level: 30, xp: 4900, maxXp: 7000, stats: { projects: 14, contributions: 650, followers: 175, stars: 840 }, skills: ["Python", "TensorFlow", "Pandas"], badges: ["🧠", "📊"], isVerified: true, isTopContributor: false },
  { id: 6, name: "Pedro Alves", username: "pedroalves", avatar: "👨‍🚀", avatarIsImage: false, bio: "Mobile developer criando apps nativos para iOS e Android.", xpTotal: 4200, level: 28, xp: 4200, maxXp: 6500, stats: { projects: 12, contributions: 580, followers: 142, stars: 720 }, skills: ["React Native", "Swift", "Kotlin"], badges: ["📱", "🎯"], isVerified: false, isTopContributor: false },
  { id: 7, name: "Mariana Lima", username: "marialima", avatar: "👩‍🏫", avatarIsImage: false, bio: "Tech lead e mentora. Ajudando desenvolvedores a crescerem.", xpTotal: 3800, level: 26, xp: 3800, maxXp: 6000, stats: { projects: 10, contributions: 520, followers: 128, stars: 650 }, skills: ["Leadership", "React", "Node.js"], badges: ["👨‍🏫", "💡"], isVerified: true, isTopContributor: false },
  { id: 8, name: "Lucas Ferreira", username: "lucasferr", avatar: "🧑‍🎓", avatarIsImage: false, bio: "Desenvolvedor júnior em constante aprendizado.", xpTotal: 2100, level: 18, xp: 2100, maxXp: 4000, stats: { projects: 6, contributions: 280, followers: 68, stars: 320 }, skills: ["JavaScript", "React", "HTML"], badges: ["🌱"], isVerified: false, isTopContributor: false },
];

interface RealUser {
  id: string; name: string; username: string;
  avatar: string; avatarZoom: number; bio: string;
  experience: string; availability: string;
}

export function DeveloperGrid() {
  const { profile } = useProfile();
  const [xpData, setXpData] = useState(getXP);
  const [userProjects, setUserProjects] = useState(0);
  const [realUsers, setRealUsers] = useState<RealUser[]>([]);

  useEffect(() => {
    const refresh = () => { setXpData(getXP()); setUserProjects(getPublishedProjects().length); };
    refresh();
    window.addEventListener(XP_EVENT_NAME, refresh);
    window.addEventListener("gitstore.projects.change", refresh);
    window.addEventListener("gitstore.profile.update", refresh);
    return () => {
      window.removeEventListener(XP_EVENT_NAME, refresh);
      window.removeEventListener("gitstore.projects.change", refresh);
      window.removeEventListener("gitstore.profile.update", refresh);
    };
  }, []);

  useEffect(() => {
    fetch(`${API}/auth/users`)
      .then((r) => r.json())
      .then(({ users }) => setRealUsers(users ?? []))
      .catch(() => {
        // Fallback: usa o perfil local se o backend não responder
        if (profile.name) {
          setRealUsers([{
            id: "local",
            name: profile.name,
            username: profile.username,
            avatar: profile.avatar,
            avatarZoom: profile.avatarZoom,
            bio: profile.bio,
            experience: profile.experience,
            availability: profile.availability,
          }]);
        }
      });
  }, [profile]);

  const lvl = calcLevel(xpData.total);
  const isLoggedIn = !!profile.name;
  const zoom = Math.min(Math.max(profile.avatarZoom || 100, 80), 200);

  // Converte usuários reais para o formato do card
  const mockUsernames = new Set(MOCK_DEVELOPERS.map((d) => d.username));
  const realEntries = realUsers
    .filter((u) => !mockUsernames.has(u.username)) // sem duplicatas com mocks
    .map((u, i) => {
      const isMe = u.username === profile.username;
      const uLvl = isMe ? lvl : calcLevel(0);
      return {
        id: -(i + 1),
        name: u.name,
        username: u.username,
        avatar: u.avatar || "🧑‍💻",
        avatarIsImage: !!u.avatar,
        avatarZoom: u.avatarZoom,
        bio: u.bio || "Desenvolvedor na plataforma GitStore.",
        xpTotal: isMe ? xpData.total : 0,
        level: uLvl.level,
        xp: uLvl.currentXp,
        maxXp: uLvl.nextXp,
        xpTitle: uLvl.title,
        stats: {
          projects: isMe ? userProjects : 0,
          contributions: isMe ? xpData.likesGiven : 0,
          followers: 0,
          stars: isMe ? xpData.likesReceived : 0,
        },
        skills: [u.experience, u.availability].filter(Boolean),
        badges: isMe ? [
          ...(userProjects >= 1  ? ["🚀"] : []),
          ...(userProjects >= 5  ? ["⭐"] : []),
          ...(xpData.total >= 500  ? ["🔥"] : []),
          ...(xpData.total >= 2000 ? ["💎"] : []),
        ] : [],
        isVerified: false,
        isTopContributor: isMe && xpData.total >= 1000,
        isCurrentUser: isMe,
      };
    });

  const userRank = isLoggedIn
    ? MOCK_DEVELOPERS.filter((d) => d.xpTotal > xpData.total).length + 1
    : null;

  // Ranking completo: mocks + usuários reais, ordenado por XP
  const ranked = [
    ...MOCK_DEVELOPERS.map((d) => ({ ...d, isCurrentUser: false, xpTitle: undefined })),
    ...realEntries,
  ]
    .sort((a, b) => b.xpTotal - a.xpTotal)
    .map((d, i) => ({ ...d, rank: i + 1 }));

  return (
    <div className="mt-6 space-y-8">
      {/* Banner pessoal — só o usuário logado vê */}
      {isLoggedIn && (
        <div className="relative overflow-hidden rounded-2xl border border-[#58a6ff]/20 bg-[linear-gradient(135deg,rgba(31,111,235,0.12),rgba(139,92,246,0.08))] p-5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(88,166,255,0.1),transparent_60%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#58a6ff]/30 bg-[#238636]">
                {profile.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover"
                    style={{ transform: `scale(${zoom / 100})` }} referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#e6edf3]">{profile.name}</p>
                  <span className="rounded-full bg-[#58a6ff]/15 px-2 py-0.5 text-[10px] font-bold text-[#58a6ff]">Você</span>
                  {userRank && (
                    <span className="rounded-full bg-[#d29922]/15 px-2 py-0.5 text-[10px] font-bold text-[#d29922]">
                      #{userRank} no ranking
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#7d8590]">@{profile.username} · Nível {lvl.level} · {lvl.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#21262d]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#1f6feb] to-[#8b5cf6] transition-all"
                      style={{ width: `${lvl.pct}%` }} />
                  </div>
                  <span className="text-xs text-[#7d8590]">{lvl.currentXp}/{lvl.nextXp} XP</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Projetos", value: userProjects, color: "#58a6ff" },
                  { label: "XP Total", value: xpData.total, color: "#3fb950" },
                  { label: "Curtidas", value: xpData.likesGiven, color: "#d29922" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-[#30363d] bg-[#0d1117]/60 px-3 py-2">
                    <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[10px] text-[#7d8590]">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/perfil"
                className="rounded-xl border border-[#58a6ff]/20 bg-[#58a6ff]/10 px-4 py-2 text-sm font-medium text-[#58a6ff] transition-all hover:bg-[#58a6ff]/20">
                Ver perfil →
              </Link>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 border-t border-[#30363d] pt-4 text-xs text-[#7d8590]">
            <span className="font-medium text-[#e6edf3]">Ganhe XP:</span>
            <span>📦 Publicar projeto <span className="text-[#3fb950]">+100</span></span>
            <span>❤️ Curtida recebida <span className="text-[#3fb950]">+10</span></span>
            <span>👍 Curtir projeto <span className="text-[#3fb950]">+2</span></span>
          </div>
        </div>
      )}

      {/* Ranking completo */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#d29922]">Ranking da comunidade</span>
          <div className="h-px flex-1 bg-[#30363d]" />
          {userRank && (
            <span className="text-xs text-[#7d8590]">
              Você está em <span className="font-semibold text-[#e6edf3]">#{userRank}</span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ranked.map((dev) => (
            <DeveloperCard key={`${dev.id}-${dev.username}`} developer={dev} showRank isCurrentUser={dev.isCurrentUser} />
          ))}
        </div>
      </div>
    </div>
  );
}
