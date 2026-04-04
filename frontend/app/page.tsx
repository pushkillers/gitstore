import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ProjectGrid } from "@/components/features/projects/ProjectGrid";
import { mockProjects } from "@/lib/data";
import { ROUTES } from "@/constants";
import Link from "next/link";

export default function Home() {
  const featuredProjects = mockProjects.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#161b22] via-[#0d1117] to-[#0d1117]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f6feb]/10 via-transparent to-transparent" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#30363d_1px,transparent_1px),linear-gradient(to_bottom,#30363d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
          
          <Container className="relative">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3fb950]"></span>
                </span>
                <span className="text-sm font-medium text-[#58a6ff]">
                  Plataforma em crescimento
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gradient">Descubra</span> projetos
                <br />
                <span className="text-[#e6edf3]">incríveis</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-[#7d8590] mb-10 max-w-2xl mx-auto leading-relaxed">
                Anuncie seus projetos, encontre colaboradores talentosos e forme equipes de desenvolvimento de alto nível
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" variant="success" asChild>
                  <Link href={ROUTES.PROJECTS} className="min-w-[200px]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explorar Projetos
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href={ROUTES.PUBLISH} className="min-w-[200px]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Publicar Projeto
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">1.2k+</div>
                  <div className="text-sm text-[#7d8590]">Projetos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">500+</div>
                  <div className="text-sm text-[#7d8590]">Desenvolvedores</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gradient mb-1">150+</div>
                  <div className="text-sm text-[#7d8590]">Equipes</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Projects */}
        <section className="py-16 bg-[#0d1117]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Projetos em Destaque</h2>
                <p className="text-[#7d8590]">Explore os projetos mais populares da comunidade</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href={ROUTES.PROJECTS}>
                  Ver todos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            </div>
            <ProjectGrid projects={featuredProjects} />
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-[#0d1117] to-[#161b22]">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Por que usar o GitHub Store?</h2>
              <p className="text-[#7d8590] text-lg">Tudo que você precisa para colaborar e crescer</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-[#1f6feb]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#58a6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Descubra Projetos</h3>
                <p className="text-[#7d8590]">Encontre projetos open source incríveis e contribua com a comunidade</p>
              </div>
              
              <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-[#238636]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#3fb950]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Forme Equipes</h3>
                <p className="text-[#7d8590]">Conecte-se com desenvolvedores e construa equipes de alto desempenho</p>
              </div>
              
              <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-[#d29922]/50 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-[#d29922]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#d29922]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cresça Rápido</h3>
                <p className="text-[#7d8590]">Acelere seu desenvolvimento com colaboração e feedback da comunidade</p>
              </div>
            </div>
          </Container>
        </section>
    </>
  );
}
