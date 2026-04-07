# ✅ Correção - Erro do Tailwind CSS

## 🐛 Problema

```
Error: Can't resolve 'tailwindcss' in 'C:\Users\leandro\Documents\GitHub\gitstore'
```

### Causa
O Next.js estava tentando resolver o `@import "tailwindcss"` a partir da raiz do projeto, mas o Tailwind CSS está instalado apenas no diretório `frontend/`.

Havia um `node_modules/` vazio na raiz do projeto que estava confundindo o resolver do Next.js.

## 🔧 Solução Aplicada

### 1. Removido `node_modules` da Raiz
```bash
Remove-Item -Recurse -Force node_modules
```

### 2. Estrutura Correta

```
gitstore/
├── frontend/              # Aplicação Next.js
│   ├── node_modules/     # ✅ Dependências aqui
│   ├── package.json      # ✅ Configuração aqui
│   └── app/
│       └── globals.css   # ✅ Importa tailwindcss
├── package.json          # Apenas scripts de proxy
└── (sem node_modules)    # ✅ Não deve existir
```

## 🚀 Como Executar Agora

### Opção 1: Da Raiz (Recomendado)
```bash
npm run dev
```

Este comando executa: `npm run dev --prefix frontend`

### Opção 2: Do Diretório Frontend
```bash
cd frontend
npm run dev
```

## 📝 Explicação Técnica

### Por que o erro aconteceu?

1. **`globals.css` importa Tailwind:**
   ```css
   @import "tailwindcss";
   ```

2. **Next.js tenta resolver a partir da raiz:**
   - Encontrou `node_modules/` na raiz (vazio)
   - Tentou resolver `tailwindcss` lá
   - Falhou porque Tailwind está em `frontend/node_modules/`

3. **Solução:**
   - Remover `node_modules/` da raiz
   - Next.js agora resolve corretamente do `frontend/`

## ✅ Verificação

### Antes (Erro)
```
gitstore/
├── node_modules/         ❌ Vazio, causando confusão
├── frontend/
│   └── node_modules/     ✅ Tem tailwindcss
```

### Depois (Correto)
```
gitstore/
├── frontend/
│   └── node_modules/     ✅ Tem tailwindcss
└── (sem node_modules)    ✅ Limpo
```

## 🎯 Comandos Disponíveis

### Da Raiz do Projeto
```bash
# Desenvolvimento
npm run dev              # Inicia frontend

# Produção
npm run build            # Build do frontend
npm run start            # Inicia em produção

# Instalação
npm run install:front    # Instala deps do frontend
```

### Do Diretório Frontend
```bash
cd frontend

# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start

# Instalação
npm install
```

## 🔍 Como Evitar no Futuro

### Não Execute na Raiz
```bash
# ❌ Não faça isso na raiz
npm install

# ✅ Faça isso no frontend
cd frontend
npm install
```

### Use os Scripts Corretos
```bash
# ✅ Da raiz, use os scripts proxy
npm run dev
npm run install:front

# ✅ Do frontend, use os scripts normais
cd frontend
npm run dev
```

## 📦 Estrutura de Dependências

### Raiz (`package.json`)
```json
{
  "name": "gitstore",
  "private": true,
  "scripts": {
    "dev": "npm run dev --prefix frontend",
    "build": "npm run build --prefix frontend",
    "start": "npm run start --prefix frontend",
    "install:front": "npm install --prefix frontend"
  }
}
```

**Sem dependências!** Apenas scripts de proxy.

### Frontend (`frontend/package.json`)
```json
{
  "name": "gitstore",
  "dependencies": {
    "next": "16.2.2",
    "react": "19.0.0",
    "tailwindcss": "^3.4.1",
    // ... outras dependências
  }
}
```

**Todas as dependências aqui!**

## ⚠️ Avisos Importantes

### 1. Não Instale Dependências na Raiz
```bash
# ❌ Errado
npm install tailwindcss

# ✅ Correto
cd frontend
npm install tailwindcss
```

### 2. Sempre Use --prefix ou cd
```bash
# ✅ Opção 1: Da raiz com --prefix
npm run dev --prefix frontend

# ✅ Opção 2: Mude para o diretório
cd frontend
npm run dev
```

### 3. Limpe node_modules se Aparecer na Raiz
```bash
# Se node_modules aparecer na raiz novamente
Remove-Item -Recurse -Force node_modules
```

## 🎉 Resultado

Agora o servidor deve iniciar sem erros:

```
▲ Next.js 16.2.2 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in 574ms
```

## 🔄 Se o Erro Persistir

### 1. Limpe Tudo
```bash
# Remova node_modules da raiz (se existir)
Remove-Item -Recurse -Force node_modules

# Limpe cache do Next.js
Remove-Item -Recurse -Force frontend/.next

# Reinstale dependências do frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### 2. Reinicie o Servidor
```bash
# Da raiz
npm run dev

# Ou do frontend
cd frontend
npm run dev
```

---

**Status:** ✅ Corrigido  
**Causa:** `node_modules/` vazio na raiz  
**Solução:** Removido `node_modules/` da raiz  
**Data:** Abril 2026
