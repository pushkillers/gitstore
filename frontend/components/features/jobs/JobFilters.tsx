"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Search, SlidersHorizontal } from "lucide-react";

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
      {/* Search and Main Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar trabalhos por título, descrição ou habilidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="px-4 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
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
            className="px-4 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
          >
            {BUDGET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {JOB_CATEGORIES.map((category) => (
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
    </div>
  );
}
