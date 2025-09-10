import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Upload API",
      version: "1.0.0",
      description: "API para upload de arquivos com integração n8n",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desenvolvimento",
      },
      {
        url: "https://api.example.com",
        description: "Servidor de produção",
      },
    ],
    components: {
      schemas: {
        UploadResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indica se o upload foi bem-sucedido",
            },
            message: {
              type: "string",
              description: "Mensagem de status",
            },
            fileIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "IDs únicos dos arquivos enviados",
            },
            n8nResponse: {
              type: "object",
              description: "Resposta do webhook n8n",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Mensagem de erro",
            },
            error: {
              type: "string",
              description: "Detalhes do erro (apenas em desenvolvimento)",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Requisição inválida",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        NotFound: {
          description: "Recurso não encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Erro interno do servidor",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Endpoints de verificação de saúde da API",
      },
      {
        name: "Upload",
        description: "Endpoints para upload de arquivos simples",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
