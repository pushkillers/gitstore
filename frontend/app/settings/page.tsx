"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  ImagePlus,
  Key,
  Link2,
  LogOut,
  Mail,
  Palette,
  Save,
  Shield,
  Smartphone,
  Trash2,
  User,
  X,
} from "lucide-react";
import { PROFILE_KEY, notifyProfileUpdate } from "@/lib/useProfile";
import { saveProfile, getToken } from "@/lib/auth";

type SectionId = "profile" | "notifications" | "security" | "appearance" | "api" | "connections";

interface SettingsSection {
  id: SectionId;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface ProfileData {
  avatar: string;
  avatarZoom: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  company: string;
  twitter: string;
  linkedin: string;
  github: string;
  availability: string;
  experience: string;
}

interface NotificationData {
  emailProjectUpdates: boolean;
  emailTeamInvites: boolean;
  emailMessages: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

interface SecurityData {
  twoFactorEnabled: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  sessions: Array<{ id: number; device: string; location: string; current: boolean; time: string }>;
}

interface AppearanceData {
  theme: "dark" | "light" | "auto";
  fontSize: "small" | "medium" | "large";
  compactMode: boolean;
}

interface ApiToken {
  id: number;
  name: string;
  lastUsed: string;
  created: string;
}

interface ApiData {
  tokens: ApiToken[];
}

const sections: SettingsSection[] = [
  { id: "profile", label: "Perfil", description: "Edite seu perfil público e links", icon: <User className="w-5 h-5" /> },
  { id: "notifications", label: "Notificações", description: "Controle alertas por email, push e navegador", icon: <Bell className="w-5 h-5" /> },
  { id: "security", label: "Segurança", description: "Gerencie senha, 2FA e sessões ativas", icon: <Shield className="w-5 h-5" /> },
  { id: "appearance", label: "Aparência", description: "Tema, fonte e densidade da interface", icon: <Palette className="w-5 h-5" /> },
  { id: "connections", label: "Conexões", description: "Conecte contas externas como Google", icon: <Link2 className="w-5 h-5" /> },
  { id: "api", label: "API & Tokens", description: "Crie e revogue tokens de acesso", icon: <Key className="w-5 h-5" /> },
];

const profileDefaults: ProfileData = {
  avatar: "",
  avatarZoom: 100,
  name: "",
  username: "",
  email: "",
  bio: "",
  location: "",
  website: "",
  company: "",
  twitter: "",
  linkedin: "",
  github: "",
  availability: "Disponível para projetos",
  experience: "Júnior",
};

const notificationDefaults: NotificationData = {
  emailProjectUpdates: true,
  emailTeamInvites: true,
  emailMessages: true,
  pushNotifications: true,
  browserNotifications: false,
  weeklyDigest: true,
  marketingEmails: false,
};

const securityDefaults: SecurityData = {
  twoFactorEnabled: false,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  sessions: [
    { id: 1, device: "Chrome em Windows", location: "São Paulo, Brasil", current: true, time: "Agora" },
    { id: 2, device: "Safari em iPhone", location: "São Paulo, Brasil", current: false, time: "2 dias atrás" },
    { id: 3, device: "Firefox em macOS", location: "Rio de Janeiro, Brasil", current: false, time: "1 semana atrás" },
  ],
};

const appearanceDefaults: AppearanceData = {
  theme: "dark",
  fontSize: "medium",
  compactMode: false,
};

const apiDefaults: ApiData = {
  tokens: [
    { id: 1, name: "Token de Desenvolvimento", lastUsed: "2 horas atrás", created: "3 meses atrás" },
    { id: 2, name: "CI/CD Pipeline", lastUsed: "5 minutos atrás", created: "1 mês atrás" },
  ],
};

function createAvatarPreview(label: string, start: string, end: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stop-color="${start}" /><stop offset="100%" stop-color="${end}" /></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#g)" /><text x="50%" y="54%" text-anchor="middle" font-size="38" font-family="Arial, sans-serif" font-weight="700" fill="white">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const recentAvatars = [
  createAvatarPreview("JS", "#ff9966", "#ff5e62"),
  createAvatarPreview("RX", "#667eea", "#764ba2"),
  createAvatarPreview("AI", "#11998e", "#38ef7d"),
  createAvatarPreview("DB", "#f7971e", "#ffd200"),
  createAvatarPreview("UX", "#ee0979", "#ff6a00"),
  createAvatarPreview("GO", "#36d1dc", "#5b86e5"),
];

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function usePersistentSection<T>(storageKey: string, defaults: T) {
  const [saved, setSaved] = useState<T>(defaults);
  const [draft, setDraft] = useState<T>(defaults);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        setSaved(parsed);
        setDraft(parsed);
      }
    } catch {
      /* ignore */
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!saveLabel) return;
    const t = window.setTimeout(() => setSaveLabel(""), 2200);
    return () => window.clearTimeout(t);
  }, [saveLabel]);

  const isDirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [draft, saved]);

  const save = () => {
    setIsSaving(true);
    window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      if (storageKey === PROFILE_KEY) {
        saveProfile(draft as Record<string, unknown>);
        notifyProfileUpdate();
      }
      setSaved(draft);
      setIsSaving(false);
      setSaveLabel("Alterações salvas");
    }, 450);
  };

  const reset = () => {
    setDraft(saved);
    setSaveLabel("Alterações descartadas");
  };

  const restoreDefaults = () => {
    setDraft(defaults);
    setSaved(defaults);
    window.localStorage.setItem(storageKey, JSON.stringify(defaults));
    if (storageKey === PROFILE_KEY) notifyProfileUpdate();
    setSaveLabel("Padrões restaurados");
  };

  return { saved, draft, setDraft, isSaving, isDirty, isLoaded, save, reset, restoreDefaults, saveLabel };
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 flex-shrink-0 rounded-full transition-all",
        checked ? "bg-[#238636]" : "bg-[#30363d]"
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ActionBar({
  onCancel,
  onSave,
  saveLabel,
  isSaving,
  isDirty,
  saveText,
  cancelText = "Cancelar",
}: {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  isSaving: boolean;
  isDirty: boolean;
  saveText: string;
  cancelText?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#30363d] pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#7d8590]">
        {saveLabel || (isDirty ? "Você tem alterações não salvas" : "Tudo sincronizado")}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#c8d1dc] transition-all hover:bg-[#21262d]"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando..." : saveText}
        </button>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#e6edf3]">{title}</h2>
        <p className="mt-1 text-sm text-[#7d8590]">{description}</p>
      </div>
      {children}
    </div>
  );
}

