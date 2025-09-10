/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verifica se a API está funcionando corretamente
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */
