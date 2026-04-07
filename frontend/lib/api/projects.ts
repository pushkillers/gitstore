/**
 * projects.ts — gerenciamento de projetos (MOCK MODE)
 * Sistema mockado sem integração com backend
 * Armazena projetos no localStorage
 */

import { Project } from "@/types";
import { getToken, getUser } from "./auth";

const STORAGE_KEY = "gitstore.published_projects";
export const PROJECTS_CHANGE_EVENT = "gitstore.projects.change";

// ─── Local cache helpers (fallback / optimistic) ─────────────────────────────

function getCached(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setCached(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(PROJECTS_CHANGE_EVENT));
}

/** Returns locally-cached published projects (used as optimistic state). */
export function getPublishedProjects(): Project[] {
  return getCached();
}

// ─── Mock API calls ──────────────────────────────────────────────────────────

/** Fetch all projects (mock - retorna do localStorage). */
export async function fetchProjects(): Promise<Project[]> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  return getCached();
}

/** Alias for fetchProjects (for compatibility). */
export async function getProjects(): Promise<Project[]> {
  return fetchProjects();
}

/** Fetch projects for a specific user (mock). */
export async function fetchMyProjects(): Promise<Project[]> {
  const token = getToken();
  if (!token) return [];
  
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = getUser();
  return getCached().filter((p) => p.author === user?.username);
}

/** Publish a new project (mock - salva apenas no localStorage). */
export async function publishProject(data: {
  name: string;
  description: string;
  language: string;
  category: string;
  tags: string[];
  repository: string;
  type: "free" | "paid";
  price?: number;
}): Promise<{ ok: true; project: Project } | { ok: false; error: string }> {
  const token = getToken();
  if (!token) return { ok: false, error: "Você precisa estar logado." };

  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  // Cria projeto mockado
  const project = createLocalProject(data);
  const cached = getCached();
  setCached([project, ...cached]);

  return { ok: true, project };
}

/** Delete a project (mock - remove do localStorage). */
export async function deleteProject(id: number): Promise<void> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove do cache local
  setCached(getCached().filter((p) => p.id !== id));
}

/** Update a project (mock - atualiza no localStorage). */
export async function updateProject(updatedProject: Project): Promise<void> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cached = getCached();
  const index = cached.findIndex((p) => p.id === updatedProject.id);
  
  if (index !== -1) {
    cached[index] = updatedProject;
    setCached(cached);
  }
}

// ─── Legacy helpers (kept for backward compat) ───────────────────────────────

/** @deprecated Use publishProject instead */
export function saveProject(project: Project) {
  const cached = getCached();
  const idx = cached.findIndex((p) => p.id === project.id);
  if (idx !== -1) cached[idx] = project;
  else cached.unshift(project);
  setCached(cached);
}

/** @deprecated Use publishProject instead */
export function createProject(data: {
  name: string; description: string; language: string; category: string;
  tags: string[]; repository: string; type: "free" | "paid"; price?: number;
  thumbnail?: string; screenshots?: string[];
}): Project {
  return createLocalProject(data);
}

function createLocalProject(data: {
  name: string; description: string; language: string; category: string;
  tags: string[]; repository: string; type: "free" | "paid"; price?: number;
  thumbnail?: string; screenshots?: string[];
}): Project {
  const user = getUser();
  return {
    id: Date.now(),
    name: data.name,
    description: data.description,
    author: user?.username || "anon",
    stars: 0,
    language: data.language,
    tags: data.tags,
    repository: data.repository,
    createdAt: new Date().toISOString().split("T")[0],
    type: data.type,
    price: data.price,
    category: data.category,
    rating: 0,
    downloads: 0,
    featured: false,
  };
}
