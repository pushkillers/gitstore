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

  const handleGoogle = () => {
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

  const inputCls = [
    "w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 text-sm text-[#e6edf3]",
    "outline-none placeholder:text-[#484f58]",
    "focus:border-[#388bfd] focus:ring-2 focus:ring-[#388bfd]/15",
    "transition-all duration-200",
  ].join(" ");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0d1117] px-4 py-12 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f6feb]/8 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-[#3fb950]/6 blur-[80px]" />
      </div>

      <div className="relative w-full max-w-[360px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#30363d] bg-[#161b22] shadow-lg shadow-black/30">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-[#e6edf3]">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e6edf3]">GitStore</h1>
          <p className="mt-1.5 text-sm text-[#7d8590]">
            {tab === "login" ? "Entre na sua conta" : "Crie sua conta gratuitamente"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl shadow-black/40">
          {/* Tab switcher */}
          <div className="flex border-b border-[#21262d]">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(""); }}
                className={[
                  "flex-1 py-3.5 text-sm font-medium transition-all duration-200",
                  tab === t
                    ? "border-b-2 border-[#388bfd] text-[#e6edf3]"
                    : "text-[#7d8590] hover:text-[#c9d1d9]",
                ].join(" ")}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm font-medium text-[#c9d1d9] transition-all duration-200 hover:border-[#484f58] hover:bg-[#161b22] hover:text-[#e6edf3] active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#21262d]" />
              <span className="text-xs text-[#484f58]">ou continue com email</span>
              <div className="h-px flex-1 bg-[#21262d]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8b949e]">Nome completo</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="João Silva"
                      required
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#8b949e]">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#484f58]">@</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={set("username")}
                        placeholder="joaosilva"
                        required
                        pattern="[a-zA-Z0-9_-]+"
                        className={`${inputCls} pl-8`}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8b949e]">
                  {tab === "login" ? "Email ou username" : "Email"}
                </label>
                <input
                  type={tab === "register" ? "email" : "text"}
                  value={form.email}
                  onChange={set("email")}
                  placeholder={tab === "login" ? "email ou @username" : "joao@exemplo.com"}
                  required
                  className={inputCls}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8b949e]">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] transition-colors hover:text-[#8b949e]"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#f85149]/20 bg-[#f85149]/8 px-3.5 py-3 text-sm text-[#ff8a84]">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#238636] py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#2ea043] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Aguarde...</>
                ) : tab === "login" ? "Entrar" : "Criar conta"}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[#7d8590]">
          {tab === "login" ? "Não tem conta? " : "Já tem conta? "}
          <button
            type="button"
            onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
            className="font-medium text-[#388bfd] transition-colors hover:text-[#58a6ff]"
          >
            {tab === "login" ? "Cadastre-se grátis" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}
