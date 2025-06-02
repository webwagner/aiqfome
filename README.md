# Sistema de Gerenciamento de Clientes e Favoritos

Este projeto implementa um sistema distribuído utilizando uma arquitetura de microsserviços com uma API Gateway. Ele consiste em três serviços principais: uma API Gateway para roteamento e segurança, um serviço para gerenciamento de clientes e um serviço para gerenciamento de produtos favoritos de clientes, que consome dados de uma API externa de produtos.

## Arquitetura do Sistema

O sistema é composto pelos seguintes serviços:

1.  **API Gateway (`ApiGateway`)**:

    - Ponto único de entrada para todas as requisições dos clientes.
    - Implementa autenticação via JWT (JSON Web Tokens), autorização baseada em roles (`read`, `write`) e rate limit.
    - Atua como um proxy reverso para os serviços de `client` e `favorite`.
    - Fornece documentação da API via Swagger UI.

2.  **Serviço de Clientes (`ApiClient`)**:

    - Responsável pelo CRUD (Create, Read, Update, Delete) de informações de clientes.
    - Utiliza PostgreSQL como banco de dados com TypeORM para persistência de dados.
    - As tabelas são gerenciadas através de migrações do TypeORM.

3.  **Serviço de Favoritos (`ApiFavorites`)**:
    - Permite que clientes favoritem produtos.
    - Armazena a relação entre `clientId` e `productId`.
    - Valida a existência do cliente (consultando a `ApiClient`) e do produto (consultando a API externa `fakestoreapi.com`).
    - Ao listar favoritos, busca os detalhes completos dos produtos da `fakestoreapi.com`.
    - Utiliza PostgreSQL e TypeORM, com chave estrangeira para a tabela de clientes e `ON DELETE CASCADE`.

## Funcionalidades Atuais

- **API Gateway:**
  - Autenticação JWT.
  - Autorização baseada em roles (`read`, `write`).
  - Proxy para os serviços de `client` e `favorite`.
  - Documentação interativa da API com Swagger UI.
- **API de Clientes:**
  - Criação, leitura, atualização e deleção de clientes.
  - Persistência de dados em PostgreSQL via TypeORM.
  - Schema do banco gerenciado por migrações.
- **API de Favoritos:**
  - Adicionar um produto (identificado por `productId`) aos favoritos de um cliente (identificado por `clientId`).
  - Listar todos os produtos favoritos de um cliente (com detalhes buscados da `fakestoreapi.com`).
  - Remover todos os favoritos de um cliente.
  - Remover um registro de favorito específico pelo seu ID.
  - Validação de existência do cliente e do produto antes de favoritar.
  - Garante que um cliente não pode favoritar o mesmo produto múltiplas vezes.

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js, TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM (com Migrações)
- **API Gateway:** Http-Proxy-Middleware
- **Autenticação:** JSON Web Tokens (JWT)
- **Documentação:** Swagger / OpenAPI
- **Requisições HTTP (internas/externas):** Axios
- **Gerenciamento de Ambiente:** Dotenv
- **Desenvolvimento:** ts-node-dev, nodemon (opcional), dotenv

## Pré-requisitos

- Node.js (v18.x ou superior recomendado)
- NPM (v8.x ou superior) ou Yarn
- Servidor PostgreSQL instalado e rodando

## Configuração e Instalação

