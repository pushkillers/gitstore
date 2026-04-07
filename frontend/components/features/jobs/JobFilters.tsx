"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

const JOB_CATEGORIES = [
  "Todos",
  "Desenvolvimento Web",
  "Mobile",
  "UI/UX Design",
  "DevOps",
  "Inteligência Artificial",
  "Consultoria",
  "QA/Testes",
];

const EXPERIENCE_LEVELS = [
  { value: "all", label: "Todos níveis" },
  { value: "junior", label: "Júnior" },
  { value: "mid", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "expert", label: "Especialista" },
];

const BUDGET_TYPES = [
  { value: "all", label: "Todos tipos" },
  { value: "fixed", label: "Valor Fixo" },
  { value: "hourly", label: "Por Hora" },
  { value: "range", label: "Faixa de Preço" },
];

interface JobFiltersProps {
  onFilterChange: (jobs: any[]) => void;
}

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [budgetType, setBudgetType] = useState("all");

  return (
    <div className="space-y-4">
      {/* Search and Selects */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8590]" />
          <input
            type="text"
            placeholder="Buscar trabalhos por título, descrição ou habilidades..."
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

        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
        >
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>

        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          className="rounded-lg border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
        >
          {BUDGET_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {JOB_CATEGORIES.map((category) => (
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
