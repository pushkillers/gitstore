"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { JobCard } from "@/components/features/jobs/JobCard";
import { JobFilters } from "@/components/features/jobs/JobFilters";
import { CreateJobModal } from "@/components/features/jobs/CreateJobModal";
import { mockJobs } from "@/lib/data";
import { Briefcase, Plus, TrendingUp } from "lucide-react";

export default function JobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] bg-[#0d1117] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(139,148,158,0.09),transparent)]" />
        <Container size="lg">
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Briefcase className="h-3.5 w-3.5 text-[#8b949e]" />
              Trabalhos Freelancer
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              Encontre trabalhos ou{" "}
              <span className="bg-gradient-to-r from-[#e6edf3] to-[#c9d1d9] bg-clip-text text-transparent">
                publique uma vaga
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Conecte-se com desenvolvedores talentosos ou encontre oportunidades freelance alinhadas com sua stack
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { label: "Vagas Ativas", value: "240+" },
                { label: "Freelancers", value: "2.1k+" },
                { label: "Projetos Concluídos", value: "890+" },
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

      {/* Content */}
      <Container size="lg">
        <div className="py-6">
          {/* Filters */}
          <div className="mb-5 rounded-xl border border-[#21262d] bg-[#161b22] p-4">
            <JobFilters onFilterChange={setFilteredJobs} />
          </div>

          {/* Action bar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">{filteredJobs.length}</span>{" "}
              {filteredJobs.length === 1 ? "vaga" : "vagas"}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]"
            >
              <Plus className="h-4 w-4" />
              Publicar vaga
            </button>
          </div>

          <div className="mb-4 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#484f58]">
              <TrendingUp className="h-3.5 w-3.5" />
              Atualizado agora
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
              <p className="text-3xl mb-3">💼</p>
              <h3 className="text-base font-semibold text-[#e6edf3]">Nenhuma vaga encontrada</h3>
              <p className="mt-1 text-sm text-[#7d8590]">Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </Container>

      <CreateJobModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
