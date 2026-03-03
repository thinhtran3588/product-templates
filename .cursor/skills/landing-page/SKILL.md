---
name: landing-page
description: Conventions, architecture, and code style for the landing-page template. Use when making changes under landing-page/.
---

# Landing Page Conventions

## Workflow

For all code changes, follow `.cursor/rules/development-flow.mdc`.

## Architecture

Clean Architecture with modular structure.

- Domain: types, schemas, interfaces
- Application: use cases (Awilix-resolved)
- Infrastructure: service/repository implementations
- Presentation: pages, components, hooks

All application code lives in `landing-page/src/`. `landing-page/app/` is routing only.

## Module Structure

```text
src/modules/{module}/
├── domain/
├── application/
├── infrastructure/
├── presentation/
└── module-configuration.ts
```

## Naming and Style

- Use kebab-case for files/folders.
- Prefer Server Components; add `"use client"` only when necessary.
- Keep client boundaries as low as possible.

## Key Patterns

- Forms: React Hook Form + Zod (`zodResolver`)
- DI: resolve through container and register in `module-configuration.ts`
- i18n: next-intl (`getTranslations`/`useTranslations`)

## Testing

- Maintain repository coverage policy.
- Mirror `src/` structure under tests.
- Prefer behavior-driven assertions and service-boundary mocks.

## References

- `landing-page/docs/architecture.md`
- `landing-page/docs/coding-conventions.md`
- `landing-page/docs/testing-guide.md`
