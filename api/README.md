# API Server

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-DD2C00?style=flat&logo=firebase&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

## Features

- **Clean Architecture + DDD** — Domain, Application, Infrastructure, Adapters layers with Awilix DI
- **CQRS Pattern** — Separate command and query handlers for optimized reads and writes
- **Modular Structure** — Feature modules under `src/modules/` with automatic discovery
- **Tech Stack** — Fastify, TypeScript (strict), PostgreSQL, Sequelize ORM, Mercurius (GraphQL)
- **Auth & Security** — Firebase Admin SDK, JWT, input sanitization, rate limiting, CORS
- **Testing** — Vitest with 100% coverage requirement
- **Domain Events** — Event-driven architecture with async processing and optimistic locking

## Quick Start

```bash
npm install
cp .env.example .env  # Edit with your database config
npm run migrate
npm run dev
```

The API runs at `http://localhost:3000`.

## Scripts

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Start development server with hot reload        |
| `npm run build`    | Build TypeScript to JavaScript                  |
| `npm run validate` | Run lint, format check, and tests with coverage |
| `npm run migrate`  | Run database migrations                         |

## Documentation

| Document                                             | Description                                                |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| [Architecture](docs/architecture.md)                 | Layers, data flow, design patterns, DI with Awilix         |
| [Coding Conventions](docs/coding-conventions.md)     | File naming, code style, validation ordering, discovery    |
| [Development Guide](docs/development-guide.md)       | Adding features, creating modules                          |
| [Testing Guide](docs/testing-guide.md)               | Test organization, 100% coverage, best practices           |
| [Firebase Integration](docs/firebase-integration.md) | Admin SDK setup, token verification, user management       |
| [Deployment](docs/deployment.md)                     | Docker builds, environment variables, production checklist |

## License

MIT
