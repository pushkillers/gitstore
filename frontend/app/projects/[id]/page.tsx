"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Download, ExternalLink, GitFork, Heart, Share2, Star, Tag, ChevronLeft, ChevronRight
} from "lucide-react";
import { mockProjects } from "@/lib/data";
import { getPublishedProjects } from "@/lib/api/projects";
import { getLikedProjects, toggleLike } from "@/lib/utils/xp";
import { toast } from "@/lib/utils/toast";
import { formatNumber } from "@/lib/utils/cn";
import { Project } from "@/types";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d", Ruby: "#701516",
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock images and contributors (replace with real data from API)
  const projectImages = [
    "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
  ];

  const contributors = [
    { id: 2, name: "João Silva", username: "joaosilva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao" },
    { id: 3, name: "Maria Santos", username: "mariasantos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria" },
    { id: 1, name: "Admin User", username: "admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" }
  ];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    const numId = Number(id);
    const all = [...getPublishedProjects(), ...mockProjects];
    const found = all.find((p) => p.id === numId) ?? null;
    setProject(found);
    if (found) {
      setLikeCount(found.stars);
      setLiked(getLikedProjects().includes(numId));
    }
  }, [id]);

  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-semibold text-[#e6edf3]">Projeto não encontrado</h2>
          <Link href="/projects" className="mt-4 inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
            <ArrowLeft className="h-4 w-4" /> Voltar ao marketplace
          </Link>
        </div>
      </div>
    );
  }

  const langColor = LANG_COLORS[project.language] ?? "#7d8590";

  const handleLike = () => {
    const nowLiked = toggleLike(project.id);
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
    if (nowLiked) toast.success("Projeto curtido! +2 XP 🎉");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleDownload = () => {
    if (project.repository) {
      window.open(project.repository, "_blank");
    }
    toast.info("Redirecionando para o repositório...");
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#2ea043]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_300px]">
          {/* Left Sidebar - Author Card */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Autor</h3>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative h-20 w-20 mb-3">
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.author}`}
                    alt={project.author}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <h4 className="text-base font-semibold text-[#e6edf3] mb-1">@{project.author}</h4>
                <p className="text-xs text-[#7d8590] mb-4">Desenvolvedor</p>
                
                <Link
                  href={`/perfil?user=${project.author}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
                >
                  Ver perfil
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-[#21262d] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7d8590]">Projetos</span>
                  <span className="font-semibold text-[#e6edf3]">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7d8590]">Seguidores</span>
                  <span className="font-semibold text-[#e6edf3]">1.2k</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#7d8590]">Level</span>
                  <span className="font-semibold text-[#e6edf3]">15</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#21262d]">
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Desenvolvedor apaixonado por criar soluções inovadoras e compartilhar conhecimento com a comunidade.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-5">
            {/* Image Carousel + Project Info - Single Card */}
            <div className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22]">
              {/* Carousel */}
              <div className="relative aspect-video overflow-hidden bg-[#0d1117]">
                <Image
                  src={projectImages[currentImageIndex]}
                  alt={`${project.name} - Screenshot ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Navigation Buttons */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117]/80 text-[#e6edf3] backdrop-blur-sm transition-all hover:bg-[#161b22] hover:border-[#484f58]"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#30363d] bg-[#0d1117]/80 text-[#e6edf3] backdrop-blur-sm transition-all hover:bg-[#161b22] hover:border-[#484f58]"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Indicators */}
                {projectImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {projectImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? "w-8 bg-[#58a6ff]"
                            : "w-2 bg-[#30363d] hover:bg-[#484f58]"
                        }`}
                        aria-label={`Ir para imagem ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Image Counter */}
                <div className="absolute top-3 right-3 rounded-full border border-[#30363d] bg-[#0d1117]/80 px-3 py-1 text-xs font-medium text-[#e6edf3] backdrop-blur-sm">
                  {currentImageIndex + 1} / {projectImages.length}
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full border border-[#d29922]/30 bg-[#0d1117]/80 px-2.5 py-1 text-xs font-semibold text-[#d29922] backdrop-blur-sm">
                      ★ Destaque
                    </span>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#e6edf3]">{project.name}</h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[#7d8590]">
                      <span>por <span className="text-[#58a6ff]">@{project.author}</span></span>
                      <span>·</span>
                      <span>{project.category}</span>
                      {project.createdAt && (
                        <>
                          <span>·</span>
                          <span>{project.createdAt}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {project.type === "free" ? (
                      <span className="rounded-full border border-[#3fb950]/25 bg-[#3fb950]/10 px-3 py-1 text-sm font-semibold text-[#3fb950]">Gratuito</span>
                    ) : project.type === "freemium" ? (
                      <span className="rounded-full border border-[#388bfd]/25 bg-[#388bfd]/10 px-3 py-1 text-sm font-semibold text-[#388bfd]">Freemium</span>
                    ) : (
                      <span className="rounded-full border border-[#e6edf3]/15 bg-[#21262d] px-3 py-1 text-sm font-semibold text-[#e6edf3]">${project.price}</span>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#8b949e]">{project.description}</p>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[#21262d] px-2.5 py-0.5 text-xs text-[#7d8590]">
                        <Tag className="h-2.5 w-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2ea043]"
                  >
                    <Download className="h-4 w-4" />
                    {project.type === "free" ? "Download grátis" : project.type === "freemium" ? "Baixar versão free" : `Comprar — ${project.price}`}
                  </button>

                  {project.repository && (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2.5 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Repositório
                    </a>
                  )}

                  <button
                    onClick={handleLike}
                    className={[
                      "inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-150",
                      liked
                        ? "border-[#f85149]/30 bg-[#f85149]/10 text-[#f85149]"
                        : "border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:border-[#f85149]/30 hover:text-[#f85149]",
                    ].join(" ")}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                    {formatNumber(likeCount)}
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2.5 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
                  >
                    <Share2 className="h-4 w-4" />
                    {copied ? "Copiado!" : "Compartilhar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            {/* Stats */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Estatísticas</h3>
              <div className="space-y-3">
                {[
                  { icon: Download, label: "Downloads", value: formatNumber(project.downloads), color: "#58a6ff" },
                  { icon: Star, label: "Stars", value: formatNumber(likeCount), color: "#d29922" },
                  { icon: GitFork, label: "Avaliação", value: `${project.rating} / 5.0`, color: "#3fb950" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[#7d8590]">
                      <s.icon className="h-4 w-4" style={{ color: s.color }} />
                      {s.label}
                    </div>
                    <span className="font-semibold text-[#e6edf3]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Tecnologia</h3>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: langColor }} />
                <span className="text-sm font-medium text-[#e6edf3]">{project.language}</span>
              </div>
            </div>

            {/* Contributors */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Contribuidores</h3>
              <div className="space-y-3">
                {contributors.map((contributor, idx) => (
                  <Link
                    key={contributor.id}
                    href={`/perfil?user=${contributor.username}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[#21262d]"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={contributor.avatar}
                        alt={contributor.name}
                        fill
                        className="rounded-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#161b22] bg-[#d29922]">
                          <Star className="h-2.5 w-2.5 fill-current text-[#0d1117]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#e6edf3]">{contributor.name}</p>
                      <p className="truncate text-xs text-[#7d8590]">@{contributor.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#21262d]">
                <p className="text-xs text-[#7d8590] text-center">
                  {contributors.length} {contributors.length === 1 ? "contribuidor" : "contribuidores"}
                </p>
              </div>
            </div>

            {/* More projects */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Explorar mais</h3>
              <Link
                href="/projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#30363d] py-2.5 text-sm text-[#c9d1d9] transition-colors hover:border-[#484f58] hover:text-[#e6edf3]"
              >
                Ver todos os projetos
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
