import React from "react";
import { Container } from "@/components/layout/Container";
import { DeveloperGrid } from "@/components/features/developers/DeveloperGrid";
import { DeveloperFilters } from "@/components/features/developers/DeveloperFilters";
import { Trophy } from "lucide-react";

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] bg-[#0d1117] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,148,158,0.09),transparent)]" />
        <Container size="lg">
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Trophy className="h-3.5 w-3.5 text-[#8b949e]" />
              Ranking da comunidade
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              <span className="bg-gradient-to-r from-[#e6edf3] to-[#c9d1d9] bg-clip-text text-transparent">Ranking</span>{" "}
              de Desenvolvedores
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Conheça os devs mais ativos da comunidade. Publique projetos, curte e suba no ranking.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { label: "Desenvolvedores", value: "4.8k+" },
                { label: "Projetos", value: "12k+" },
                { label: "Contribuições", value: "★ 4.9" },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="h-4 w-px bg-[#30363d]" />}
                  <div className="text-center">
                    <span className="font-bold text-[#e6edf3]">{s.value}</span>
                    <span className="ml-1.5 text-[#7d8590]">{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container size="lg">
        <div className="py-6">
          {/* Filters */}
          <div className="mb-5 rounded-xl border border-[#21262d] bg-[#161b22] p-4">
            <DeveloperFilters />
          </div>

          {/* Action bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              Explore o ranking de desenvolvedores
            </p>
          </div>

          <DeveloperGrid />
        </div>
      </Container>
    </div>
  );
}
