"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, CheckCircle, DollarSign, Info, Upload, BookOpen, Video, FileText } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "@/lib/utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LEVELS = [
  { value: "beginner", label: "Iniciante", desc: "Para quem está começando", icon: "🌱" },
  { value: "intermediate", label: "Intermediário", desc: "Conhecimento básico necessário", icon: "📚" },
  { value: "advanced", label: "Avançado", desc: "Para desenvolvedores experientes", icon: "🚀" },
] as const;

const TYPES = [
  { value: "free", label: "Gratuito", desc: "Disponível para todos", icon: "🆓" },
  { value: "paid", label: "Pago", desc: "Acesso mediante pagamento", icon: "💎" },
] as const;

const inputCls = "w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

export function PublishCourseModal({ open, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    duration: "",
    modules: "",
    language: "Português",
    type: "free" as "free" | "paid",
    price: "",
    thumbnail: "",
    videoUrl: "",
    tags: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, thumbnail: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setForm({
      title: "", description: "", category: "", level: "beginner",
      duration: "", modules: "", language: "Português", type: "free",
      price: "", thumbnail: "", videoUrl: "", tags: ""
    });
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
    await new Promise((r) => setTimeout(r, 800));
    
    toast.success("Curso publicado com sucesso!");
    
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
            <h2 className="text-xl font-bold text-[#e6edf3]">Publicar Curso</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Compartilhe seu conhecimento com a comunidade</p>
          </div>
          <button type="button" onClick={handleClose}
            className="rounded-lg p-2 text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#e6edf3]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-[#3fb950]" />
            <h3 className="text-2xl font-bold text-[#e6edf3]">Curso publicado com sucesso!</h3>
            <p className="text-sm text-[#7d8590]">Seu curso já está disponível na plataforma.</p>
            <div className="mt-4 flex w-full max-w-md flex-col gap-3">
              <button onClick={() => { handleClose(); router.push("/cursos"); }}
                className="w-full rounded-lg bg-[linear-gradient(135deg,#238636,#2ea043)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                Ver no catálogo
              </button>
              <button onClick={reset}
                className="w-full rounded-lg border border-[#30363d] px-5 py-3 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]">
                Publicar outro curso
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
                  {/* Título */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">Título do curso *</label>
                    <input type="text" value={form.title} onChange={set("title")} required
                      placeholder="React do Zero ao Avançado" className={inputCls} />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">Descrição *</label>
                    <textarea value={form.description} onChange={set("description")} required rows={4}
                      placeholder="Aprenda React desde os fundamentos até conceitos avançados..."
                      className={`${inputCls} resize-none`} />
                  </div>

                  {/* Categoria + Idioma */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#e6edf3]">Categoria *</label>
                      <select value={form.category} onChange={set("category")} required className={inputCls}>
                        <option value="">Selecione...</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Mobile">Mobile</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#e6edf3]">Idioma *</label>
                      <select value={form.language} onChange={set("language")} required className={inputCls}>
                        <option value="Português">Português</option>
                        <option value="Inglês">Inglês</option>
                        <option value="Espanhol">Espanhol</option>
                      </select>
                    </div>
                  </div>

                  {/* Duração + Módulos */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#e6edf3]">Duração total *</label>
                      <input type="text" value={form.duration} onChange={set("duration")} required
                        placeholder="20 horas" className={inputCls} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#e6edf3]">Número de módulos *</label>
                      <input type="number" value={form.modules} onChange={set("modules")} required min="1"
                        placeholder="10" className={inputCls} />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">
                      Tags <span className="text-xs font-normal text-[#7d8590]">(separadas por vírgula)</span>
                    </label>
                    <input type="text" value={form.tags} onChange={set("tags")}
                      placeholder="react, javascript, hooks, context-api" className={inputCls} />
                  </div>

                  {/* URL do vídeo de apresentação */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">
                      <Video className="inline h-4 w-4 mr-1" />
                      URL do vídeo de apresentação
                    </label>
                    <input type="url" value={form.videoUrl} onChange={set("videoUrl")}
                      placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                    <p className="text-xs text-[#7d8590]">
                      Link do YouTube ou Vimeo com uma prévia do curso
                    </p>
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#e6edf3]">Imagem de capa</label>
                    
                    {!form.thumbnail ? (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#30363d] bg-[#0d1117] p-8 transition-all hover:border-[#58a6ff]/50 hover:bg-[#161b22]">
                        <Upload className="mb-2 h-8 w-8 text-[#7d8590]" />
                        <p className="text-sm font-medium text-[#e6edf3]">Clique para adicionar imagem</p>
                        <p className="mt-1 text-xs text-[#7d8590]">PNG, JPG ou WEBP (recomendado: 1280x720px)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-[#30363d]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.thumbnail} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, thumbnail: "" }))}
                          className="absolute right-2 top-2 rounded-full bg-[#f85149] p-2 text-white transition-opacity hover:bg-[#f85149]/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  {/* Nível */}
                  <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5">
                    <label className="mb-3 block text-sm font-semibold text-[#e6edf3]">Nível do curso</label>
                    <div className="space-y-2">
                      {LEVELS.map((lvl) => (
                        <button key={lvl.value} type="button"
                          onClick={() => setForm((f) => ({ ...f, level: lvl.value }))}
                          className={`w-full rounded-lg border p-3.5 text-left transition-all ${
                            form.level === lvl.value
                              ? "border-[#58a6ff] bg-[#58a6ff]/10"
                              : "border-[#30363d] hover:border-[#58a6ff]/40"
                          }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lvl.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#e6edf3]">{lvl.label}</p>
                              <p className="text-xs text-[#7d8590]">{lvl.desc}</p>
                            </div>
                            {form.level === lvl.value && (
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#58a6ff]" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

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
                        Preço (BRL)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">R$</span>
                        <input type="number" min="0" step="0.01" value={form.price} onChange={set("price")}
                          placeholder="199.90" className={`${inputCls} pl-10`} />
                      </div>
                      <p className="mt-2 text-xs text-[#7d8590]">
                        Defina um preço justo para seu curso
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
                      Cursos com vídeos de apresentação, descrições detalhadas e imagens atrativas têm 3x mais inscrições.
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
                  : <><BookOpen className="h-4 w-4" />Publicar curso</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
