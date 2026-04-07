"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, PlayCircle, CheckCircle, Lock, Unlock, Clock, Users, Star,
  BookOpen, Award, ChevronDown, ChevronUp, Play, FileText, Download,
  MessageCircle, Heart, Share2, Check
} from "lucide-react";
import { toast } from "@/lib/utils/toast";
import { formatNumber } from "@/lib/utils/cn";

interface Module {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'project';
  locked: boolean;
  completed: boolean;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  instructor: {
    name: string;
    username: string;
    avatar: string;
    role: string;
    bio: string;
    students: number;
    courses: number;
  };
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount?: string;
  thumbnail: string;
  banner: string;
  tags: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  modules: Module[];
  includes: string[];
  lastUpdated: string;
}

const MOCK_COURSES: Record<string, Course> = {
  "1": {
    id: "1",
    title: "React Hooks Avançado: Do Zero ao Profissional",
    description: "Aprenda todos os hooks do React, incluindo custom hooks e padrões avançados de desenvolvimento.",
    fullDescription: "Este curso completo de React Hooks vai te levar do básico ao avançado. Você aprenderá useState, useEffect, useContext, useReducer, useMemo, useCallback e como criar seus próprios hooks personalizados. Com projetos práticos e exercícios reais, você estará pronto para qualquer desafio React.",
    instructor: {
      name: "Ana Silva",
      username: "anasilva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      role: "Senior Frontend Dev",
      bio: "Desenvolvedora frontend com 8+ anos de experiência. Já trabalhou em empresas como Nubank, Spotify e Netflix. Especialista em React, TypeScript e arquitetura frontend.",
      students: 15234,
      courses: 12
    },
    category: "Frontend",
    level: "Avançado",
    duration: "12h 30min",
    students: 1234,
    rating: 4.8,
    reviews: 328,
    price: 149.90,
    originalPrice: 299.90,
    discount: "50% OFF",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&h=1080&fit=crop",
    banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&h=1080&fit=crop",
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    whatYouWillLearn: [
      "Dominar todos os hooks nativos do React",
      "Criar custom hooks reutilizáveis",
      "Gerenciar estado complexo com useReducer",
      "Otimizar performance com useMemo e useCallback",
      "Integrar hooks com Context API",
      "Testar hooks com React Testing Library"
    ],
    requirements: [
      "Conhecimento básico de JavaScript",
      "Familiaridade com React fundamentals",
      "Node.js instalado na máquina"
    ],
    modules: [
      { id: 1, title: "Introdução aos Hooks", duration: "45min", type: "video", locked: false, completed: true, description: "O que são hooks e por que foram criados" },
      { id: 2, title: "useState em Profundidade", duration: "1h 15min", type: "video", locked: false, completed: false, description: "Tudo sobre gerenciamento de estado local" },
      { id: 3, title: "useEffect e Ciclo de Vida", duration: "1h 30min", type: "video", locked: true, completed: false, description: "Efeitos colaterais e cleanup" },
      { id: 4, title: "useContext para Estado Global", duration: "1h", type: "video", locked: true, completed: false, description: "Context API moderna" },
      { id: 5, title: "useReducer para Estados Complexos", duration: "1h 45min", type: "video", locked: true, completed: false, description: "Padrão reducer e actions" },
      { id: 6, title: "useMemo e useCallback", duration: "1h 20min", type: "video", locked: true, completed: false, description: "Otimização de performance" },
      { id: 7, title: "Custom Hooks", duration: "2h", type: "project", locked: true, completed: false, description: "Criando hooks reutilizáveis" },
      { id: 8, title: "Projeto Final", duration: "3h", type: "project", locked: true, completed: false, description: "Dashboard completo com hooks" },
    ],
    includes: [
      "12h 30min de conteúdo",
      "Certificado de conclusão",
      "Projetos práticos",
      "Suporte da comunidade",
      "Acesso vitalício",
      "Atualizações gratuitas"
    ],
    lastUpdated: "Dezembro 2024"
  },
  "2": {
    id: "2",
    title: "Node.js e Express: API RESTful Completa",
    description: "Construa APIs robustas e escaláveis com Node.js, Express e MongoDB.",
    fullDescription: "Aprenda a criar APIs profissionais do zero. Desde o básico do Node.js até padrões avançados de arquitetura, autenticação JWT, middlewares, e deploy na nuvem.",
    instructor: {
      name: "Carlos Mendes",
      username: "carlosmendes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      role: "Backend Architect",
      bio: "Arquiteto de software especializado em sistemas distribuídos. 10+ anos trabalhando com Node.js e microserviços. Ex-tech lead na Uber.",
      students: 23400,
      courses: 8
    },
    category: "Backend",
    level: "Intermediário",
    duration: "18h 45min",
    students: 856,
    rating: 4.9,
    reviews: 215,
    price: 199.90,
    originalPrice: 399.90,
    discount: "50% OFF",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920&h=1080&fit=crop",
    banner: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920&h=1080&fit=crop",
    tags: ["Node.js", "Express", "MongoDB", "API", "Backend"],
    whatYouWillLearn: [
      "Criar APIs RESTful completas",
      "Autenticação com JWT",
      "Middlewares e padrões de código",
      "Integração com MongoDB",
      "Testes automatizados",
      "Deploy na nuvem"
    ],
    requirements: [
      "JavaScript intermediário",
      "Noções de HTTP e APIs",
      "Terminal/linha de comando"
    ],
    modules: [
      { id: 1, title: "Fundamentos do Node.js", duration: "2h", type: "video", locked: false, completed: false },
      { id: 2, title: "Express Básico", duration: "2h 30min", type: "video", locked: true, completed: false },
      { id: 3, title: "Rotas e Controllers", duration: "3h", type: "video", locked: true, completed: false },
      { id: 4, title: "MongoDB e Mongoose", duration: "3h 30min", type: "video", locked: true, completed: false },
      { id: 5, title: "Autenticação JWT", duration: "2h 45min", type: "video", locked: true, completed: false },
      { id: 6, title: "Middlewares Avançados", duration: "2h", type: "video", locked: true, completed: false },
      { id: 7, title: "Testes com Jest", duration: "2h 30min", type: "video", locked: true, completed: false },
      { id: 8, title: "Deploy na AWS", duration: "1h 30min", type: "project", locked: true, completed: false },
    ],
    includes: [
      "18h 45min de conteúdo",
      "Certificado de conclusão",
      "Código fonte dos projetos",
      "Templates de APIs",
      "Acesso vitalício"
    ],
    lastUpdated: "Novembro 2024"
  }
};

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Iniciante:     { bg: "bg-[#3fb950]/15", text: "text-[#3fb950]", border: "border-[#3fb950]/25" },
  Intermediário: { bg: "bg-[#58a6ff]/15", text: "text-[#58a6ff]", border: "border-[#58a6ff]/25" },
  Avançado:      { bg: "bg-[#a371f7]/15", text: "text-[#a371f7]", border: "border-[#a371f7]/25" },
};

