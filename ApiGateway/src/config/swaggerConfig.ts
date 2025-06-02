import { config as appConfig } from "./index";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Gateway - Documentação",
    version: "1.0.0",
    description:
      "Documentação da API Gateway que serve como proxy para os serviços de Clientes e Favoritos.",
    contact: {
      name: "Wagner Ramos",
    },
  },
  servers: [
    {
      url: `http://localhost:${appConfig.port || 3000}/api`,
      description: "Servidor de Desenvolvimento da API Gateway",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          'Token JWT obtido através do endpoint de login (`/auth/login`). Cole o token no formato "Bearer seu_token_aqui".',
      },
    },

    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Mensagem de erro detalhada." },
        },
        required: ["message"],
      },

      LoginCredentials: {
        type: "object",
        required: ["id", "name", "roles"],
        properties: {
          id: { type: "string", example: "user123" },
          name: { type: "string", example: "testuser" },
          roles: {
            type: "array",
            items: { type: "string", enum: ["read", "write"] },
            example: ["read", "write"],
          },
        },
      },
      UserLoginResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login bem-sucedido!" },
          token: {
            type: "string",
            example:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          },
          user: { $ref: "#/components/schemas/LoginCredentials" },
        },
      },

      ClientInput: {
        type: "object",
        required: ["nome", "email"],
        properties: {
          nome: { type: "string", example: "José Silva" },
          email: {
            type: "string",
            format: "email",
            example: "josesilva@gmail.com",
          },
        },
      },
      ClientResponse: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          },
          nome: { type: "string", example: "José Silva" },
          email: {
            type: "string",
            format: "email",
            example: "josesilva@exemplo.com",
          },
        },
      },
      ClientListResponse: {
        type: "array",
        items: { $ref: "#/components/schemas/ClientResponse" },
      },

      FavoriteCreateApiInput: {
        type: "object",
        required: ["clientId", "productId"],
        properties: {
          clientId: {
            type: "string",
            format: "uuid",
            description: "ID do cliente que está favoritando.",
            example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
          },
          productId: {
            type: "integer",
            description: "ID do produto da FakeStoreAPI a ser favoritado.",
            example: 1,
          },
        },
      },
      FavoriteLinkResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Produto adicionado aos favoritos com sucesso.",
          },
          favorite: {
            type: "object",
            properties: {
              favoriteId: {
                type: "string",
                format: "uuid",
                description: "ID do registro de favorito criado.",
              },
              clientId: { type: "string", format: "uuid" },
              productId: { type: "integer" },
            },
          },
        },
      },
      FakeStoreProduct: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: {
            type: "string",
            example: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          },
          price: { type: "number", format: "float", example: 109.95 },
          description: {
            type: "string",
            example: "Your perfect pack for everyday use...",
          },
          category: { type: "string", example: "men's clothing" },
          image: {
            type: "string",
            format: "url",
            example: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          },
          rating: {
            type: "object",
            properties: {
              rate: { type: "number", format: "float", example: 3.9 },
              count: { type: "integer", example: 120 },
            },
          },
        },
      },
      ClientFavoritesListResponse: {
        type: "array",
        items: { $ref: "#/components/schemas/FakeStoreProduct" },
      },
      DeleteClientFavoritesResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Favorito(s) do cliente foram deletados.",
          },
        },
      },
    },

    responses: {
      Unauthorized: {
        description:
          "Erro: Não autorizado (Tokens ausente, inválido ou expirado).",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Erro: Acesso negado (Roles insuficientes).",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Erro: Recurso não encontrado.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      BadRequest: {
        description:
          "Erro: Requisição inválida (verifique os parâmetros ou corpo enviados).",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Conflict: {
        description: "Erro: Conflito (ex: recurso já existe).",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      ServiceUnavailable: {
        description:
          "Erro: Serviço externo indisponível ou falha de comunicação.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      BadGateway: {
        description:
          "Erro: Bad Gateway (problema no proxy ao contatar serviço interno).",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },

  paths: {
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Autentica um usuário e retorna um token.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginCredentials" },
            },
          },
        },
        responses: {
          "200": {
            description: "Autenticação bem-sucedida.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserLoginResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },

    "/client": {
      post: {
        tags: ["Cliente"],
        summary: "Cria um novo cliente.",
        description: "Requer autenticação JWT e a role 'write'.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cliente criado com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
      get: {
        tags: ["Cliente"],
        summary: "Lista todos os clientes.",
        description: "Requer autenticação JWT e a role 'read'.",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de clientes recuperada com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientListResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
    },
    "/client/{id}": {
      get: {
        tags: ["Cliente"],
        summary: "Recupera um cliente pelo ID.",
        description: "Requer autenticação JWT e a role 'read'.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do cliente (UUID).",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Cliente recuperado com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
      put: {
        tags: ["Cliente"],
        summary: "Atualiza um cliente existente.",
        description: "Requer autenticação JWT e a role 'write'.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do cliente (UUID).",
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ClientInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Cliente atualizado com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ClientResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
      delete: {
        tags: ["Cliente"],
        summary: "Deleta um cliente pelo ID.",
        description: "Requer autenticação JWT e a role 'write'.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID do cliente (UUID).",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Cliente deletado com sucesso.",
            content: {
              "application/json": {
                schema: { properties: { message: { type: "string" } } },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
    },

    "/favorite": {
      post: {
        tags: ["Favoritos"],
        summary: "Adiciona um produto à lista de favoritos de um cliente.",
        description:
          "Requer autenticação JWT e a role 'write'. Envie clientId e productId no corpo JSON.",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FavoriteCreateApiInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Produto adicionado aos favoritos com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FavoriteLinkResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": {
            description: "Cliente não encontrado.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "Este produto já é um favorito deste cliente.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "502": { $ref: "#/components/responses/BadGateway" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
    },
    "/favorite/{client}": {
      get: {
        tags: ["Favoritos"],
        summary: "Lista todos os itens favoritos de um cliente específico.",
        description:
          "Requer autenticação JWT e a role 'read'. O ID do cliente é passado no path. Os detalhes dos produtos são buscados de uma API externa.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "client",
            in: "path",
            required: true,
            description: "ID do cliente (UUID).",
            schema: {
              type: "string",
              format: "uuid",
              example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            },
          },
        ],
        responses: {
          "200": {
            description: "Lista de favoritos recuperada com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ClientFavoritesListResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "502": { $ref: "#/components/responses/BadGateway" },
          "503": { $ref: "#/components/responses/ServiceUnavailable" },
        },
      },
      delete: {
        tags: ["Favoritos"],
        summary: "Deleta TODOS os itens favoritos de um cliente específico.",
        description:
          "Requer autenticação JWT e a role 'write'. O ID do cliente é passado no path.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "client",
            in: "path",
            required: true,
            description: "ID do cliente (UUID).",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Favoritos do cliente deletados com sucesso.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DeleteClientFavoritesResponse",
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
    },
    "/favorite/item/{favoriteId}": {
      delete: {
        tags: ["Favoritos"],
        summary: "Deleta UM registro de favorito específico pelo seu ID.",
        description: "Requer autenticação JWT e a role 'write'.",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "favoriteId",
            in: "path",
            required: true,
            description: "ID do registro de favorito (UUID).",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Registro de favorito deletado com sucesso.",
            content: {
              "application/json": {
                schema: { properties: { message: { type: "string" } } },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "502": { $ref: "#/components/responses/BadGateway" },
        },
      },
    },
  },
};

export default swaggerDefinition;
