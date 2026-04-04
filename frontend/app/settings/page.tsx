"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Key, 
  Mail, 
  Smartphone,
  Save,
  ChevronRight,
  LogOut,
  Trash2
} from "lucide-react";

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const sections: SettingsSection[] = [
  { id: "profile", label: "Perfil", icon: <User className="w-5 h-5" /> },
  { id: "notifications", label: "Notificações", icon: <Bell className="w-5 h-5" /> },
  { id: "security", label: "Segurança", icon: <Shield className="w-5 h-5" /> },
  { id: "appearance", label: "Aparência", icon: <Palette className="w-5 h-5" /> },
  { id: "api", label: "API & Tokens", icon: <Key className="w-5 h-5" /> },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen bg-github-canvas-default">
      <div className="flex">
        {/* Sidebar fixa à esquerda */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-github-canvas-subtle border-r border-github-border-default overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-github-fg-default mb-6 px-4">Configurações</h2>
            
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? "bg-github-canvas-default text-github-fg-default border border-github-border-default"
                      : "text-github-fg-muted hover:bg-github-canvas-default hover:text-github-fg-default"
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? "rotate-90" : ""
                  }`} />
                </button>
              ))}
            </nav>

            {/* Danger Zone */}
            <div className="mt-8 pt-6 border-t border-github-border-default">
              <h3 className="text-sm font-semibold text-github-danger-fg mb-4 px-4">
                Zona de Perigo
              </h3>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-github-danger-fg hover:bg-github-danger-fg/10 transition-all">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair de todas</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-github-danger-fg hover:bg-github-danger-fg/10 transition-all mt-1">
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Excluir conta</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Conteúdo - usa todo espaço disponível */}
        <main className="flex-1 ml-64 min-h-screen">
          <div className="px-8 py-6 w-full">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-github-fg-default">
                {sections.find(s => s.id === activeSection)?.label}
              </h1>
              <p className="text-github-fg-muted text-sm mt-1">
                Gerencie suas preferências e configurações
              </p>
            </div>

            <div className="bg-github-canvas-subtle border border-github-border-default rounded-xl p-8">
              {activeSection === "profile" && <ProfileSettings onSave={handleSave} isSaving={isSaving} />}
              {activeSection === "notifications" && <NotificationSettings onSave={handleSave} isSaving={isSaving} />}
              {activeSection === "security" && <SecuritySettings onSave={handleSave} isSaving={isSaving} />}
              {activeSection === "appearance" && <AppearanceSettings onSave={handleSave} isSaving={isSaving} />}
              {activeSection === "api" && <ApiSettings onSave={handleSave} isSaving={isSaving} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ onSave, isSaving }: { onSave: () => void; isSaving: boolean }) {
  const [formData, setFormData] = useState({
    name: "João Silva",
    username: "joaosilva",
    email: "joao@exemplo.com",
    bio: "Desenvolvedor full-stack apaixonado por código",
    location: "São Paulo, Brasil",
    website: "https://joaosilva.dev",
    company: "TechCorp",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-github-fg-default">Perfil Público</h2>
        <p className="text-github-fg-muted text-sm mt-1">
          Essas informações serão exibidas publicamente no seu perfil
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-github-accent-emphasis flex items-center justify-center text-2xl font-bold text-white">
          JS
        </div>
        <div>
          <button className="px-4 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default hover:bg-github-border-default transition-all text-sm font-medium">
            Alterar avatar
          </button>
          <p className="text-github-fg-subtle text-xs mt-2">
            JPG, GIF ou PNG. Máximo 1MB.
          </p>
        </div>
      </div>

      {/* Form Fields - preenchendo espaço disponível */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Nome</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Nome de usuário</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-github-fg-muted">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full pl-8 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 xl:col-span-2">
          <label className="text-sm font-medium text-github-fg-default">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-github-fg-muted" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2 xl:col-span-4">
          <label className="text-sm font-medium text-github-fg-default">Bio</label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all resize-none"
            placeholder="Fale um pouco sobre você..."
          />
          <p className="text-github-fg-subtle text-xs">{formData.bio.length}/160 caracteres</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Localização</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            placeholder="Cidade, País"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            placeholder="https://seusite.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Empresa</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            placeholder="Onde você trabalha"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Twitter/X</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-github-fg-muted">@</span>
            <input
              type="text"
              className="w-full pl-8 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
              placeholder="username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">LinkedIn</label>
          <input
            type="url"
            className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
            placeholder="linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">GitHub</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-github-fg-muted">github.com/</span>
            <input
              type="text"
              className="w-full pl-[90px] pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
              placeholder="username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Disponibilidade</label>
          <select className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all">
            <option>Disponível para projetos</option>
            <option>Ocupado</option>
            <option>Procurando equipe</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-github-fg-default">Nível de experiência</label>
          <select className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all">
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
            <option>Especialista</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-github-border-default">
        <button className="px-4 py-2 text-github-fg-muted hover:text-github-fg-default transition-all">
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ onSave, isSaving }: { onSave: () => void; isSaving: boolean }) {
  const [settings, setSettings] = useState({
    emailProjectUpdates: true,
    emailTeamInvites: true,
    emailMessages: true,
    pushNotifications: true,
    browserNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
  });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all ${
        checked ? "bg-github-success-emphasis" : "bg-github-border-default"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-github-fg-default">Notificações</h2>
        <p className="text-github-fg-muted text-sm mt-1">
          Escolha como e quando deseja ser notificado
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications - em grid */}
        <div>
          <h3 className="text-sm font-semibold text-github-fg-default uppercase tracking-wide mb-4">
            Notificações por Email
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { key: "emailProjectUpdates", label: "Atualizações de projetos", desc: "Novas atividades nos projetos que você segue" },
              { key: "emailTeamInvites", label: "Convites de equipe", desc: "Quando for convidado para uma nova equipe" },
              { key: "emailMessages", label: "Mensagens diretas", desc: "Quando alguém te enviar uma mensagem" },
              { key: "weeklyDigest", label: "Resumo semanal", desc: "Resumo semanal das atividades mais importantes" },
              { key: "marketingEmails", label: "Emails de marketing", desc: "Novidades, atualizações e ofertas especiais" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-github-canvas-default rounded-lg border border-github-border-default">
                <div>
                  <p className="font-medium text-github-fg-default text-sm">{item.label}</p>
                  <p className="text-xs text-github-fg-muted">{item.desc}</p>
                </div>
                <Toggle
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(v) => setSettings({ ...settings, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-github-border-default" />

        {/* Push & Browser - em grid */}
        <div>
          <h3 className="text-sm font-semibold text-github-fg-default uppercase tracking-wide mb-4">
            Push & Browser
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[
              { key: "pushNotifications", label: "Notificações push", desc: "Receba notificações em seu dispositivo móvel" },
              { key: "browserNotifications", label: "Notificações no navegador", desc: "Receba notificações mesmo com a aba fechada" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-github-canvas-default rounded-lg border border-github-border-default">
                <div>
                  <p className="font-medium text-github-fg-default text-sm">{item.label}</p>
                  <p className="text-xs text-github-fg-muted">{item.desc}</p>
                </div>
                <Toggle
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(v) => setSettings({ ...settings, [item.key]: v })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-github-border-default">
        <button className="px-4 py-2 text-github-fg-muted hover:text-github-fg-default transition-all">
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar preferências"}
        </button>
      </div>
    </div>
  );
}

// Security Settings Component
function SecuritySettings({ onSave, isSaving }: { onSave: () => void; isSaving: boolean }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-github-fg-default">Segurança</h2>
        <p className="text-github-fg-muted text-sm mt-1">
          Mantenha sua conta protegida
        </p>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-github-canvas-default flex items-center justify-center">
              <Shield className="w-5 h-5 text-github-accent-fg" />
            </div>
            <div>
              <p className="font-medium text-github-fg-default">Senha</p>
              <p className="text-sm text-github-fg-muted">Última alteração há 3 meses</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default hover:bg-github-border-default transition-all text-sm font-medium"
          >
            Alterar senha
          </button>
        </div>

        {showPasswordForm && (
          <div className="p-4 bg-github-canvas-default rounded-lg border border-github-border-default space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-github-fg-default">Senha atual</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-github-fg-default">Nova senha</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-github-fg-default">Confirmar nova senha</label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 text-github-fg-muted hover:text-github-fg-default transition-all"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all">
                Atualizar senha
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-github-border-default" />

      {/* Two Factor Auth */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-github-canvas-default flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-github-accent-fg" />
            </div>
            <div>
              <p className="font-medium text-github-fg-default">Autenticação de dois fatores</p>
              <p className="text-sm text-github-fg-muted">
                {twoFactorEnabled ? "Ativado via app autenticador" : "Adicione uma camada extra de segurança"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              twoFactorEnabled
                ? "bg-github-danger-fg/10 text-github-danger-fg hover:bg-github-danger-fg/20"
                : "bg-github-accent-emphasis hover:bg-[#388bfd] text-white"
            }`}
          >
            {twoFactorEnabled ? "Desativar" : "Ativar"}
          </button>
        </div>
      </div>

      <div className="border-t border-github-border-default" />

      {/* Sessions - grid horizontal */}
      <div>
        <h3 className="font-medium text-github-fg-default mb-3">Sessões ativas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { device: "Chrome em Windows", location: "São Paulo, Brasil", current: true, time: "Agora" },
            { device: "Safari em iPhone", location: "São Paulo, Brasil", current: false, time: "2 dias atrás" },
            { device: "Firefox em macOS", location: "Rio de Janeiro, Brasil", current: false, time: "1 semana atrás" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-github-canvas-default rounded-lg border border-github-border-default">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-github-canvas-subtle flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-github-fg-muted" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-github-fg-default text-sm truncate">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 bg-github-success-emphasis/20 text-github-success-fg text-xs rounded-full">
                        Atual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-github-fg-muted truncate">{session.location} • {session.time}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-sm text-github-danger-fg hover:underline ml-2">
                  Revogar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings({ onSave, isSaving }: { onSave: () => void; isSaving: boolean }) {
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [compactMode, setCompactMode] = useState(false);

  const themes = [
    { id: "dark", label: "Escuro", desc: "O tema padrão do GitStore", color: "#0d1117" },
    { id: "light", label: "Claro", desc: "Para ambientes bem iluminados", color: "#ffffff" },
    { id: "auto", label: "Automático", desc: "Segue as preferências do sistema", color: "linear-gradient(135deg, #0d1117 50%, #ffffff 50%)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-github-fg-default">Aparência</h2>
        <p className="text-github-fg-muted text-sm mt-1">
          Personalize como o GitStore aparece para você
        </p>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-github-fg-default">Tema</label>
        <div className="grid grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                theme === t.id
                  ? "border-github-accent-emphasis bg-github-accent-emphasis/10"
                  : "border-github-border-default hover:border-github-accent-emphasis/50"
              }`}
            >
              <div
                className="w-full h-12 rounded-lg mb-3 border border-github-border-default"
                style={{ background: t.color }}
              />
              <p className="font-medium text-github-fg-default text-sm">{t.label}</p>
              <p className="text-xs text-github-fg-muted mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-github-border-default" />

      {/* Font Size */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-github-fg-default">Tamanho da fonte</label>
        <div className="flex gap-2">
          {[
            { id: "small", label: "Pequeno", size: "14px" },
            { id: "medium", label: "Médio", size: "16px" },
            { id: "large", label: "Grande", size: "18px" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFontSize(f.id)}
              className={`flex-1 py-3 px-4 rounded-lg border transition-all ${
                fontSize === f.id
                  ? "border-github-accent-emphasis bg-github-accent-emphasis/10 text-github-accent-fg"
                  : "border-github-border-default text-github-fg-muted hover:border-github-accent-emphasis/50"
              }`}
              style={{ fontSize: f.size }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-github-border-default" />

      {/* Compact Mode */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="font-medium text-github-fg-default">Modo compacto</p>
          <p className="text-sm text-github-fg-muted">Reduz espaçamentos e mostra mais conteúdo</p>
        </div>
        <button
          onClick={() => setCompactMode(!compactMode)}
          className={`relative w-11 h-6 rounded-full transition-all ${
            compactMode ? "bg-github-success-emphasis" : "bg-github-border-default"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
              compactMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-github-border-default">
        <button className="px-4 py-2 text-github-fg-muted hover:text-github-fg-default transition-all">
          Restaurar padrões
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Aplicando..." : "Aplicar tema"}
        </button>
      </div>
    </div>
  );
}

// API Settings Component
function ApiSettings({ onSave, isSaving }: { onSave: () => void; isSaving: boolean }) {
  const [tokens, setTokens] = useState([
    { id: 1, name: "Token de Desenvolvimento", lastUsed: "2 horas atrás", created: "3 meses atrás" },
    { id: 2, name: "CI/CD Pipeline", lastUsed: "5 minutos atrás", created: "1 mês atrás" },
  ]);
  const [showNewToken, setShowNewToken] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");

  const handleGenerateToken = () => {
    const token = "ghp_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedToken(token);
    setTokens([...tokens, { id: Date.now(), name: newTokenName, lastUsed: "Nunca", created: "Agora" }]);
    setShowNewToken(false);
    setNewTokenName("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-github-fg-default">API & Tokens de Acesso</h2>
        <p className="text-github-fg-muted text-sm mt-1">
          Gerencie tokens para acesso programático à API
        </p>
      </div>

      {/* Generate New Token */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-github-fg-default">Tokens pessoais</p>
          <p className="text-sm text-github-fg-muted">{tokens.length} tokens ativos</p>
        </div>
        <button
          onClick={() => setShowNewToken(true)}
          className="px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all text-sm font-medium"
        >
          Gerar novo token
        </button>
      </div>

      {/* New Token Modal */}
      {showNewToken && (
        <div className="p-4 bg-github-canvas-default rounded-lg border border-github-border-default space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-github-fg-default">Nome do token</label>
            <input
              type="text"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              className="w-full px-3 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 transition-all"
              placeholder="Ex: Integração Slack"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewToken(false)}
              className="px-4 py-2 text-github-fg-muted hover:text-github-fg-default transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateToken}
              disabled={!newTokenName.trim()}
              className="px-4 py-2 bg-github-accent-emphasis hover:bg-[#388bfd] text-white rounded-lg transition-all disabled:opacity-50"
            >
              Gerar token
            </button>
          </div>
        </div>
      )}

      {/* Generated Token Display */}
      {generatedToken && (
        <div className="p-4 bg-github-success-emphasis/10 border border-github-success-emphasis/30 rounded-lg space-y-3">
          <p className="font-medium text-github-success-fg">Token gerado com sucesso!</p>
          <p className="text-sm text-github-fg-muted">
            Copie agora. Você não poderá vê-lo novamente.
          </p>
          <div className="flex gap-2">
            <code className="flex-1 px-3 py-2 bg-github-canvas-default rounded-lg font-mono text-sm text-github-fg-default break-all">
              {generatedToken}
            </code>
            <button
              onClick={() => copyToClipboard(generatedToken)}
              className="px-4 py-2 bg-github-canvas-subtle border border-github-border-default rounded-lg text-github-fg-default hover:bg-github-border-default transition-all"
            >
              Copiar
            </button>
          </div>
        </div>
      )}

      {/* Token List - grid horizontal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tokens.map((token) => (
          <div key={token.id} className="flex items-center justify-between p-3 bg-github-canvas-default rounded-lg border border-github-border-default">
            <div className="min-w-0">
              <p className="font-medium text-github-fg-default text-sm truncate">{token.name}</p>
              <p className="text-xs text-github-fg-muted">
                Último: {token.lastUsed} • Criado: {token.created}
              </p>
            </div>
            <button
              onClick={() => setTokens(tokens.filter((t) => t.id !== token.id))}
              className="text-sm text-github-danger-fg hover:underline ml-2 flex-shrink-0"
            >
              Revogar
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-github-border-default" />

      {/* API Documentation */}
      <div className="p-4 bg-github-canvas-default rounded-lg border border-github-border-default">
        <h3 className="font-medium text-github-fg-default mb-2">Documentação da API</h3>
        <p className="text-sm text-github-fg-muted mb-4">
          Aprenda como integrar com nossa API RESTful
        </p>
        <a
          href="#"
          className="text-github-accent-fg hover:underline text-sm font-medium"
        >
          Ver documentação →
        </a>
      </div>
    </div>
  );
}
