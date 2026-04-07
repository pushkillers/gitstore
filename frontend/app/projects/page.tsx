"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { ProjectFilters } from "@/components/features/projects/ProjectFilters";
import { mockProjects } from "@/lib/data";
import { fetchProjects, PROJECTS_CHANGE_EVENT } from "@/lib/projects";
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

  const [allProjects, setAllProjects] = useState<Project[]>(mockProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const backendProjects = await fetchProjects();
      if (cancelled) return;
      // Merge: backend projects first, then mock projects not already present
      const ids = new Set(backendProjects.map((p: Project) => p.id));
      setAllProjects([...backendProjects, ...mockProjects.filter((p) => !ids.has(p.id))]);
      setLoading(false);
    };
    load();
    window.addEventListener(PROJECTS_CHANGE_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(PROJECTS_CHANGE_EVENT, load);
    };
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
      <div className="relative overflow-hidden border-b border-[#21262d] bg-[#0d1117] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(88,166,255,0.09),transparent)]" />

        <Container>
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
              Marketplace de Projetos
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3] md:text-5xl">
              Explore{" "}
              <span className="bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] bg-clip-text text-transparent">
                projetos incríveis
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Descubra templates, ferramentas e soluções prontas criadas pela comunidade
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              {[
                { label: "Projetos", value: allProjects.length.toString() },
                { label: "Downloads", value: `${(totalDownloads / 1000).toFixed(0)}k+` },
                { label: "Avaliação", value: `★ ${avgRating}` },
              ].map((s, i) => (
                <>
                  {i > 0 && <div key={`sep-${i}`} className="h-4 w-px bg-[#30363d]" />}
                  <div key={s.label} className="text-center">
                    <span className="font-bold text-[#e6edf3]">{s.value}</span>
                    <span className="ml-1.5 text-[#7d8590]">{s.label}</span>
                  </div>
                </>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-6">
          {/* Filters */}
          <div className="mb-5 rounded-xl border border-[#21262d] bg-[#161b22] p-4">
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
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#7d8590]">
              <span className="font-semibold text-[#e6edf3]">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "projeto" : "projetos"}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-1.5 text-xs text-[#c9d1d9] outline-none transition-colors hover:border-[#484f58] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Featured */}
          {!loading && featured.length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d29922]">Em destaque</span>
              </div>
              <ProjectGrid projects={featured} />
            </div>
          )}

          {/* All */}
          {!loading && regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7d8590]">Todos os projetos</span>
                </div>
              )}
              <ProjectGrid projects={regular} />
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] animate-pulse">
                  <div className="h-40 bg-[#21262d]" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3.5 w-3/4 rounded-full bg-[#21262d]" />
                    <div className="h-3 w-full rounded-full bg-[#21262d]" />
                    <div className="h-3 w-1/2 rounded-full bg-[#21262d]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
              <p className="text-3xl mb-3">🔍</p>
              <h3 className="text-base font-semibold text-[#e6edf3]">Nenhum projeto encontrado</h3>
              <p className="mt-1 text-sm text-[#7d8590]">Tente ajustar os filtros</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedLanguage(""); setSelectedCategory(""); setSelectedType("all"); }}
                className="mt-5 rounded-lg border border-[#30363d] px-4 py-2 text-sm text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
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
