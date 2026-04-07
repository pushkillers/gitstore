"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

const DEVELOPER_CATEGORIES = ["Todos", "Top Contributors", "Verificados", "Novos", "Ativos"];

export function DeveloperFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  return (
    <div className="space-y-4">
      {/* Search Row */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
        <input
          type="text"
          placeholder="Buscar desenvolvedores por nome, username ou habilidades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] py-2.5 pl-10 pr-10 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Chips Row */}
      <div className="flex flex-wrap gap-2">
        {DEVELOPER_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
              selectedCategory === category
                ? "border-[#238636]/50 bg-[#238636] text-white"
                : "border-[#30363d] text-[#7d8590] hover:border-[#484f58] hover:text-[#e6edf3]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
