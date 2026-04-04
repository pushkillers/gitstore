"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { ProjectFilters } from "@/components/features/projects/ProjectFilters";
import { mockProjects } from "@/lib/data";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      !selectedLanguage || project.language === selectedLanguage;
    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;
    const matchesType =
      selectedType === "all" || project.type === selectedType;
    return matchesSearch && matchesLanguage && matchesCategory && matchesType;
  });

  // Separate featured projects
  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <div className="py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-gradient">Explorar</span> Projetos
          </h1>
          <p className="text-lg text-[#7d8590]">
            Descubra projetos open source, templates premium e soluções prontas
          </p>
        </div>
        
        {/* Filters */}
        <ProjectFilters
          searchQuery={searchQuery}
          selectedLanguage={selectedLanguage}
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onSearchChange={setSearchQuery}
          onLanguageChange={setSelectedLanguage}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />
        
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#7d8590]">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#7d8590]">Ordenar por:</span>
            <select className="px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:border-[#58a6ff] outline-none cursor-pointer">
              <option>Mais populares</option>
              <option>Melhor avaliados</option>
              <option>Mais recentes</option>
              <option>Mais baixados</option>
            </select>
          </div>
        </div>
        
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-[#d29922]" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              <h2 className="text-2xl font-bold">Projetos em Destaque</h2>
            </div>
            <ProjectGrid projects={featuredProjects} />
          </div>
        )}
        
        {/* Regular Projects */}
        {regularProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Todos os Projetos</h2>
            <ProjectGrid projects={regularProjects} />
          </div>
        )}
        
        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-[#7d8590]">Tente ajustar os filtros ou buscar por outros termos</p>
          </div>
        )}
      </Container>
    </div>
  );
}
