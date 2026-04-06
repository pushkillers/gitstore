"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Briefcase, DollarSign, Clock, MapPin } from "lucide-react";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateJobModal({ isOpen, onClose }: CreateJobModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    budgetType: "fixed",
    budgetValue: "",
    budgetMin: "",
    budgetMax: "",
    experienceLevel: "mid",
    duration: "",
    location: "remote",
    urgent: false,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative bg-github-canvas-subtle border border-github-border-default rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-github-border-default">
          <div>
            <h2 className="text-xl font-bold text-github-fg-default">
              Publicar Novo Trabalho
            </h2>
            <p className="text-sm text-github-fg-muted">
              Passo {step} de 3
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-github-canvas-default rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-github-fg-muted" />
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Título do Trabalho
                </label>
                <input
                  type="text"
                  placeholder="Ex: Desenvolvimento de E-commerce em React"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default">
                  Descrição Detalhada
                </label>
                <textarea
                  rows={5}
                  placeholder="Descreva o projeto, requisitos, entregáveis esperados..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20 resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default">
                  Habilidades Necessárias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript, PostgreSQL"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis focus:ring-2 focus:ring-github-accent-emphasis/20"
                />
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Tipo de Orçamento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "fixed", label: "Valor Fixo" },
                    { value: "hourly", label: "Por Hora" },
                    { value: "range", label: "Faixa" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, budgetType: type.value })}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.budgetType === type.value
                          ? "bg-github-accent-emphasis text-white border-github-accent-emphasis"
                          : "bg-github-canvas-default border-github-border-default text-github-fg-muted hover:text-github-fg-default"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-github-fg-muted">
                    R$
                  </span>
                  {formData.budgetType === "fixed" && (
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full pl-10 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
                    />
                  )}
                  {formData.budgetType === "hourly" && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="flex-1 pl-10 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="flex-1 pl-10 pr-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default">
                  Nível de Experiência
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
                >
                  <option value="junior">Júnior</option>
                  <option value="mid">Pleno</option>
                  <option value="senior">Sênior</option>
                  <option value="expert">Especialista</option>
                </select>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duração Estimada
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
                >
                  <option value="">Selecione...</option>
                  <option value="Less than 1 month">Menos de 1 mês</option>
                  <option value="1 to 3 months">1 a 3 meses</option>
                  <option value="3 to 6 months">3 a 6 meses</option>
                  <option value="More than 6 months">Mais de 6 meses</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-github-fg-default flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Localização
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 bg-github-canvas-default border border-github-border-default rounded-lg text-github-fg-default focus:outline-none focus:border-github-accent-emphasis"
                >
                  <option value="remote">Remoto</option>
                  <option value="onsite">Presencial</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-github-danger-fg/10 rounded-lg border border-github-danger-fg/20">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                  className="w-4 h-4 accent-github-danger-fg"
                />
                <label htmlFor="urgent" className="text-sm text-github-danger-fg font-medium">
                  Marcar como Urgente (precisa começar imediatamente)
                </label>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-github-border-default bg-github-canvas-subtle">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Anterior
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Próximo
              </Button>
            ) : (
              <Button variant="success" onClick={onClose}>
                Publicar Trabalho
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
