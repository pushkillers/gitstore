"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, CheckCircle, DollarSign, Info, Upload, Image as ImageIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { LANGUAGES, CATEGORIES } from "@/constants";
import { createProject, saveProject } from "@/lib/api/projects";
import { addXP } from "@/lib/utils/xp";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TYPES = [
  { value: "free", label: "Gratuito", desc: "Disponível para todos", icon: "🆓" },
  { value: "paid", label: "Pago", desc: "Acesso mediante pagamento", icon: "💎" },
] as const;

const inputCls = "w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

export function NewProjectModal({ open, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", language: "", category: "",
    tags: "", repository: "", type: "free" as "free" | "paid", price: "",
  });
  const [images, setImages] = useState<string[]>([]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 6 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setForm({ name: "", description: "", language: "", category: "", tags: "", repository: "", type: "free", price: "" });
    setImages([]);
    setStep("form");
  };

  const handleClose = () => { reset(); onClose(); };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

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
      thumbnail: images[0],
      screenshots: images.slice(1),
    });
    saveProject(project);
    addXP("PROJECT_CREATED");
    setSubmitting(false);
    setStep("done");
    onSuccess?.();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#e6edf3]">Publicar Projeto</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Compartilhe seu projeto com a comunidade</p>
          </div>
          <button type="button" onClick={handleClose}
            className="rounded-lg p-2 text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#e6edf3]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-[#3fb950]" />
            <h3 className="text-2xl font-bold text-[#e6edf3]">Projeto publicado com sucesso!</h3>
            <p className="text-sm text-[#7d8590]">Seu projeto já está visível no marketplace.</p>
            <div className="mt-4 flex w-full max-w-md flex-col gap-3">
              <button onClick={() => { handleClose(); router.push("/projects"); }}
                className="w-full rounded-lg bg-[linear-gradient(135deg,#238636,#2ea043)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                Ver no marketplace
              </button>
              <button onClick={reset}
                className="w-full rounded-lg border border-[#30363d] px-5 py-3 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]">
                Publicar outro projeto
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Main Content */}
              <div className="space-y-5">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">Nome do projeto *</label>
                  <input type="text" value={form.name} onChange={set("name")} required
                    placeholder="meu-projeto-incrivel" className={inputCls} />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">Descrição *</label>
                  <textarea value={form.description} onChange={set("description")} required rows={4}
                    placeholder="Descreva seu projeto de forma clara e objetiva..." className={`${inputCls} resize-none`} />
                </div>

                {/* Linguagem + Categoria */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">Linguagem *</label>
                    <select value={form.language} onChange={set("language")} required className={inputCls}>
                      <option value="">Selecione...</option>
                      {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">Categoria *</label>
                    <select value={form.category} onChange={set("category")} required className={inputCls}>
                      <option value="">Selecione...</option>
                      {CATEGORIES.filter((c) => c !== "Todos").map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">
                    Tags <span className="text-xs font-normal text-[#7d8590]">(separadas por vírgula)</span>
                  </label>
                  <input type="text" value={form.tags} onChange={set("tags")}
                    placeholder="nextjs, react, typescript" className={inputCls} />
                </div>

                {/* Repositório */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">URL do repositório</label>
                  <input type="url" value={form.repository} onChange={set("repository")}
                    placeholder="https://github.com/usuario/projeto" className={inputCls} />
                </div>

                {/* Imagens */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">
                    Imagens <span className="text-xs font-normal text-[#7d8590]">(até 6 imagens)</span>
                  </label>
                  
                  {/* Upload Area */}
                  {images.length < 6 && (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#30363d] bg-[#0d1117] p-6 transition-all hover:border-[#58a6ff]/50 hover:bg-[#161b22]">
                      <Upload className="mb-2 h-8 w-8 text-[#7d8590]" />
                      <p className="text-sm font-medium text-[#e6edf3]">Clique para adicionar imagens</p>
                      <p className="mt-1 text-xs text-[#7d8590]">PNG, JPG ou WEBP (máx. 5MB cada)</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {/* Image Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-video overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
                          {idx === 0 && (
                            <div className="absolute left-2 top-2 rounded-full bg-[#238636] px-2 py-0.5 text-[10px] font-semibold text-white">
                              Capa
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-2 top-2 rounded-full bg-[#f85149] p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Tipo */}
                <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                  <label className="mb-3 block text-sm font-semibold text-[#e6edf3]">Tipo de acesso</label>
                  <div className="space-y-2">
                    {TYPES.map((t) => (
                      <button key={t.value} type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                        className={`w-full rounded-lg border p-3.5 text-left transition-all ${
                          form.type === t.value
                            ? "border-[#58a6ff] bg-[#58a6ff]/10"
                            : "border-[#30363d] hover:border-[#58a6ff]/40"
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{t.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#e6edf3]">{t.label}</p>
                            <p className="text-xs text-[#7d8590]">{t.desc}</p>
                          </div>
                          {form.type === t.value && (
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#58a6ff]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                {form.type === "paid" && (
                  <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                    <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
                      <DollarSign className="h-4 w-4" />
                      Preço (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">$</span>
                      <input type="number" min="0.99" step="0.01" value={form.price} onChange={set("price")}
                        placeholder="29.99" className={`${inputCls} pl-8`} />
                    </div>
                    <p className="mt-2 text-xs text-[#7d8590]">
                      Defina um preço justo para seu projeto
                    </p>
                  </div>
                )}

                {/* Info Card */}
                <div className="rounded-xl border border-[#388bfd]/20 bg-[#388bfd]/5 p-5">
                  <div className="mb-2 flex items-center gap-2 text-[#58a6ff]">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm font-semibold">Dica</p>
                  </div>
                  <p className="text-xs leading-relaxed text-[#7d8590]">
                    Projetos com imagens atrativas, descrições detalhadas e tags relevantes têm mais visibilidade no marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex flex-shrink-0 justify-end gap-3 border-t border-[#30363d] px-6 py-4">
              <button type="button" onClick={handleClose}
                className="rounded-lg border border-[#30363d] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]">
                Cancelar
              </button>
              <button type="submit" disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#238636,#2ea043)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60">
                {submitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Publicando...</>
                  : <>🚀 Publicar projeto</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
