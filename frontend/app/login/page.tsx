"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { login, register } from "@/lib/auth";

function LoginContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/perfil";

  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  const API = "/api/backend";

  const handleGoogle = () => {
    // Google OAuth precisa ir direto para o backend (redirect externo)
    window.location.href = `http://localhost:3001/auth/google/login`;
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = tab === "register"
      ? await register({ name: form.name, username: form.username, email: form.email, password: form.password })
      : await login(form.email, form.password);

    setLoading(false);

    if (!result.ok) { setError(result.error); return; }
    window.location.href = callbackUrl;
  };

  const inputCls = "w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#30363d] bg-[#161b22]">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#e6edf3]">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">GitStore</h1>
          <p className="mt-1 text-sm text-[#7d8590]">{tab === "login" ? "Entre na sua conta" : "Crie sua conta"}</p>
        </div>

        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d] active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#30363d]" />
            <span className="text-xs text-[#7d8590]">ou</span>
            <div className="h-px flex-1 bg-[#30363d]" />
          </div>
          <div className="mb-5 flex rounded-xl border border-[#30363d] bg-[#0d1117] p-1">
            {(["login", "register"] as const).map((t) => (
              <button key={t} type="button" onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${tab === t ? "bg-[#161b22] text-[#e6edf3] shadow-sm" : "text-[#7d8590] hover:text-[#e6edf3]"}`}>
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "register" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#e6edf3]">Nome completo</label>
                  <input type="text" value={form.name} onChange={set("name")} placeholder="João Silva" required className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#e6edf3]">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">@</span>
                    <input type="text" value={form.username} onChange={set("username")} placeholder="joaosilva" required pattern="[a-zA-Z0-9_-]+" className={`${inputCls} pl-8`} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">{tab === "login" ? "Email ou username" : "Email"}</label>
              <input type={tab === "register" ? "email" : "text"} value={form.email} onChange={set("email")}
                placeholder={tab === "login" ? "email ou @username" : "joao@exemplo.com"} required className={inputCls} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">Senha</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="••••••••" required minLength={6} className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8590] hover:text-[#e6edf3]">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#f85149]/20 bg-[#f8514915] px-3 py-2.5 text-sm text-[#ff8a84]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60 mt-1">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</> : tab === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[#7d8590]">
          {tab === "login" ? "Não tem conta? " : "Já tem conta? "}
          <button type="button" onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
            className="text-[#58a6ff] hover:underline">
            {tab === "login" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}
