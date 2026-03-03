---
description: Conventions, architecture, and code style for the API template. Use when making code changes to files under api/.
---

# API Conventions

## Workflow

> **CRITICAL**: For all code changes, follow `.agent/workflows/development_flow.md`.
>
> - Always branch before coding (`feature/xxx`, `fix/xxx`).
> - Run project validation before committing.

## Architecture

Clean Architecture with DDD and CQRS.

- **Domain** (`domain/`): Aggregates, value objects, domain interfaces/events
- **Application** (`application/`): Command/query handlers and use-case orchestration
- **Infrastructure** (`infrastructure/`): Repositories, persistence mapping, external services
- **Adapters** (`adapters/`): REST routes, GraphQL resolvers, transport mapping

All API code lives in `api/src/`, organized by modules under `api/src/modules/`.

## Module Structure

```text
src/modules/{module}/
├── adapters/
├── application/
├── domain/
├── infrastructure/
├── interfaces/
└── module-configuration.ts
```

## Naming and Style

- All files/folders: **kebab-case**
- Keep transport logic in adapters; business logic in application/domain
- Use explicit suffixes:
  - `-command-handler.ts`
  - `-query-handler.ts`
  - `-repository-impl.ts`

## Key Patterns

- **Validation**: Zod schemas at adapter boundaries
- **DI**: Awilix container + module registration
- **CQRS**: Commands mutate state, queries read state
- **Errors**: Prefer stable error codes and mapped API responses

## Implementation Checklist

Use this checklist for every API task:

1. **Respect Layer Boundaries**
   - Keep HTTP/GraphQL transport code in `adapters`.
   - Keep orchestration in `application`.
   - Keep business rules and invariants in `domain`.
   - Keep database/provider integrations in `infrastructure`.
2. **Follow CQRS**
   - Use command handlers for write operations.
   - Use query handlers for read operations.
   - Keep each handler focused on one use case.
3. **Validate and Map Errors**
   - Validate external input at adapter boundaries with Zod.
   - Prefer structured error codes over ad hoc error strings.
   - Map internal errors to stable API response shapes.
4. **Apply Naming Rules**
   - Use kebab-case for files and folders.
   - Prefer explicit suffixes (`-command-handler.ts`, `-query-handler.ts`, `-repository-impl.ts`).
5. **Pass Quality Gate**
   - Run validation from `api/`.
   - Fix all issues.
   - Ensure tests cover affected behavior.

## Testing

- Maintain repository coverage policy
- Mirror source structure in tests
- Mock at infrastructure boundaries for unit tests

## References

- [Architecture](api/docs/architecture.md)
- [Coding Conventions](api/docs/coding-conventions.md)
- [Development Guide](api/docs/development-guide.md)
- [Testing Guide](api/docs/testing-guide.md)
- [Firebase Integration](api/docs/firebase-integration.md)
- [Deployment](api/docs/deployment.md)
