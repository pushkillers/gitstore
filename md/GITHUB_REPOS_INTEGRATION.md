# Integração com Repositórios do GitHub

## Overview
Implementada integração real com a API pública do GitHub para exibir os repositórios do usuário na página de perfil.

## Funcionalidade

### Como Funciona
1. Usuário configura seu username do GitHub em **Configurações → Perfil → GitHub**
2. A página de perfil busca automaticamente os repositórios públicos através da API do GitHub
3. Exibe até 30 repositórios ordenados por data de atualização (mais recentes primeiro)

### API Utilizada
- **Endpoint**: `https://api.github.com/users/{username}/repos`
- **Parâmetros**: `sort=updated&per_page=30`
- **Método**: GET (sem autenticação)
- **Limite**: 60 requisições por hora por IP (API pública do GitHub)

## Mudanças Implementadas

### 1. Página de Perfil (`frontend/app/perfil/page.tsx`)

#### Estados Adicionados
- `repos` - Lista de repositórios do GitHub
- `loading` - Estado de carregamento
- `error` - Mensagens de erro

#### Busca de Repositórios
```typescript
useEffect(() => {
  const fetchGithubRepos = async () => {
    if (!profile.github) return;
    
    const response = await fetch(
      `https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=30`
    );
    
    if (response.ok) {
      const data = await response.json();
      setRepos(data);
    }
  };
  
  fetchGithubRepos();
}, [profile.github]);
```

#### Tratamento de Erros
- **404**: Usuário não encontrado
- **403**: Limite de requisições excedido
- **Outros**: Erro genérico de conexão

#### Estados da UI
1. **Loading**: Spinner animado enquanto carrega
2. **Erro**: Mensagem de erro com link para configurações
3. **Vazio (sem GitHub)**: Prompt para configurar username
4. **Vazio (com GitHub)**: Mensagem de nenhum repositório público
5. **Sucesso**: Lista de repositórios

### 2. Seção de Repositórios

#### Título
- Alterado de "Projetos publicados" para "Repositórios"
- Adicionado link "Ver no GitHub" quando username está configurado

#### Estatísticas
- "Projetos" → "Repositórios"
- Contadores atualizados dinamicamente com dados reais do GitHub

#### Card de Repositório
Exibe:
- Nome do repositório (link para GitHub)
- Descrição (se disponível)
- Linguagem principal com cor
- Número de stars
- Número de forks
- Última atualização (formato relativo: "2d atrás", "1sem atrás", etc.)

## Dados Exibidos

### Interface GithubRepo
```typescript
interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
}
```

### Cores de Linguagens
Mapeamento de cores para linguagens populares:
- TypeScript: #3178c6
- JavaScript: #f1e05a
- Python: #3572A5
- Go: #00ADD8
- Rust: #dea584
- E mais...

## Fluxo do Usuário

### Configuração Inicial
1. Usuário faz login
2. Vai para Configurações
3. Preenche campo "GitHub" com username (ex: "octocat")
4. Salva alterações

### Visualização
1. Acessa página de perfil
2. Sistema busca repositórios automaticamente
3. Repositórios são exibidos com informações atualizadas

### Sem Configuração
- Exibe mensagem: "Configure seu GitHub"
- Botão "Configurar GitHub" leva para /settings
- Estatísticas mostram 0 repositórios

## Vantagens

1. **Dados Reais**: Não depende de mock ou localStorage
2. **Sempre Atualizado**: Busca dados direto do GitHub
3. **Sem Backend**: Usa API pública do GitHub (client-side)
4. **Fácil Configuração**: Apenas username necessário
5. **Feedback Visual**: Estados de loading, erro e vazio bem definidos

## Limitações

1. **Rate Limit**: 60 requisições/hora por IP (sem autenticação)
2. **Apenas Públicos**: Não exibe repositórios privados
3. **Sem Cache**: Busca a cada carregamento da página
4. **Máximo 30**: Limitado a 30 repositórios mais recentes

## Melhorias Futuras (Opcional)

1. Adicionar cache no localStorage (5-10 minutos)
2. Implementar paginação para mais de 30 repos
3. Adicionar filtros por linguagem
4. Mostrar repositórios "pinned" primeiro
5. Integrar com GitHub OAuth para repos privados
