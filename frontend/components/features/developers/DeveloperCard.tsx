"use client";

import { Badge } from "@/components/ui/Badge";
import { FollowButton } from "@/components/ui/FollowButton";

interface Developer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  avatarIsImage?: boolean;
  avatarZoom?: number;
  bio: string;
  rank: number;
  level: number;
  xp: number;
  maxXp: number;
  xpTotal?: number;
  xpTitle?: string;
  stats: {
    projects: number;
    contributions: number;
    followers: number;
    stars: number;
  };
  skills: string[];
  badges: string[];
  isVerified: boolean;
  isTopContributor: boolean;
  isCurrentUser?: boolean;
}

interface DeveloperCardProps {
  developer: Developer;
  showRank?: boolean;
  isCurrentUser?: boolean;
}

export function DeveloperCard({ developer, showRank = false, isCurrentUser = false }: DeveloperCardProps) {
  const xpPercentage = (developer.xp / developer.maxXp) * 100;
  const zoom = Math.min(Math.max(developer.avatarZoom || 100, 80), 200);

  return (
    <div className={`group relative bg-gradient-to-b from-[#161b22] to-[#0d1117] border rounded-xl overflow-hidden hover:border-[#1f6feb] transition-all duration-300 hover:shadow-2xl hover:shadow-[#1f6feb]/30 hover:-translate-y-1 h-full flex flex-col ${isCurrentUser ? "border-[#58a6ff]/40 shadow-[0_0_20px_rgba(88,166,255,0.1)]" : "border-[#30363d]"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1f6feb]/0 via-[#1f6feb]/0 to-[#1f6feb]/0 group-hover:from-[#1f6feb]/5 group-hover:via-[#1f6feb]/0 group-hover:to-[#1f6feb]/5 transition-all duration-500 pointer-events-none" />
      
      <div className="relative h-48 bg-gradient-to-br from-[#1f6feb]/20 to-[#8b5cf6]/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
        
        {showRank && developer.rank <= 3 && (
          <div className="absolute top-3 left-3">
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-2xl backdrop-blur-sm ${developer.rank === 1 ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-950' : ''} ${developer.rank === 2 ? 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-slate-900' : ''} ${developer.rank === 3 ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-orange-950' : ''}`}>
              <div className="absolute inset-0 rounded-full animate-pulse opacity-50 blur-sm bg-current" />
              <span className="relative z-10">#{developer.rank}</span>
            </div>
          </div>
        )}
        
        {developer.isTopContributor && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning" className="backdrop-blur-sm font-bold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              TOP
            </Badge>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1f6feb] to-[#8b5cf6] rounded-full blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#1f6feb] via-[#6366f1] to-[#8b5cf6] border-2 border-[#30363d] flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-2 ring-[#1f6feb]/20 group-hover/avatar:ring-[#1f6feb]/40 transition-all overflow-hidden">
              {developer.avatarIsImage && developer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={developer.avatar} alt={developer.name} className="h-full w-full object-cover"
                  style={{ transform: `scale(${zoom / 100})` }} referrerPolicy="no-referrer" />
              ) : (
                developer.avatar
              )}
            </div>
            {developer.isVerified && (
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-full border-2 border-[#161b22] flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors mb-1 line-clamp-1">
                {developer.name}
              </h3>
              <p className="text-sm text-[#7d8590]">@{developer.username}</p>
            </div>
            {!isCurrentUser && (
              <FollowButton username={developer.username} size="sm" />
            )}
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs font-medium text-[#7d8590] mb-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">Nível {developer.level}</Badge>
              {developer.xpTitle && <span className="text-[10px] text-[#7d8590]">{developer.xpTitle}</span>}
              {isCurrentUser && <span className="rounded-full bg-[#58a6ff]/15 px-2 py-0.5 text-[10px] font-bold text-[#58a6ff]">Você</span>}
            </div>
            <span className="flex items-center gap-1">
              <span className="text-[#58a6ff]">{developer.xp.toLocaleString()}</span>
              <span>/</span>
              <span>{developer.maxXp.toLocaleString()} XP</span>
            </span>
          </div>
          <div className="relative h-2 bg-[#21262d] rounded-full overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            <div className="relative h-full bg-gradient-to-r from-[#1f6feb] via-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-700 ease-out shadow-lg" style={{ width: `${xpPercentage}%` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
          <div className="text-center">
            <div className="text-sm font-bold text-[#1f6feb]">{developer.stats.projects}</div>
            <div className="text-[10px] text-[#7d8590]">Projetos</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[#238636]">{developer.stats.contributions}</div>
            <div className="text-[10px] text-[#7d8590]">Commits</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[#d29922]">{developer.stats.stars}</div>
            <div className="text-[10px] text-[#7d8590]">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[#8b5cf6]">{developer.stats.followers}</div>
            <div className="text-[10px] text-[#7d8590]">Seguidores</div>
          </div>
        </div>
        
        <p className="text-[#7d8590] text-sm mb-4 line-clamp-2 flex-1">{developer.bio}</p>
        
        {isCurrentUser && (
          <div className="mb-3 rounded-xl border border-[#30363d] bg-[#0d1117] p-3 text-xs text-[#7d8590]">
            <p className="mb-1.5 font-semibold text-[#e6edf3]">Como ganhar XP:</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span>📦 Publicar projeto</span><span className="text-[#3fb950]">+100 XP</span></div>
              <div className="flex justify-between"><span>❤️ Curtida recebida</span><span className="text-[#3fb950]">+10 XP</span></div>
              <div className="flex justify-between"><span>👍 Curtir projeto</span><span className="text-[#3fb950]">+2 XP</span></div>
            </div>
          </div>
        )}
        
        <div className="space-y-3 pt-3 border-t border-[#21262d]">
          {developer.badges.length > 0 && (
            <div className="flex gap-1.5">
              {developer.badges.map((badge) => (
                <span key={badge} className="text-lg" title={badge}>{badge}</span>
              ))}
            </div>
          )}
          
          <div className="flex gap-1.5 flex-wrap">
            {developer.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="default" className="text-xs">{skill}</Badge>
            ))}
            {developer.skills.length > 2 && (
              <Badge variant="default" className="text-xs">+{developer.skills.length - 2}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
