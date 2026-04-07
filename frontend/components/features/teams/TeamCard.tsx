"use client";

interface TeamMember { id: number; name: string; avatar: string; }
interface Team {
  id: number; name: string; description: string;
  logo: string; members: TeamMember[]; memberCount: number;
  projectCount: number; tags: string[]; isPublic: boolean; level: number;
}

const LEVEL_COLORS = [
  { min: 0,  max: 10, color: "#3fb950", label: "Iniciante" },
  { min: 10, max: 20, color: "#58a6ff", label: "Intermediário" },
  { min: 20, max: 30, color: "#d29922", label: "Avançado" },
  { min: 30, max: Infinity, color: "#a371f7", label: "Elite" },
];

export function TeamCard({ team }: { team: Team }) {
  const lvl = LEVEL_COLORS.find((l) => team.level >= l.min && team.level < l.max) ?? LEVEL_COLORS[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#30363d] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
      {/* Banner */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#1f6feb]/15 to-[#8957e5]/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(88,166,255,0.08) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(88,166,255,0.1),transparent_70%)]" />

        {/* Badges */}
        <div className="absolute right-3 top-3 flex gap-1.5">
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
      <div className="flex flex-1 flex-col p-5">
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
        <button className="w-full rounded-lg border border-[#30363d] py-1.5 text-xs font-medium text-[#7d8590] transition-all hover:border-[#388bfd]/40 hover:text-[#58a6ff]">
          {team.isPublic ? "Solicitar entrada" : "Ver detalhes"}
        </button>
      </div>
    </article>
  );
}
