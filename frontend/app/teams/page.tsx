"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { TeamGrid } from "@/components/features/teams/TeamGrid";
import { TeamFilters } from "@/components/features/teams/TeamFilters";
import { CreateTeamModal } from "@/components/features/teams/CreateTeamModal";
import { Users } from "lucide-react";

export default function TeamsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] bg-[#0d1117] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,148,158,0.09),transparent)]" />
        <Container size="lg">
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Users className="h-3.5 w-3.5 text-[#8b949e]" />
              Equipes de desenvolvimento
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              Encontre seu{" "}
              <span className="bg-gradient-to-r from-[#e6edf3] to-[#c9d1d9] bg-clip-text text-transparent">
                time ideal
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Junte-se a equipes que compartilham sua stack e visão. Colabore em projetos reais e construa algo incrível juntos.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { label: "Equipes", value: "850+" },
                { label: "Membros", value: "3.2k+" },
                { label: "Projetos Ativos", value: "1.5k+" },
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
            <TeamFilters />
          </div>

          {/* Action bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              Explore equipes e encontre colaboradores
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar equipe
            </button>
          </div>

          <TeamGrid />
        </div>
      </Container>

      {/* Modal de criar equipe */}
      <CreateTeamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
