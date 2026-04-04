"use client";

import { Badge } from "@/components/ui/Badge";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  banner: string;
  logo: string;
  members: TeamMember[];
  memberCount: number;
  projectCount: number;
  tags: string[];
  isPublic: boolean;
  level: number;
}

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="group relative bg-gradient-to-b from-[#161b22] to-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#1f6feb] transition-all duration-300 hover:shadow-2xl hover:shadow-[#1f6feb]/30 hover:-translate-y-1 h-full flex flex-col">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f6feb]/0 via-[#1f6feb]/0 to-[#1f6feb]/0 group-hover:from-[#1f6feb]/5 group-hover:via-[#1f6feb]/0 group-hover:to-[#1f6feb]/5 transition-all duration-500 pointer-events-none" />
      
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-br from-[#1f6feb]/20 to-[#8b5cf6]/20 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant={team.isPublic ? "success" : "default"} className="backdrop-blur-sm font-bold">
            {team.isPublic ? "PÚBLICA" : "PRIVADA"}
          </Badge>
          <Badge variant="primary" className="backdrop-blur-sm font-bold">
            NÍVEL {team.level}
          </Badge>
        </div>
        
        {/* Team logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative group/logo">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb] to-[#8b5cf6] rounded-2xl blur-xl opacity-50 group-hover/logo:opacity-75 transition-opacity" />
            <div className="relative w-20 h-20 rounded-2xl bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-2 ring-[#1f6feb]/20 group-hover/logo:ring-[#1f6feb]/40 transition-all">
              {team.logo}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors mb-1 line-clamp-1">
            {team.name}
          </h3>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1 text-[#7d8590]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 3.5A2.5 2.5 0 018 6h5.5a.5.5 0 010 1H8a2.5 2.5 0 01-2.5-2.5.5.5 0 011 0zM3 8a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9A.5.5 0 013 8zm0 2.5a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z"/>
            </svg>
            <span className="text-xs">{team.projectCount} projetos</span>
          </div>
          <div className="flex items-center gap-1 text-[#7d8590]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
            <span className="text-xs">{team.memberCount} membros</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[#7d8590] text-sm mb-4 line-clamp-2 flex-1">
          {team.description}
        </p>
        
        {/* Footer */}
        <div className="space-y-3 pt-3 border-t border-[#21262d]">
          {/* Members avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#8b5cf6] border-2 border-[#161b22] flex items-center justify-center text-xs font-bold text-white"
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ))}
            </div>
            {team.memberCount > 5 && (
              <span className="text-xs text-[#7d8590]">
                +{team.memberCount - 5}
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {team.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
            {team.tags.length > 2 && (
              <Badge variant="default" className="text-xs">+{team.tags.length - 2}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
