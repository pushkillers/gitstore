"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Download, ExternalLink, GitFork, Heart, Share2, Star, Tag
} from "lucide-react";
import { mockProjects } from "@/lib/data";
import { getPublishedProjects } from "@/lib/projects";
import { getLikedProjects, toggleLike } from "@/lib/xp";
import { toast } from "@/lib/toast";
import { formatNumber } from "@/lib/utils";
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

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#7d8590] transition-colors hover:text-[#e6edf3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div className="space-y-5">
            {/* Header card */}
            <div className="overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22]">
              {/* Banner */}
              <div
                className="relative h-48 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${langColor}18, ${langColor}08)` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.2)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/8 bg-[#0d1117]/80 backdrop-blur-sm">
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 16 16" style={{ color: langColor }}>
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full border border-[#d29922]/30 bg-[#0d1117]/80 px-2.5 py-1 text-xs font-semibold text-[#d29922] backdrop-blur-sm">
                      ★ Destaque
                    </span>
                  </div>
                )}
              </div>

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
                    {project.type === "free" ? "Download grátis" : project.type === "freemium" ? "Baixar versão free" : `Comprar — $${project.price}`}
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

            {/* About */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
              <h2 className="mb-4 text-base font-semibold text-[#e6edf3]">Sobre o projeto</h2>
              <p className="text-sm leading-7 text-[#8b949e]">
                {project.description}
                {" "}Este projeto foi desenvolvido com foco em qualidade e boas práticas de desenvolvimento.
                Ideal para quem busca uma solução robusta e bem documentada para {project.category.toLowerCase()}.
              </p>
            </div>
          </div>

          {/* Sidebar */}
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

            {/* Author */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">Autor</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#238636] text-sm font-bold text-white">
                  {project.author[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e6edf3]">@{project.author}</p>
                  <p className="text-xs text-[#7d8590]">Desenvolvedor</p>
                </div>
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