function inputCls(extra?: string) {
  return cn(
    "w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-[#e6edf3] outline-none transition-all",
    "placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15",
    extra
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");

  return (
    <div className="min-h-screen bg-[#0d1117] py-8">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e6edf3]">Configurações</h1>
          <p className="mt-2 text-[#7d8590]">Gerencie suas preferências e configurações da conta</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                      activeSection === section.id
                        ? "border-[#58a6ff]/20 bg-[#58a6ff]/10 text-[#e6edf3]"
                        : "border-transparent text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]"
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0">{section.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{section.label}</p>
                      <p className="mt-0.5 text-xs leading-5 text-[#7d8590]">{section.description}</p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0 transition-transform",
                        activeSection === section.id && "translate-x-0.5 text-[#58a6ff]"
                      )}
                    />
                  </button>
                ))}
              </nav>

              <div className="mt-4 border-t border-[#30363d] pt-4">
                <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-[#f85149]">
                  Zona de perigo
                </p>
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[#ff8a84] transition-all hover:bg-[#f8514915]">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sair de todas</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[#ff8a84] transition-all hover:bg-[#f8514915]">
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Excluir conta</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 space-y-6">
            {activeSection === "profile" && <ProfileSettings />}
            {activeSection === "notifications" && <NotificationSettings />}
            {activeSection === "security" && <SecuritySettings />}
            {activeSection === "appearance" && <AppearanceSettings />}
            {activeSection === "connections" && <ConnectionsSettings />}
            {activeSection === "api" && <ApiSettings />}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const settings = usePersistentSection(PROFILE_KEY, profileDefaults);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState("");
  const [pendingZoom, setPendingZoom] = useState(100);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  if (!settings.isLoaded) return null;

  const data = settings.draft;
  const initials = data.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const zoom = Math.min(Math.max(data.avatarZoom || 100, 80), 200);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAvatar(typeof reader.result === "string" ? reader.result : "");
      setPendingZoom(data.avatarZoom || 100);
      setIsAvatarModalOpen(false);
      setIsEditorOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <SettingsCard
      title="Perfil Público"
      description="Essas informações serão exibidas publicamente no seu perfil."
    >
      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-[#238636]">
            {data.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.avatar}
                alt={`Avatar de ${data.name}`}
                className="h-full w-full object-cover"
                style={{ transform: `scale(${zoom / 100})` }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                {initials}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="rounded-xl border border-[#30363d] px-4 py-2 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
              >
                Alterar avatar
              </button>
              {data.avatar && (
                <button
                  type="button"
                  onClick={() => settings.setDraft({ ...data, avatar: "" })}
                  className="rounded-xl border border-[#f85149]/25 px-4 py-2 text-sm font-medium text-[#ff8a84] transition-all hover:bg-[#f8514915]"
                >
                  Remover
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <p className="mt-2 text-xs text-[#6e7681]">JPG, GIF, PNG ou WEBP. Máximo 1MB.</p>
          </div>
        </div>

        {/* Avatar Modal */}
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Selecione uma imagem</h3>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="rounded-xl p-2 text-[#7d8590] transition-all hover:bg-white/8 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#30363d] py-10 transition-all hover:border-[#58a6ff]/50 hover:bg-[#58a6ff]/5"
              >
                <ImagePlus className="h-8 w-8 text-[#7d8590]" />
                <span className="font-medium text-[#e6edf3]">Enviar imagem</span>
                <span className="text-xs text-[#7d8590]">JPG, PNG, GIF ou WEBP até 1MB</span>
              </button>
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-[#e6edf3]">Avatares recentes</p>
                <div className="flex flex-wrap gap-3">
                  {recentAvatars.map((avatar, i) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => {
                        setPendingAvatar(avatar);
                        setPendingZoom(100);
                        setIsAvatarModalOpen(false);
                        setIsEditorOpen(true);
                      }}
                      className={cn(
                        "overflow-hidden rounded-full border-2 transition-all",
                        data.avatar === avatar ? "border-[#58a6ff]" : "border-transparent hover:border-white/20"
                      )}
                      aria-label={`Avatar recente ${i + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatar} alt="" className="h-12 w-12 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Avatar Editor */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Editar imagem</h3>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-xl p-2 text-[#7d8590] transition-all hover:bg-white/8 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-center">
                <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-white/20">
                  {pendingAvatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pendingAvatar}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      style={{ transform: `scale(${pendingZoom / 100})` }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm text-[#7d8590]">
                  <span>Zoom</span>
                  <span>{pendingZoom}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="5"
                  value={pendingZoom}
                  onChange={(e) => setPendingZoom(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#30363d] accent-[#58a6ff]"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-xl border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    settings.setDraft({ ...data, avatar: pendingAvatar, avatarZoom: pendingZoom });
                    setIsEditorOpen(false);
                  }}
                  className="rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Nome</label>
            <input type="text" value={data.name} onChange={(e) => settings.setDraft({ ...data, name: e.target.value })} className={inputCls()} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Nome de usuário</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]">@</span>
              <input type="text" value={data.username} onChange={(e) => settings.setDraft({ ...data, username: e.target.value })} className={inputCls("pl-8")} />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#e6edf3]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7d8590]" />
              <input type="email" value={data.email} onChange={(e) => settings.setDraft({ ...data, email: e.target.value })} className={inputCls("pl-10")} />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2 xl:col-span-4">
            <label className="text-sm font-medium text-[#e6edf3]">Bio</label>
            <textarea
              rows={3}
              value={data.bio}
              onChange={(e) => settings.setDraft({ ...data, bio: e.target.value.slice(0, 160) })}
              className={inputCls("resize-none")}
              placeholder="Fale um pouco sobre você..."
            />
            <p className="text-xs text-[#6e7681]">{data.bio.length}/160 caracteres</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Localização</label>
            <input type="text" value={data.location} onChange={(e) => settings.setDraft({ ...data, location: e.target.value })} className={inputCls()} placeholder="Cidade, País" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Website</label>
            <input type="url" value={data.website} onChange={(e) => settings.setDraft({ ...data, website: e.target.value })} className={inputCls()} placeholder="https://seusite.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Empresa</label>
            <input type="text" value={data.company} onChange={(e) => settings.setDraft({ ...data, company: e.target.value })} className={inputCls()} placeholder="Onde você trabalha" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Twitter/X</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]">@</span>
              <input type="text" value={data.twitter} onChange={(e) => settings.setDraft({ ...data, twitter: e.target.value })} className={inputCls("pl-8")} placeholder="username" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">LinkedIn</label>
            <input type="url" value={data.linkedin} onChange={(e) => settings.setDraft({ ...data, linkedin: e.target.value })} className={inputCls()} placeholder="linkedin.com/in/username" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">GitHub</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7d8590]">github.com/</span>
              <input type="text" value={data.github} onChange={(e) => settings.setDraft({ ...data, github: e.target.value })} className={inputCls("pl-[92px]")} placeholder="username" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Disponibilidade</label>
            <select value={data.availability} onChange={(e) => settings.setDraft({ ...data, availability: e.target.value })} className={inputCls()}>
              <option>Disponível para projetos</option>
              <option>Ocupado</option>
              <option>Procurando equipe</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#e6edf3]">Nível de experiência</label>
            <select value={data.experience} onChange={(e) => settings.setDraft({ ...data, experience: e.target.value })} className={inputCls()}>
              <option>Júnior</option>
              <option>Pleno</option>
              <option>Sênior</option>
              <option>Especialista</option>
            </select>
          </div>
        </div>

        <ActionBar
          onCancel={settings.reset}
          onSave={settings.save}
          saveLabel={settings.saveLabel}
          isSaving={settings.isSaving}
          isDirty={settings.isDirty}
          saveText="Salvar alterações"
        />
      </div>
    </SettingsCard>
  );
}

function NotificationSettings() {
  const settings = usePersistentSection("gitstore.settings.notifications", notificationDefaults);

  if (!settings.isLoaded) return null;

  const items = [
    { key: "emailProjectUpdates", label: "Atualizações de projetos", desc: "Novas atividades nos projetos que você segue" },
    { key: "emailTeamInvites", label: "Convites de equipe", desc: "Quando for convidado para uma nova equipe" },
    { key: "emailMessages", label: "Mensagens diretas", desc: "Quando alguém te enviar uma mensagem" },
    { key: "weeklyDigest", label: "Resumo semanal", desc: "Resumo das atividades mais importantes" },
    { key: "marketingEmails", label: "Emails de marketing", desc: "Novidades, atualizações e ofertas especiais" },
    { key: "pushNotifications", label: "Notificações push", desc: "Receba alertas em seu dispositivo móvel" },
    { key: "browserNotifications", label: "Notificações no navegador", desc: "Receba alertas mesmo com a aba fechada" },
  ] as const;

  return (
    <SettingsCard
      title="Notificações"
      description="Escolha como e quando deseja ser notificado."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
              <div>
                <p className="font-medium text-[#e6edf3]">{item.label}</p>
                <p className="mt-1 text-sm text-[#7d8590]">{item.desc}</p>
              </div>
              <Toggle
                checked={settings.draft[item.key]}
                onChange={(v) => settings.setDraft({ ...settings.draft, [item.key]: v })}
              />
            </div>
          ))}
        </div>
        <ActionBar
          onCancel={settings.reset}
          onSave={settings.save}
          saveLabel={settings.saveLabel}
          isSaving={settings.isSaving}
          isDirty={settings.isDirty}
          saveText="Salvar preferências"
        />
      </div>
    </SettingsCard>
  );
}

function SecuritySettings() {
  const settings = usePersistentSection("gitstore.settings.security", securityDefaults);

  if (!settings.isLoaded) return null;

  const data = settings.draft;
  const passwordMismatch =
    data.newPassword.length > 0 && data.confirmPassword.length > 0 && data.newPassword !== data.confirmPassword;

  return (
    <SettingsCard
      title="Segurança"
      description="Gerencie senha, autenticação em dois fatores e sessões ativas."
    >
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Password */}
          <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161b22]">
                <Shield className="h-5 w-5 text-[#58a6ff]" />
              </div>
              <div>
                <p className="font-medium text-[#e6edf3]">Alterar senha</p>
                <p className="text-sm text-[#7d8590]">Última alteração há 3 meses</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e6edf3]">Senha atual</label>
                <input type="password" value={data.currentPassword} onChange={(e) => settings.setDraft({ ...data, currentPassword: e.target.value })} className={inputCls()} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e6edf3]">Nova senha</label>
                <input type="password" value={data.newPassword} onChange={(e) => settings.setDraft({ ...data, newPassword: e.target.value })} className={inputCls()} placeholder="Mínimo 8 caracteres" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e6edf3]">Confirmar nova senha</label>
                <input type="password" value={data.confirmPassword} onChange={(e) => settings.setDraft({ ...data, confirmPassword: e.target.value })} className={inputCls()} placeholder="••••••••" />
              </div>
              {passwordMismatch && <p className="text-sm text-[#f85149]">A confirmação da senha não confere.</p>}
            </div>
          </div>

          {/* 2FA */}
          <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161b22]">
                <Smartphone className="h-5 w-5 text-[#58a6ff]" />
              </div>
              <div>
                <p className="font-medium text-[#e6edf3]">Autenticação em dois fatores</p>
                <p className="text-sm text-[#7d8590]">
                  {data.twoFactorEnabled ? "Ativado via app autenticador" : "Adicione uma camada extra de segurança"}
                </p>
              </div>
            </div>
            <Toggle
              checked={data.twoFactorEnabled}
              onChange={(v) => settings.setDraft({ ...data, twoFactorEnabled: v })}
            />
          </div>
        </div>

        {/* Sessions */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#7d8590]">Sessões ativas</h3>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {data.sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#161b22]">
                    <Smartphone className="h-4 w-4 text-[#7d8590]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#e6edf3]">
                      {session.device}
                      {session.current && (
                        <span className="ml-2 rounded-full bg-[#238636]/20 px-2 py-0.5 text-xs text-[#3fb950]">Atual</span>
                      )}
                    </p>
                    <p className="truncate text-sm text-[#7d8590]">{session.location} • {session.time}</p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    onClick={() => settings.setDraft({ ...data, sessions: data.sessions.filter((s) => s.id !== session.id) })}
                    className="flex-shrink-0 text-sm font-medium text-[#f85149] hover:underline"
                  >
                    Revogar
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <ActionBar
          onCancel={settings.reset}
          onSave={settings.save}
          saveLabel={settings.saveLabel}
          isSaving={settings.isSaving}
          isDirty={settings.isDirty}
          saveText="Salvar segurança"
        />
      </div>
    </SettingsCard>
  );
}

function AppearanceSettings() {
  const settings = usePersistentSection("gitstore.settings.appearance", appearanceDefaults);

  if (!settings.isLoaded) return null;

  const themes = [
    { id: "dark", label: "Escuro", desc: "O tema padrão do GitStore", preview: "#0d1117" },
    { id: "light", label: "Claro", desc: "Para ambientes bem iluminados", preview: "#f6f8fa" },
    { id: "auto", label: "Automático", desc: "Segue as preferências do sistema", preview: "linear-gradient(135deg,#0d1117 50%,#f6f8fa 50%)" },
  ] as const;

  return (
    <SettingsCard
      title="Aparência"
      description="Personalize como o GitStore aparece para você."
    >
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-[#e6edf3]">Tema</label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => settings.setDraft({ ...settings.draft, theme: theme.id })}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  settings.draft.theme === theme.id
                    ? "border-[#58a6ff] bg-[#58a6ff]/8"
                    : "border-[#30363d] hover:border-[#58a6ff]/40"
                )}
              >
                <div className="mb-3 h-12 rounded-lg border border-[#30363d]" style={{ background: theme.preview }} />
                <p className="font-medium text-[#e6edf3]">{theme.label}</p>
                <p className="mt-1 text-xs text-[#7d8590]">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#30363d]" />

        <div>
          <label className="mb-3 block text-sm font-medium text-[#e6edf3]">Tamanho da fonte</label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "small", label: "Pequeno", size: "14px" },
              { id: "medium", label: "Médio", size: "16px" },
              { id: "large", label: "Grande", size: "18px" },
            ] as const).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => settings.setDraft({ ...settings.draft, fontSize: item.id })}
                className={cn(
                  "rounded-xl border px-4 py-3 transition-all",
                  settings.draft.fontSize === item.id
                    ? "border-[#58a6ff] bg-[#58a6ff]/8 text-[#8ec2ff]"
                    : "border-[#30363d] text-[#7d8590] hover:border-[#58a6ff]/40"
                )}
                style={{ fontSize: item.size }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#30363d]" />

        <div className="flex items-center justify-between rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <div>
            <p className="font-medium text-[#e6edf3]">Modo compacto</p>
            <p className="text-sm text-[#7d8590]">Reduz espaçamentos e deixa a interface mais densa</p>
          </div>
          <Toggle
            checked={settings.draft.compactMode}
            onChange={(v) => settings.setDraft({ ...settings.draft, compactMode: v })}
          />
        </div>

        <ActionBar
          onCancel={settings.reset}
          onSave={settings.save}
          saveLabel={settings.saveLabel}
          isSaving={settings.isSaving}
          isDirty={settings.isDirty}
          saveText="Aplicar tema"
          cancelText="Descartar"
        />
      </div>
    </SettingsCard>
  );
}

function ApiSettings() {
  const settings = usePersistentSection("gitstore.settings.api", apiDefaults);
  const [showNewToken, setShowNewToken] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");

  if (!settings.isLoaded) return null;

  const generateToken = () => {
    const token = "ghp_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedToken(token);
    settings.setDraft({
      tokens: [...settings.draft.tokens, { id: Date.now(), name: newTokenName, lastUsed: "Nunca", created: "Agora" }],
    });
    setShowNewToken(false);
    setNewTokenName("");
  };

  return (
    <SettingsCard
      title="API & Tokens de Acesso"
      description="Crie e revogue tokens para acesso programático à API."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-[#e6edf3]">Tokens pessoais</p>
            <p className="text-sm text-[#7d8590]">{settings.draft.tokens.length} tokens ativos</p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewToken(true)}
            className="rounded-xl bg-[linear-gradient(135deg,#1f6feb,#3279db)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            Gerar novo token
          </button>
        </div>

        {showNewToken && (
          <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#e6edf3]">Nome do token</label>
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                className={inputCls()}
                placeholder="Ex: Integração Slack"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowNewToken(false)}
                className="rounded-xl border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={generateToken}
                disabled={!newTokenName.trim()}
                className="rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                Gerar token
              </button>
            </div>
          </div>
        )}

        {generatedToken && (
          <div className="rounded-xl border border-[#238636]/30 bg-[#238636]/10 p-4">
            <p className="font-medium text-[#3fb950]">Token gerado com sucesso!</p>
            <p className="mt-1 text-sm text-[#7d8590]">Copie agora. Você não poderá vê-lo novamente.</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <code className="flex-1 break-all rounded-xl bg-[#0d1117] px-3 py-2 font-mono text-sm text-[#e6edf3]">
                {generatedToken}
              </code>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(generatedToken)}
                className="rounded-xl border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {settings.draft.tokens.map((token) => (
            <div key={token.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-[#e6edf3]">{token.name}</p>
                <p className="text-sm text-[#7d8590]">Último: {token.lastUsed} • Criado: {token.created}</p>
              </div>
              <button
                type="button"
                onClick={() => settings.setDraft({ tokens: settings.draft.tokens.filter((t) => t.id !== token.id) })}
                className="flex-shrink-0 text-sm font-medium text-[#f85149] hover:underline"
              >
                Revogar
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <h3 className="font-medium text-[#e6edf3]">Documentação da API</h3>
          <p className="mt-1 text-sm text-[#7d8590]">Aprenda como integrar com nossa API RESTful.</p>
          <a href="#" className="mt-3 inline-block text-sm font-medium text-[#58a6ff] hover:underline">
            Ver documentação →
          </a>
        </div>

        <ActionBar
          onCancel={settings.reset}
          onSave={settings.save}
          saveLabel={settings.saveLabel}
          isSaving={settings.isSaving}
          isDirty={settings.isDirty}
          saveText="Salvar tokens"
        />
      </div>
    </SettingsCard>
  );
}

function ConnectionsSettings() {
  const API = "/api/backend";
  const BACKEND_DIRECT = "http://localhost:3001"; // para redirects OAuth
  const token = getToken();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [msg, setMsg] = useState("");

  // Lê status da conexão Google do backend
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(({ user }) => {
        setGoogleConnected(!!user?.googleConnected);
        setGoogleEmail(user?.googleEmail ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Detecta retorno do callback de conexão
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "google") {
      setMsg("Google conectado com sucesso!");
      window.history.replaceState({}, "", "/settings");
    }
    if (params.get("error") === "google_already_linked") {
      setMsg("Esta conta Google já está vinculada a outro usuário.");
      window.history.replaceState({}, "", "/settings");
    }
  }, [API, token]);

  const handleConnect = () => {
    if (!token) return;
    window.location.href = `${BACKEND_DIRECT}/auth/google/connect?auth=${token}`;
  };

  const handleDisconnect = async () => {
    if (!token) return;
    setDisconnecting(true);
    try {
      const res = await fetch(`${API}/auth/google/disconnect`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) { setMsg(json.error); return; }
      setGoogleConnected(false);
      setGoogleEmail(null);
      setMsg("Google desconectado.");
    } catch {
      setMsg("Erro ao desconectar.");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <SettingsCard
      title="Conexões"
      description="Conecte contas externas para fazer login mais rápido ou importar dados."
    >
      {loading ? (
        <div className="py-8 text-center text-sm text-[#7d8590]">Carregando...</div>
      ) : (
        <div className="space-y-4">
          {msg && (
            <div className={`rounded-xl border px-4 py-3 text-sm ${
              msg.includes("sucesso") || msg.includes("desconectado")
                ? "border-[#3fb950]/20 bg-[#3fb950]/8 text-[#3fb950]"
                : "border-[#f85149]/20 bg-[#f8514915] text-[#ff8a84]"
            }`}>
              {msg}
            </div>
          )}

          {/* Google */}
          <div className="flex items-center justify-between rounded-2xl border border-[#30363d] bg-[#0d1117] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22]">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-[#e6edf3]">Google</p>
                {googleConnected && googleEmail
                  ? <p className="mt-0.5 text-sm text-[#7d8590]">Conectado como <span className="text-[#3fb950]">{googleEmail}</span></p>
                  : <p className="mt-0.5 text-sm text-[#7d8590]">Faça login com sua conta Google</p>
                }
              </div>
            </div>

            {googleConnected ? (
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="rounded-xl border border-[#f85149]/20 px-4 py-2 text-sm font-medium text-[#ff8a84] transition-all hover:bg-[#f8514915] disabled:opacity-50"
              >
                {disconnecting ? "Desconectando..." : "Desconectar"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                className="rounded-xl bg-[linear-gradient(135deg,#1f6feb,#3279db)] px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
              >
                Conectar
              </button>
            )}
          </div>

          <p className="text-xs text-[#7d8590]">
            Ao conectar o Google, você poderá usar "Continuar com Google" na tela de login para acessar esta conta.
          </p>
        </div>
      )}
    </SettingsCard>
  );
}
