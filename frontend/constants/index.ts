export const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "Ruby",
] as const;

export const CATEGORIES = [
  "Todos",
  "E-commerce",
  "Inteligência Artificial",
  "Produtividade",
  "Redes Sociais",
  "Analytics",
  "CMS",
  "Fintech",
  "Blog",
] as const;

export const PROJECT_TYPES = [
  { value: "all", label: "Todos" },
  { value: "free", label: "Gratuitos" },
  { value: "paid", label: "Pagos" },
] as const;

export const ROUTES = {
  HOME: "/",
  PROJECTS: "/projects",
  PROJECT_DETAIL: (id: number) => `/projects/${id}`,
  TEAMS: "/teams",
  TEAM_DETAIL: (id: number) => `/teams/${id}`,
  DEVELOPERS: "/developers",
  DEVELOPER_PROFILE: (username: string) => `/developers/${username}`,
  JOBS: "/jobs",
  JOB_DETAIL: (id: number) => `/jobs/${id}`,
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;
