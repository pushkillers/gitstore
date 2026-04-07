"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { adminLogin, isAdminLoggedIn } from "@/lib/api/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isAdminLoggedIn()) router.replace("/admin/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 5) {
      setError("Muitas tentativas. Aguarde alguns minutos.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await adminLogin(username, password);
    setLoading(false);
    if (!result.ok) {
      setAttempts((a) => a + 1);
      setError(result.error);
      setPassword("");
      return;
    }
    router.replace("/admin/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010409] px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f85149]/4 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,81,73,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,81,73,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative w-full max-w-[360px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f85149]/20 bg-[#f85149]/8">
            <ShieldAlert className="h-7 w-7 text-[#f85149]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#e6edf3]">GitStore Admin</h1>
          <p className="mt-1.5 text-xs text-[#484f58]">Acesso restrito aos criadores da plataforma</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#0d1117] shadow-2xl shadow-black/60">
          <div className="border-b border-[#21262d] bg-[#f85149]/5 px-6 py-3">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#f85149]">
              ⚠ Área Restrita
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#7d8590]">Usuário admin</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="username"
                required
                autoComplete="off"
                className="w-full rounded-xl border border-[#30363d] bg-[#010409] px-3.5 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#484f58] focus:border-[#f85149]/50 focus:ring-2 focus:ring-[#f85149]/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#7d8590]">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#30363d] bg-[#010409] px-3.5 py-2.5 pr-10 text-sm text-[#e6edf3] outline-none placeholder:text-[#484f58] focus:border-[#f85149]/50 focus:ring-2 focus:ring-[#f85149]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484f58] transition-colors hover:text-[#7d8590]"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-[#f85149]/20 bg-[#f85149]/8 px-3.5 py-3 text-xs text-[#ff8a84]">
                <ShieldAlert className="h-3.5 w-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {attempts >= 3 && attempts < 5 && (
              <p className="text-center text-[10px] text-[#f85149]/70">
                {5 - attempts} tentativa{5 - attempts !== 1 ? "s" : ""} restante{5 - attempts !== 1 ? "s" : ""}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f85149] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#ff6b6b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Verificando...</>
              ) : "Entrar no painel"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[10px] text-[#30363d]">
          Esta página não é indexada por mecanismos de busca.
        </p>
      </div>
    </div>
  );
}
