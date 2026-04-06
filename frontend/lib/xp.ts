/**
 * Sistema de XP e Níveis
 * - Projeto publicado: +100 XP
 * - Curtida recebida: +10 XP
 * - Curtida dada: +2 XP
 */

export const XP_RULES = {
  PROJECT_CREATED: 100,
  LIKE_RECEIVED:   10,
  LIKE_GIVEN:      2,
};

const XP_KEY = "gitstore.xp";
const LIKES_KEY = "gitstore.likes"; // projetos que o usuário curtiu
const XP_EVENT = "gitstore.xp.change";

export interface XPData {
  total: number;
  projectsCreated: number;
  likesReceived: number;
  likesGiven: number;
}

export function getXP(): XPData {
  try {
    const raw = localStorage.getItem(XP_KEY);
    return raw ? JSON.parse(raw) : { total: 0, projectsCreated: 0, likesReceived: 0, likesGiven: 0 };
  } catch { return { total: 0, projectsCreated: 0, likesReceived: 0, likesGiven: 0 }; }
}

function saveXP(data: XPData) {
  localStorage.setItem(XP_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(XP_EVENT));
}

export function addXP(type: keyof typeof XP_RULES) {
  const data = getXP();
  data.total += XP_RULES[type];
  if (type === "PROJECT_CREATED") data.projectsCreated++;
  if (type === "LIKE_RECEIVED")   data.likesReceived++;
  if (type === "LIKE_GIVEN")      data.likesGiven++;
  saveXP(data);
}

/** Calcula nível a partir do XP total */
export function calcLevel(xp: number): { level: number; currentXp: number; nextXp: number; pct: number; title: string } {
  // XP necessário por nível cresce progressivamente
  let level = 1;
  let threshold = 200;
  let accumulated = 0;

  while (xp >= accumulated + threshold) {
    accumulated += threshold;
    level++;
    threshold = Math.floor(threshold * 1.3);
  }

  const currentXp = xp - accumulated;
  const pct = Math.min(100, Math.round((currentXp / threshold) * 100));

  const titles: Record<number, string> = {
    1: "Iniciante", 2: "Aprendiz", 3: "Desenvolvedor", 4: "Colaborador",
    5: "Contribuidor", 6: "Especialista", 7: "Sênior", 8: "Expert",
    9: "Mestre", 10: "Lenda",
  };
  const title = titles[Math.min(level, 10)] ?? "Lenda";

  return { level, currentXp, nextXp: threshold, pct, title };
}

/** Gerencia curtidas */
export function getLikedProjects(): number[] {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function toggleLike(projectId: number): boolean {
  const liked = getLikedProjects();
  const isLiked = liked.includes(projectId);

  if (isLiked) {
    localStorage.setItem(LIKES_KEY, JSON.stringify(liked.filter((id) => id !== projectId)));
    return false;
  } else {
    localStorage.setItem(LIKES_KEY, JSON.stringify([...liked, projectId]));
    addXP("LIKE_GIVEN");
    return true;
  }
}

export const XP_EVENT_NAME = XP_EVENT;
