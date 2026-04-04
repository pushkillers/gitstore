import Link from "next/link";
import { Project } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import { ROUTES } from "@/constants";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  Ruby: "#701516",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={ROUTES.PROJECT_DETAIL(project.id)} className="block group">
      <div className="relative bg-gradient-to-b from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#1f6feb] transition-all duration-300 hover:shadow-2xl hover:shadow-[#1f6feb]/30 hover:-translate-y-1 h-full flex flex-col">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f6feb]/0 via-[#1f6feb]/0 to-[#1f6feb]/0 group-hover:from-[#1f6feb]/5 group-hover:via-[#1f6feb]/0 group-hover:to-[#1f6feb]/5 transition-all duration-500 pointer-events-none" />
        
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-[#1f6feb]/20 to-[#238636]/20 overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="warning" className="backdrop-blur-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                Destaque
              </Badge>
            </div>
          )}
          
          {/* Price tag */}
          <div className="absolute top-3 right-3">
            {project.type === "free" ? (
              <Badge variant="success" className="backdrop-blur-sm font-bold">
                GRÁTIS
              </Badge>
            ) : project.type === "freemium" ? (
              <Badge variant="primary" className="backdrop-blur-sm font-bold">
                FREEMIUM
              </Badge>
            ) : (
              <Badge variant="default" className="backdrop-blur-sm font-bold bg-[#161b22]">
                ${project.price}
              </Badge>
            )}
          </div>
          
          {/* Project icon/logo placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative group/logo">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb] to-[#8b5cf6] rounded-2xl blur-xl opacity-50 group-hover/logo:opacity-75 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center shadow-2xl ring-2 ring-[#1f6feb]/20 group-hover/logo:ring-[#1f6feb]/40 transition-all">
                <svg className="w-10 h-10 text-[#58a6ff]" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors mb-1 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-[#7d8590]">
              {project.category}
            </p>
          </div>
          
          {/* Rating and downloads */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-[#d29922] font-bold">{project.rating}</span>
              <svg className="w-4 h-4 text-[#d29922]" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
            </div>
            <div className="flex items-center gap-1 text-[#7d8590]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-xs">{formatNumber(project.downloads)}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-[#7d8590] text-sm mb-4 line-clamp-2 flex-1">
            {project.description}
          </p>
          
          {/* Footer */}
          <div className="space-y-3 pt-3 border-t border-[#21262d]">
            {/* Author and language */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#7d8590]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                @{project.author}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: languageColors[project.language] || "#7d8590" }}
                />
                <span className="text-[#7d8590] font-medium">
                  {project.language}
                </span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex gap-1.5 flex-wrap">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="default" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="default" className="text-xs">+{project.tags.length - 2}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
