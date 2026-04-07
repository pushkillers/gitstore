"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { BookOpen, Video, FileText, Code, Star, Clock, Users, Search, Plus } from "lucide-react";

interface Course {
  id: string; title: string; description: string;
  instructor: { name: string; avatar: string; role: string };
  category: string; level: "Iniciante" | "Intermediário" | "Avançado";
  type: "video" | "article" | "tutorial" | "workshop";
  duration: string; students: number; rating: number;
  price: "free" | "paid"; tags: string[];
  color: string;
}

const COURSES: Course[] = [
  { id:"1", title:"React Hooks Avançado: Do Zero ao Profissional", description:"Aprenda todos os hooks do React, incluindo custom hooks e padrões avançados de desenvolvimento.", instructor:{name:"Ana Silva",avatar:"AS",role:"Senior Frontend Dev"}, category:"Frontend", level:"Avançado", type:"video", duration:"8h 30min", students:1234, rating:4.8, price:"free", tags:["React","Hooks","JavaScript"], color:"#61dafb" },
  { id:"2", title:"Node.js e Express: API RESTful Completa", description:"Construa APIs robustas e escaláveis com Node.js, Express e MongoDB.", instructor:{name:"Carlos Mendes",avatar:"CM",role:"Backend Architect"}, category:"Backend", level:"Intermediário", type:"tutorial", duration:"12h", students:856, rating:4.9, price:"paid", tags:["Node.js","Express","MongoDB"], color:"#3fb950" },
  { id:"3", title:"TypeScript: Tipagem Forte para JavaScript", description:"Domine TypeScript e escreva código mais seguro e manutenível.", instructor:{name:"Maria Santos",avatar:"MS",role:"Full Stack Dev"}, category:"Linguagens", level:"Iniciante", type:"article", duration:"4h", students:2103, rating:4.7, price:"free", tags:["TypeScript","JavaScript"], color:"#3178c6" },
  { id:"4", title:"Docker e Kubernetes na Prática", description:"Aprenda a containerizar aplicações e orquestrar com Kubernetes.", instructor:{name:"Pedro Costa",avatar:"PC",role:"DevOps Engineer"}, category:"DevOps", level:"Avançado", type:"workshop", duration:"6h", students:645, rating:4.9, price:"paid", tags:["Docker","Kubernetes","DevOps"], color:"#2496ed" },
  { id:"5", title:"Design Patterns em JavaScript", description:"Padrões de projeto essenciais para desenvolvedores JavaScript modernos.", instructor:{name:"Julia Oliveira",avatar:"JO",role:"Software Architect"}, category:"Arquitetura", level:"Intermediário", type:"video", duration:"10h", students:1567, rating:4.8, price:"free", tags:["Design Patterns","JavaScript"], color:"#f1e05a" },
  { id:"6", title:"Next.js 15: SSR e SSG Completo", description:"Domine Server-Side Rendering e Static Site Generation com Next.js 15.", instructor:{name:"Roberto Lima",avatar:"RL",role:"Frontend Lead"}, category:"Frontend", level:"Intermediário", type:"tutorial", duration:"7h 45min", students:923, rating:4.9, price:"paid", tags:["Next.js","React","SSR"], color:"#e6edf3" },
];

const CATEGORIES = ["Todos","Frontend","Backend","DevOps","Linguagens","Arquitetura","Mobile"];
const LEVELS = ["Todos","Iniciante","Intermediário","Avançado"];
const TYPES = [
  { id:"all",      label:"Todos",     Icon:BookOpen },
  { id:"video",    label:"Vídeos",    Icon:Video },
  { id:"article",  label:"Artigos",   Icon:FileText },
  { id:"tutorial", label:"Tutoriais", Icon:Code },
];

const LEVEL_STYLES: Record<string, string> = {
  Iniciante:     "text-[#3fb950] border-[#3fb950]/20 bg-[#3fb950]/8",
  Intermediário: "text-[#58a6ff] border-[#58a6ff]/20 bg-[#58a6ff]/8",
  Avançado:      "text-[#a371f7] border-[#a371f7]/20 bg-[#a371f7]/8",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video:    <Video className="h-3.5 w-3.5" />,
  article:  <FileText className="h-3.5 w-3.5" />,
  tutorial: <Code className="h-3.5 w-3.5" />,
  workshop: <Users className="h-3.5 w-3.5" />,
};

