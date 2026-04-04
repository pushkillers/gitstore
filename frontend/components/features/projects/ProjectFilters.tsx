"use client";

import { Input } from "@/components/ui/Input";
import { LANGUAGES, CATEGORIES, PROJECT_TYPES } from "@/constants";

interface ProjectFiltersProps {
  searchQuery: string;
  selectedLanguage: string;
  selectedCategory: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
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
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Buscar projetos por nome ou descrição..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>
      
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === "Todos" ? "" : category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${
                (category === "Todos" && !selectedCategory) || selectedCategory === category
                  ? "bg-[#238636] text-white shadow-lg shadow-green-900/30"
                  : "bg-[#21262d] text-[#7d8590] hover:bg-[#30363d] hover:text-[#e6edf3] border border-[#30363d]"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type filter */}
        <div className="relative flex-1">
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 pr-10 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/20 hover:border-[#484f58] transition-all cursor-pointer"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7d8590]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Language filter */}
        <div className="relative flex-1">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 pr-10 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/20 hover:border-[#484f58] transition-all cursor-pointer"
          >
            <option value="">Todas as linguagens</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7d8590]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
