"use client";

import Link from "next/link";
import { FolderGit2, FolderKanban, Plus } from "lucide-react";

export default function SeusProjetosPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e6edf3]">Seus Projetos</h1>
          <p className="mt-2 text-[#7d8590]">Gerencie e publique seus projetos na vitrine</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/seus-projetos/github"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-[#58a6ff]/40 hover:bg-[#161b22]"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#58a6ff]/10 text-[#58a6ff] transition-all group-hover:bg-[#58a6ff]/20">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-[#e6edf3]">Importar do GitHub</h2>
            <p className="mt-2 text-sm text-[#7d8590]">
              Conecte seus repositórios e exiba-os na sua vitrine pública
            </p>
          </Link>

          <Link
            href="/publish"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-[#3fb950]/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3fb950]/10 text-[#3fb950] transition-all group-hover:bg-[#3fb950]/20">
              <Plus className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-[#e6edf3]">Publicar projeto</h2>
            <p className="mt-2 text-sm text-[#7d8590]">
              Crie um novo projeto manualmente e publique na plataforma
            </p>
          </Link>

          <Link
            href="/projects"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-6 transition-all hover:border-[#f0b442]/40"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0b442]/10 text-[#f0b442] transition-all group-hover:bg-[#f0b442]/20">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-[#e6edf3]">Ver marketplace</h2>
            <p className="mt-2 text-sm text-[#7d8590]">
              Explore todos os projetos publicados na plataforma
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
