import { Container } from "@/components/layout/Container";
import { TeamGrid } from "@/components/features/teams/TeamGrid";
import { TeamFilters } from "@/components/features/teams/TeamFilters";
import { Users, Globe, Zap, Trophy } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Users,  value: "150+",  label: "Equipes ativas",    color: "#58a6ff" },
  { icon: Globe,  value: "80%",   label: "Equipes públicas",  color: "#3fb950" },
  { icon: Zap,    value: "600+",  label: "Projetos em andamento", color: "#d29922" },
  { icon: Trophy, value: "Nível 25", label: "Equipe top",     color: "#a371f7" },
];

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(88,166,255,0.07),transparent)]" />
        <Container size="lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Users className="h-3.5 w-3.5" />
              Equipes de desenvolvimento
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              Encontre seu{" "}
              <span className="bg-gradient-to-r from-[#58a6ff] to-[#a371f7] bg-clip-text text-transparent">
                time ideal
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Junte-se a equipes que compartilham sua stack e visão. Colabore em projetos reais e construa algo incrível juntos.
            </p>
            <Link
              href="/publish"
              className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar equipe
            </Link>
          </div>
        </Container>
      </div>

      {/* Stats */}
      <div className="border-b border-[#21262d]">
        <Container size="lg">
          <div className="grid grid-cols-2 divide-x divide-y divide-[#21262d] md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 py-5">
                <s.icon className="h-5 w-5 flex-shrink-0" style={{ color: s.color }} />
                <div>
                  <p className="text-lg font-bold text-[#e6edf3]">{s.value}</p>
                  <p className="text-xs text-[#7d8590]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container size="lg">
        <div className="py-6">
          <TeamFilters />
          <TeamGrid />
        </div>
      </Container>
    </div>
  );
}
