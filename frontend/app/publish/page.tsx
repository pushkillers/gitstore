"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { LANGUAGES, CATEGORIES } from "@/constants";
import { publishProject } from "@/lib/projects";
import { addXP } from "@/lib/xp";
import { toast } from "@/lib/toast";
import { CheckCircle, Loader2 } from "lucide-react";

const TYPES = [
  { value: "free",     label: "Gratuito",  desc: "Disponível para todos sem custo" },
  { value: "freemium", label: "Freemium",  desc: "Versão gratuita + recursos pagos" },
  { value: "paid",     label: "Pago",      desc: "Acesso mediante pagamento" },
];

export default function PublishPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", description: "", language: "", category: "",
    tags: "", repository: "", type: "free" as "free" | "paid" | "freemium", price: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await publishProject({
      name: form.name,
      description: form.description,
      language: form.language,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      repository: form.repository,
      type: form.type,
      price: form.price ? parseFloat(form.price) : undefined,
    });

    setSubmitting(false);
    if (result.ok) {
      addXP("PROJECT_CREATED");
      toast.success("Projeto publicado! +100 XP 🚀");
      setDone(true);
    } else {
      // show error inline — reuse the error state
      setError(result.error);
    }
  };

  const inputCls = "w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117]">
        <div className="w-full max-w-sm rounded-2xl border border-[#3fb950]/20 bg-[#161b22] p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-[#3fb950]" />
          <h2 className="text-2xl font-bold text-[#e6edf3]">Projeto publicado!</h2>
          <p className="mt-2 text-sm text-[#7d8590]">Seu projeto já está visível no marketplace.</p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => router.push("/projects")}
              className="w-full rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
            >
              Ver no marketplace
            </button>
            <button
              onClick={() => { setDone(false); setForm({ name: "", description: "", language: "", category: "", tags: "", repository: "", type: "free", price: "" }); }}
              className="w-full rounded-xl border border-[#30363d] py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]"
            >
              Publicar outro projeto
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] py-10">
      <Container size="sm">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#e6edf3]">
            Publicar <span className="bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">Projeto</span>
          </h1>
          <p className="mt-2 text-[#7d8590]">Compartilhe seu projeto com a comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#7d8590]">Informações básicas</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#e6edf3]">Nome do projeto *</label>
              <input type="text" value={form.name} onChange={set("name")} required placeholder="meu-projeto-incrivel" className={inputCls} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#e6edf3]">Descrição *</label>
              <textarea value={form.description} onChange={set("description")} required rows={3}
                placeholder="Descreva seu projeto de forma clara e objetiva..."
                className={`${inputCls} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#e6edf3]">Linguagem *</label>
                <select value={form.language} onChange={set("language")} required className={inputCls}>
                  <option value="">Selecione...</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#e6edf3]">Categoria *</label>
                <select value={form.category} onChange={set("category")} required className={inputCls}>
                  <option value="">Selecione...</option>
                  {CATEGORIES.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#e6edf3]">Tags <span className="text-[#7d8590]">(separadas por vírgula)</span></label>
              <input type="text" value={form.tags} onChange={set("tags")} placeholder="nextjs, react, typescript" className={inputCls} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#e6edf3]">URL do repositório</label>
              <input type="url" value={form.repository} onChange={set("repository")} placeholder="https://github.com/usuario/projeto" className={inputCls} />
            </div>
          </div>

          {/* Tipo */}
          <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#7d8590]">Tipo de acesso</h2>
            <div className="grid grid-cols-3 gap-3">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t.value as typeof form.type }))}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    form.type === t.value
                      ? "border-[#58a6ff] bg-[#58a6ff]/10"
                      : "border-[#30363d] hover:border-[#58a6ff]/40"
                  }`}
                >
                  <p className="font-semibold text-[#e6edf3] text-sm">{t.label}</p>
                  <p className="mt-1 text-xs text-[#7d8590]">{t.desc}</p>
                </button>
              ))}
            </div>

            {form.type !== "free" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#e6edf3]">Preço (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8590]">$</span>
                  <input type="number" min="0.99" step="0.01" value={form.price} onChange={set("price")}
                    placeholder="29.99" className={`${inputCls} pl-7`} />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Publicando...</>
            ) : (
              <>🚀 Publicar projeto</>
            )}
          </button>

          {error && (
            <p className="rounded-xl border border-[#f85149]/30 bg-[#f8514915] px-4 py-3 text-sm text-[#ff8a84]">
              {error}
            </p>
          )}
        </form>
      </Container>
    </div>
  );
}
