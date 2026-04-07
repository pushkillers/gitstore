"use client";

import { TeamCard } from "./TeamCard";

interface TeamMember { id: number; name: string; avatar: string; }
interface Team {
  id: number; name: string; description: string;
  logo: string; members: TeamMember[]; memberCount: number;
  projectCount: number; tags: string[]; isPublic: boolean; level: number;
  banner: string;
  joinType?: 'instant' | 'request';
}

const teams: Team[] = [
  {
    id: 1,
    name: "DevSquad Elite",
    description: "Equipe focada em desenvolvimento full-stack com React, Node.js e TypeScript. Buscamos criar soluções inovadoras.",
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop",
    logo: "🚀",
    members: [
      { id: 1, name: "João", avatar: "J" },
      { id: 2, name: "Maria", avatar: "M" },
      { id: 3, name: "Pedro", avatar: "P" },
      { id: 4, name: "Ana", avatar: "A" },
      { id: 5, name: "Carlos", avatar: "C" },
      { id: 6, name: "Julia", avatar: "J" },
    ],
    memberCount: 12,
    projectCount: 8,
    tags: ["React", "Node.js", "TypeScript", "MongoDB"],
    isPublic: true,
    joinType: 'instant',
    level: 15,
  },
  {
    id: 2,
    name: "Code Warriors",
    description: "Guerreiros do código unidos para dominar o mundo do desenvolvimento. Especialistas em arquitetura de software.",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop",
    logo: "⚔️",
    members: [
      { id: 1, name: "Lucas", avatar: "L" },
      { id: 2, name: "Fernanda", avatar: "F" },
      { id: 3, name: "Rafael", avatar: "R" },
    ],
    memberCount: 8,
    projectCount: 15,
    tags: ["Python", "Django", "AWS", "Docker"],
    isPublic: true,
    joinType: 'request',
    level: 22,
  },
  {
    id: 3,
    name: "Pixel Pioneers",
    description: "Pioneiros em design e desenvolvimento frontend. Criamos experiências visuais incríveis e interfaces modernas.",
    banner: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1920&h=1080&fit=crop",
    logo: "🎨",
    members: [
      { id: 1, name: "Sofia", avatar: "S" },
      { id: 2, name: "Bruno", avatar: "B" },
      { id: 3, name: "Camila", avatar: "C" },
      { id: 4, name: "Diego", avatar: "D" },
    ],
    memberCount: 10,
    projectCount: 12,
    tags: ["UI/UX", "React", "Tailwind", "Figma"],
    isPublic: true,
    joinType: 'instant',
    level: 18,
  },
  {
    id: 4,
    name: "Data Wizards",
    description: "Magos dos dados especializados em análise, machine learning e inteligência artificial.",
    banner: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop",
    logo: "🧙",
    members: [
      { id: 1, name: "Roberto", avatar: "R" },
      { id: 2, name: "Patricia", avatar: "P" },
    ],
    memberCount: 6,
    projectCount: 5,
    tags: ["Python", "ML", "TensorFlow", "Data Science"],
    isPublic: false,
    joinType: 'request',
    level: 12,
  },
  {
    id: 5,
    name: "Cloud Ninjas",
    description: "Ninjas da nuvem especializados em infraestrutura, DevOps e arquitetura cloud-native.",
    banner: "https://images.unsplash.com/photo-1667372393119-c8f473882e8e?w=1920&h=1080&fit=crop",
    logo: "☁️",
    members: [
      { id: 1, name: "Thiago", avatar: "T" },
      { id: 2, name: "Amanda", avatar: "A" },
      { id: 3, name: "Gabriel", avatar: "G" },
      { id: 4, name: "Larissa", avatar: "L" },
      { id: 5, name: "Marcos", avatar: "M" },
    ],
    memberCount: 14,
    projectCount: 20,
    tags: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
    isPublic: true,
    joinType: 'instant',
    level: 25,
  },
  {
    id: 6,
    name: "Mobile Masters",
    description: "Mestres do desenvolvimento mobile com foco em React Native e Flutter para criar apps nativos.",
    banner: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1920&h=1080&fit=crop",
    logo: "📱",
    members: [
      { id: 1, name: "Beatriz", avatar: "B" },
      { id: 2, name: "Felipe", avatar: "F" },
      { id: 3, name: "Isabela", avatar: "I" },
    ],
    memberCount: 9,
    projectCount: 11,
    tags: ["React Native", "Flutter", "iOS", "Android"],
    isPublic: true,
    joinType: 'request',
    level: 16,
  },
];

export function TeamGrid() {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
