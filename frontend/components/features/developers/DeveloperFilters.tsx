"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";

const DEVELOPER_CATEGORIES = ["Todos", "Top Contributors", "Verificados", "Novos", "Ativos"];

const DEVELOPER_SORT_OPTIONS = [
  { value: "rank", label: "Ranking" },
  { value: "xp", label: "XP" },
  { value: "projects", label: "Projetos" },
  { value: "contributions", label: "Contribuições" },
  { value: "followers", label: "Seguidores" },
];

export function DeveloperFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("rank");

  return (
    <div className="space-y-4 mb-8">
      {/* Search */}
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Buscar desenvolvedores por nome, username ou habilidades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>
      
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {DEVELOPER_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${
                selectedCategory === category
                  ? "bg-[#238636] text-white shadow-lg shadow-green-900/30"
                  : "bg-[#21262d] text-[#7d8590] hover:bg-[#30363d] hover:text-[#e6edf3] border border-[#30363d]"
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Sort filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 pr-10 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] focus:border-[#58a6ff] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/20 hover:border-[#484f58] transition-all cursor-pointer"
          >
            {DEVELOPER_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Ordenar por: {option.label}
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
