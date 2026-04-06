"use client";

import { useRouter } from "next/navigation";
import { Dropdown, DropdownHeader, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";
import { useProfile } from "@/lib/useProfile";
import { useSession } from "@/lib/useSession";
import { logout } from "@/lib/auth";

export function UserMenuDropdown() {
  const router = useRouter();
  const { user } = useSession();
  const { profile } = useProfile();

  const name   = profile.name   || user?.name   || "Usuário";
  const email  = profile.email  || user?.email  || "";
  const avatar = profile.avatar || user?.avatar || "";
  const zoom   = Math.min(Math.max(profile.avatarZoom || 100, 80), 200);
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";

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
            <AvatarSmall size={40} />
          </div>
          <svg className="w-4 h-4 text-[#7d8590] group-hover:text-[#e6edf3] transition-colors" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
          </svg>
        </>
      }
      className="flex items-center gap-3 pl-3 pr-4 py-2 hover:bg-[#161b22] rounded-lg transition-colors border border-transparent hover:border-[#30363d] group"
    >
      <DropdownHeader>
        <div className="flex items-center gap-3 py-2">
          <AvatarSmall size={48} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#e6edf3] text-sm truncate">{name}</p>
            <p className="text-xs text-[#7d8590] truncate">{email}</p>
          </div>
        </div>
      </DropdownHeader>

      <DropdownItem onClick={() => router.push("/perfil")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>Seu Perfil</DropdownItem>
      <DropdownItem onClick={() => router.push("/seus-projetos")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>}>Seus Projetos</DropdownItem>
      <DropdownItem onClick={() => router.push("/teams")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>Suas Equipes</DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={() => router.push("/settings")} icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>Configurações</DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={handleLogout} variant="danger" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}>Sair</DropdownItem>
    </Dropdown>
  );
}
