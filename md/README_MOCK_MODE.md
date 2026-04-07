# GitStore - Modo Mock (Frontend Standalone)

## 🚀 Como Executar

### Modo Mock (Apenas Frontend - Recomendado)
```bash
npm run dev
```

Este comando inicia apenas o frontend Next.js em `http://localhost:3000` sem o backend Go.

### Modo Fullstack (Frontend + Backend)
Se você quiser executar com o backend Go (não necessário no modo mock):
```bash
npm run dev:fullstack
```

### Comandos Individuais

**Apenas Frontend:**
```bash
npm run dev:front
```

**Apenas Backend Go:**
```bash
npm run dev:api
```

## 📝 Mudanças Principais

### 1. Script `npm run dev` Modificado
- **Antes:** Iniciava backend Go + frontend Next.js
- **Agora:** Inicia apenas o frontend Next.js

### 2. Proxy do Next.js Removido
- **Antes:** `/api/backend/*` redirecionava para `http://localhost:3001`
- **Agora:** Proxy comentado, sem redirecionamento

### 3. Sistema Completamente Mock
- Autenticação via localStorage
- Projetos salvos localmente
- Admin com credenciais fixas
- Sem requisições HTTP ao backend

## 🎯 Funcionalidades Disponíveis

### Autenticação
- ✅ Registro de usuários
- ✅ Login com email/senha
- ✅ Perfil personalizável
- ✅ Logout
- ❌ OAuth Google (desabilitado)

### Projetos
- ✅ Publicar projetos
- ✅ Listar projetos
- ✅ Deletar projetos
- ✅ Filtros e busca

### Admin
- ✅ Login: `admin` / `admin123`
- ✅ Dashboard com estatísticas
- ✅ Gerenciar usuários
- ✅ Gerenciar projetos

### Gamificação
- ✅ Sistema de XP
- ✅ Níveis e títulos
- ✅ Ranking de desenvolvedores
- ✅ Badges e conquistas

## 💾 Armazenamento de Dados

Todos os dados são armazenados no navegador:

### localStorage
- `gitstore.users.db` - Banco de usuários
- `gitstore.published_projects` - Projetos publicados
- `gitstore.token` - Token de sessão
- `gitstore.user` - Dados do usuário logado
- `gitstore.settings.profile` - Configurações de perfil

### sessionStorage
- `gitstore.admin.token` - Token admin
- `gitstore.admin.name` - Nome do admin

## 🔧 Desenvolvimento

### Estrutura de Pastas
```
gitstore/
├── frontend/           # Aplicação Next.js (standalone)
│   ├── app/           # Páginas e rotas
│   ├── components/    # Componentes React
│   ├── lib/           # Utilitários e APIs mockadas
│   └── ...
├── backend-go/        # Backend Go (não usado no modo mock)
└── package.json       # Scripts principais
```

### Arquivos Modificados para Modo Mock
- `frontend/lib/api/auth.ts` - Autenticação mockada
- `frontend/lib/api/projects.ts` - Projetos mockados
- `frontend/lib/api/admin.ts` - Admin mockado
- `frontend/app/(auth)/login/page.tsx` - Google OAuth desabilitado
- `frontend/app/(auth)/register/page.tsx` - Google OAuth desabilitado
- `frontend/app/settings/page.tsx` - Conexões mockadas
- `frontend/components/features/developers/DeveloperGrid.tsx` - Sem backend
- `frontend/next.config.ts` - Proxy removido
- `package.json` - Script dev modificado

## 🧪 Testando

### Criar Conta de Teste
1. Acesse `http://localhost:3000/register`
2. Preencha os dados:
   - Nome: Seu Nome
   - Username: seunome
   - Email: seu@email.com
   - Senha: senha123
3. Clique em "Criar conta"

### Fazer Login
1. Acesse `http://localhost:3000/login`
2. Use o email e senha cadastrados
3. Você será redirecionado para `/perfil`

### Acessar Admin
1. Acesse `http://localhost:3000/admin`
2. Use: `admin` / `admin123`
3. Explore o dashboard

### Publicar Projeto
1. Faça login
2. Acesse a página de publicação
3. Preencha os dados do projeto
4. Projeto aparecerá na listagem

## ⚠️ Limitações

1. **Dados locais apenas** - Não compartilhados entre dispositivos
2. **Sem persistência real** - Limpar cache apaga tudo
3. **Senhas em texto plano** - Apenas para demonstração
4. **Sem OAuth** - Google login não funciona
5. **Sem validação de email** - Aceita qualquer formato
6. **Sem recuperação de senha** - Funcionalidade não implementada

## 🔄 Reverter para Modo Fullstack

Se quiser voltar a usar o backend:

1. Descomentar o proxy no `frontend/next.config.ts`
2. Modificar `package.json` para usar `dev:fullstack` como padrão
3. Reverter mudanças nos arquivos `frontend/lib/api/*.ts`
4. Reativar OAuth Google nas páginas de auth

## 📚 Documentação Adicional

- `MOCK_MODE_IMPLEMENTATION.md` - Detalhes técnicos da implementação
- `frontend/STRUCTURE.md` - Estrutura do frontend
- `frontend/MIGRATION_GUIDE.md` - Guia de migração

## 🎨 Tecnologias

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Armazenamento:** localStorage, sessionStorage
- **Avatares:** DiceBear API
- **Animações:** Framer Motion, CSS Animations

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique o console do navegador (F12)
2. Limpe o localStorage se houver problemas
3. Reinicie o servidor de desenvolvimento

---

**Modo:** Frontend Standalone (Mock)  
**Versão:** 1.0.0  
**Última Atualização:** Abril 2026
