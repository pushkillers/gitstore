"use client";

import Link from "next/link";
import { Job } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ROUTES } from "@/constants";
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  MapPin, 
  Calendar,
  User
} from "lucide-react";

const budgetTypeLabels: Record<string, string> = {
  fixed: "Valor Fixo",
  hourly: "Por Hora",
  range: "Faixa de Preço",
};

const experienceLevelLabels: Record<string, string> = {
  junior: "Júnior",
  mid: "Pleno",
  senior: "Sênior",
  expert: "Especialista",
};

export function JobCard({ job }: { job: Job }) {
  const postedDate = new Date(job.postedAt);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Link href={ROUTES.JOB_DETAIL(job.id)} className="block group">
      <Card className="h-full flex flex-col hover:border-github-accent-emphasis transition-all duration-300">
        {/* Header */}
        <div className="p-5 border-b border-github-border-default">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-github-fg-default line-clamp-2 group-hover:text-github-accent-fg transition-colors">
              {job.title}
            </h3>
            <Badge variant={job.status === "open" ? "success" : "default"}>
              {job.status === "open" ? "Aberto" : "Fechado"}
            </Badge>
          </div>
          
          <p className="text-sm text-github-fg-muted line-clamp-2 mb-3">
            {job.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map((skill: string) => (
              <span 
                key={skill}
                className="px-2 py-1 text-xs rounded-full bg-github-canvas-subtle text-github-fg-muted border border-github-border-default"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs text-github-fg-subtle">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        </div>
        
        {/* Details */}
        <div className="p-5 space-y-3 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-github-success-fg" />
            <span className="font-medium text-github-fg-default">
              {job.budget.type === "fixed" && `R$ ${job.budget.value?.toLocaleString()}`}
              {job.budget.type === "hourly" && `R$ ${job.budget.min}/hr - R$ ${job.budget.max}/hr`}
              {job.budget.type === "range" && `R$ ${job.budget.min?.toLocaleString()} - R$ ${job.budget.max?.toLocaleString()}`}
            </span>
            <span className="text-github-fg-subtle text-xs">
              ({budgetTypeLabels[job.budget.type]})
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-github-fg-muted">
            <Briefcase className="w-4 h-4" />
            <span>{experienceLevelLabels[job.experienceLevel]}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-github-fg-muted">
            <Clock className="w-4 h-4" />
            <span>{job.duration}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-github-fg-muted">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-github-border-default bg-github-canvas-subtle/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-github-accent-emphasis flex items-center justify-center text-white text-sm font-bold">
                {job.client.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-github-fg-default">
                  {job.client.name}
                </p>
                <p className="text-xs text-github-fg-subtle">
                  {job.client.rating} ★ ({job.client.jobsPosted} trabalhos)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-github-fg-subtle">
              <Calendar className="w-3 h-3" />
              {daysAgo === 0 ? "Hoje" : daysAgo === 1 ? "Ontem" : `${daysAgo} dias atrás`}
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-github-border-default flex items-center justify-between text-sm">
            <span className="text-github-fg-muted">
              <User className="w-4 h-4 inline mr-1" />
              {job.proposalsCount} propostas
            </span>
            {job.urgent && (
              <Badge variant="danger" className="text-xs">Urgente</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
