/**
 * auth.ts — cliente de autenticação (frontend only)
 * Faz fetch para o backend Express em localhost:3001
 * Armazena token JWT e dados do usuário no localStorage
 */

const API = "/api/backend";
const TOKEN_KEY = "gitstore.token";
const USER_KEY  = "gitstore.user";
export const AUTH_EVENT_NAME = "gitstore.auth.change";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  avatarZoom: number;
  bio: string;
  location: string;
  website: string;
  company: string;
  twitter: string;
  linkedin: string;
  github: string;
  availability: string;
  experience: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dispatch() {
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  window.dispatchEvent(new Event("gitstore.profile.update"));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

function persist(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem("gitstore.settings.profile", JSON.stringify(user));
  dispatch();
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export async function register(data: {
  name: string; username: string; email: string; password: string;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error ?? "Erro ao cadastrar." };
    persist(json.token, json.user);
    return { ok: true, user: json.user };
  } catch {
    return { ok: false, error: "Backend indisponível. Inicie o servidor." };
  }
}

export async function login(
  email: string, password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error ?? "Credenciais inválidas." };
    persist(json.token, json.user);
    return { ok: true, user: json.user };
  } catch {
    return { ok: false, error: "Backend indisponível. Inicie o servidor." };
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("gitstore.settings.profile");
  dispatch();
}

export async function restoreSession(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { logout(); return null; }
    const { user } = await res.json();
    persist(token, user);
    return user;
  } catch { return null; }
}

export async function saveProfile(data: Partial<User>): Promise<void> {
  const token = getToken();
  const current = getUser();
  if (!token || !current) return;

  const updated = { ...current, ...data };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  localStorage.setItem("gitstore.settings.profile", JSON.stringify(updated));
  dispatch();

  // Persiste no backend em background
  fetch(`${API}/auth/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  }).catch(() => {});
}
