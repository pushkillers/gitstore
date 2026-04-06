import Link from "next/link";
import { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import { ROUTES } from "@/constants";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d", Ruby: "#701516",
};

const LANG_GRADIENTS: Record<string, string> = {
  TypeScript: "from-[#3178c6]/30 to-[#1a4a8a]/20",
  JavaScript: "from-[#f1e05a]/20 to-[#b8a800]/10",
  Python:     "from-[#3572A5]/30 to-[#1a3d6b]/20",
  Java:       "from-[#b07219]/30 to-[#6b4510]/20",
  Go:         "from-[#00ADD8]/30 to-[#006b87]/20",
  Rust:       "from-[#dea584]/20 to-[#8b5e3c]/10",
  "C++":      "from-[#f34b7d]/20 to-[#8b1a3d]/10",
  Ruby:       "from-[#701516]/30 to-[#3d0a0b]/20",
};

export function ProjectCard({ project }: { project: Project }) {
  const gradient = LANG_GRADIENTS[project.language] ?? "from-[#1f6feb]/20 to-[#238636]/10";
  const langColor = LANG_COLORS[project.language] ?? "#7d8590";

  return (
    <Link href={ROUTES.PROJECT_DETAIL(project.id)} className="block group h-full">
      <div className="relative h-full flex flex-col rounded-2xl border border-[#30363d] bg-[#161b22] overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#58a6ff]/50 hover:shadow-[0_8px_40px_-12px_rgba(88,166,255,0.4)]">

        {/* Thumbnail */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden flex-shrink-0`}>
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(48,54,61,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(48,54,61,0.4)_1px,transparent_1px)] bg-[size:28px_28px]" />

          {/* Glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(88,166,255,0.15),transparent_70%)]" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#d29922]/30 bg-[#d29922]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d29922] backdrop-blur-sm">
                ⭐ Destaque
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            {project.type === "free" ? (
              <span className="rounded-full border border-[#3fb950]/30 bg-[#3fb950]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3fb950] backdrop-blur-sm">Grátis</span>
            ) : project.type === "freemium" ? (
              <span className="rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#58a6ff] backdrop-blur-sm">Freemium</span>
            ) : (
              <span className="rounded-full border border-[#e6edf3]/20 bg-[#0d1117]/60 px-2.5 py-0.5 text-[10px] font-bold text-[#e6edf3] backdrop-blur-sm">${project.price}</span>
            )}
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity" style={{ backgroundColor: langColor }} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1117]/80 shadow-2xl backdrop-blur-sm ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 16 16" style={{ color: langColor }}>
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-[#e6edf3] transition-colors group-hover:text-[#58a6ff]">
                {project.name}
              </h3>
              <p className="mt-0.5 text-xs text-[#7d8590]">{project.category}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-[#d29922]/10 px-2 py-1">
              <svg className="h-3 w-3 text-[#d29922]" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              <span className="text-xs font-bold text-[#d29922]">{project.rating}</span>
            </div>
          </div>

          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-6 text-[#7d8590]">
            {project.description}
          </p>

          <div className="space-y-3 border-t border-[#21262d] pt-3">
            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-[#7d8590]">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {formatNumber(project.downloads)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                {project.language}
              </span>
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                @{project.author}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full border border-[#30363d] bg-[#0d1117] px-2 py-0.5 text-[10px] font-medium text-[#7d8590] transition-colors group-hover:border-[#58a6ff]/20 group-hover:text-[#8ec2ff]">
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="rounded-full border border-[#30363d] bg-[#0d1117] px-2 py-0.5 text-[10px] text-[#7d8590]">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA — aparece no hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="bg-[linear-gradient(135deg,#1f6feb,#3279db)] py-2.5 text-center text-xs font-semibold text-white">
            Ver projeto →
          </div>
        </div>
      </div>
    </Link>
  );
}
