"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { useProfile } from "@/hooks/useProfile";
import { useSession } from "@/hooks/useSession";
import { logout } from "@/lib/api/auth";
import { getXP, calcLevel, XP_EVENT_NAME } from "@/lib/utils/xp";

export function UserMenuDropdown() {
  const router = useRouter();
  const { user } = useSession();
  const { profile } = useProfile();
  const [xpData, setXpData] = useState(() => {
    if (typeof window === "undefined") return { total: 0, projectsCreated: 0, likesReceived: 0, likesGiven: 0 };
    return getXP();
  });

  useEffect(() => {
    const refresh = () => setXpData(getXP());
    window.addEventListener(XP_EVENT_NAME, refresh);
    return () => window.removeEventListener(XP_EVENT_NAME, refresh);
  }, []);

  const name   = profile.name   || user?.name   || "Usuário";
  const email  = profile.email  || user?.email  || "";
  const avatar = profile.avatar || user?.avatar || "";
  const zoom   = Math.min(Math.max(profile.avatarZoom || 100, 80), 200);
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";
  const lvl = calcLevel(xpData.total);

  const AvatarSmall = ({ size }: { size: number }) => (
    <div className="relative overflow-hidden rounded-full flex-shrink-0 bg-[#238636]" style={{ width: size, height: size }}>
      {avatar
        ? <img src={avatar} alt={name} className="h-full w-full object-cover" style={{ transform: `scale(${zoom / 100})` }} referrerPolicy="no-referrer" /> // eslint-disable-line @next/next/no-img-element
        : <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">{initials}</div>
      }
    </div>
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <Dropdown
      trigger={
        <>
          <div className="ring-2 ring-transparent group-hover:ring-[#30363d] transition-all rounded-full">
            <AvatarSmall size={36} />
          </div>
          <svg className="w-3.5 h-3.5 text-[#484f58] group-hover:text-[#7d8590] transition-colors" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </>
      }
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#161b22] rounded-lg transition-colors border border-transparent hover:border-[#21262d] group"
    >
      <DropdownHeader>
        <div className="flex items-center gap-3 py-2">
          <AvatarSmall size={48} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#e6edf3] text-base truncate">{name}</p>
            <p className="text-sm text-[#7d8590] truncate">{email}</p>
            {/* XP bar */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-[#484f58] mb-1">
                <span>Nível {lvl.level} · {lvl.title}</span>
                <span>{lvl.currentXp}/{lvl.nextXp} XP</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#21262d]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#388bfd] to-[#3fb950] transition-all duration-500"
                  style={{ width: `${lvl.pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </DropdownHeader>

      <DropdownItem onClick={() => router.push("/perfil")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>Seu Perfil</DropdownItem>
      <DropdownItem onClick={() => router.push("/developers")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}>Ranking</DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => router.push("/settings")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>Configurações</DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleLogout} variant="danger" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}>Sair</DropdownItem>
    </Dropdown>
  );
}
