/**
 * auth.ts — cliente de autenticação (frontend only - MOCK MODE)
 * Sistema de autenticação mockado sem integração com backend
 * Gera usuários fictícios e armazena no localStorage
 */

const TOKEN_KEY = "gitstore.token";
const USER_KEY  = "gitstore.user";
const USERS_DB_KEY = "gitstore.users.db"; // Banco de usuários mockados
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

// ─── Mock Helpers ────────────────────────────────────────────────────────────

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

// ─── Mock Database ───────────────────────────────────────────────────────────

interface MockUserDB {
  [email: string]: {
    password: string;
    user: User;
  };
}

function getMockDB(): MockUserDB {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMockDB(db: MockUserDB) {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
}

function generateMockToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

function generateUsername(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
}

function generateAvatar(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
}

function createMockUser(data: {
  name: string;
  username?: string;
  email: string;
}): User {
  const username = data.username || generateUsername(data.name);
  return {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name,
    username: username,
    email: data.email,
    avatar: generateAvatar(username),
    avatarZoom: 1,
    bio: "",
    location: "",
    website: "",
    company: "",
    twitter: "",
    linkedin: "",
    github: "",
    availability: "available",
    experience: "intermediate",
    createdAt: new Date().toISOString(),
  };
}

// ─── Auth actions (MOCK) ─────────────────────────────────────────────────────

export async function register(data: {
  name: string; username: string; email: string; password: string;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const db = getMockDB();

  // Verifica se email já existe
  if (db[data.email]) {
    return { ok: false, error: "Email já cadastrado." };
  }

  // Verifica se username já existe
  const usernameExists = Object.values(db).some(
    entry => entry.user.username === data.username
  );
  if (usernameExists) {
    return { ok: false, error: "Username já está em uso." };
  }

  // Cria novo usuário mockado
  const user = createMockUser({
    name: data.name,
    username: data.username,
    email: data.email,
  });

  // Salva no banco mockado
  db[data.email] = {
    password: data.password, // Em produção real, seria hash
    user: user,
  };
  saveMockDB(db);

  // Gera token e persiste sessão
  const token = generateMockToken(user.id);
  persist(token, user);

  return { ok: true, user };
}

export async function login(
  email: string, password: string
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));

  const db = getMockDB();
  const entry = db[email];

  // Verifica se usuário existe
  if (!entry) {
    return { ok: false, error: "Email não encontrado." };
  }

  // Verifica senha
  if (entry.password !== password) {
    return { ok: false, error: "Senha incorreta." };
  }

  // Gera token e persiste sessão
  const token = generateMockToken(entry.user.id);
  persist(token, entry.user);

  return { ok: true, user: entry.user };
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

  // Simula validação de token
  const user = getUser();
  if (!user) {
    logout();
    return null;
  }

  return user;
}

export async function saveProfile(data: Partial<User>): Promise<void> {
  const token = getToken();
  const current = getUser();
  if (!token || !current) return;

  const updated = { ...current, ...data };
  
  // Atualiza no localStorage
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  localStorage.setItem("gitstore.settings.profile", JSON.stringify(updated));
  
  // Atualiza no banco mockado
  const db = getMockDB();
  const entry = Object.entries(db).find(([_, e]) => e.user.id === current.id);
  if (entry) {
    const [email, userData] = entry;
    db[email] = {
      ...userData,
      user: updated,
    };
    saveMockDB(db);
  }
  
  dispatch();
}
