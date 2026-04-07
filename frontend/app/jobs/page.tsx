"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { JobCard } from "@/components/features/jobs/JobCard";
import { JobFilters } from "@/components/features/jobs/JobFilters";
import { CreateJobModal } from "@/components/features/jobs/CreateJobModal";
import { mockJobs } from "@/lib/data";
import { Briefcase, Plus, TrendingUp, Users, CheckCircle, DollarSign } from "lucide-react";

const stats = [
  { icon: Briefcase,    value: "1.2k+", label: "Vagas publicadas",  color: "#58a6ff" },
  { icon: Users,        value: "850+",  label: "Freelancers ativos", color: "#3fb950" },
  { icon: CheckCircle,  value: "95%",   label: "Taxa de sucesso",    color: "#d29922" },
  { icon: DollarSign,   value: "R$2M+", label: "Em pagamentos",      color: "#a371f7" },
];

export default function JobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(88,166,255,0.08),transparent)]" />
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <Briefcase className="h-3.5 w-3.5" />
              Trabalhos Freelancer
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              Encontre trabalhos ou{" "}
              <span className="bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
                publique uma vaga
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Conecte-se com desenvolvedores talentosos ou encontre oportunidades freelance alinhadas com sua stack
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]"
            >
              <Plus className="h-4 w-4" />
              Publicar vaga
            </button>
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

      {/* Content */}
      <Container>
        <div className="py-6">
          <JobFilters onFilterChange={setFilteredJobs} />

          <div className="mt-6 mb-4 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">{filteredJobs.length}</span>{" "}
              {filteredJobs.length === 1 ? "vaga" : "vagas"}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#484f58]">
              <TrendingUp className="h-3.5 w-3.5" />
              Atualizado agora
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
