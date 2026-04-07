"use client";

import { useEffect, useState } from "react";
import { X, Upload, CheckCircle, DollarSign, Info } from "lucide-react";
import { Project } from "@/types";
import { LANGUAGES, CATEGORIES } from "@/constants";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  onSave: (updatedProject: Project) => void;
}

export function EditProjectModal({ open, onClose, project, onSave }: EditProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    category: "",
    tags: [] as string[],
    repository: "",
    type: "free" as "free" | "paid",
    price: 0,
  });
  const [images, setImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && project) {
      setFormData({
        name: project.name,
        description: project.description,
        language: project.language,
        category: project.category,
        tags: project.tags || [],
        repository: project.repository || "",
        type: project.type,
        price: project.price || 0,
      });
      const projectImages = [];
      if (project.thumbnail) projectImages.push(project.thumbnail);
      if (project.screenshots) projectImages.push(...project.screenshots);
      setImages(projectImages);
      setTagInput("");
      setErrors({});
    }
  }, [open, project]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (!formData.language) {
      newErrors.language = "Linguagem é obrigatória";
    }
    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória";
    }
    if (formData.type === "paid" && (!formData.price || formData.price <= 0)) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const updatedProject: Project = {
      ...project,
      name: formData.name,
      description: formData.description,
      language: formData.language,
      category: formData.category,
      tags: formData.tags,
      repository: formData.repository,
      type: formData.type,
      price: formData.type === "paid" ? formData.price : undefined,
      thumbnail: images[0],
      screenshots: images.slice(1),
      updatedAt: new Date().toISOString().split("T")[0],
    };

    onSave(updatedProject);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative flex h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-[#30363d] bg-[#161b22] shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#30363d] bg-[#161b22] px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-[#e6edf3]">Editar Projeto</h2>
            <p className="mt-1 text-sm text-[#7d8590]">Atualize as informações do seu projeto</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7d8590] transition-colors hover:bg-[#21262d] hover:text-[#e6edf3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Coluna Principal (2/3) */}
              <div className="space-y-5">
              {/* Nome */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                  Nome do Projeto <span className="text-[#f85149]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.name ? "border-[#f85149]" : "border-[#30363d]"
                  } bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15`}
                  placeholder="Ex: Sistema de Chat em Tempo Real"
                />
                {errors.name && <p className="mt-1 text-sm text-[#f85149]">{errors.name}</p>}
              </div>

              {/* Descrição */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                  Descrição <span className="text-[#f85149]">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full resize-none rounded-lg border ${
                    errors.description ? "border-[#f85149]" : "border-[#30363d]"
                  } bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15`}
                  placeholder="Descreva seu projeto de forma clara e objetiva..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-[#f85149]">{errors.description}</p>
                )}
              </div>

              {/* Linguagem e Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                    Linguagem <span className="text-[#f85149]">*</span>
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.language ? "border-[#f85149]" : "border-[#30363d]"
                    } bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15`}
                  >
                    <option value="">Selecione...</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  {errors.language && <p className="mt-1 text-sm text-[#f85149]">{errors.language}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                    Categoria <span className="text-[#f85149]">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.category ? "border-[#f85149]" : "border-[#30363d]"
                    } bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15`}
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-[#f85149]">{errors.category}</p>}
                </div>
              </div>

              {/* Repositório */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                  Repositório
                </label>
                <input
                  type="url"
                  name="repository"
                  value={formData.repository}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15"
                  placeholder="https://github.com/usuario/projeto"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#e6edf3]">
                  Tags <span className="text-xs font-normal text-[#7d8590]">(máximo 5)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2.5 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15"
                    placeholder="Digite e pressione Enter"
                    disabled={formData.tags.length >= 5}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={formData.tags.length >= 5}
                    className="rounded-lg border border-[#30363d] px-4 py-2.5 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#161b22] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-[#58a6ff]/10 px-3 py-1 text-sm text-[#58a6ff]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-[#58a6ff] hover:text-[#79c0ff]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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

              {/* Coluna Lateral (1/3) */}
              <div className="space-y-5">
              {/* Tipo */}
              <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
                <label className="mb-3 block text-sm font-semibold text-[#e6edf3]">
                  Tipo de Projeto <span className="text-[#f85149]">*</span>
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: "free", price: 0 }))}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-sm font-medium transition-all ${
                      formData.type === "free"
                        ? "border-[#3fb950] bg-[#3fb950]/10 text-[#3fb950]"
                        : "border-[#30363d] text-[#7d8590] hover:border-[#3fb950]/50 hover:text-[#e6edf3]"
                    }`}
                  >
                    <span className="text-xl">🆓</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Gratuito</p>
                      <p className="text-xs text-[#7d8590]">Disponível para todos</p>
                    </div>
                    {formData.type === "free" && (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: "paid" }))}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-sm font-medium transition-all ${
                      formData.type === "paid"
                        ? "border-[#f0b442] bg-[#f0b442]/10 text-[#f0b442]"
                        : "border-[#30363d] text-[#7d8590] hover:border-[#f0b442]/50 hover:text-[#e6edf3]"
                    }`}
                  >
                    <span className="text-xl">💎</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Pago</p>
                      <p className="text-xs text-[#7d8590]">Acesso mediante pagamento</p>
                    </div>
                    {formData.type === "paid" && (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* Preço */}
              {formData.type === "paid" && (
                <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
                  <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
                    <DollarSign className="h-4 w-4" />
                    Preço (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7d8590]">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full rounded-lg border ${
                        errors.price ? "border-[#f85149]" : "border-[#30363d]"
                      } bg-[#0d1117] px-4 py-2.5 pl-8 text-sm text-[#e6edf3] outline-none transition-all placeholder:text-[#6e7681] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/15`}
                      placeholder="29.99"
                    />
                  </div>
                  {errors.price && <p className="mt-2 text-sm text-[#f85149]">{errors.price}</p>}
                  <p className="mt-2 text-xs text-[#7d8590]">
                    Defina um preço justo para seu projeto
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="rounded-xl border border-[#388bfd]/20 bg-[#388bfd]/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-[#58a6ff]">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm font-semibold">Informação</p>
                </div>
                <div className="space-y-1 text-xs text-[#7d8590]">
                  <p>• Campos com * são obrigatórios</p>
                  <p>• Máximo de 5 tags por projeto</p>
                  <p>• Primeira imagem será a capa</p>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex flex-shrink-0 justify-end gap-3 border-t border-[#30363d] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#30363d] px-5 py-2.5 text-sm font-medium text-[#e6edf3] transition-colors hover:bg-[#21262d]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#238636] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] active:scale-[0.98]"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
