# ⚠️ Instruções para Deletar o Backend

## O backend-go está em uso e não pode ser deletado automaticamente

### Passos para remover:

1. **Pare o servidor de desenvolvimento**
   - Pressione `Ctrl + C` no terminal onde o servidor está rodando
   - Aguarde até que todos os processos sejam encerrados

2. **Delete a pasta backend-go manualmente**
   ```bash
   # No PowerShell ou terminal
   Remove-Item -Recurse -Force backend-go
   ```
   
   Ou simplesmente delete a pasta `backend-go` pelo Windows Explorer

3. **Verifique se foi removido**
   ```bash
   ls
   ```
   A pasta `backend-go` não deve mais aparecer

## ✅ Já Feito

- ✅ package.json atualizado (scripts do backend removidos)
- ✅ Dependência `concurrently` pode ser removida (não é mais necessária)

## 🧹 Limpeza Adicional (Opcional)

Após deletar o backend-go, você pode remover a dependência concurrently:

```bash
npm uninstall concurrently
```

## 📝 Scripts Atualizados

O `package.json` agora contém apenas:

```json
{
  "scripts": {
    "dev": "npm run dev --prefix frontend",
    "build": "npm run build --prefix frontend",
    "start": "npm run start --prefix frontend",
    "install:front": "npm install --prefix frontend"
  }
}
```

## 🚀 Após Deletar

Execute:
```bash
npm run dev
```

Apenas o frontend será iniciado em http://localhost:3000

---

**Nota:** Se ainda houver problemas para deletar, reinicie o computador e tente novamente.
