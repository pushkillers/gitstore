"use client";

import { useState, useEffect } from "react";
import { X, Mail, UserPlus, CheckCircle, Copy, Link as LinkIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "@/lib/utils/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  teamName: string;
  teamId: number;
}

export function InviteMemberModal({ open, onClose, teamName, teamId }: Props) {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Gerar link de convite
      setInviteLink(`${window.location.origin}/teams/${teamId}/join?invite=${btoa(teamId.toString())}`);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, teamId]);

  const handleClose = () => {
    setEmail("");
    setCopied(false);
    onClose();
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simular envio de convite
    toast.success(`Convite enviado para ${email}!`);
    setEmail("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#e6edf3]">Convidar Membro</h2>
            <p className="mt-0.5 text-sm text-[#7d8590]">{teamName}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#e6edf3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Convidar por email */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
              <Mail className="h-4 w-4" />
              Convidar por e-mail
            </label>
            <form onSubmit={handleSendInvite} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15"
              />
              <button
                type="submit"
                disabled={!email}
                className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4" />
                Enviar
              </button>
            </form>
            <p className="mt-2 text-xs text-[#7d8590]">
              O membro receberá um e-mail com o convite para entrar na equipe
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#161b22] px-2 text-[#7d8590]">ou</span>
            </div>
          </div>

          {/* Link de convite */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
              <LinkIcon className="h-4 w-4" />
              Link de convite
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#7d8590] outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#21262d] px-4 py-2.5 text-sm font-semibold text-[#e6edf3] transition-all hover:bg-[#30363d]"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[#3fb950]" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-[#7d8590]">
              Compartilhe este link com quem você deseja convidar
            </p>
          </div>

          {/* Info */}
          <div className="rounded-lg border border-[#388bfd]/20 bg-[#388bfd]/5 p-4">
            <p className="text-xs leading-relaxed text-[#7d8590]">
              💡 Os convites são válidos por 7 dias. Membros convidados terão acesso aos projetos da equipe após a aprovação.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#30363d] px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#30363d] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
