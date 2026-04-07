"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Users,
  Calendar, CheckCircle, Building2, Globe, Mail, Send
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { toast } from "@/lib/utils/toast";

interface Job {
  id: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: "remote" | "hybrid" | "onsite";
  contractType: "fulltime" | "parttime" | "contract" | "freelance";
  salary: { min: number; max: number; currency: string };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  postedAt: string;
  applicants: number;
  companySize: string;
  companyWebsite?: string;
  contactEmail?: string;
}

const MOCK_JOBS: Record<string, Job> = {
  "1": {
    id: 1,
    title: "Desenvolvedor Full Stack para E-commerce",
    company: "TechCommerce",
    companyLogo: "🛒",
    location: "São Paulo, SP",
    type: "hybrid",
    contractType: "fulltime",
    salary: { min: 8000, max: 12000, currency: "BRL" },
    description: "Estamos buscando um desenvolvedor full stack experiente para atuar no desenvolvimento e manutenção de nossa plataforma de e-commerce. Você trabalhará com tecnologias modernas e terá a oportunidade de impactar milhões de usuários.",
    requirements: [
      "3+ anos de experiência com desenvolvimento web",
      "Domínio de React e Node.js",
      "Experiência com bancos de dados SQL e NoSQL",
      "Conhecimento em arquitetura de microserviços",
      "Inglês intermediário para leitura técnica"
    ],
    responsibilities: [
      "Desenvolver e manter features da plataforma de e-commerce",
      "Participar de code reviews e pair programming",
      "Colaborar com equipes de produto e design",
      "Otimizar performance e escalabilidade",
      "Implementar testes automatizados"
    ],
    benefits: [
      "Vale refeição e alimentação",
      "Plano de saúde e odontológico",
      "Auxílio home office",
      "Horário flexível",
      "Day off no aniversário",
      "Programa de educação continuada"
    ],
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "Docker"],
    experience: "3-5 anos",
    postedAt: "2024-12-20",
    applicants: 24,
    companySize: "50-200 funcionários",
    companyWebsite: "https://techcommerce.com",
    contactEmail: "jobs@techcommerce.com"
  },
  "2": {
    id: 2,
    title: "App Mobile de Delivery (React Native)",
    company: "DeliveryFast",
    companyLogo: "🚚",
    location: "Remoto",
    type: "remote",
    contractType: "contract",
    salary: { min: 15000, max: 25000, currency: "BRL" },
    description: "Projeto de 6 meses para desenvolvimento de aplicativo mobile de delivery. Buscamos desenvolvedor React Native com experiência em apps de alta performance e integração com APIs.",
    requirements: [
      "2+ anos com React Native",
      "Experiência com Redux ou Context API",
      "Conhecimento em integração de APIs REST",
      "Publicação de apps na App Store e Google Play",
      "Experiência com geolocalização e mapas"
    ],
    responsibilities: [
      "Desenvolver aplicativo mobile do zero",
      "Integrar com backend via API REST",
      "Implementar sistema de rastreamento em tempo real",
      "Otimizar performance e UX",
      "Publicar nas lojas de aplicativos"
    ],
    benefits: [
      "Trabalho 100% remoto",
      "Pagamento por projeto",
      "Flexibilidade de horários",
      "Possibilidade de renovação"
    ],
    skills: ["React Native", "Redux", "TypeScript", "Firebase", "Google Maps API"],
    experience: "2-4 anos",
    postedAt: "2024-12-18",
    applicants: 42,
    companySize: "10-50 funcionários",
    companyWebsite: "https://deliveryfast.com"
  }
};

const TYPE_LABELS = {
  remote: { label: "Remoto", icon: Globe, color: "#3fb950" },
  hybrid: { label: "Híbrido", icon: Building2, color: "#58a6ff" },
  onsite: { label: "Presencial", icon: Building2, color: "#d29922" }
};

