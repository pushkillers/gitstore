"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/features/jobs/JobCard";
import { JobFilters } from "@/components/features/jobs/JobFilters";
import { CreateJobModal } from "@/components/features/jobs/CreateJobModal";
import { mockJobs } from "@/lib/data";
import { Briefcase, Plus, Search } from "lucide-react";

export default function JobsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  return (
    <div className="min-h-screen bg-github-canvas-default">
      {/* Hero Section */}
      <section className="relative py-16 border-b border-github-border-default overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-github-canvas-subtle to-github-canvas-default" />
        
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-github-accent-emphasis/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-github-accent-fg" />
              </div>
              <span className="text-github-accent-fg font-medium">Trabalhos Freelancer</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-github-fg-default mb-4">
              Encontre trabalhos ou {" "}
              <span className="text-gradient">publique uma vaga</span>
            </h1>
            
            <p className="text-xl text-github-fg-muted mb-8">
              Conecte-se com desenvolvedores talentosos para seus projetos ou encontre oportunidades freelance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Publicar Trabalho
              </Button>
              <Button size="lg" variant="secondary">
                <Search className="w-5 h-5 mr-2" />
                Buscar Oportunidades
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-8 border-b border-github-border-default">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "1.2k+", label: "Trabalhos Publicados" },
              { value: "850+", label: "Freelancers Ativos" },
              { value: "95%", label: "Taxa de Sucesso" },
              { value: "R$ 2M+", label: "Em Pagamentos" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-lg border border-github-border-default">
                <div className="text-2xl font-bold text-github-accent-fg">{stat.value}</div>
                <div className="text-sm text-github-fg-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Filters & List */}
      <section className="py-8">
        <Container>
          <JobFilters onFilterChange={setFilteredJobs} />
          
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-github-fg-default">
                Trabalhos Recentes
              </h2>
              <span className="text-github-fg-muted">
                {filteredJobs.length} encontrados
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Create Job Modal */}
      <CreateJobModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
