# File Upload MVP com n8n

Uma aplicação MVP para upload de arquivos (PDF e imagens) com integração ao n8n para processamento automático.

## 🚀 Tecnologias

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** React + TypeScript
- **Gerenciador de Pacotes:** pnpm
- **Documentação:** Swagger/OpenAPI
- **Integração:** n8n workflow

## 📁 Estrutura do Projeto

```
├── backend/                 # API Node.js
│   ├── src/
│   │   └── index.ts        # Servidor principal
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Interface React
│   ├── src/
│   │   ├── App.tsx         # Componente principal
│   │   ├── index.tsx       # Ponto de entrada
│   │   └── index.css       # Estilos
│   ├── public/
│   └── package.json
├── package.json            # Workspace root
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+
- pnpm
- n8n (para processamento dos arquivos)

### 1. Instalar Dependências

```bash
# Instalar dependências de todos os workspaces
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp backend/env.example backend/.env

# Editar as variáveis conforme necessário
# PORT=3001
# N8N_WEBHOOK_URL=http://localhost:5678/webhook/upload-file
# NODE_ENV=development
```

### 3. Executar a Aplicação

```bash
# Executar backend e frontend simultaneamente
pnpm dev

# Ou executar separadamente:
# Backend: pnpm --filter backend dev
# Frontend: pnpm --filter frontend dev
```

### 4. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Documentação Swagger:** http://localhost:3001/api-docs

## 🔧 Configuração do n8n

Siga as instruções detalhadas no arquivo [N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md) para configurar seu workflow n8n.

### Resumo da Configuração:

1. **Remover** o Google Drive Trigger atual
2. **Adicionar** um Webhook Trigger (POST)
3. **Configurar** para receber dados do backend
4. **Conectar** ao AI Agent existente

## 📋 Funcionalidades

### Backend

- ✅ Upload de arquivos (PDF, JPEG, PNG, GIF)
- ✅ Validação de tipo e tamanho (máx. 10MB)
- ✅ Conversão para base64
- ✅ Integração com webhook n8n
- ✅ Documentação Swagger automática
- ✅ Tratamento de erros
- ✅ Limpeza de arquivos temporários

### Frontend

- ✅ Interface drag-and-drop
- ✅ Preview de imagens
- ✅ Validação de arquivos
- ✅ Feedback visual de upload
- ✅ Tratamento de erros
- ✅ Design responsivo

## 🔌 API Endpoints

### `GET /health`

Verificação de saúde da API

### `POST /upload`

Upload de arquivo simples

- **Content-Type:** `multipart/form-data`
- **Body:** `file` (arquivo)
- **Response:** Status do upload e resposta do n8n

## 🎯 Fluxo da Aplicação

1. **Usuário** faz upload de arquivo no frontend
2. **Frontend** envia arquivo para backend via POST
3. **Backend** valida arquivo e converte para base64
4. **Backend** envia dados para webhook n8n
5. **n8n** processa arquivo com AI Agent
6. **n8n** salva resultado no Google Sheets
7. **Backend** retorna resposta para frontend
8. **Frontend** exibe resultado para usuário

## 🚨 Limitações do MVP

- Arquivos limitados a 10MB
- Apenas PDF e imagens (JPEG, PNG, GIF)
- Sem autenticação
- Processamento síncrono
- Sem persistência de dados

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Executa backend + frontend
pnpm --filter backend dev   # Apenas backend
pnpm --filter frontend dev  # Apenas frontend

# Build
pnpm build                  # Build de produção
pnpm --filter backend build # Build apenas backend
pnpm --filter frontend build # Build apenas frontend

# Produção
pnpm start                  # Executa backend em produção
```

### Estrutura de Dados

#### Dados enviados para n8n:

```json
{
  "fileName": "documento.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "fileData": "base64_encoded_content",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se a porta 3001 está livre
- Confirme se as dependências foram instaladas
- Verifique as variáveis de ambiente

### Frontend não carrega

- Verifique se o backend está rodando
- Confirme se a porta 3000 está livre
- Verifique o console do navegador

### Upload falha

- Verifique se o n8n está rodando
- Confirme a URL do webhook
- Verifique os logs do backend e n8n

### n8n não processa arquivo

- Verifique se o workflow está ativo
- Confirme a configuração do webhook
- Verifique os logs do n8n

## 📝 Próximos Passos

- [ ] Adicionar autenticação
- [ ] Implementar filas de processamento
- [ ] Adicionar notificações
- [ ] Melhorar tratamento de erros
- [ ] Adicionar testes
- [ ] Implementar cache
- [ ] Adicionar métricas

## 📄 Licença

MIT License
