# 🚀 Quick Start - GitStore (Modo Mock)

## ⚠️ IMPORTANTE: Remover Backend

Antes de começar, você precisa deletar a pasta `backend-go`:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Delete a pasta:**
   ```bash
   Remove-Item -Recurse -Force backend-go
   ```
   Ou delete manualmente pelo Windows Explorer

3. **Remova dependência desnecessária:**
   ```bash
   npm uninstall concurrently
   ```

## Instalação e Execução

### 1. Instalar Dependências
```bash
# Na raiz do projeto
npm install

# Instalar dependências do frontend
npm run install:front
```

### 2. Iniciar o Servidor
```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

## 🎯 Primeiros Passos

### Criar sua Conta
1. Acesse http://localhost:3000/register
2. Preencha:
   - **Nome:** Seu Nome Completo
   - **Username:** seunome (sem espaços)
   - **Email:** seu@email.com
   - **Senha:** mínimo 6 caracteres
3. Clique em **"Criar conta"**
4. Você será redirecionado para seu perfil

### Explorar a Plataforma
- **Perfil:** http://localhost:3000/perfil
- **Projetos:** http://localhost:3000/projects
- **Desenvolvedores:** http://localhost:3000/developers
- **Cursos:** http://localhost:3000/cursos

### Publicar um Projeto
1. Faça login
2. Acesse a página de publicação
3. Preencha os dados do projeto
4. Clique em **"Publicar"**

### Acessar Painel Admin
1. Acesse http://localhost:3000/admin
2. Use as credenciais:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Explore o dashboard

## 📝 Comandos Úteis

```bash
# Iniciar frontend
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Instalar dependências do frontend
npm run install:front
```

## 💡 Dicas

### Limpar Dados
Se quiser começar do zero, abra o console do navegador (F12) e execute:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Ver Dados Armazenados
No console do navegador:
```javascript
// Ver usuários cadastrados
JSON.parse(localStorage.getItem('gitstore.users.db'))

// Ver projetos publicados
JSON.parse(localStorage.getItem('gitstore.published_projects'))

// Ver usuário logado
JSON.parse(localStorage.getItem('gitstore.user'))
```

### Credenciais Admin
- Username: `admin`
- Password: `admin123`

## 🎮 Funcionalidades Disponíveis

### ✅ Funcionando
- Registro e login de usuários
- Perfis personalizáveis
- Publicação de projetos
- Sistema de XP e níveis
- Ranking de desenvolvedores
- Painel administrativo
- Gamificação (badges, conquistas)

### ❌ Não Disponível (Modo Mock)
- Login com Google
- Login com GitHub
- Sincronização entre dispositivos
- Recuperação de senha
- Notificações por email

### 🐛 Problemas Comuns

### Backend ainda está rodando
- Pare o processo (Ctrl+C)
- Delete a pasta `backend-go` manualmente
- Execute apenas `npm run dev`

### Não consegue deletar backend-go
- Pare todos os processos (Ctrl+C)
- Feche o terminal
- Delete pelo Windows Explorer
- Ou reinicie o computador

## 📚 Documentação

- **README_MOCK_MODE.md** - Guia completo do modo mock
- **MOCK_MODE_IMPLEMENTATION.md** - Detalhes técnicos
- **CHANGELOG_MOCK_MODE.md** - Histórico de mudanças

## 🎨 Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage API

## 📞 Suporte

Problemas? Verifique:
1. Console do navegador (F12)
2. Terminal onde o servidor está rodando
3. Documentação nos arquivos MD

---

**Pronto para começar!** 🚀

Execute `npm run dev` e acesse http://localhost:3000
