"use client";

import { LANGUAGES, CATEGORIES, PROJECT_TYPES } from "@/constants";
import { X } from "lucide-react";

interface ProjectFiltersProps {
  searchQuery: string;
  selectedLanguage: string;
  selectedCategory: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClearFilters?: () => void;
}

export function ProjectFilters({
  searchQuery,
  selectedLanguage,
  selectedCategory,
  selectedType,
  onSearchChange,
  onLanguageChange,
  onCategoryChange,
  onTypeChange,
  onClearFilters,
}: ProjectFiltersProps) {
  const hasActiveFilters = searchQuery || selectedLanguage || selectedCategory || selectedType !== "all";

  const chipCls = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
      active
        ? "border-[#238636]/50 bg-[#238636] text-white shadow-sm"
        : "border-[#30363d] bg-[#0d1117] text-[#7d8590] hover:border-[#58a6ff]/40 hover:text-[#e6edf3]"
    }`;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar projetos por nome ou descrição..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-2.5 pl-10 pr-10 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all"
        />
        {searchQuery && (
          <button type="button" onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} type="button"
            onClick={() => onCategoryChange(cat === "Todos" ? "" : cat)}
            className={chipCls((cat === "Todos" && !selectedCategory) || selectedCategory === cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Type + Language chips */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#7d8590]">Tipo:</span>
          {PROJECT_TYPES.map((t) => (
            <button key={t.value} type="button"
              onClick={() => onTypeChange(t.value)}
              className={chipCls(selectedType === t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#7d8590]">Linguagem:</span>
          <button type="button"
            onClick={() => onLanguageChange("")}
            className={chipCls(!selectedLanguage)}>
            Todas
          </button>
          {LANGUAGES.map((lang) => (
            <button key={lang} type="button"
              onClick={() => onLanguageChange(lang)}
              className={chipCls(selectedLanguage === lang)}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasActiveFilters && onClearFilters && (
        <button type="button" onClick={onClearFilters}
          className="inline-flex items-center gap-1.5 text-xs text-[#f85149] hover:underline">
          <X className="h-3 w-3" />
          Limpar filtros
        </button>
      )}
    </div>
  );
}
