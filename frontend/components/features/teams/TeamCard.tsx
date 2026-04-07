"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { InviteMemberModal } from "./InviteMemberModal";

interface TeamMember { id: number; name: string; avatar: string; }
interface Team {
  id: number; name: string; description: string;
  logo: string; members: TeamMember[]; memberCount: number;
  projectCount: number; tags: string[]; isPublic: boolean; level: number;
  banner: string;
  joinType?: 'instant' | 'request';
}

const LEVEL_COLORS = [
  { min: 0,  max: 10, color: "#3fb950", label: "Iniciante" },
  { min: 10, max: 20, color: "#58a6ff", label: "Intermediário" },
  { min: 20, max: 30, color: "#d29922", label: "Avançado" },
  { min: 30, max: Infinity, color: "#a371f7", label: "Elite" },
];

export function TeamCard({ team }: { team: Team }) {
  const lvl = LEVEL_COLORS.find((l) => team.level >= l.min && team.level < l.max) ?? LEVEL_COLORS[0];
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleInviteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInviteModalOpen(true);
  };

  return (
    <>
      <Link href={`/teams/${team.id}`}>
        <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#30363d] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={team.banner} 
          alt={team.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb]/40 to-[#8957e5]/30" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(88,166,255,0.1) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(88,166,255,0.2),transparent_70%)]" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-1.5 z-20">
          {/* Botão de ações rápidas - Convidar membro */}
          <button
            onClick={handleInviteClick}
            className="pointer-events-auto rounded-full border border-[#58a6ff]/25 bg-[#0d1117]/85 p-1.5 text-[#58a6ff] backdrop-blur-sm transition-all hover:bg-[#58a6ff]/10 hover:scale-110"
            title="Convidar membro"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5 z-10">
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm"
            style={{ color: lvl.color, borderColor: `${lvl.color}25`, backgroundColor: `${lvl.color}10` }}
          >
            Nível {team.level}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
            team.isPublic
              ? "border-[#3fb950]/25 bg-[#3fb950]/10 text-[#3fb950]"
              : "border-[#484f58]/25 bg-[#21262d] text-[#7d8590]"
          }`}>
            {team.isPublic ? "Pública" : "Privada"}
          </span>
        </div>

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/8 bg-[#0d1117]/80 text-3xl backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
            {team.logo}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 text-sm font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
          {team.name}
        </h3>

        <div className="mb-3 flex items-center gap-3 text-[11px] text-[#484f58]">
          <span>{team.memberCount} membros</span>
          <span>·</span>
          <span>{team.projectCount} projetos</span>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-xs leading-5 text-[#7d8590]">{team.description}</p>

        {/* Members */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {team.members.slice(0, 5).map((m) => (
              <div
                key={m.id}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#161b22] bg-gradient-to-br from-[#388bfd] to-[#8957e5] text-[9px] font-bold text-white"
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
          </div>
          {team.memberCount > 5 && (
            <span className="text-[10px] text-[#484f58]">+{team.memberCount - 5}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {team.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
              {tag}
            </span>
          ))}
          {team.tags.length > 3 && (
            <span className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
              +{team.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[#21262d] px-5 py-3">
        {team.joinType === 'instant' || (team.isPublic && team.joinType !== 'request') ? (
          <button className="w-full rounded-lg bg-[#238636] py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#2ea043]">
            Entrar na equipe
          </button>
        ) : (
          <button className="w-full rounded-lg border border-[#388bfd]/40 bg-[#388bfd]/10 py-1.5 text-xs font-semibold text-[#58a6ff] transition-all hover:bg-[#388bfd]/20">
            Solicitar entrada
          </button>
        )}
      </div>
      </article>
    </Link>

    {/* Modal de convite */}
    <InviteMemberModal
      open={inviteModalOpen}
      onClose={() => setInviteModalOpen(false)}
      teamName={team.name}
      teamId={team.id}
    />
    </>
  );
}
