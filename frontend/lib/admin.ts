/**
 * Admin auth — armazenado em sessionStorage (some ao fechar o browser)
 */

const API = "/api/backend";
const KEY = "gitstore.admin.token";
const ADMIN_KEY = "gitstore.admin.name";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function getAdminName(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ADMIN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}

export function adminLogout() {
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem(ADMIN_KEY);
}

export async function adminLogin(
  username: string,
  password: string
): Promise<{ ok: true; admin: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error ?? "Credenciais inválidas." };
    sessionStorage.setItem(KEY, json.token);
    sessionStorage.setItem(ADMIN_KEY, json.admin);
    return { ok: true, admin: json.admin };
  } catch {
    return { ok: false, error: "Backend indisponível." };
  }
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
  if (res.status === 401) {
    adminLogout();
    window.location.href = "/admin";
    throw new Error("Sessão expirada.");
  }
  return res;
}

export async function fetchAdminStats() {
  const res = await adminFetch("/admin/stats");
  return res.json();
}

export async function fetchAdminUsers() {
  const res = await adminFetch("/admin/users");
  return res.json();
}

export async function deleteAdminUser(id: string) {
  await adminFetch(`/admin/users/${id}`, { method: "DELETE" });
}

export async function fetchAdminProjects() {
  const res = await adminFetch("/admin/projects");
  return res.json();
}

export async function deleteAdminProject(id: number) {
  await adminFetch(`/admin/projects/${id}`, { method: "DELETE" });
}
