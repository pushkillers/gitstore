"use client";

import { Job } from "@/types";
import { MapPin, Clock, DollarSign, Users, Zap } from "lucide-react";

const EXP_LABELS: Record<string, { label: string; color: string }> = {
  junior: { label: "Júnior",      color: "#3fb950" },
  mid:    { label: "Pleno",       color: "#58a6ff" },
  senior: { label: "Sênior",      color: "#f0b442" },
  expert: { label: "Especialista",color: "#a371f7" },
};

function formatBudget(job: Job): string {
  const { type, value, min, max } = job.budget;
  if (type === "fixed")  return `R$ ${value?.toLocaleString("pt-BR")}`;
  if (type === "hourly") return `R$ ${min}–${max}/h`;
  return `R$ ${min?.toLocaleString("pt-BR")} – ${max?.toLocaleString("pt-BR")}`;
}

function daysAgo(dateStr: string): string {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (d === 0) return "Hoje";
  if (d === 1) return "Ontem";
  return `${d}d atrás`;
}

export function JobCard({ job }: { job: Job }) {
  const exp = EXP_LABELS[job.experienceLevel] ?? { label: job.experienceLevel, color: "#7d8590" };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] transition-all duration-200 hover:border-[#30363d] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
      {/* Urgent stripe */}
      {job.urgent && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#f85149] to-transparent" />
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#e6edf3] line-clamp-2 transition-colors group-hover:text-[#58a6ff]">
              {job.title}
            </h3>
            <p className="mt-1 text-xs text-[#484f58]">{job.client.name}</p>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
            {job.urgent && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f85149]/25 bg-[#f85149]/10 px-2 py-0.5 text-[10px] font-semibold text-[#f85149]">
                <Zap className="h-2.5 w-2.5" />
                Urgente
              </span>
            )}
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: exp.color, borderColor: `${exp.color}25`, backgroundColor: `${exp.color}10` }}
            >
              {exp.label}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-xs leading-5 text-[#7d8590]">{job.description}</p>

        {/* Skills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full border border-[#21262d] bg-[#0d1117] px-2 py-0.5 text-[10px] text-[#7d8590]">
              {s}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="rounded-full border border-[#21262d] px-2 py-0.5 text-[10px] text-[#484f58]">
              +{job.skills.length - 4}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="mt-auto grid grid-cols-2 gap-2 text-[11px] text-[#7d8590]">
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-[#3fb950]" />
            <span className="font-semibold text-[#e6edf3]">{formatBudget(job)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#484f58]" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#484f58]" />
            {job.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#484f58]" />
            {job.proposalsCount} propostas
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#21262d] px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#388bfd] text-[10px] font-bold text-white">
            {job.client.name[0]}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#484f58]">
            <span className="text-[#d29922]">★ {job.client.rating}</span>
            <span>· {job.client.jobsPosted} vagas</span>
          </div>
        </div>
        <span className="text-[10px] text-[#484f58]">{daysAgo(job.postedAt)}</span>
      </div>
    </article>
  );
}
