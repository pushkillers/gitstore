import { Project } from "@/types";
import { getToken, getUser } from "./auth";

const API = "/api/backend";
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

// ─── API calls ────────────────────────────────────────────────────────────────

/** Fetch all projects from backend and sync local cache. */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API}/projects`);
    if (!res.ok) throw new Error("fetch failed");
    const json = await res.json();
    const backendProjects: Project[] = json.projects ?? [];
    setCached(backendProjects);
    return backendProjects;
  } catch {
    return getCached();
  }
}

/** Fetch projects for a specific user. */
export async function fetchMyProjects(): Promise<Project[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API}/projects?authorId=${getUser()?.id ?? ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("fetch failed");
    const json = await res.json();
    return json.projects ?? [];
  } catch {
    return getCached().filter((p) => p.author === getUser()?.username);
  }
}

/** Publish a new project to the backend (with local optimistic update). */
export async function publishProject(data: {
  name: string;
  description: string;
  language: string;
  category: string;
  tags: string[];
  repository: string;
  type: "free" | "paid" | "freemium";
  price?: number;
}): Promise<{ ok: true; project: Project } | { ok: false; error: string }> {
  const token = getToken();
  if (!token) return { ok: false, error: "Você precisa estar logado." };

  try {
    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error ?? "Erro ao publicar." };

    const project: Project = json.project;
    // Optimistic: prepend to local cache
    const cached = getCached();
    const ids = new Set(cached.map((p) => p.id));
    if (!ids.has(project.id)) setCached([project, ...cached]);

    return { ok: true, project };
  } catch {
    // Fallback: save locally only
    const project = createLocalProject(data);
    const cached = getCached();
    setCached([project, ...cached]);
    return { ok: true, project };
  }
}

/** Delete a project (backend + local cache). */
export async function deleteProject(id: number): Promise<void> {
  const token = getToken();
  // Optimistic local removal
  setCached(getCached().filter((p) => p.id !== id));

  if (!token) return;
  try {
    await fetch(`${API}/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch { /* ignore */ }
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
  tags: string[]; repository: string; type: "free" | "paid" | "freemium"; price?: number;
}): Project {
  return createLocalProject(data);
}

function createLocalProject(data: {
  name: string; description: string; language: string; category: string;
  tags: string[]; repository: string; type: "free" | "paid" | "freemium"; price?: number;
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
