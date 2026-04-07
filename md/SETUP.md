# Setup do Projeto GitStore

## Pré-requisitos

- Node.js 18+ instalado
- Go 1.25+ instalado

## Configuração do Go no Windows

Se você instalou o Go mas ele não está funcionando, adicione ao PATH do sistema:

1. Abra o PowerShell como Administrador
2. Execute o comando:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Go\bin", "Machine")
```
3. Feche e reabra o terminal

Ou adicione manualmente:
1. Pressione `Win + X` e selecione "Sistema"
2. Clique em "Configurações avançadas do sistema"
3. Clique em "Variáveis de Ambiente"
4. Em "Variáveis do sistema", selecione "Path" e clique em "Editar"
5. Clique em "Novo" e adicione: `C:\Program Files\Go\bin`
6. Clique em "OK" em todas as janelas
7. Feche e reabra o terminal

## Instalação

```bash
# Instalar dependências do frontend
npm run install:front

# Instalar dependências do backend Go
cd backend-go
go mod download
cd ..
```

## Executar o projeto

```bash
# Iniciar frontend e backend juntos
npm run dev

# Ou iniciar separadamente:
npm run dev:front  # Frontend na porta 3000
npm run dev:api    # Backend na porta 3001
```

## Portas

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Estrutura

```
gitstore/
├── frontend/          # Next.js 15 + TypeScript
├── backend-go/        # API em Go
├── db.json           # Dados de exemplo
└── package.json      # Scripts principais
```
