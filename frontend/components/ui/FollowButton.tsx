"use client";

import { useEffect, useState } from "react";
import { isFollowing, toggleFollow, FOLLOWS_EVENT } from "@/lib/follows";
import { useProfile } from "@/lib/useProfile";

interface Props {
  username: string;
  size?: "sm" | "md";
}

export function FollowButton({ username, size = "md" }: Props) {
  const { profile } = useProfile();
  const [following, setFollowing] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setFollowing(isFollowing(username));
    const refresh = () => setFollowing(isFollowing(username));
    window.addEventListener(FOLLOWS_EVENT, refresh);
    return () => window.removeEventListener(FOLLOWS_EVENT, refresh);
  }, [username]);

  // Não mostra o botão no próprio perfil
  if (profile.username && profile.username === username) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowing(toggleFollow(username));
  };

  const sm = size === "sm";

  if (following) {
    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`inline-flex items-center gap-1.5 rounded-xl border font-medium transition-all ${
          sm ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"
        } ${
          hovered
            ? "border-[#f85149]/30 bg-[#f8514915] text-[#ff8a84]"
            : "border-[#30363d] bg-[#21262d] text-[#e6edf3]"
        }`}
      >
        {hovered ? "Deixar de seguir" : "✓ Seguindo"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-[#58a6ff]/30 bg-[#58a6ff]/10 font-semibold text-[#58a6ff] transition-all hover:bg-[#58a6ff]/20 ${
        sm ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"
      }`}
    >
      + Seguir
    </button>
  );
}
