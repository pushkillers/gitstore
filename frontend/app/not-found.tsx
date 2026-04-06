"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useState } from "react";

// Partículas flutuantes em CSS - posições predefinidas para evitar hydration error
const PARTICLES = [
  { left: 10, top: 20, delay: 0, duration: 4 },
  { left: 85, top: 15, delay: 1, duration: 5 },
  { left: 70, top: 80, delay: 2, duration: 3 },
  { left: 25, top: 60, delay: 0.5, duration: 6 },
  { left: 90, top: 40, delay: 1.5, duration: 4 },
  { left: 5, top: 85, delay: 3, duration: 5 },
  { left: 50, top: 10, delay: 2.5, duration: 3 },
  { left: 35, top: 75, delay: 1, duration: 4 },
  { left: 80, top: 55, delay: 4, duration: 6 },
  { left: 15, top: 35, delay: 2, duration: 5 },
  { left: 60, top: 25, delay: 0.8, duration: 4 },
  { left: 45, top: 90, delay: 3.5, duration: 3 },
  { left: 95, top: 70, delay: 1.2, duration: 5 },
  { left: 20, top: 50, delay: 2.8, duration: 4 },
  { left: 75, top: 30, delay: 0.3, duration: 6 },
  { left: 40, top: 65, delay: 4.5, duration: 3 },
  { left: 55, top: 45, delay: 1.8, duration: 5 },
  { left: 30, top: 85, delay: 3.2, duration: 4 },
  { left: 65, top: 10, delay: 0.6, duration: 3 },
  { left: 8, top: 55, delay: 2.4, duration: 6 },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-github-accent-fg/30 animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background gradiente */}
      <div className="absolute inset-0 bg-gradient-radial from-github-canvas-subtle/50 via-github-canvas-default to-github-canvas-inset" />
      
      {/* Partículas */}
      <FloatingParticles />
      
      {/* Conteúdo central */}
      <div className="text-center space-y-8 z-10 max-w-2xl">
        {/* 404 com animação suave */}
        <div className="relative">
          <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-gradient drop-shadow-[0_0_60px_rgba(88,166,255,0.5)] animate-float-slow">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 -z-10 animate-pulse-slow" />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-github-fg-default">
            Página não encontrada
          </h2>
          <p className="text-github-fg-muted text-lg max-w-md mx-auto">
            Parece que você se perdeu no espaço digital.
            <br />
            A página que você procura não existe ou foi movida.
          </p>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-github-fg-subtle" />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default placeholder:text-github-fg-subtle focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
            />
          </div>
          <Link
            href={searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : "/"}
            className="px-4 py-3 bg-github-canvas-subtle hover:bg-github-border-default border border-github-border-default rounded-lg text-github-fg-default transition-all hover:scale-105"
          >
            <Search className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Botões */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-github-accent-emphasis hover:bg-[#388bfd] text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(88,166,255,0.4)]"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Voltar ao início
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-github-canvas-subtle hover:bg-github-border-default text-github-fg-default font-medium rounded-lg border border-github-border-default transition-all duration-300 hover:scale-105 hover:border-github-accent-emphasis/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar atrás
          </button>
        </div>
        
        <p className="text-github-fg-subtle text-sm pt-2">
          Código: <code className="px-2 py-1 bg-github-canvas-subtle rounded text-github-accent-fg font-mono">NOT_FOUND</code>
        </p>
      </div>
    </div>
  );
}

