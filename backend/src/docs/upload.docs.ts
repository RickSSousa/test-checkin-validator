/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload de múltiplos arquivos
 *     description: Faz upload de múltiplos arquivos (PDF ou imagens) para processamento via n8n como FormData
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Arquivos para upload (PDF, JPEG, PNG, GIF) - máximo 10 arquivos
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Arquivos enviados com sucesso para o n8n
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UploadResponse"
 *       400:
 *         description: Erro na validação dos arquivos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               no-files:
 *                 summary: Nenhum arquivo enviado
 *                 value:
 *                   success: false
 *                   message: "Nenhum arquivo foi enviado"
 *               invalid-type:
 *                 summary: Tipo de arquivo inválido
 *                 value:
 *                   success: false
 *                   message: "Apenas arquivos de imagem (JPEG, PNG, GIF) e PDF são permitidos"
 *               file-too-large:
 *                 summary: Arquivo muito grande
 *                 value:
 *                   success: false
 *                   message: "Arquivo muito grande. Tamanho máximo permitido: 10MB por arquivo"
 *               too-many-files:
 *                 summary: Muitos arquivos
 *                 value:
 *                   success: false
 *                   message: "Muitos arquivos. Máximo permitido: 10 arquivos"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
