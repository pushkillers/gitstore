"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle, Users, Globe, Lock, Upload } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "@/lib/utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputCls = "w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15 transition-all";

export function CreateTeamModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    tags: "",
    isPublic: true,
    logo: "🚀",
    banner: "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm({ name: "", description: "", tags: "", isPublic: true, logo: "🚀", banner: "" });
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
    
    // Simular criação da equipe
    toast.success("Equipe criada com sucesso!");
    
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
      <div className="relative flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#e6edf3]">Criar Equipe</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Monte sua equipe de desenvolvimento</p>
          </div>
          <button type="button" onClick={handleClose}
            className="rounded-lg p-2 text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#e6edf3]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <CheckCircle className="h-16 w-16 text-[#3fb950]" />
            <h3 className="text-2xl font-bold text-[#e6edf3]">Equipe criada com sucesso!</h3>
            <p className="text-sm text-[#7d8590]">Sua equipe já está disponível. Comece a convidar membros!</p>
            <div className="mt-4 flex w-full max-w-md flex-col gap-3">
              <button onClick={handleClose}
                className="w-full rounded-lg bg-[linear-gradient(135deg,#238636,#2ea043)] px-5 py-3 text-sm font-semibold text-white transition-all hover:brightness-110">
                Ver minha equipe
              </button>
              <button onClick={reset}
                className="w-full rounded-lg border border-[#30363d] px-5 py-3 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]">
                Criar outra equipe
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">
                {/* Nome */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">Nome da equipe *</label>
                  <input type="text" value={form.name} onChange={set("name")} required
                    placeholder="DevSquad Elite" className={inputCls} />
                </div>

                {/* Logo Emoji */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">Logo (emoji) *</label>
                  <div className="flex gap-2">
                    <input type="text" value={form.logo} onChange={set("logo")} required maxLength={2}
                      placeholder="🚀" className={`${inputCls} w-20 text-center text-2xl`} />
                    <div className="flex flex-wrap gap-2">
                      {["🚀", "⚡", "💎", "🔥", "⚔️", "🎯", "🌟", "💻"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, logo: emoji }))}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition-all hover:scale-110 ${
                            form.logo === emoji
                              ? "border-[#58a6ff] bg-[#58a6ff]/10"
                              : "border-[#30363d] hover:border-[#58a6ff]/40"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">Descrição *</label>
                  <textarea value={form.description} onChange={set("description")} required rows={4}
                    placeholder="Equipe focada em desenvolvimento full-stack com React, Node.js e TypeScript..."
                    className={`${inputCls} resize-none`} />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">
                    Tecnologias <span className="text-xs font-normal text-[#7d8590]">(separadas por vírgula)</span>
                  </label>
                  <input type="text" value={form.tags} onChange={set("tags")}
                    placeholder="React, Node.js, TypeScript, MongoDB" className={inputCls} />
                </div>

                {/* Banner URL */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#e6edf3]">URL do banner</label>
                  <input type="url" value={form.banner} onChange={set("banner")}
                    placeholder="https://images.unsplash.com/photo-..." className={inputCls} />
                  <p className="text-xs text-[#7d8590]">
                    Recomendado: 1920x1080px. Deixe em branco para usar um banner padrão.
                  </p>
                </div>

                {/* Visibilidade */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-[#e6edf3]">Visibilidade</label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, isPublic: true }))}
                      className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                        form.isPublic
                          ? "border-[#3fb950] bg-[#3fb950]/10"
                          : "border-[#30363d] hover:border-[#3fb950]/40"
                      }`}
                    >
                      <Globe className="h-5 w-5 flex-shrink-0 text-[#3fb950]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#e6edf3]">Pública</p>
                        <p className="text-xs text-[#7d8590]">Qualquer pessoa pode ver e solicitar entrada</p>
                      </div>
                      {form.isPublic && <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#3fb950]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, isPublic: false }))}
                      className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                        !form.isPublic
                          ? "border-[#7d8590] bg-[#7d8590]/10"
                          : "border-[#30363d] hover:border-[#7d8590]/40"
                      }`}
                    >
                      <Lock className="h-5 w-5 flex-shrink-0 text-[#7d8590]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#e6edf3]">Privada</p>
                        <p className="text-xs text-[#7d8590]">Apenas membros convidados podem ver e participar</p>
                      </div>
                      {!form.isPublic && <CheckCircle className="h-5 w-5 flex-shrink-0 text-[#7d8590]" />}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="rounded-lg border border-[#388bfd]/20 bg-[#388bfd]/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[#58a6ff]">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm font-semibold">Dica</p>
                  </div>
                  <p className="text-xs leading-relaxed text-[#7d8590]">
                    Equipes com descrições claras, tecnologias bem definidas e banners atrativos têm mais visibilidade e atraem desenvolvedores qualificados.
                  </p>
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
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Criando...</>
                  : <>🚀 Criar equipe</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
