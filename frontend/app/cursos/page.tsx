"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  Star, 
  Clock, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Plus
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    role: string;
  };
  thumbnail: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  type: "video" | "article" | "tutorial" | "workshop";
  duration: string;
  students: number;
  rating: number;
  price: "free" | "paid";
  tags: string[];
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "React Hooks Avançado: Do Zero ao Profissional",
    description: "Aprenda todos os hooks do React, incluindo custom hooks e padrões avançados de desenvolvimento.",
    instructor: {
      name: "Ana Silva",
      avatar: "AS",
      role: "Senior Frontend Developer"
    },
    thumbnail: "react",
    category: "Frontend",
    level: "Avançado",
    type: "video",
    duration: "8h 30min",
    students: 1234,
    rating: 4.8,
    price: "free",
    tags: ["React", "Hooks", "JavaScript", "Frontend"]
  },
  {
    id: "2",
    title: "Node.js e Express: API RESTful Completa",
    description: "Construa APIs robustas e escaláveis com Node.js, Express e MongoDB.",
    instructor: {
      name: "Carlos Mendes",
      avatar: "CM",
      role: "Backend Architect"
    },
    thumbnail: "nodejs",
    category: "Backend",
    level: "Intermediário",
    type: "tutorial",
    duration: "12h",
    students: 856,
    rating: 4.9,
    price: "paid",
    tags: ["Node.js", "Express", "MongoDB", "API"]
  },
  {
    id: "3",
    title: "TypeScript: Tipagem Forte para JavaScript",
    description: "Domine TypeScript e escreva código mais seguro e manutenível.",
    instructor: {
      name: "Maria Santos",
      avatar: "MS",
      role: "Full Stack Developer"
    },
    thumbnail: "typescript",
    category: "Linguagens",
    level: "Iniciante",
    type: "article",
    duration: "4h",
    students: 2103,
    rating: 4.7,
    price: "free",
    tags: ["TypeScript", "JavaScript", "Tipos"]
  },
  {
    id: "4",
    title: "Docker e Kubernetes na Prática",
    description: "Aprenda a containerizar aplicações e orquestrar com Kubernetes.",
    instructor: {
      name: "Pedro Costa",
      avatar: "PC",
      role: "DevOps Engineer"
    },
    thumbnail: "docker",
    category: "DevOps",
    level: "Avançado",
    type: "workshop",
    duration: "6h",
    students: 645,
    rating: 4.9,
    price: "paid",
    tags: ["Docker", "Kubernetes", "DevOps", "Containers"]
  },
  {
    id: "5",
    title: "Design Patterns em JavaScript",
    description: "Padrões de projeto essenciais para desenvolvedores JavaScript modernos.",
    instructor: {
      name: "Julia Oliveira",
      avatar: "JO",
      role: "Software Architect"
    },
    thumbnail: "patterns",
    category: "Arquitetura",
    level: "Intermediário",
    type: "video",
    duration: "10h",
    students: 1567,
    rating: 4.8,
    price: "free",
    tags: ["Design Patterns", "JavaScript", "Arquitetura"]
  },
  {
    id: "6",
    title: "Next.js 15: SSR e SSG Completo",
    description: "Domine Server-Side Rendering e Static Site Generation com Next.js 15.",
    instructor: {
      name: "Roberto Lima",
      avatar: "RL",
      role: "Frontend Lead"
    },
    thumbnail: "nextjs",
    category: "Frontend",
    level: "Intermediário",
    type: "tutorial",
    duration: "7h 45min",
    students: 923,
    rating: 4.9,
    price: "paid",
    tags: ["Next.js", "React", "SSR", "SSG"]
  }
];

const categories = ["Todos", "Frontend", "Backend", "DevOps", "Linguagens", "Arquitetura", "Mobile"];
const levels = ["Todos", "Iniciante", "Intermediário", "Avançado"];
const types = [
  { id: "all", label: "Todos", icon: BookOpen },
  { id: "video", label: "Vídeos", icon: Video },
  { id: "article", label: "Artigos", icon: FileText },
  { id: "tutorial", label: "Tutoriais", icon: Code }
];

export default function CursosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = mockCourses.filter(course => {
    const matchesCategory = selectedCategory === "Todos" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "Todos" || course.level === selectedLevel;
    const matchesType = selectedType === "all" || course.type === selectedType;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesLevel && matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="w-4 h-4" />;
      case "article": return <FileText className="w-4 h-4" />;
      case "tutorial": return <Code className="w-4 h-4" />;
      case "workshop": return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Iniciante": return "bg-[#238636]/10 text-[#3fb950] border-[#238636]/20";
      case "Intermediário": return "bg-[#1f6feb]/10 text-[#58a6ff] border-[#1f6feb]/20";
      case "Avançado": return "bg-[#8957e5]/10 text-[#a371f7] border-[#8957e5]/20";
      default: return "bg-[#6e7681]/10 text-[#7d8590] border-[#6e7681]/20";
    }
  };

  return (
    <div className="py-8">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-gradient">Cursos</span>
          </h1>
          <p className="text-lg text-[#7d8590]">
            Compartilhe e aprenda com a comunidade de desenvolvedores
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Search and Main Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7d8590]" />
                <input
                  type="text"
                  placeholder="Buscar cursos, tutoriais, artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] placeholder:text-[#7d8590] focus:outline-none focus:border-[#58a6ff] transition-all"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] cursor-pointer"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Type Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? "bg-[#238636] text-white shadow-lg shadow-green-900/30"
                    : "bg-[#21262d] text-[#7d8590] hover:bg-[#30363d] hover:text-[#e6edf3] border border-[#30363d]"
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count and Sort */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#7d8590]">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all font-medium">
              <Plus className="w-4 h-4" />
              Publicar Curso
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#7d8590]">Ordenar por:</span>
              <select className="px-3 py-1.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:border-[#58a6ff] outline-none cursor-pointer">
                <option>Mais populares</option>
                <option>Melhor avaliados</option>
                <option>Mais recentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden hover:border-[#58a6ff] transition-all group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-[#1f6feb] to-[#8957e5] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {getTypeIcon(course.type)}
                  <span className="ml-2 text-white font-bold text-4xl opacity-20">
                    {course.thumbnail.toUpperCase()}
                  </span>
                </div>
                {course.price === "free" && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#238636] text-white text-xs font-bold rounded-full">
                    GRÁTIS
                  </div>
                )}
                <div className={`absolute top-3 left-3 px-3 py-1 border rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs text-[#7d8590]">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#7d8590]">
                    {getTypeIcon(course.type)}
                    <span className="capitalize">{course.type}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#e6edf3] mb-2 group-hover:text-[#58a6ff] transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-[#7d8590] mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#30363d]">
                  <div className="w-10 h-10 rounded-full bg-[#1f6feb] flex items-center justify-center text-white font-bold text-sm">
                    {course.instructor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e6edf3] truncate">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-[#7d8590] truncate">
                      {course.instructor.role}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[#7d8590]">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#7d8590]">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#d29922]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {course.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#0d1117] text-[#7d8590] text-xs rounded border border-[#30363d]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-[#7d8590] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#e6edf3] mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-[#7d8590] mb-6">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSelectedLevel("Todos");
                setSelectedType("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-all"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
