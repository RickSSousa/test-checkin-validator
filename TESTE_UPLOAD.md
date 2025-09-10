# Teste de Upload de Arquivos

## Como Testar o FormData

### 1. Executar a Aplicação

```bash
# Instalar dependências
pnpm install

# Executar backend e frontend
pnpm dev
```

### 2. Acessar a Aplicação

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Swagger:** http://localhost:3001/api-docs

### 3. Testar Upload

1. **Abra o console do navegador** (F12 → Console)
2. **Selecione um arquivo** (PDF ou imagem)
3. **Clique em "Enviar Arquivo"**
4. **Verifique os logs** no console do navegador e no terminal do backend

### 4. Logs Esperados

#### No Console do Navegador:

```
FormData criado:
Arquivo: exemplo.pdf Tamanho: 1024000 Tipo: application/pdf
FormData[file]: File {name: "exemplo.pdf", size: 1024000, type: "application/pdf", ...}
```

#### No Terminal do Backend:

```
=== UPLOAD REQUEST RECEBIDA ===
Headers: {
  'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary...',
  'content-length': '1024123',
  ...
}
Body: {}
File: {
  fieldname: 'file',
  originalname: 'exemplo.pdf',
  encoding: '7bit',
  mimetype: 'application/pdf',
  destination: 'uploads',
  filename: 'file-1234567890-123456789.pdf',
  path: 'uploads/file-1234567890-123456789.pdf',
  size: 1024000
}
Arquivo recebido: {
  fileName: 'exemplo.pdf',
  fileMimeType: 'application/pdf',
  fileSize: 1024000,
  filePath: 'uploads/file-1234567890-123456789.pdf'
}
```

## Estrutura do FormData Enviado

O FormData é criado corretamente com:

```javascript
const formData = new FormData();
formData.append("file", selectedFile); // selectedFile é o arquivo do usuário
```

### Campos do FormData:

- **`file`**: O arquivo selecionado pelo usuário (File object)

### Headers Automáticos:

- **`Content-Type`**: `multipart/form-data; boundary=...` (definido automaticamente pelo axios)

## Validação no Backend

O backend recebe o FormData através do middleware `multer`:

```javascript
app.post("/upload", upload.single("file"), async (req, res) => {
  // req.file contém os dados do arquivo
  // req.body contém outros campos do form (se houver)
});
```

### Dados Disponíveis em `req.file`:

- `fieldname`: Nome do campo no form ("file")
- `originalname`: Nome original do arquivo
- `mimetype`: Tipo MIME do arquivo
- `size`: Tamanho em bytes
- `path`: Caminho onde o arquivo foi salvo temporariamente
- `filename`: Nome do arquivo gerado pelo multer

## Troubleshooting

### Problema: Arquivo não é enviado

- Verifique se o arquivo está sendo selecionado corretamente
- Confirme se o FormData está sendo criado (logs no console)
- Verifique se o backend está rodando na porta 3001

### Problema: Backend não recebe o arquivo

- Verifique os logs do backend
- Confirme se o multer está configurado corretamente
- Verifique se o campo do form é "file"

### Problema: Erro de CORS

- O CORS já está configurado no backend
- Verifique se o frontend está fazendo requisição para a URL correta

## Exemplo de Requisição HTTP

```http
POST /upload HTTP/1.1
Host: localhost:3001
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="exemplo.pdf"
Content-Type: application/pdf

[conteúdo binário do arquivo]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

## Próximos Passos

1. **Teste com diferentes tipos de arquivo** (PDF, JPEG, PNG, GIF)
2. **Teste com arquivos grandes** (próximo do limite de 10MB)
3. **Verifique a integração com n8n** (webhook)
4. **Monitore os logs** para identificar possíveis problemas
