# Changelog - Migração para Modo Mock

## 🎯 Objetivo
Remover completamente a dependência do backend Go, transformando o frontend em uma aplicação standalone que funciona apenas com dados mockados no localStorage.

## ✅ Mudanças Realizadas

### 1. Sistema de Autenticação
**Arquivo:** `frontend/lib/api/auth.ts`

**Antes:**
- Fazia requisições HTTP para `http://localhost:3001/auth/*`
- Dependia do backend para validação
- Tokens JWT reais do backend

**Depois:**
- Banco de dados mockado no localStorage (`gitstore.users.db`)
- Validação local de credenciais
- Tokens mockados gerados localmente
- Geração automática de avatares via DiceBear
- Criação automática de usernames únicos

**Funções Modificadas:**
- `register()` - Cria usuário no localStorage
- `login()` - Valida contra localStorage
- `restoreSession()` - Valida token mockado
- `saveProfile()` - Atualiza localStorage

### 2. Gerenciamento de Projetos
**Arquivo:** `frontend/lib/api/projects.ts`

**Antes:**
- Sincronizava com backend via API REST
- Cache otimista com fallback

**Depois:**
- Armazena tudo no localStorage
- Simula delays de rede (300-500ms)
- Sem requisições HTTP

**Funções Modificadas:**
- `fetchProjects()` - Retorna do localStorage
- `fetchMyProjects()` - Filtra por usuário local
- `publishProject()` - Salva no localStorage
- `deleteProject()` - Remove do localStorage

### 3. Painel Administrativo
**Arquivo:** `frontend/lib/api/admin.ts`

**Antes:**
- Autenticação via backend
- Dados de usuários e projetos do backend

**Depois:**
- Credenciais fixas: `admin` / `admin123`
- Estatísticas mockadas
- Gerencia dados do localStorage

**Funções Modificadas:**
- `adminLogin()` - Valida credenciais localmente
- `fetchAdminStats()` - Retorna dados mockados
- `fetchAdminUsers()` - Lista usuários do localStorage
- `fetchAdminProjects()` - Lista projetos do localStorage
- `deleteAdminUser()` - Remove do localStorage
- `deleteAdminProject()` - Remove do localStorage

### 4. Páginas de Autenticação

**Arquivos:**
- `frontend/app/(auth)/login/page.tsx`
- `frontend/app/(auth)/register/page.tsx`

**Mudanças:**
- Botão "Login com Google" desabilitado
- Mostra mensagem de erro ao clicar
- Mantém UI intacta

### 5. Página de Configurações
**Arquivo:** `frontend/app/settings/page.tsx`

**Mudanças:**
- Conexões Google mockadas
- Não faz requisições ao backend
- Mostra mensagens "(Mock)"

### 6. Grid de Desenvolvedores
**Arquivo:** `frontend/components/features/developers/DeveloperGrid.tsx`

**Antes:**
- Buscava usuários reais do backend

**Depois:**
- Usa apenas perfil do usuário logado
- Mantém desenvolvedores mockados para demo
- Sem requisições HTTP

### 7. Configuração do Next.js
**Arquivo:** `frontend/next.config.ts`

**Antes:**
```typescript
async rewrites() {
  return [
    {
      source: "/api/backend/:path*",
      destination: "http://localhost:3001/:path*",
    },
  ];
}
```

**Depois:**
```typescript
// Proxy removido - modo mock sem backend
// async rewrites() { ... }
```

### 8. Scripts NPM
**Arquivo:** `package.json`

**Antes:**
```json
{
  "scripts": {
    "dev": "concurrently ... backend + frontend"
  }
}
```

**Depois:**
```json
{
  "scripts": {
    "dev": "npm run dev --prefix frontend",
    "dev:fullstack": "concurrently ... backend + frontend"
  }
}
```

### 9. Variáveis de Ambiente
**Arquivo:** `.env.example`

**Mudanças:**
- Comentadas todas as variáveis de backend
- Mantidas apenas variáveis do frontend
- Adicionados comentários explicativos

## 📊 Comparação

### Antes (Modo Fullstack)
```
npm run dev
  ↓
Backend Go (3001) + Frontend Next.js (3000)
  ↓
Frontend → HTTP → Backend → Database
```

### Depois (Modo Mock)
```
npm run dev
  ↓
Frontend Next.js (3000)
  ↓
Frontend → localStorage
```

## 🗄️ Estrutura de Dados

### localStorage
```javascript
// Banco de usuários
"gitstore.users.db": {
  "user@email.com": {
    password: "senha123",
    user: { id, name, username, email, avatar, ... }
  }
}

// Projetos publicados
"gitstore.published_projects": [
  { id, name, description, author, ... }
]

// Sessão atual
"gitstore.token": "mock_token_..."
"gitstore.user": { id, name, username, ... }
"gitstore.settings.profile": { ... }
```

### sessionStorage
```javascript
// Admin
"gitstore.admin.token": "mock_admin_token_..."
"gitstore.admin.name": "admin"
```

## 🎮 Credenciais de Teste

### Admin
- Username: `admin`
- Password: `admin123`

### Usuários Regulares
Crie sua própria conta via `/register`

## ⚠️ Limitações Conhecidas

1. **Dados não persistem entre dispositivos**
   - Cada navegador tem seu próprio localStorage

2. **Sem sincronização**
   - Dados não são compartilhados

3. **Senhas em texto plano**
   - Apenas para demonstração, não use em produção

4. **OAuth desabilitado**
   - Google e GitHub login não funcionam

5. **Sem recuperação de senha**
   - Funcionalidade não implementada

6. **Dados podem ser perdidos**
   - Limpar cache do navegador remove tudo

## 🔄 Como Reverter

Para voltar ao modo fullstack:

1. **Descomentar proxy no next.config.ts**
2. **Modificar package.json:**
   ```json
   "dev": "npm run dev:fullstack"
   ```
3. **Reverter arquivos da API:**
   - `frontend/lib/api/auth.ts`
   - `frontend/lib/api/projects.ts`
   - `frontend/lib/api/admin.ts`
4. **Reativar OAuth Google:**
   - `frontend/app/(auth)/login/page.tsx`
   - `frontend/app/(auth)/register/page.tsx`

## 📈 Benefícios do Modo Mock

✅ **Desenvolvimento mais rápido** - Sem necessidade de backend  
✅ **Testes mais fáceis** - Dados controlados localmente  
✅ **Deploy simplificado** - Apenas frontend estático  
✅ **Sem dependências** - Não precisa de Go, PostgreSQL, Redis  
✅ **Prototipagem rápida** - Ideal para demos e MVPs  

## 🚀 Próximos Passos

- [ ] Adicionar seed de dados iniciais
- [ ] Implementar export/import de dados
- [ ] Adicionar validações mais robustas
- [ ] Criar testes unitários para funções mock
- [ ] Documentar API mockada

---

**Data:** Abril 2026  
**Versão:** 1.0.0  
**Status:** ✅ Completo
