"use client";

import { LANGUAGES, CATEGORIES, PROJECT_TYPES } from "@/constants";
import { Search, X } from "lucide-react";

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
}: ProjectFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Selects Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
          <input
            type="text"
            placeholder="Buscar projetos por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2.5 pl-10 pr-10 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
        >
          <option value="">Todas linguagens</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Chips Row */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat === "Todos" ? "" : cat)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              (cat === "Todos" && !selectedCategory) || selectedCategory === cat
                ? "border-[#238636]/50 bg-[#238636] text-white"
                : "border-[#30363d] text-[#7d8590] hover:border-[#484f58] hover:text-[#e6edf3]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
