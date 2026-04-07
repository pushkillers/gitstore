# Modal de Edição de Projeto

## Overview
Componente modal para editar projetos publicados na plataforma GitStore.

## Localização
`frontend/components/features/projects/EditProjectModal.tsx`

## Props

```typescript
interface EditProjectModalProps {
  open: boolean;           // Controla visibilidade do modal
  onClose: () => void;     // Callback ao fechar
  project: Project;        // Projeto a ser editado
  onSave: (updatedProject: Project) => void; // Callback ao salvar
}
```

## Funcionalidades

### 1. Campos Editáveis

#### Nome do Projeto
- Campo de texto obrigatório
- Placeholder: "Ex: Sistema de Chat em Tempo Real"
- Validação: não pode estar vazio

#### Descrição
- Textarea com 4 linhas
- Campo obrigatório
- Validação: não pode estar vazia

#### Linguagem
- Select com opções de LANGUAGES
- Campo obrigatório
- Opções: TypeScript, JavaScript, Python, Java, Go, Rust, C++, Ruby

#### Categoria
- Select com opções de CATEGORIES
- Campo obrigatório
- Opções: E-commerce, IA, Produtividade, Redes Sociais, Analytics, CMS, Fintech, Blog

#### Tags
- Input com botão "Adicionar"
- Máximo 5 tags
- Pressionar Enter adiciona tag
- Tags exibidas como badges removíveis
- Opcional

#### Repositório
- Input tipo URL
- Campo opcional
- Placeholder: "https://github.com/usuario/projeto"

#### Tipo
- Três botões: Gratuito, Pago, Freemium
- Seleção única (radio button visual)
- Cores diferentes para cada tipo:
  - Gratuito: Verde (#3fb950)
  - Pago: Amarelo (#f0b442)
  - Freemium: Roxo (#bc8cff)

#### Preço
- Aparece apenas quando tipo = "paid"
- Input numérico com step 0.01
- Validação: deve ser maior que zero
- Formato: R$ 0.00

### 2. Validações

#### Campos Obrigatórios
- Nome
- Descrição
- Linguagem
- Categoria

#### Validação de Preço
- Apenas para tipo "paid"
- Deve ser maior que zero

#### Feedback Visual
- Campos com erro: border vermelho
- Mensagem de erro abaixo do campo
- Cor: #f85149

### 3. Comportamento

#### Inicialização
- Preenche formulário com dados do projeto
- Reseta erros
- Limpa input de tags

#### Adicionar Tag
- Trim do input
- Verifica se já existe
- Verifica limite de 5 tags
- Limpa input após adicionar

#### Remover Tag
- Botão X em cada badge
- Remove da lista

#### Salvar
- Valida todos os campos
- Cria objeto Project atualizado
- Adiciona campo updatedAt com data atual
- Chama callback onSave
- Fecha modal

#### Cancelar
- Fecha modal sem salvar
- Descarta alterações

### 4. Integração com API

#### Função updateProject
```typescript
export async function updateProject(updatedProject: Project): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cached = getCached();
  const index = cached.findIndex((p) => p.id === updatedProject.id);
  
  if (index !== -1) {
    cached[index] = updatedProject;
    setCached(cached);
  }
}
```

- Simula delay de rede (300ms)
- Atualiza projeto no localStorage
- Dispara evento de mudança

### 5. Integração na Página

#### Estado
```typescript
const [editModalOpen, setEditModalOpen] = useState(false);
const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
```

#### Abrir Modal
```typescript
const handleEdit = (project: Project) => {
  setProjectToEdit(project);
  setEditModalOpen(true);
};
```

#### Salvar Edição
```typescript
const handleSaveEdit = async (updatedProject: Project) => {
  await updateProject(updatedProject);
  setProjects(projects.map((p) => 
    p.id === updatedProject.id ? updatedProject : p
  ));
  setEditModalOpen(false);
  setProjectToEdit(null);
};
```

#### Renderização
```typescript
{projectToEdit && (
  <EditProjectModal
    open={editModalOpen}
    onClose={() => {
      setEditModalOpen(false);
      setProjectToEdit(null);
    }}
    project={projectToEdit}
    onSave={handleSaveEdit}
  />
)}
```

## Estrutura Visual

### Header
```
┌─────────────────────────────────────┐
│ Editar Projeto                  [X] │
└─────────────────────────────────────┘
```

### Formulário
```
┌─────────────────────────────────────┐
│ Nome do Projeto *                   │
│ [_________________________________] │
│                                     │
│ Descrição *                         │
│ [_________________________________] │
│ [_________________________________] │
│ [_________________________________] │
│ [_________________________________] │
│                                     │
│ Linguagem *        Categoria *      │
│ [_______________] [_______________] │
│                                     │
│ Tags (máximo 5)                     │
│ [_____________________] [Adicionar] │
│ [tag1 ×] [tag2 ×] [tag3 ×]         │
│                                     │
│ Repositório (opcional)              │
│ [_________________________________] │
│                                     │
│ Tipo *                              │
│ [Gratuito] [Pago] [Freemium]       │
│                                     │
│ Preço (R$) *                        │
│ [_________________________________] │
│                                     │
│ ─────────────────────────────────  │
│              [Cancelar] [Salvar]    │
└─────────────────────────────────────┘
```

## Estilos

### Modal
- Fundo: Preto 70% com blur
- Container: max-w-2xl
- Border: #30363d
- Background: #0d1117
- Border radius: 2xl
- Shadow: 2xl

### Campos
- Border: #30363d
- Background: #0d1117
- Focus: border #58a6ff com ring
- Erro: border #f85149

### Botões de Tipo
- Border quando não selecionado
- Background colorido quando selecionado
- Transição suave

### Tags
- Background: #58a6ff/10
- Texto: #58a6ff
- Border radius: full
- Botão X hover: mais claro

## Responsividade

### Desktop
- Modal centralizado
- Largura máxima 2xl (672px)
- Grid 2 colunas para linguagem/categoria

### Mobile
- Modal full-width com padding
- Grid 1 coluna
- Scroll vertical se necessário

## Acessibilidade

### Labels
- Todos os campos têm labels
- Asterisco vermelho para obrigatórios

### Feedback
- Mensagens de erro claras
- Cores contrastantes
- Estados visuais distintos

### Teclado
- Enter adiciona tag
- Tab navega entre campos
- Escape fecha modal (futuro)

## Performance

### Otimizações
- useEffect apenas quando modal abre
- Validação apenas no submit
- Atualização local do estado antes da API

### Delays
- 300ms para simular rede
- Feedback imediato na UI

## Melhorias Futuras

### Upload de Imagens
- Thumbnail do projeto
- Screenshots
- Preview antes de salvar

### Editor Rico
- Markdown para descrição
- Preview em tempo real
- Syntax highlighting

### Validação Avançada
- URL do repositório válida
- Verificar se nome já existe
- Limite de caracteres

### Auto-save
- Salvar rascunho automaticamente
- Recuperar em caso de erro
- Indicador de salvamento

### Histórico
- Ver versões anteriores
- Restaurar versão antiga
- Diff entre versões