const CONTRACT_LABELS = {
  fulltime: "Tempo Integral",
  parttime: "Meio Período",
  contract: "Contrato",
  freelance: "Freelance"
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundJob = MOCK_JOBS[id] || null;
    setJob(foundJob);
  }, [id]);

  const handleApply = () => {
    setHasApplied(true);
    toast.success("Candidatura enviada com sucesso!");
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-[#0d1117] py-12">
        <Container size="lg">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h2 className="text-xl font-semibold text-[#e6edf3]">Vaga não encontrada</h2>
              <Link href="/jobs" className="mt-4 inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:underline">
                <ArrowLeft className="h-4 w-4" /> Voltar para vagas
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const typeInfo = TYPE_LABELS[job.type];
  const TypeIcon = typeInfo.icon;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <div className="border-b border-[#21262d] bg-[#0d1117] py-6">
        <Container size="lg">
          <Link
            href="/jobs"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#7d8590] transition-colors hover:text-[#58a6ff]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para vagas
          </Link>

          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-[#30363d] bg-[#161b22] text-3xl">
              {job.companyLogo}
            </div>

            {/* Job Info */}
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-[#e6edf3]">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#7d8590]">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#e6edf3]">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <TypeIcon className="h-4 w-4" style={{ color: typeInfo.color }} />
                  <span style={{ color: typeInfo.color }}>{typeInfo.label}</span>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {CONTRACT_LABELS[job.contractType]}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={hasApplied}
              className="inline-flex items-center gap-2 rounded-lg bg-[#238636] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasApplied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Candidatura enviada
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Candidatar-se
                </>
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container size="lg">
        <div className="grid gap-6 py-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Salary & Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
                <div className="mb-1 flex items-center gap-2 text-[#7d8590]">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-medium">Salário</span>
                </div>
                <p className="text-lg font-bold text-[#e6edf3]">
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
                <div className="mb-1 flex items-center gap-2 text-[#7d8590]">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Candidatos</span>
                </div>
                <p className="text-lg font-bold text-[#e6edf3]">{job.applicants}</p>
              </div>

              <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
                <div className="mb-1 flex items-center gap-2 text-[#7d8590]">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">Publicado</span>
                </div>
                <p className="text-lg font-bold text-[#e6edf3]">
                  {new Date(job.postedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
              <h2 className="mb-4 text-lg font-bold text-[#e6edf3]">Sobre a vaga</h2>
              <p className="leading-relaxed text-[#7d8590]">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
              <h2 className="mb-4 text-lg font-bold text-[#e6edf3]">Requisitos</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#7d8590]">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#3fb950]" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
              <h2 className="mb-4 text-lg font-bold text-[#e6edf3]">Responsabilidades</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#7d8590]">
                    <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#58a6ff]">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
              <h2 className="mb-4 text-lg font-bold text-[#e6edf3]">Benefícios</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#7d8590]">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#d29922]" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Skills */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-3 text-sm font-semibold text-[#e6edf3]">Tecnologias</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#e6edf3]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-4 text-sm font-semibold text-[#e6edf3]">Sobre a empresa</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-[#7d8590]">
                  <Users className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{job.companySize}</span>
                </div>
                {job.companyWebsite && (
                  <div className="flex items-start gap-2">
                    <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7d8590]" />
                    <a
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#58a6ff] hover:underline"
                    >
                      {job.companyWebsite.replace('https://', '')}
                    </a>
                  </div>
                )}
                {job.contactEmail && (
                  <div className="flex items-start gap-2">
                    <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#7d8590]" />
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="text-[#58a6ff] hover:underline"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5">
              <h3 className="mb-2 text-sm font-semibold text-[#e6edf3]">Experiência necessária</h3>
              <p className="text-sm text-[#7d8590]">{job.experience}</p>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-[#388bfd]/20 bg-[#388bfd]/5 p-5">
              <p className="mb-3 text-sm leading-relaxed text-[#7d8590]">
                Interessado nesta vaga? Candidate-se agora e faça parte desta equipe!
              </p>
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className="w-full rounded-lg bg-[#238636] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasApplied ? "Candidatura enviada" : "Candidatar-se agora"}
              </button>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
