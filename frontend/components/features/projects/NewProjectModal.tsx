"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, CheckCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { LANGUAGES, CATEGORIES } from "@/constants";
import { createProject, saveProject } from "@/lib/projects";
import { addXP } from "@/lib/xp";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TYPES = [
  { value: "free",     label: "Gratuito",  desc: "Disponível para todos" },
  { value: "freemium", label: "Freemium",  desc: "Grátis + recursos pagos" },
  { value: "paid",     label: "Pago",      desc: "Acesso mediante pagamento" },
] as const;

const inputCls = "w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

export function NewProjectModal({ open, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", language: "", category: "",
    tags: "", repository: "", type: "free" as "free" | "paid" | "freemium", price: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm({ name: "", description: "", language: "", category: "", tags: "", repository: "", type: "free", price: "" });
    setStep("form");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const project = createProject({
      name: form.name, description: form.description,
      language: form.language, category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      repository: form.repository, type: form.type,
      price: form.price ? parseFloat(form.price) : undefined,
    });
    saveProject(project);
    addXP("PROJECT_CREATED");
    setSubmitting(false);
    setStep("done");
  };

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#e6edf3]">Novo Projeto</h2>
            <p className="text-xs text-[#7d8590]">Publique seu projeto no marketplace</p>
          </div>
          <button type="button" onClick={handleClose}
            className="rounded-xl p-2 text-[#7d8590] transition-all hover:bg-[#21262d] hover:text-[#e6edf3]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <CheckCircle className="h-14 w-14 text-[#3fb950]" />
            <h3 className="text-xl font-bold text-[#e6edf3]">Projeto publicado!</h3>
            <p className="text-sm text-[#7d8590]">Seu projeto já está visível no marketplace.</p>
            <div className="mt-2 flex w-full flex-col gap-3">
              <button onClick={() => { handleClose(); router.push("/projects"); }}
                className="w-full rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110">
                Ver no marketplace
              </button>
              <button onClick={reset}
                className="w-full rounded-xl border border-[#30363d] py-2.5 text-sm font-medium text-[#e6edf3] transition-all hover:bg-[#21262d]">
                Publicar outro
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">Nome do projeto *</label>
              <input type="text" value={form.name} onChange={set("name")} required
                placeholder="meu-projeto-incrivel" className={inputCls} />
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">Descrição *</label>
              <textarea value={form.description} onChange={set("description")} required rows={3}
                placeholder="Descreva seu projeto..." className={`${inputCls} resize-none`} />
            </div>

            {/* Linguagem + Categoria */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#e6edf3]">Linguagem *</label>
                <select value={form.language} onChange={set("language")} required className={inputCls}>
                  <option value="">Selecione...</option>
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#e6edf3]">Categoria *</label>
                <select value={form.category} onChange={set("category")} required className={inputCls}>
                  <option value="">Selecione...</option>
                  {CATEGORIES.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">Tags <span className="text-[#7d8590]">(separadas por vírgula)</span></label>
              <input type="text" value={form.tags} onChange={set("tags")}
                placeholder="nextjs, react, typescript" className={inputCls} />
            </div>

            {/* Repositório */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#e6edf3]">URL do repositório</label>
              <input type="url" value={form.repository} onChange={set("repository")}
                placeholder="https://github.com/usuario/projeto" className={inputCls} />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#e6edf3]">Tipo de acesso</label>
              <div className="grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      form.type === t.value
                        ? "border-[#58a6ff] bg-[#58a6ff]/10"
                        : "border-[#30363d] hover:border-[#58a6ff]/40"
                    }`}>
                    <p className="text-xs font-semibold text-[#e6edf3]">{t.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#7d8590]">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preço */}
            {form.type !== "free" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#e6edf3]">Preço (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">$</span>
                  <input type="number" min="0.99" step="0.01" value={form.price} onChange={set("price")}
                    placeholder="29.99" className={`${inputCls} pl-7`} />
                </div>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#238636,#2ea043)] py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60">
              {submitting
                ? <><Loader2 className="h-4 w-4 animate-spin" />Publicando...</>
                : <>🚀 Publicar projeto</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
