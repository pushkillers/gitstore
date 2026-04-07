/**
 * Admin auth — armazenado em sessionStorage (some ao fechar o browser)
 * MOCK MODE - sem integração com backend
 */

const KEY = "gitstore.admin.token";
const ADMIN_KEY = "gitstore.admin.name";

// Credenciais mockadas (em produção real, isso seria validado no backend)
const MOCK_ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
};

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
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  // Valida credenciais mockadas
  if (username !== MOCK_ADMIN_CREDENTIALS.username || password !== MOCK_ADMIN_CREDENTIALS.password) {
    return { ok: false, error: "Credenciais inválidas." };
  }

  // Gera token mockado
  const token = `mock_admin_token_${Date.now()}`;
  sessionStorage.setItem(KEY, token);
  sessionStorage.setItem(ADMIN_KEY, username);
  
  return { ok: true, admin: username };
}

// ─── Mock Admin API ──────────────────────────────────────────────────────────

export async function fetchAdminStats() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retorna estatísticas mockadas
  return {
    totalUsers: 150,
    totalProjects: 89,
    activeUsers: 42,
    revenue: 12450.00,
    growth: {
      users: 12,
      projects: 8,
      revenue: 15.5
    }
  };
}

export async function fetchAdminUsers() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retorna usuários mockados do localStorage
  const usersDB = localStorage.getItem("gitstore.users.db");
  const users = usersDB ? Object.values(JSON.parse(usersDB)).map((entry: any) => entry.user) : [];
  
  return { users };
}

export async function deleteAdminUser(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove usuário do localStorage
  const usersDB = localStorage.getItem("gitstore.users.db");
  if (usersDB) {
    const db = JSON.parse(usersDB);
    const email = Object.keys(db).find(key => db[key].user.id === id);
    if (email) {
      delete db[email];
      localStorage.setItem("gitstore.users.db", JSON.stringify(db));
    }
  }
}

export async function fetchAdminProjects() {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Retorna projetos mockados do localStorage
  const projects = localStorage.getItem("gitstore.published_projects");
  return { projects: projects ? JSON.parse(projects) : [] };
}

export async function deleteAdminProject(id: number) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Remove projeto do localStorage
  const projects = localStorage.getItem("gitstore.published_projects");
  if (projects) {
    const parsed = JSON.parse(projects);
    const filtered = parsed.filter((p: any) => p.id !== id);
    localStorage.setItem("gitstore.published_projects", JSON.stringify(filtered));
    window.dispatchEvent(new Event("gitstore.projects.change"));
  }
}
