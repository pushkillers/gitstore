# Guia de Migração - Nova Estrutura

## Mudanças Realizadas

### 📁 Estrutura de Pastas

#### Criadas:
- `hooks/` - Hooks customizados do React
- `lib/api/` - Lógica de comunicação com backend
- `lib/utils/` - Funções utilitárias
- `components/shared/` - Componentes compartilhados

### 📦 Arquivos Movidos

#### Hooks (`lib/` → `hooks/`)
- ✅ `lib/useSession.ts` → `hooks/useSession.ts`
- ✅ `lib/useProfile.ts` → `hooks/useProfile.ts`
- ✅ `lib/useRequireAuth.ts` → `hooks/useRequireAuth.ts`

#### API (`lib/` → `lib/api/`)
- ✅ `lib/admin.ts` → `lib/api/admin.ts`
- ✅ `lib/auth.ts` → `lib/api/auth.ts`
- ✅ `lib/follows.ts` → `lib/api/follows.ts`
- ✅ `lib/projects.ts` → `lib/api/projects.ts`

#### Utilitários (`lib/` → `lib/utils/`)
- ✅ `lib/utils.ts` → `lib/utils/cn.ts`
- ✅ `lib/toast.ts` → `lib/utils/toast.ts`
- ✅ `lib/xp.ts` → `lib/utils/xp.ts`

#### Componentes
- ✅ `components/error-3d-scene.tsx` → `components/ui/Error3DScene.tsx`

### 🗑️ Arquivos Removidos
- ❌ `frontend/ia.txt` (arquivo desnecessário)

### ✨ Arquivos Criados
- 📄 `hooks/index.ts` - Barrel export para hooks
- 📄 `lib/api/index.ts` - Barrel export para API
- 📄 `lib/utils/index.ts` - Barrel export para utilitários
- 📄 `STRUCTURE.md` - Documentação da estrutura
- 📄 `MIGRATION_GUIDE.md` - Este guia

## Atualizações Automáticas

Todos os imports foram atualizados automaticamente usando `smartRelocate`. Os seguintes arquivos tiveram seus imports atualizados:

### Componentes:
- `components/layout/Header.tsx`
- `components/layout/UserMenuDropdown.tsx`
- `components/layout/Container.tsx`
- `components/features/developers/DeveloperGrid.tsx`
- `components/features/projects/ProjectCard.tsx`
- `components/features/projects/NewProjectModal.tsx`
- `components/ui/FollowButton.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Input.tsx`
- `components/ui/ToastContainer.tsx`

### Páginas:
- `app/admin/page.tsx`
- `app/admin/dashboard/page.tsx`
- `app/perfil/page.tsx`
- `app/settings/page.tsx`
- `app/seus-projetos/page.tsx`
- `app/projects/page.tsx`
- `app/projects/[id]/page.tsx`
- `app/publish/page.tsx`

## Como Usar a Nova Estrutura

### Importações Recomendadas

#### Antes:
```typescript
import { useSession } from '@/lib/useSession';
import { fetchProjects } from '@/lib/projects';
import { cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';
```

#### Depois (Opção 1 - Específico):
```typescript
import { useSession } from '@/hooks/useSession';
import { fetchProjects } from '@/lib/api/projects';
import { cn } from '@/lib/utils/cn';
import { showToast } from '@/lib/utils/toast';
```

#### Depois (Opção 2 - Barrel Exports):
```typescript
import { useSession } from '@/hooks';
import { fetchProjects } from '@/lib/api';
import { cn, showToast } from '@/lib/utils';
```

## Próximos Passos Recomendados

1. ✅ Testar a aplicação para garantir que tudo funciona
2. ⏳ Considerar criar contextos em `contexts/` se necessário
3. ⏳ Adicionar testes unitários para hooks e utilitários
4. ⏳ Documentar componentes complexos com Storybook
5. ⏳ Criar aliases adicionais no tsconfig se necessário

## Benefícios

- 🎯 **Organização Clara**: Cada tipo de arquivo tem seu lugar
- 🔍 **Fácil Localização**: Encontre arquivos rapidamente
- 📦 **Melhor Escalabilidade**: Adicione novos recursos facilmente
- 🤝 **Onboarding Rápido**: Novos devs entendem a estrutura rapidamente
- 🔧 **Manutenção Simplificada**: Código mais fácil de manter

## Suporte

Para dúvidas sobre a nova estrutura, consulte:
- `STRUCTURE.md` - Documentação completa da estrutura
- Este arquivo - Guia de migração
