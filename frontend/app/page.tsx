import Link from "next/link";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants";
import { mockProjects } from "@/lib/data";

const featuredProjects = mockProjects.slice(0, 3);

const heroSignals = [
  "Matching por stack",
  "Equipes remotas",
  "Projetos open source",
  "Vagas para contribuir",
];

const workflowSteps = [
  {
    title: "Publique sua ideia",
    description: "Apresente seu projeto com contexto tecnico, objetivos e stack ideal para atrair as pessoas certas.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Conecte talento certo",
    description: "Filtre por linguagem, senioridade e disponibilidade para montar um time alinhado ao ritmo do produto.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Ganhe velocidade",
    description: "Centralize oportunidades, pessoas e aprendizado em um fluxo continuo de descoberta e colaboracao.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const communityPulse = [
  { label: "Novos projetos hoje", value: "48", tone: "text-[#58a6ff]" },
  { label: "Colaboradores ativos", value: "312", tone: "text-[#3fb950]" },
  { label: "Vagas abertas", value: "27", tone: "text-[#d29922]" },
  { label: "Pitchs revisados", value: "96", tone: "text-[#a371f7]" },
];

const trendingStacks = ["Next.js", "Python", "Open Source", "IA aplicada", "Design System", "DevOps"];

const tractionCards = [
  {
    title: "Taxa de resposta",
    value: "92%",
    description: "Projetos publicados com detalhes claros recebem contato inicial em ate 48h.",
    trend: "+11% este mes",
  },
  {
    title: "Entrega colaborativa",
    value: "3.4x",
    description: "Times criados pela plataforma chegam no primeiro milestone mais rapido.",
    trend: "Aceleracao media",
  },
  {
    title: "Retencao de talentos",
    value: "81%",
    description: "Contribuidores que entram por fit de stack tendem a permanecer no projeto.",
    trend: "Com base no ultimo trimestre",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#21262d] bg-[#0d1117] py-14 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(56,139,253,0.18),transparent_36%),radial-gradient(circle_at_88%_10%,rgba(63,185,80,0.12),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(210,153,34,0.08),transparent_38%)]" />
        <div className="absolute inset-0 hero-grid-layer" />
        <div className="absolute inset-0 hero-noise opacity-[0.35]" />

        <Container className="relative">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1f6feb]/25 bg-[#1f6feb]/10 px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb950] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3fb950]" />
                </span>
                <span className="text-sm font-medium text-[#58a6ff]">Plataforma em crescimento para quem quer construir junto</span>
              </div>

              <h1 className="mb-5 text-5xl font-bold leading-[0.92] tracking-tight text-[#e6edf3] sm:text-6xl lg:text-7xl">
                Tire projetos do papel com uma comunidade pronta para colaborar.
              </h1>

              <p className="mb-8 max-w-2xl text-lg leading-8 text-[#9aa4b2] sm:text-xl">
                Anuncie ideias, descubra produtos promissores, encontre devs alinhados com sua stack e acelere o que antes ficava parado no backlog.
              </p>

              <div className="mb-8 flex flex-wrap gap-3">
                {heroSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-[#30363d] bg-[#161b22]/70 px-4 py-2 text-sm font-medium text-[#c9d1d9] transition-colors hover:border-[#58a6ff]/40"
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Button size="lg" variant="success" asChild>
                  <Link href={ROUTES.PROJECTS} className="min-w-[220px]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explorar Projetos
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.PUBLISH} className="min-w-[220px]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Publicar Projeto
                  </Link>
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "1.2k+", label: "Projetos em vitrine" },
                  { value: "500+", label: "Desenvolvedores ativos" },
                  { value: "150+", label: "Equipes formadas" },
                ].map((stat) => (
                  <div key={stat.label} className="soft-card rounded-2xl px-5 py-4">
                    <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                    <div className="mt-1 text-sm text-[#7d8590]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-[#2a3440] bg-[linear-gradient(140deg,rgba(12,19,33,0.95),rgba(10,26,48,0.9),rgba(18,33,28,0.86))] p-6 shadow-[0_30px_110px_-45px_rgba(0,0,0,0.88)] sm:p-7">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7d8590]">Radar da comunidade</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#e6edf3]">Tudo importante, sem poluicao lateral</h2>
                </div>
                <span className="w-fit rounded-full border border-[#238636]/40 bg-[#238636]/10 px-3 py-1 text-xs font-semibold text-[#3fb950]">
                  Atualizado ha pouco
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {communityPulse.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#2f3d50] bg-[#0b1422]/72 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#58a6ff]/40">
                    <div className={`text-3xl font-bold ${item.tone}`}>{item.value}</div>
                    <div className="mt-1 text-sm text-[#9aa4b2]">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {trendingStacks.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[#314359] bg-[#111f32]/85 px-3 py-2 text-sm text-[#c9d1d9] transition-colors hover:border-[#58a6ff]/35"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-[#21262d] bg-[#0b1220] py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#58a6ff]">Tracao da comunidade</p>
              <h2 className="mt-2 text-3xl font-bold text-[#e6edf3]">Metricas reais para quem quer executar com mais previsibilidade</h2>
            </div>
            <p className="max-w-2xl text-[#7d8590]">Cada indicador aqui aponta para uma jornada mais curta entre ideia, conexao e entrega.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {tractionCards.map((card) => (
              <article key={card.title} className="group relative overflow-hidden rounded-3xl border border-[#2a3440] bg-[#111a2a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#58a6ff]/45">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#58a6ff] via-[#2ea043] to-[#d29922] opacity-70" />
                <p className="text-sm uppercase tracking-[0.18em] text-[#7d8590]">{card.title}</p>
                <p className="mt-4 text-4xl font-bold text-[#e6edf3]">{card.value}</p>
                <p className="mt-4 leading-7 text-[#9aa4b2]">{card.description}</p>
                <p className="mt-5 text-sm font-semibold text-[#58a6ff]">{card.trend}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[#21262d] bg-[#0d1117] py-14">
        <Container>
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#58a6ff]">Como funciona</p>
              <h2 className="mt-2 text-3xl font-bold text-[#e6edf3]">Um fluxo simples para sair da ideia e chegar na entrega</h2>
            </div>
            <p className="max-w-2xl text-[#7d8590]">
              O produto ja tinha uma base boa. Aqui a gente deixa a proposta mais clara logo de cara para aumentar confianca e conversao.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="group rounded-3xl border border-[#30363d] bg-[#161b22]/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#58a6ff]/40"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f6feb]/10 text-[#58a6ff]">
                    {step.icon}
                  </div>
                  <span className="text-sm font-semibold text-[#7d8590]">0{index + 1}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-[#e6edf3]">{step.title}</h3>
                <p className="leading-7 text-[#9aa4b2]">{step.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#0d1117] py-16">
        <Container>
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#e6edf3]">Projetos em Destaque</h2>
              <p className="mt-2 text-[#7d8590]">Explore os projetos que mais estao movimentando a comunidade agora</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href={ROUTES.PROJECTS}>
                Ver todos
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </Button>
          </div>
          <ProjectGrid projects={featuredProjects} />

          <div className="mt-12 overflow-hidden rounded-3xl border border-[#2a3440] bg-[linear-gradient(90deg,rgba(10,30,58,0.95),rgba(18,43,35,0.92),rgba(40,28,14,0.94))] p-8 shadow-[0_30px_100px_-50px_rgba(0,0,0,0.9)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9cd1ff]">Pronto para o proximo passo</p>
                <h3 className="mt-3 text-3xl font-bold leading-tight text-white">Tire seu roadmap da teoria e forme um time que entrega.</h3>
                <p className="mt-3 text-[#d4e5f5]/85">Comece com uma descricao objetiva e deixe a comunidade certa encontrar seu projeto.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="success" asChild>
                  <Link href={ROUTES.PUBLISH}>Publicar agora</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.DEVELOPERS}>Buscar desenvolvedores</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
