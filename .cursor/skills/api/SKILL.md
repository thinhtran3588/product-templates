---
name: api
description: Conventions, architecture, and code style for the API template. Use when making changes under api/.
---

# API Conventions

## Workflow

For all code changes, follow `.cursor/rules/development-flow.mdc`.

## Architecture

Clean Architecture with DDD and CQRS.

- Domain: aggregates, value objects, domain interfaces/events
- Application: command/query handlers and use-case orchestration
- Infrastructure: repositories, persistence mapping, external services
- Adapters: REST routes, GraphQL resolvers, transport mapping

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

- Use kebab-case for files/folders.
- Keep transport logic in adapters; business logic in handlers/domain.
- Use explicit suffixes (`-command-handler.ts`, `-query-handler.ts`, `-repository-impl.ts`).

## Key Patterns

- Validation: Zod schemas at adapter boundaries
- DI: Awilix container/module registrations
- CQRS: commands mutate state, queries read state
- Errors: prefer stable error codes and mapped API responses

## Implementation Checklist

Use this checklist for every API task:

1. Respect layer boundaries
   - Keep transport code (HTTP/GraphQL) in `adapters`.
   - Keep use-case orchestration in `application`.
   - Keep business rules in `domain`.
   - Keep DB/provider integrations in `infrastructure`.
2. Follow CQRS
   - Use command handlers for writes.
   - Use query handlers for reads.
   - Keep each handler focused on one use case.
3. Validate and map errors
   - Validate external input at adapter boundaries with Zod.
   - Prefer structured error codes over ad hoc error strings.
   - Map internal errors to consistent API response shapes.
4. Apply naming
   - Use kebab-case file names.
   - Prefer explicit suffixes (`-command-handler.ts`, `-query-handler.ts`, `-repository-impl.ts`).
5. Pass quality gate
   - Run project validation from `api/`.
   - Address all failures before finalizing.

## Testing

- Maintain repository coverage policy.
- Mirror source structure in tests.
- Mock at infrastructure boundaries for unit tests.
- For API tasks, run validation and coverage commands from `api/`.

## References

- `api/docs/architecture.md`
- `api/docs/coding-conventions.md`
- `api/docs/development-guide.md`
- `api/docs/testing-guide.md`
- `api/docs/firebase-integration.md`
- `api/docs/deployment.md`
