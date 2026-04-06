import { Project } from "@/types";
import { getUser } from "./auth";

const STORAGE_KEY = "gitstore.published_projects";
const CHANGE_EVENT = "gitstore.projects.change";

export function getPublishedProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveProject(project: Project) {
  const projects = getPublishedProjects();
  const existing = projects.findIndex((p) => p.id === project.id);
  if (existing !== -1) {
    projects[existing] = project;
  } else {
    projects.unshift(project); // mais recente primeiro
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function deleteProject(id: number) {
  const projects = getPublishedProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function createProject(data: {
  name: string;
  description: string;
  language: string;
  category: string;
  tags: string[];
  repository: string;
  type: "free" | "paid" | "freemium";
  price?: number;
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

export const PROJECTS_CHANGE_EVENT = CHANGE_EVENT;
