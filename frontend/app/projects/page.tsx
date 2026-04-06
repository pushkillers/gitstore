"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { ProjectFilters } from "@/components/features/projects/ProjectFilters";
import { mockProjects } from "@/lib/data";
import { getPublishedProjects, PROJECTS_CHANGE_EVENT } from "@/lib/projects";
import { Project } from "@/types";

const SORT_OPTIONS = [
  { value: "popular",  label: "Mais populares" },
  { value: "rating",   label: "Melhor avaliados" },
  { value: "recent",   label: "Mais recentes" },
  { value: "downloads",label: "Mais baixados" },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery]           = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType]         = useState("all");
  const [sortBy, setSortBy]                     = useState("popular");

  // Inicializa já com os dados para evitar flash de "0 projetos"
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    if (typeof window === "undefined") return mockProjects;
    try {
      const userProjects = getPublishedProjects();
      const ids = new Set(userProjects.map((p) => p.id));
      return [...userProjects, ...mockProjects.filter((p) => !ids.has(p.id))];
    } catch {
      return mockProjects;
    }
  });

  // Atualiza quando novos projetos são publicados
  useEffect(() => {
    const load = () => {
      const userProjects = getPublishedProjects();
      const ids = new Set(userProjects.map((p) => p.id));
      setAllProjects([...userProjects, ...mockProjects.filter((p) => !ids.has(p.id))]);
    };
    // Sincroniza no mount (caso o estado inicial tenha sido o fallback SSR)
    load();
    window.addEventListener(PROJECTS_CHANGE_EVENT, load);
    return () => window.removeEventListener(PROJECTS_CHANGE_EVENT, load);
  }, []);

  const filtered = allProjects
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
        (!selectedLanguage || p.language === selectedLanguage) &&
        (!selectedCategory || p.category === selectedCategory) &&
        (selectedType === "all" || p.type === selectedType)
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating")    return b.rating - a.rating;
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "recent")    return b.id - a.id;
      return b.downloads * b.rating - a.downloads * a.rating; // popular
    });

  const featured = filtered.filter((p) => p.featured);
  const regular  = filtered.filter((p) => !p.featured);

  const totalDownloads = allProjects.reduce((s, p) => s + p.downloads, 0);
  const avgRating = allProjects.length
    ? (allProjects.filter(p => p.rating > 0).reduce((s, p) => s + p.rating, 0) /
       allProjects.filter(p => p.rating > 0).length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#30363d] bg-[#0d1117] py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(88,166,255,0.12),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <Container>
          <div className="relative text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#58a6ff]/20 bg-[#58a6ff]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8ec2ff]">
              🚀 Marketplace de Projetos
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-[#e6edf3] md:text-6xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] bg-clip-text text-transparent">
                projetos incríveis
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-[#7d8590]">
              Descubra templates, ferramentas e soluções prontas criadas pela comunidade
            </p>

            {/* Stats */}
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-4">
              {[
                { label: "Projetos", value: allProjects.length.toString() },
                { label: "Downloads", value: `${(totalDownloads / 1000).toFixed(0)}k+` },
                { label: "Avaliação média", value: `⭐ ${avgRating}` },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-[#30363d] bg-[#161b22]/80 px-4 py-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-[#e6edf3]">{s.value}</p>
                  <p className="mt-1 text-xs text-[#7d8590]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-8">
          {/* Filters */}
          <div className="mb-6 rounded-2xl border border-[#30363d] bg-[#161b22] p-4">
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
          </div>

          {/* Results bar */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "projeto encontrado" : "projetos encontrados"}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#7d8590]">Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-sm text-[#e6edf3] outline-none focus:border-[#58a6ff] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured */}
          {featured.length > 0 && (
            <div className="mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d29922]/20 bg-[#d29922]/10 text-[#d29922]">⭐</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#d29922]">Em destaque</p>
                  <h2 className="text-xl font-bold text-[#e6edf3]">Projetos em Destaque</h2>
                </div>
              </div>
              <ProjectGrid projects={featured} />
            </div>
          )}

          {/* All */}
          {regular.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#58a6ff]/20 bg-[#58a6ff]/10 text-[#58a6ff]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#58a6ff]">Todos os projetos</p>
                  <h2 className="text-xl font-bold text-[#e6edf3]">Explorar catálogo</h2>
                </div>
              </div>
              <ProjectGrid projects={regular} />
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#30363d] py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#30363d] bg-[#161b22] text-4xl">🔍</div>
              <h3 className="text-xl font-semibold text-[#e6edf3]">Nenhum projeto encontrado</h3>
              <p className="mt-2 text-[#7d8590]">Tente ajustar os filtros ou buscar por outros termos</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedLanguage(""); setSelectedCategory(""); setSelectedType("all"); }}
                className="mt-6 rounded-xl border border-[#30363d] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
