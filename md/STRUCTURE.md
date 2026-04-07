# Estrutura do Frontend

## Organização de Pastas

```
frontend/
├── app/                          # Next.js App Router (páginas e rotas)
│   ├── admin/                    # Área administrativa
│   ├── auth/                     # Autenticação
│   ├── projects/                 # Projetos
│   ├── developers/               # Desenvolvedores
│   ├── jobs/                     # Vagas
│   ├── teams/                    # Equipes
│   └── ...                       # Outras páginas
│
├── components/
│   ├── features/                 # Componentes específicos por domínio
│   │   ├── developers/           # Componentes de desenvolvedores
│   │   ├── jobs/                 # Componentes de vagas
│   │   ├── projects/             # Componentes de projetos
│   │   └── teams/                # Componentes de equipes
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── Header.tsx            # Cabeçalho/Navbar
│   │   ├── Container.tsx         # Container principal
│   │   └── ...                   # Outros layouts
│   │
│   ├── ui/                       # Componentes UI reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   │
│   └── shared/                   # Componentes compartilhados entre features
│
├── hooks/                        # Hooks customizados do React
│   ├── useSession.ts             # Hook de sessão do usuário
│   ├── useProfile.ts             # Hook de perfil do usuário
│   ├── useRequireAuth.ts         # Hook de autenticação obrigatória
│   └── index.ts                  # Barrel export
│
├── lib/
│   ├── api/                      # Chamadas de API e lógica de backend
│   │   ├── admin.ts              # API de administração
│   │   ├── auth.ts               # API de autenticação
│   │   ├── follows.ts            # API de follows/seguidores
│   │   ├── projects.ts           # API de projetos
│   │   └── index.ts              # Barrel export
│   │
│   ├── utils/                    # Funções utilitárias
│   │   ├── cn.ts                 # Utilitário de classes CSS (classnames)
│   │   ├── toast.ts              # Sistema de notificações
│   │   ├── xp.ts                 # Sistema de XP/níveis
│   │   └── index.ts              # Barrel export
│   │
│   └── data.ts                   # Mock data para desenvolvimento
│
├── types/                        # Definições de tipos TypeScript
│   └── index.ts
│
├── constants/                    # Constantes da aplicação
│   └── index.ts
│
└── public/                       # Assets estáticos
    └── ...

```

## Convenções de Importação

### Hooks
```typescript
// Importação individual
import { useSession } from '@/hooks/useSession';

// Importação via barrel
import { useSession, useProfile } from '@/hooks';
```

### API
```typescript
// Importação individual
import { fetchProjects } from '@/lib/api/projects';

// Importação via barrel
import { fetchProjects, loginUser } from '@/lib/api';
```

### Utilitários
```typescript
// Importação individual
import { cn } from '@/lib/utils/cn';
import { showToast } from '@/lib/utils/toast';

// Importação via barrel
import { cn, showToast } from '@/lib/utils';
```

### Componentes
```typescript
// Componentes UI
import { Button } from '@/components/ui/Button';

// Componentes de features
import { ProjectCard } from '@/components/features/projects/ProjectCard';

// Componentes de layout
import { Header } from '@/components/layout/Header';
```

## Regras de Organização

1. **Hooks**: Sempre começam com `use` e ficam em `hooks/`
2. **API**: Toda lógica de comunicação com backend fica em `lib/api/`
3. **Utilitários**: Funções auxiliares puras ficam em `lib/utils/`
4. **Componentes UI**: Componentes reutilizáveis sem lógica de negócio
5. **Componentes Features**: Componentes específicos de domínio com lógica de negócio
6. **Barrel Exports**: Use arquivos `index.ts` para facilitar importações

## Benefícios da Nova Estrutura

- ✅ Separação clara de responsabilidades
- ✅ Fácil localização de arquivos
- ✅ Importações mais limpas
- ✅ Melhor escalabilidade
- ✅ Facilita onboarding de novos desenvolvedores
- ✅ Reduz acoplamento entre módulos