const MODULE_ICONS: Record<string, React.ReactNode> = {
  video: <PlayCircle className="h-5 w-5" />,
  text: <FileText className="h-5 w-5" />,
  quiz: <CheckCircle className="h-5 w-5" />,
  project: <Award className="h-5 w-5" />,
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'content' | 'info' | 'reviews'>('content');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundCourse = MOCK_COURSES[id] || null;
    setCourse(foundCourse);
    // Mock: curso 1 está comprado para demonstração
    setIsEnrolled(id === "1");
  }, [id]);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-[#e6edf3]">Curso não encontrado</h2>
          <Link href="/cursos" className="mt-4 inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Voltar aos cursos
          </Link>
        </div>
      </div>
    );
  }

  const levelStyle = LEVEL_COLORS[course.level];

  const handleEnroll = async () => {
    setIsProcessing(true);
    // Simula processamento de compra
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEnrolled(true);
    setIsProcessing(false);
    toast.success(`Bem-vindo ao curso! Acesso liberado 🎉`);
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleModuleClick = (module: Module) => {
    if (!isEnrolled && module.locked) {
      toast.info("Faça a compra do curso para acessar este módulo 🔒");
      return;
    }
    toast.success(`Abrindo: ${module.title} ▶️`);
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={course.banner}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f6feb]/30 to-[#8957e5]/30" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#2ea043]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
            {course.category} • {course.level}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            {/* Thumbnail */}
            <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-xl border-4 border-[#0d1117] shadow-2xl hidden lg:block">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <PlayCircle className="h-12 w-12 text-white/80" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#e6edf3] mb-3">
                {course.title}
              </h1>
              <p className="text-[#7d8590] max-w-3xl mb-4">{course.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-[#d29922]">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-[#e6edf3]">{course.rating}</span>
                  <span className="text-[#7d8590]">({course.reviews} avaliações)</span>
                </div>
                <div className="flex items-center gap-1 text-[#7d8590]">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(course.students)} alunos</span>
                </div>
                <div className="flex items-center gap-1 text-[#7d8590]">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-[#7d8590]">
                  <BookOpen className="h-4 w-4" />
                  <span>Atualizado {course.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="lg:text-right">
              {isEnrolled ? (
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3fb950]/30 bg-[#3fb950]/10 px-3 py-1 text-sm text-[#3fb950]">
                    <Check className="h-4 w-4" /> Acesso liberado
                  </span>
                  <button 
                    onClick={() => {
                      const firstUnlocked = course.modules.find(m => !m.locked);
                      if (firstUnlocked) toast.success(`Continuando: ${firstUnlocked.title}`);
                    }}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2ea043]"
                  >
                    <Play className="h-4 w-4" />
                    Continuar curso
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-start lg:items-end gap-2">
                  {course.discount && (
                    <span className="inline-flex items-center rounded-full bg-[#da3633]/20 px-2 py-0.5 text-xs font-semibold text-[#f85149]">
                      {course.discount}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    {course.originalPrice && (
                      <span className="text-lg text-[#7d8590] line-through">
                        R$ {course.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-[#e6edf3]">
                      R$ {course.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={isProcessing}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Comprar curso
                      </>
                    )}
                  </button>
                  <p className="text-xs text-[#7d8590]">Garantia de 7 dias ou seu dinheiro de volta</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-[#21262d] bg-[#161b22] p-1">
              {[
                { id: 'content', label: 'Conteúdo' },
                { id: 'info', label: 'Sobre' },
                { id: 'reviews', label: `Avaliações (${course.reviews})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#21262d] text-[#e6edf3]'
                      : 'text-[#7d8590] hover:text-[#e6edf3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#e6edf3]">
                      {isEnrolled ? 'Módulos do curso' : 'Prévia do conteúdo'}
                    </h3>
                    <span className="text-xs text-[#7d8590]">
                      {course.modules.filter(m => !m.locked).length} de {course.modules.length} liberados
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {course.modules.map((module, index) => (
                      <div
                        key={module.id}
                        className={`rounded-xl border ${
                          module.locked && !isEnrolled
                            ? 'border-[#21262d] bg-[#161b22]/50 opacity-70'
                            : 'border-[#21262d] bg-[#161b22]'
                        } overflow-hidden`}
                      >
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#21262d]/50"
                        >
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                            module.locked && !isEnrolled
                              ? 'bg-[#21262d] text-[#484f58]'
                              : module.completed
                                ? 'bg-[#3fb950]/20 text-[#3fb950]'
                                : 'bg-[#1f6feb]/20 text-[#58a6ff]'
                          }`}>
                            {module.locked && !isEnrolled ? (
                              <Lock className="h-5 w-5" />
                            ) : module.completed ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              MODULE_ICONS[module.type]
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#7d8590]">Módulo {index + 1}</span>
                              {module.completed && (
                                <span className="rounded-full bg-[#3fb950]/20 px-1.5 py-0.5 text-[10px] text-[#3fb950]">
                                  Concluído
                                </span>
                              )}
                            </div>
                            <p className={`font-medium truncate ${
                              module.locked && !isEnrolled ? 'text-[#7d8590]' : 'text-[#e6edf3]'
                            }`}>
                              {module.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#7d8590]">
                            <span className="hidden sm:inline">{module.duration}</span>
                            {expandedModules.includes(module.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </button>

                        {expandedModules.includes(module.id) && (
                          <div className="border-t border-[#21262d] px-4 py-3">
                            <p className="text-sm text-[#7d8590] mb-3">
                              {module.description || "Neste módulo você aprenderá os conceitos fundamentais e práticas recomendadas."}
                            </p>
                            <button
                              onClick={() => handleModuleClick(module)}
                              disabled={module.locked && !isEnrolled}
                              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                module.locked && !isEnrolled
                                  ? 'cursor-not-allowed bg-[#21262d] text-[#484f58]'
                                  : 'bg-[#238636] text-white hover:bg-[#2ea043]'
                              }`}
                            >
                              {module.locked && !isEnrolled ? (
                                <><Lock className="h-4 w-4" /> Bloqueado</>
                              ) : (
                                <><Play className="h-4 w-4" /> Assistir aula</>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isEnrolled && (
                    <div className="mt-6 rounded-xl border border-dashed border-[#30363d] bg-[#0d1117] p-6 text-center">
                      <Lock className="mx-auto mb-3 h-8 w-8 text-[#484f58]" />
                      <p className="mb-2 text-sm font-medium text-[#e6edf3]">
                        {course.modules.filter(m => m.locked).length} módulos bloqueados
                      </p>
                      <p className="mb-4 text-xs text-[#7d8590]">
                        Compre o curso para ter acesso a todo o conteúdo
                      </p>
                      <button
                        onClick={handleEnroll}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043]"
                      >
                        <BookOpen className="h-4 w-4" />
                        Desbloquear agora por R$ {course.price.toFixed(2)}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                {/* What you'll learn */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">O que você vai aprender</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.whatYouWillLearn.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3fb950]" />
                        <span className="text-sm text-[#8b949e]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Pré-requisitos</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#8b949e]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#7d8590]" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Includes */}
                <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                  <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">O curso inclui</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {course.includes.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-[#8b949e]">
                        <Check className="h-4 w-4 text-[#58a6ff]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
                <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Avaliações dos alunos</h3>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#21262d]">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#e6edf3]">{course.rating}</div>
                    <div className="flex items-center justify-center gap-0.5 my-1">
                      {[1,2,3,4,5].map(star => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= Math.round(course.rating) ? 'fill-[#d29922] text-[#d29922]' : 'text-[#484f58]'}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-[#7d8590]">{course.reviews} avaliações</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5,4,3,2,1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="w-3 text-xs text-[#7d8590]">{stars}</span>
                        <Star className="h-3 w-3 text-[#d29922]" />
                        <div className="flex-1 h-1.5 rounded-full bg-[#21262d] overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-[#d29922]"
                            style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs text-[#7d8590]">
                          {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-[#7d8590] text-center">
                  Avaliações verificadas de alunos matriculados
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            {/* Instructor */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Instrutor</h3>
              <Link
                href={`/perfil?user=${course.instructor.username}`}
                className="flex items-center gap-3 mb-4"
              >
                <div className="relative h-14 w-14">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#e6edf3]">{course.instructor.name}</p>
                  <p className="text-sm text-[#7d8590]">@{course.instructor.username}</p>
                </div>
              </Link>
              <p className="text-sm text-[#8b949e] mb-4">{course.instructor.bio}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-[#7d8590]">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(course.instructor.students)} alunos</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7d8590]">
                  <PlayCircle className="h-4 w-4" />
                  <span>{course.instructor.courses} cursos</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Compartilhar</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copiado!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] py-2.5 text-sm text-[#e6edf3] transition-all hover:bg-[#30363d]"
                >
                  <Share2 className="h-4 w-4" /> Copiar link
                </button>
                <button className="flex items-center justify-center rounded-lg border border-[#30363d] bg-[#21262d] px-3 text-[#e6edf3] transition-all hover:bg-[#30363d]">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isEnrolled && (
              <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10 p-5">
                <h3 className="mb-2 text-sm font-semibold text-[#3fb950]">Seu progresso</h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#7d8590]">{course.modules.filter(m => m.completed).length} de {course.modules.length} módulos</span>
                  <span className="text-[#e6edf3] font-medium">
                    {Math.round((course.modules.filter(m => m.completed).length / course.modules.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#21262d] overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#3fb950] transition-all"
                    style={{ width: `${(course.modules.filter(m => m.completed).length / course.modules.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16" />
    </div>
  );
}
