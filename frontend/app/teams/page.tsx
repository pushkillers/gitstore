import { Container } from "@/components/layout/Container";
import { TeamGrid } from "@/components/features/teams/TeamGrid";
import { TeamFilters } from "@/components/features/teams/TeamFilters";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants";

export default function TeamsPage() {
  const totalTeams = 6; // Mock data - replace with actual count

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-gradient">Equipes</span> de Desenvolvimento
          </h1>
          <p className="text-lg text-[#7d8590]">
            Junte-se a uma equipe ou crie a sua própria. Colabore em projetos incríveis com desenvolvedores talentosos.
          </p>
        </div>

        <TeamFilters />
        
        {/* Results count and create button */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#7d8590]">
            {totalTeams} {totalTeams === 1 ? 'equipe encontrada' : 'equipes encontradas'}
          </p>
          <Button variant="primary" asChild>
            <Link href={ROUTES.PUBLISH}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Criar Equipe
            </Link>
          </Button>
        </div>

        <TeamGrid />
      </Container>
    </div>
  );
}