export default function CursosPage() {
  const [category, setCategory] = useState("Todos");
  const [level, setLevel] = useState("Todos");
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");

  const filtered = COURSES.filter((c) => {
    const matchCat  = category === "Todos" || c.category === category;
    const matchLvl  = level === "Todos" || c.level === level;
    const matchType = type === "all" || c.type === type;
    const matchQ    = !q || c.title.toLowerCase().includes(q.toLowerCase()) || c.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
    return matchCat && matchLvl && matchType && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#21262d] py-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(163,113,247,0.07),transparent)]" />
        <Container size="lg">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3.5 py-1.5 text-xs font-medium text-[#8b949e]">
              <BookOpen className="h-3.5 w-3.5" />
              Aprenda com a comunidade
            </div>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-[#e6edf3]">
              Cursos e{" "}
              <span className="bg-gradient-to-r from-[#a371f7] to-[#58a6ff] bg-clip-text text-transparent">
                tutoriais
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-sm text-[#7d8590]">
              Conteúdo criado por devs para devs. Aprenda na prática com quem está no mercado.
            </p>
          </div>
        </Container>
      </div>

      <Container size="lg">
        <div className="py-6">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#484f58]" />
                <input
                  type="text"
                  placeholder="Buscar cursos, tutoriais..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-lg border border-[#30363d] bg-[#161b22] py-2.5 pl-9 pr-4 text-sm text-[#e6edf3] outline-none placeholder:text-[#484f58] focus:border-[#388bfd] transition-colors"
                />
              </div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
              >
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-[#30363d] bg-[#161b22] px-3 py-2.5 text-sm text-[#c9d1d9] outline-none cursor-pointer hover:border-[#484f58] transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {TYPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setType(id)}
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    type === id
                      ? "border-[#388bfd]/40 bg-[#388bfd]/10 text-[#58a6ff]"
                      : "border-[#30363d] text-[#7d8590] hover:border-[#484f58] hover:text-[#c9d1d9]",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-[#484f58]">{filtered.length} cursos</span>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#238636] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#2ea043]">
                  <Plus className="h-3.5 w-3.5" />
                  Publicar
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((course) => (
                <article
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#30363d] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-36 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${course.color}12, ${course.color}05)` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle, ${course.color}15 1px, transparent 1px)`,
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-[#0d1117]/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105"
                        style={{ color: course.color }}
                      >
                        {TYPE_ICONS[course.type]}
                      </div>
                    </div>
                    <div className="absolute left-3 top-3">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${LEVEL_STYLES[course.level]}`}>
                        {course.level}
                      </span>
                    </div>
                    {course.price === "free" && (
                      <div className="absolute right-3 top-3">
                        <span className="rounded-full border border-[#3fb950]/25 bg-[#0d1117]/85 px-2 py-0.5 text-[10px] font-semibold text-[#3fb950] backdrop-blur-sm">
                          Grátis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2 text-[10px] text-[#484f58]">
                      <span className="rounded border border-[#21262d] px-1.5 py-0.5">{course.category}</span>
                      <span className="inline-flex items-center gap-1">{TYPE_ICONS[course.type]}{course.type}</span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
                      {course.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-xs leading-5 text-[#7d8590]">{course.description}</p>

                    {/* Instructor */}
                    <div className="mb-4 flex items-center gap-2.5 border-t border-[#21262d] pt-4">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.instructor.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-[#e6edf3]">{course.instructor.name}</p>
                        <p className="truncate text-[10px] text-[#484f58]">{course.instructor.role}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-[11px] text-[#484f58]">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{course.students.toLocaleString()}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#d29922]">
                        <Star className="h-3 w-3 fill-current" />{course.rating}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#30363d]" />
              <h3 className="text-sm font-semibold text-[#e6edf3]">Nenhum curso encontrado</h3>
              <p className="mt-1 text-xs text-[#7d8590]">Tente ajustar os filtros</p>
              <button
                onClick={() => { setCategory("Todos"); setLevel("Todos"); setType("all"); setQ(""); }}
                className="mt-4 rounded-lg border border-[#30363d] px-4 py-2 text-xs text-[#c9d1d9] transition-colors hover:border-[#484f58]"
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