1.  **Clonar o Repositório:**

    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta-do-projeto>
    ```

2.  **Instalar Dependências para Cada Serviço:**
    Execute `npm install` dentro de cada uma das seguintes pastas:

    - `ApiGateway/`
    - `ApiClient/`
    - `ApiFavorites/`

3.  **Configurar Variáveis de Ambiente (`.env`):**

    - **`ApiGateway/.env`:**

      ```env
      PORT=3000
      JWT_SECRET=SUA_CHAVE_SECRETA
      CLIENT_SERVICE_URL=http://localhost:3001
      FAVORITE_SERVICE_URL=http://localhost:3002
      ```

    - **`ApiClient/.env`:**

      ```env
      PORT=3001
      NODE_ENV=development
      DB_USER=seu_usuario_postgres
      DB_HOST=localhost
      DB_DATABASE=nome_do_seu_banco_de_dados
      DB_PASSWORD=sua_senha_postgres
      DB_PORT=5432
      ```

    - **`ApiFavorite/.env`:**
      ```env
      PORT=3002
      NODE_ENV=development
      DB_USER=seu_usuario_postgres
      DB_HOST=localhost
      DB_DATABASE=nome_do_seu_banco_de_dados
      DB_PASSWORD=sua_senha_postgres
      DB_PORT=5432
      CLIENT_SERVICE_URL=http://localhost:3001
      ```

4.  **Executar Migrações do TypeORM:**
    As migrações criarão as tabelas `clients` e `favorites`. Execute na ordem correta se houver dependências (a tabela `clients` deve existir antes que a FK da `favorites` possa ser criada).

    - Para `ApiClient`:
      ```bash
      cd ApiClient
      npm run migration:run
      ```
    - Para `ApiFavorite`:
      ```bash
      cd ApiFavorite
      npm run migration:run
      ```

## Como Rodar o Sistema

É recomendado iniciar os serviços na seguinte ordem:

1.  **Iniciar o `ApiClient`:**
    (Abra um terminal)

    ```bash
    cd ApiClient
    npm run dev
    ```

2.  **Iniciar o `ApiFavorites`:**
    (Abra outro terminal)

    ```bash
    cd ApiFavorites
    npm run dev
    ```

3.  **Iniciar a `ApiGateway`:**
    (Abra um terceiro terminal)
    ```bash
    cd ApiGateway
    npm run dev
    ```

## Documentação da API

Após iniciar a `ApiGateway`, a documentação da API estará disponível em:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Exemplo de Uso (via API Gateway)

1.  **Login:** `POST /api/auth/login` com corpo `{"id": "u1", "name": "test", "roles": ["read", "write"]}` para obter um token JWT.
2.  **Criar Cliente:** `POST /api/client` com header `Authorization: Bearer <token>` e corpo `{"nome": "Novo Cliente", "email": "cliente@exemplo.com"}`.
3.  **Adicionar Favorito:** `POST /api/favorite` com header `Authorization: Bearer <token>` e corpo `{"clientId": "id_do_cliente_criado", "productId": 1}`.
4.  **Listar Favoritos:** `GET /api/favorite/id_do_cliente_criado` com header `Authorization: Bearer <token>`.

## Esquema do Banco de Dados (Visão Geral)

- **Tabela `clients`** (gerenciada pelo `ApiClient`):
  - `id` (UUID, PK)
  - `nome` (VARCHAR)
  - `email` (VARCHAR, UNIQUE)
- **Tabela `favorites`** (gerenciada pelo `ApiFavorites`):
  - `id` (UUID, PK)
  - `clientId` (UUID, FK para `clients.id`, ON DELETE CASCADE)
  - `productId` (INTEGER)
  - Constraint UNIQUE em (`clientId`, `productId`)

# Explique Suas Escolhas

### 1. Arquitetura de Microsserviços

- **Escolha:** Adotei uma arquitetura de microsserviços, separando o sistema em:
  - `ApiGateway`: Ponto de entrada e orquestração.
  - `ApiClient`: Gerenciamento de dados de clientes.
  - `ApiFavorite`: Gerenciamento de produtos favoritos.
- **Justificativa:**
  - **Escalabilidade:** Cada serviço pode ser escalado individualmente conforme a necessidade.
  - **Manutenibilidade e Evolução:** Alterações em um serviço têm menor probabilidade de impactar outros, facilitando a manutenção e a introdução de novas funcionalidades.
  - **Resiliência:** Uma falha em um serviço tem menos chance de derrubar todo o sistema.

### 2. Padrão API Gateway

- **Escolha:** Implementei uma API Gateway.
- **Justificativa:**
  - **Ponto Único de Entrada:** Simplifica a interface para os clientes da API.
  - **Centralização de Tarefas:** Autenticação, autorização e rate limiting.
  - **Desacoplamento:** Os clientes não precisam conhecer os endereços de cada microsserviço individual.

### 3. Autenticação e Autorização

- **Escolha:** JWT para autenticação e um sistema simples de roles (`read`, `write`) para autorização.
- **Justificativa:**
  - **JWT:** Padrão amplamente adotado muito usado para microsserviços.
  - **Roles:** Implementação simples para controle de acesso a diferentes rotas da API.

## Possíveis Melhorias Futuras

- **Testes:** Implementar testes unitários, de integração e E2E.
- **BFF:** Implementar BFF para responses personalizados para web e mobile.
- **PATCH :** Implementar para aplicar modificações parciais.
- **Padrão Arquitetural:** Implementar um padrão como clean arquiteture para que o sistema seja mais fácil de manter no longo prazo.
- **CI/CD:** Pipelines para integração e deploy contínuos.
- **Containerização:** Docker e Docker Compose para ambiente e deploy.
- **Monitoramento e Logging:** Prometheus, Grafana, Datadog, ELK Stack.
- **Comunicação Assíncrona:** Para operações como notificar outros serviços sobre criação/deleção de clientes, usar um message broker (RabbitMQ, Kafka).
- **Resiliência para API Externa:** Circuit Breaker e Retry para retentativas para chamadas à API de produtos.
- **Caching de Respostas:** Armazenar no Redis produtos para evitar a chamada à API de produtos.
