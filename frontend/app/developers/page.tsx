import { Container } from "@/components/layout/Container";
import { DeveloperGrid } from "@/components/features/developers/DeveloperGrid";
import { DeveloperFilters } from "@/components/features/developers/DeveloperFilters";
import { Trophy, Users, Zap, Star } from "lucide-react";

const stats = [
  { icon: Users,  value: "500+",  label: "Devs ativos",    color: "#58a6ff" },
  { icon: Trophy, value: "Top 3", label: "Ranqueados",      color: "#d29922" },
  { icon: Zap,    value: "10k+",  label: "XP distribuído",  color: "#3fb950" },
  { icon: Star,   value: "2k+",   label: "Curtidas dadas",  color: "#a371f7" },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(210,153,34,0.08),transparent)]" />
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Trophy className="h-3.5 w-3.5 text-[#d29922]" />
              Ranking da comunidade
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              <span className="bg-gradient-to-r from-[#d29922] to-[#f0b442] bg-clip-text text-transparent">Ranking</span>{" "}
              de Desenvolvedores
            </h1>
            <p className="max-w-lg text-sm text-[#7d8590]">
              Conheça os devs mais ativos da comunidade. Publique projetos, curta e suba no ranking.
            </p>
          </div>
        </Container>
      </div>

      {/* Stats */}
      <div className="border-b border-[#21262d]">
        <Container>
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

      <Container>
        <div className="py-6">
          <DeveloperFilters />
          <DeveloperGrid />
        </div>
      </Container>
    </div>
  );
}
