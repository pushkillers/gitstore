# Página de Projetos Publicados

## Overview
Nova página para gerenciar projetos publicados pelo usuário na plataforma GitStore.

## Rota
`/publicados`

## Funcionalidades

### 1. Listagem de Projetos
- Exibe todos os projetos publicados pelo usuário logado
- Filtra automaticamente por username do autor
- Carrega dados do localStorage (mock mode)

### 2. Estatísticas
Três cards com métricas:
- **Total**: Número total de projetos
- **Públicos**: Projetos com visibilidade pública
- **Privados**: Projetos com visibilidade privada

### 3. Busca e Filtros

#### Busca por Texto
- Campo de busca com ícone
- Busca em: título, descrição e categoria
- Atualização em tempo real

#### Filtro por Visibilidade
Três botões:
- **Todos**: Exibe todos os projetos
- **Públicos**: Apenas projetos públicos (verde)
- **Privados**: Apenas projetos privados (amarelo)

### 4. Card de Projeto

#### Informações Exibidas
- Título (link para página do projeto)
- Badge de visibilidade (Público/Privado)
- Descrição (máximo 2 linhas)
- Linguagem com cor
- Número de stars
- Número de forks
- Categoria (badge azul)
- Data de última atualização

#### Menu de Ações
Botão com três pontos (⋮) que abre menu:
- **Ver Projeto**: Redireciona para `/projects/{id}`
- **Editar**: Placeholder (em desenvolvimento)
- **Excluir**: Remove o projeto com confirmação

### 5. Criar Novo Projeto
- Botão "Novo Projeto" no header
- Abre modal `NewProjectModal`
- Recarrega lista após criação

### 6. Estados da UI

#### Loading
- Spinner animado enquanto carrega

#### Vazio (sem projetos)
- Ícone de pasta
- Mensagem: "Você ainda não publicou nenhum projeto"
- Botão "Criar Projeto"

#### Vazio (com filtros)
- Mensagem: "Nenhum projeto encontrado"
- Sugestão: "Tente ajustar os filtros de busca"

## Integração com Navbar

### UserMenuDropdown
Alteração no menu do usuário:
- **Antes**: "Projetos" → `/projects`
- **Depois**: "Publicados" → `/publicados`

### Estrutura do Menu
```
Seu Perfil → /perfil
Publicados → /publicados (NOVO)
Ranking → /developers
───────────────────────
Configurações → /settings
───────────────────────
Sair
```

## Componentes Utilizados

### Ícones (lucide-react)
- `Plus` - Criar novo projeto
- `Search` - Busca
- `Eye` - Público
- `EyeOff` - Privado
- `FolderGit2` - Pasta/projeto
- `Star` - Stars
- `GitFork` - Forks
- `MoreVertical` - Menu de ações
- `Edit` - Editar
- `Trash2` - Excluir

### Hooks
- `useRequireAuth` - Proteção de rota
- `useSession` - Dados do usuário
- `useState` - Estados locais
- `useEffect` - Carregamento de dados

### API Functions
- `getProjects()` - Busca todos os projetos
- `deleteProject(id)` - Remove um projeto

## Estrutura Visual

### Header
```
┌─────────────────────────────────────────────┐
│ Projetos Publicados    [+ Novo Projeto]    │
│ Gerencie seus projetos publicados...       │
│                                             │
│ [📁 Total: 5] [👁 Públicos: 3] [🔒 Privados: 2] │
└─────────────────────────────────────────────┘
```

### Filtros
```
┌─────────────────────────────────────────────┐
│ [🔍 Buscar projetos...]  [Todos] [Públicos] [Privados] │
└─────────────────────────────────────────────┘
```

### Lista de Projetos
```
┌─────────────────────────────────────────────┐
│ Sistema de Chat [👁 Público]           [⋮] │
│ Chat em tempo real com WebSocket           │
│ ● TypeScript  ⭐ 45  🔱 12  [E-commerce]   │
│ Atualizado 15/01/2025                      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ API REST [🔒 Privado]                  [⋮] │
│ API para gerenciamento de usuários         │
│ ● Python  ⭐ 23  🔱 5  [Backend]           │
│ Atualizado 10/01/2025                      │
└─────────────────────────────────────────────┘
```

## Cores e Estilos

### Badges de Visibilidade
- **Público**: Verde (#3fb950) com fundo transparente
- **Privado**: Amarelo (#f0b442) com fundo transparente

### Botões de Filtro
- **Ativo**: Fundo colorido com texto branco
- **Inativo**: Border com texto cinza

### Cards
- Fundo: #161b22
- Border: #21262d
- Hover: #1c2128 com border #30363d

## Funcionalidades Futuras

### Edição de Projetos
- Modal de edição
- Atualizar título, descrição, categoria
- Alterar visibilidade
- Adicionar/remover tags

### Ordenação
- Por data de criação
- Por data de atualização
- Por número de stars
- Por número de forks

### Filtros Avançados
- Por categoria
- Por linguagem
- Por data

### Ações em Lote
- Selecionar múltiplos projetos
- Excluir em lote
- Alterar visibilidade em lote

### Analytics
- Visualizações por projeto
- Cliques por projeto
- Gráfico de crescimento

## Responsividade

### Desktop (>1024px)
- Layout completo
- Todos os elementos visíveis
- Cards em lista vertical

### Tablet (768px - 1024px)
- Header empilhado
- Filtros em linha
- Cards adaptados

### Mobile (<768px)
- Header vertical
- Filtros empilhados
- Cards full-width
- Menu de ações adaptado

## Segurança

### Proteção de Rota
- Requer autenticação (`useRequireAuth`)
- Redireciona para login se não autenticado

### Filtro de Dados
- Exibe apenas projetos do usuário logado
- Compara `project.author.username` com `user.username`

### Confirmação de Exclusão
- Alert nativo antes de excluir
- Previne exclusão acidental

## Performance

### Carregamento
- Loading state durante fetch
- Feedback visual imediato

### Filtros
- Atualização em tempo real
- Sem delay perceptível
- Usa `useEffect` para reatividade

### Otimizações Futuras
- Paginação (10-20 projetos por página)
- Lazy loading de imagens
- Debounce na busca
- Cache de resultados
