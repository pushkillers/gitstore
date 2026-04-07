"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { formatNumber } from "@/lib/utils/cn";
import { ROUTES } from "@/constants";
import { getLikedProjects, toggleLike } from "@/lib/utils/xp";
import { toast } from "@/lib/utils/toast";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d",
  Ruby: "#701516", Swift: "#F05138", Kotlin: "#A97BFF", PHP: "#4F5D95",
};

export function ProjectCard({ project }: { project: Project }) {
  const langColor = LANG_COLORS[project.language] ?? "#7d8590";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.stars);

  useEffect(() => {
    setLiked(getLikedProjects().includes(project.id));
  }, [project.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowLiked = toggleLike(project.id);
    setLiked(nowLiked);
    setLikeCount((c) => c + (nowLiked ? 1 : -1));
    if (nowLiked) toast.success("+2 XP · Projeto curtido!");
  };

  const typeBadge = {
    free: { label: "Grátis", cls: "text-[#3fb950] border-[#3fb950]/20 bg-[#3fb950]/8" },
    paid: { label: `$${project.price}`, cls: "text-[#e6edf3] border-[#30363d] bg-[#21262d]" },
  }[project.type] || { label: "Grátis", cls: "text-[#3fb950] border-[#3fb950]/20 bg-[#3fb950]/8" };

  return (
    <Link href={ROUTES.PROJECT_DETAIL(project.id)} className="block group h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#388bfd]/30 hover:shadow-[0_0_0_1px_rgba(56,139,253,0.1),0_8px_32px_-8px_rgba(0,0,0,0.6)]">

        {/* Thumbnail */}
        <div
          className="relative h-36 flex-shrink-0 overflow-hidden"
          style={{ 
            background: project.thumbnail 
              ? `linear-gradient(135deg, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.1) 100%)`
              : `linear-gradient(135deg, ${langColor}14 0%, ${langColor}06 100%)`
          }}
        >
          {/* Background image */}
          {project.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={project.thumbnail} 
              alt={project.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-60" />

          {/* Dot grid - só aparece se não tiver thumbnail */}
          {!project.thumbnail && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, ${langColor}20 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
          )}

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at 50% 100%, ${langColor}15, transparent 70%)` }}
          />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex gap-1.5 z-10">
            {project.featured && (
              <span className="rounded-full border border-[#d29922]/25 bg-[#0d1117]/85 px-2 py-0.5 text-[10px] font-semibold text-[#d29922] backdrop-blur-sm">
                ★ Destaque
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 z-10">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
          </div>

          {/* Language icon - só aparece se não tiver thumbnail */}
          {!project.thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-[#0d1117]/75 backdrop-blur-sm transition-all duration-200 group-hover:scale-105 group-hover:border-white/12"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16" style={{ color: langColor }}>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title row */}
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
              {project.name}
            </h3>
            <div className="flex flex-shrink-0 items-center gap-0.5 text-[11px] font-semibold text-[#d29922]">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              {project.rating}
            </div>
          </div>

          <p className="mb-1 text-[10px] text-[#484f58]">{project.category}</p>

          <p className="mb-3 line-clamp-2 flex-1 text-xs leading-5 text-[#7d8590]">
            {project.description}
          </p>

          {/* Footer */}
          <div className="border-t border-[#21262d] pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-[#484f58]">
                <span className="inline-flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {formatNumber(project.downloads)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
                  {project.language}
                </span>
              </div>

              <button
                onClick={handleLike}
                className={[
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-150 active:scale-95",
                  liked
                    ? "bg-[#f85149]/10 text-[#f85149]"
                    : "text-[#484f58] hover:bg-[#f85149]/8 hover:text-[#f85149]",
                ].join(" ")}
              >
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${liked ? "scale-110" : ""}`}
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {formatNumber(likeCount)}
              </button>
            </div>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
