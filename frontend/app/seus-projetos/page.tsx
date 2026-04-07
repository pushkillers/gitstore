"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderGit2, FolderKanban, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { fetchMyProjects, deleteProject, PROJECTS_CHANGE_EVENT } from "@/lib/projects";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { Project } from "@/types";

export default function SeusProjetosPage() {
  useRequireAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchMyProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    window.addEventListener(PROJECTS_CHANGE_EVENT, load);
    return () => window.removeEventListener(PROJECTS_CHANGE_EVENT, load);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    setDeleting(id);
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#e6edf3]">Seus Projetos</h1>
            <p className="mt-2 text-[#7d8590]">Gerencie e publique seus projetos na vitrine</p>
          </div>
          <Link
            href="/publish"
            className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Novo projeto
          </Link>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/seus-projetos/github"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#58a6ff]/40"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#58a6ff]/10 text-[#58a6ff] transition-all group-hover:bg-[#58a6ff]/20">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-[#e6edf3]">Importar do GitHub</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Conecte seus repositórios</p>
          </Link>

          <Link
            href="/publish"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#3fb950]/40"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#3fb950]/10 text-[#3fb950] transition-all group-hover:bg-[#3fb950]/20">
              <Plus className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-[#e6edf3]">Publicar projeto</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Crie um novo projeto</p>
          </Link>

          <Link
            href="/projects"
            className="group rounded-2xl border border-[#30363d] bg-[#161b22] p-5 transition-all hover:border-[#f0b442]/40"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0b442]/10 text-[#f0b442] transition-all group-hover:bg-[#f0b442]/20">
              <FolderKanban className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-[#e6edf3]">Ver marketplace</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Explore todos os projetos</p>
          </Link>
        </div>

        {/* Published projects list */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#e6edf3]">
            Projetos publicados
            {!loading && (
              <span className="ml-2 rounded-full bg-[#21262d] px-2.5 py-0.5 text-sm font-normal text-[#7d8590]">
                {projects.length}
              </span>
            )}
          </h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl border border-[#30363d] bg-[#161b22]" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#30363d] py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#30363d] bg-[#161b22] text-3xl">📦</div>
              <h3 className="text-lg font-semibold text-[#e6edf3]">Nenhum projeto publicado</h3>
              <p className="mt-2 text-sm text-[#7d8590]">Publique seu primeiro projeto e apareça no marketplace</p>
              <Link
                href="/publish"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                Publicar agora
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#30363d] bg-[#161b22] px-5 py-4 transition-all hover:border-[#58a6ff]/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#e6edf3] truncate">{project.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.type === "free"
                          ? "bg-[#3fb950]/10 text-[#3fb950]"
                          : project.type === "paid"
                          ? "bg-[#f0b442]/10 text-[#f0b442]"
                          : "bg-[#58a6ff]/10 text-[#58a6ff]"
                      }`}>
                        {project.type === "free" ? "Gratuito" : project.type === "paid" ? `$${project.price}` : "Freemium"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#7d8590] truncate">{project.description}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-[#6e7681]">
                      <span>{project.language}</span>
                      <span>·</span>
                      <span>{project.category}</span>
                      <span>·</span>
                      <span>{project.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-[#30363d] p-2 text-[#7d8590] transition-all hover:border-[#58a6ff]/40 hover:text-[#58a6ff]"
                        title="Ver repositório"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="rounded-xl border border-[#f85149]/20 p-2 text-[#f85149] transition-all hover:bg-[#f8514915] disabled:opacity-50"
                      title="Excluir projeto"
                    >
                      {deleting === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
