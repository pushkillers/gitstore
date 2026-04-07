import Link from "next/link";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { mockProjects } from "@/lib/data";

const featuredProjects = mockProjects.filter((p) => p.featured).slice(0, 3);

const STATS = [
  { value: "12k+",  label: "Projetos publicados",  color: "#58a6ff" },
  { value: "4.8k+", label: "Desenvolvedores ativos", color: "#3fb950" },
  { value: "850+",  label: "Equipes formadas",       color: "#d29922" },
  { value: "R$8M+", label: "Em transações",          color: "#a371f7" },
];

const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
      </svg>
    ),
    title: "Marketplace de Projetos",
    desc: "Compre, venda e distribua projetos de software com controle total sobre licenciamento e precificação.",
    color: "#58a6ff",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Matching de Talentos",
    desc: "Algoritmo inteligente que conecta projetos com desenvolvedores pelo fit de stack, senioridade e disponibilidade.",
    color: "#3fb950",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Pagamentos Seguros",
    desc: "Escrow integrado com Stripe para freelancers e compradores. Dinheiro liberado apenas após entrega confirmada.",
    color: "#d29922",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Sistema de XP & Ranking",
    desc: "Gamificação real: ganhe XP publicando projetos, recebendo curtidas e colaborando. Suba no ranking da comunidade.",
    color: "#a371f7",
  },
];

const TESTIMONIALS = [
  {
    quote: "Publiquei meu boilerplate Next.js e em 3 dias já tinha 40 downloads. A plataforma é o que faltava para monetizar projetos open source.",
    name: "Ana Silva",
    role: "Senior Frontend Dev",
    avatar: "AS",
    color: "#58a6ff",
  },
  {
    quote: "Encontrei um time completo para meu SaaS em menos de uma semana. O matching por stack é absurdamente preciso.",
    name: "Carlos Mendes",
    role: "Founder & CTO",
    avatar: "CM",
    color: "#3fb950",
  },
  {
    quote: "Como freelancer, o GitStore me trouxe 3 contratos em um mês. Os clientes já chegam com contexto técnico claro.",
    name: "Beatriz Costa",
    role: "Full Stack Developer",
    avatar: "BC",
    color: "#d29922",
  },
];

const LOGOS = ["Nubank", "iFood", "Mercado Livre", "Totvs", "RD Station", "Conta Azul"];

export default function Home() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#0d1117]">
        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full bg-[#1f6feb]/8 blur-[140px]" />
          <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#3fb950]/6 blur-[120px]" />
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#a371f7]/5 blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 hero-grid" />

        <Container size="lg">
          <div className="relative pb-20 pt-24 sm:pt-32 lg:pt-40">
            {/* Live badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#388bfd]/20 bg-[#388bfd]/6 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
              </span>
              <span className="text-xs font-semibold text-[#79c0ff] tracking-wide">
                Plataforma em crescimento · 4.8k devs ativos agora
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="mb-6 text-[clamp(2.6rem,6.5vw,5rem)] font-bold leading-[1.04] tracking-[-0.02em] text-[#e6edf3]">
                O marketplace onde{" "}
                <span className="bg-gradient-to-r from-[#58a6ff] via-[#79c0ff] to-[#3fb950] bg-clip-text text-transparent">
                  código vira produto
                </span>{" "}
                e devs viram time.
              </h1>

              <p className="mb-10 max-w-2xl text-xl leading-8 text-[#8b949e]">
                Publique projetos, encontre colaboradores pelo fit de stack, feche contratos freelance e suba no ranking da maior comunidade dev do Brasil.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="success" asChild>
                  <Link href={ROUTES.PROJECTS}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explorar projetos
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.PUBLISH}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Publicar projeto
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href={ROUTES.JOBS}>Ver vagas →</Link>
                </Button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="group rounded-xl border border-[#21262d] bg-[#161b22]/60 px-5 py-4 backdrop-blur-sm transition-all duration-200 hover:border-[#30363d] hover:bg-[#161b22]"
                >
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="mt-1 text-xs text-[#7d8590]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1117] to-transparent" />
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="border-y border-[#21262d] bg-[#0d1117] py-6">
        <Container size="lg">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <p className="flex-shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#484f58]">
              Usado por devs de
            </p>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 sm:justify-start">
              {LOGOS.map((logo) => (
                <span key={logo} className="text-sm font-semibold text-[#484f58] transition-colors hover:text-[#7d8590]">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="border-b border-[#21262d] bg-[#0d1117] py-20">
        <Container size="lg">
          <div className="mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#388bfd]">Plataforma completa</p>
            <h2 className="text-3xl font-bold text-[#e6edf3] sm:text-4xl">
              Tudo que um dev precisa para crescer
            </h2>
            <p className="mt-4 text-[#7d8590]">
              Do primeiro commit ao primeiro contrato. Uma plataforma construída por devs, para devs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#30363d] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at 30% 0%, ${f.color}08, transparent 60%)` }}
                />
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.color}12`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-[#e6edf3]">{f.title}</h3>
                <p className="text-xs leading-5 text-[#7d8590]">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── FEATURED PROJECTS ─── */}
      <section className="border-b border-[#21262d] bg-[#0d1117] py-20">
        <Container size="lg">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#388bfd]">Em destaque</p>
              <h2 className="text-2xl font-bold text-[#e6edf3]">Projetos mais populares</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href={ROUTES.PROJECTS} className="text-sm">
                Ver todos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </Container>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-b border-[#21262d] bg-[#0d1117] py-20">
        <Container size="lg">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#388bfd]">Depoimentos</p>
            <h2 className="text-3xl font-bold text-[#e6edf3]">O que a comunidade diz</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] p-6"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}50, transparent)` }}
                />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 fill-[#d29922]" viewBox="0 0 16 16">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                  ))}
                </div>
                <p className="mb-5 text-sm leading-6 text-[#8b949e]">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e6edf3]">{t.name}</p>
                    <p className="text-xs text-[#7d8590]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-[#0d1117] py-24">
        <Container size="lg">
          <div className="relative overflow-hidden rounded-2xl border border-[#21262d] bg-[#161b22] px-8 py-16 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#1f6feb]/10 blur-[80px]" />
              <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#3fb950]/8 blur-[80px]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#388bfd]/40 to-transparent" />
            </div>
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#388bfd]">Comece hoje</p>
              <h2 className="mb-4 text-3xl font-bold text-[#e6edf3] sm:text-4xl">
                Seu próximo projeto começa aqui.
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-[#8b949e]">
                Junte-se a 4.800+ desenvolvedores que já estão construindo, colaborando e monetizando no GitStore.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" variant="success" asChild>
                  <Link href="/login">Criar conta grátis</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.PROJECTS}>Explorar projetos</Link>
                </Button>
              </div>
              <p className="mt-5 text-xs text-[#484f58]">Sem cartão de crédito · Grátis para sempre no plano básico</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
