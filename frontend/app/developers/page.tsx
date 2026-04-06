import { Container } from "@/components/layout/Container";
import { DeveloperGrid } from "@/components/features/developers/DeveloperGrid";
import { DeveloperFilters } from "@/components/features/developers/DeveloperFilters";

export default function DevelopersPage() {
  const totalDevelopers = 8; // Mock data

  return (
    <div className="py-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-gradient">Ranking</span> de Desenvolvedores
          </h1>
          <p className="text-lg text-[#7d8590]">
            Conheça os desenvolvedores mais ativos e talentosos da comunidade
          </p>
        </div>

        <DeveloperFilters />
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-[#7d8590]">
            {totalDevelopers} {totalDevelopers === 1 ? 'desenvolvedor encontrado' : 'desenvolvedores encontrados'}
          </p>
        </div>

        <DeveloperGrid />
      </Container>
    </div>
  );
}
