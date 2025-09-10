# Estrutura do Backend

## Organização dos Arquivos

```
backend/
├── src/
│   ├── docs/                    # Documentação Swagger
│   │   ├── swagger.config.ts    # Configuração principal do Swagger
│   │   ├── health.docs.ts       # Documentação do endpoint /health
│   │   └── upload.docs.ts       # Documentação do endpoint /upload
│   ├── routes/                  # Rotas da API
│   │   ├── health.routes.ts     # Rota de health check
│   │   └── upload.routes.ts     # Rota de upload simples
│   └── index.ts                 # Arquivo principal do servidor
├── package.json
├── tsconfig.json
└── env.example
```

## Arquivos de Documentação

### `docs/swagger.config.ts`

- Configuração principal do Swagger
- Define schemas, componentes e configurações globais
- Inclui exemplos de resposta e validações

### `docs/*.docs.ts`

- Documentação específica de cada endpoint
- Contém anotações JSDoc para o Swagger
- Inclui exemplos de requisição e resposta

## Arquivos de Rotas

### `routes/health.routes.ts`

- Endpoint: `GET /health`
- Funcionalidade: Verificação de saúde da API
- Dependências: Apenas Express
- **Sem documentação Swagger** (separada em `docs/`)

### `routes/upload.routes.ts`

- Endpoint: `POST /upload`
- Funcionalidade: Upload de arquivo simples (PDF/imagem)
- Dependências: Express, Multer, Axios, FS, Path
- Integração: Webhook n8n para processamento
- **Sem documentação Swagger** (separada em `docs/`)

## Arquivo Principal

### `index.ts`

- Configuração do servidor Express
- Middleware global (CORS, JSON, URL-encoded)
- Configuração do Swagger UI
- Registro das rotas
- Middleware de tratamento de erros
- Inicialização do servidor

## Vantagens da Nova Estrutura

1. **Separação de Responsabilidades**: Cada arquivo tem uma função específica
2. **Manutenibilidade**: Mais fácil de manter e atualizar
3. **Escalabilidade**: Fácil adicionar novas rotas e documentação
4. **Organização**: Código mais limpo e organizado
5. **Reutilização**: Componentes podem ser reutilizados
6. **Testabilidade**: Mais fácil de testar individualmente

## Como Adicionar Novos Endpoints

1. **Criar documentação** em `docs/nome-endpoint.docs.ts`
2. **Criar rota** em `routes/nome-endpoint.routes.ts`
3. **Registrar rota** em `index.ts`
4. **Atualizar schemas** em `swagger.config.ts` se necessário

## Variáveis de Ambiente

```env
PORT=3001
N8N_WEBHOOK_URL=http://localhost:5678/webhook/upload-file
N8N_MENU_ANALYSIS_URL=http://localhost:5678/webhook/analyze-menu
NODE_ENV=development
```

## Scripts Disponíveis

```bash
pnpm dev      # Desenvolvimento com hot reload
pnpm build    # Build de produção
pnpm start    # Executar build de produção
```
