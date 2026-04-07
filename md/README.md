# 🚀 GitStore - Plataforma de Projetos para Desenvolvedores

Uma plataforma moderna para desenvolvedores compartilharem, descobrirem e colaborarem em projetos open source.

## ✨ Características

- 🎨 Interface moderna inspirada no GitHub
- 🎮 Sistema de gamificação (XP, níveis, badges)
- 👥 Perfis de desenvolvedores personalizáveis
- 📦 Publicação e descoberta de projetos
- 🏆 Ranking da comunidade
- 🎓 Seção de cursos e aprendizado
- 🔐 Sistema de autenticação mockado
- 💾 Armazenamento local (localStorage)

## 🛠️ Tecnologias

- **Frontend:** Next.js 16, React 19, TypeScript
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Armazenamento:** localStorage API
- **Avatares:** DiceBear API

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/gitstore.git
cd gitstore

# Instale as dependências
npm install
npm run install:front

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o frontend

# Produção
npm run build            # Build para produção
npm run start            # Inicia em modo produção

# Utilitários
npm run install:front    # Instala dependências do frontend
```

## 🎯 Funcionalidades

### Autenticação
- ✅ Registro de usuários
- ✅ Login com email/senha
- ✅ Perfis personalizáveis
- ✅ Sistema de sessão

### Projetos
- ✅ Publicar projetos
- ✅ Buscar e filtrar projetos
- ✅ Categorias e tags
- ✅ Sistema de curtidas
- ✅ Projetos gratuitos, pagos e freemium

### Gamificação
- ✅ Sistema de XP
- ✅ Níveis e títulos
- ✅ Badges e conquistas
- ✅ Ranking de desenvolvedores

### Admin
- ✅ Dashboard administrativo
- ✅ Gerenciamento de usuários
- ✅ Gerenciamento de projetos
- ✅ Estatísticas da plataforma

**Credenciais Admin:**
- Username: `admin`
- Password: `admin123`

## 📂 Estrutura do Projeto

```
gitstore/
├── frontend/              # Aplicação Next.js
│   ├── app/              # Páginas e rotas (App Router)
│   ├── components/       # Componentes React
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── features/    # Features específicas
│   │   ├── layout/      # Layout e navegação
│   │   └── ui/          # Componentes UI reutilizáveis
│   ├── lib/             # Utilitários e APIs
│   │   ├── api/         # APIs mockadas
│   │   └── utils/       # Funções utilitárias
│   ├── hooks/           # React hooks customizados
│   ├── types/           # TypeScript types
│   └── public/          # Arquivos estáticos
├── docs/                # Documentação
└── package.json         # Dependências e scripts
```

## 💾 Armazenamento de Dados

Todos os dados são armazenados localmente no navegador:

### localStorage
- `gitstore.users.db` - Banco de usuários
- `gitstore.published_projects` - Projetos publicados
- `gitstore.token` - Token de sessão
- `gitstore.user` - Dados do usuário logado

### sessionStorage
- `gitstore.admin.token` - Token admin
- `gitstore.admin.name` - Nome do admin

## 🎮 Como Usar

### 1. Criar uma Conta
1. Acesse `/register`
2. Preencha seus dados
3. Clique em "Criar conta"

### 2. Publicar um Projeto
1. Faça login
2. Acesse a página de publicação
3. Preencha os detalhes do projeto
4. Clique em "Publicar"

### 3. Explorar Projetos
1. Acesse `/projects`
2. Use filtros e busca
3. Curta projetos interessantes

### 4. Acessar Admin
1. Acesse `/admin`
2. Use: `admin` / `admin123`
3. Gerencie usuários e projetos

## ⚠️ Modo Mock

Este projeto funciona em **modo mock** (standalone):
- ✅ Sem necessidade de backend
- ✅ Dados armazenados localmente
- ✅ Ideal para desenvolvimento e demos
- ❌ Dados não sincronizam entre dispositivos
- ❌ OAuth não disponível

## 🧪 Desenvolvimento

### Limpar Dados
Para resetar todos os dados:

```javascript
// No console do navegador (F12)
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Ver Dados Armazenados
```javascript
// Usuários cadastrados
JSON.parse(localStorage.getItem('gitstore.users.db'))

// Projetos publicados
JSON.parse(localStorage.getItem('gitstore.published_projects'))

// Usuário logado
JSON.parse(localStorage.getItem('gitstore.user'))
```

## 📚 Documentação

- **QUICK_START.md** - Guia rápido de início
- **README_MOCK_MODE.md** - Detalhes do modo mock
- **MOCK_MODE_IMPLEMENTATION.md** - Implementação técnica
- **CHANGELOG_MOCK_MODE.md** - Histórico de mudanças
- **frontend/STRUCTURE.md** - Estrutura do frontend
- **frontend/MIGRATION_GUIDE.md** - Guia de migração

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas features
- Enviar pull requests
- Melhorar a documentação

## 📄 Licença

Este projeto está sob a licença MIT.

## 🎨 Screenshots

### Home
Interface principal com projetos em destaque

### Perfil
Perfil personalizável com sistema de XP e badges

### Projetos
Catálogo completo de projetos com filtros

### Admin
Dashboard administrativo completo

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

## 💡 Dicas

- Use o modo desenvolvedor do navegador (F12) para debug
- Limpe o localStorage se encontrar problemas
- Todos os dados são locais - não serão perdidos ao recarregar a página
- Para resetar completamente, limpe o cache do navegador

---

**Desenvolvido com ❤️ usando Next.js e React**

**Modo:** Frontend Standalone (Mock)  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para uso
