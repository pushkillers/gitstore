"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Contributor {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface ContributorsCardProps {
  contributors: Contributor[];
  className?: string;
}

export function ContributorsCard({ contributors, className = "" }: ContributorsCardProps) {
  if (!contributors || contributors.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl border border-[#21262d] bg-[#161b22] p-5 ${className}`}>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#484f58]">
        Contribuidores
      </h3>
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
  );
}
