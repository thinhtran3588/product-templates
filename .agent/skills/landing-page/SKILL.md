---
description: Conventions, architecture, and code style for the landing-page template. Use when making code changes to files under landing-page/.
---

# Landing Page Conventions

## Architecture

Clean Architecture with modular structure. All code lives in `landing-page/src/`; `landing-page/app/` is routing only.

- **Domain** (`domain/`): Types, Zod schemas, interfaces — no dependencies
- **Application** (`application/`): Use cases extending `BaseUseCase`, resolved via Awilix DI
- **Infrastructure** (`infrastructure/`): Services/repositories implementing domain interfaces
- **Presentation** (`presentation/`): Pages, components, hooks — depends on Application + Domain

## Module Structure

```
src/modules/{module}/
├── domain/          # types.ts, schemas.ts, interfaces.ts
├── application/     # {name}-use-case.ts
├── infrastructure/  # services/, repositories/
├── presentation/    # pages/, components/, hooks/
└── module-configuration.ts  # DI registration
```

## Naming & Style

- All files/folders: **kebab-case** (e.g. `submit-contact-form-use-case.ts`)
- Components with props: define a props type. Without props: no props type/parameter
- Default to Server Components; add `"use client"` only for hooks/browser APIs/Zustand
- Keep `"use client"` as low as possible (leaf components)

## Key Patterns

- **Forms**: React Hook Form + Zod (`zodResolver`), submit via use case `execute()`
- **DI**: Awilix container; resolve with `useContainer()` hook; register in `module-configuration.ts`
- **i18n**: next-intl — `getTranslations()` (server), `useTranslations()` (client)
- **Validation**: Always run `npm run validate` in `landing-page/` before committing (lint + format + test:coverage + build)

## Testing

- **100% coverage** required (lines, functions, branches, statements)
- Tests mirror `src/` structure in `src/__tests__/`
- Vitest + React Testing Library; mock at service boundary
- Prefer queries by role/label over `data-testid`

## References

- [Architecture](landing-page/docs/architecture.md)
- [Coding Conventions](landing-page/docs/coding-conventions.md)
- [Testing Guide](landing-page/docs/testing-guide.md)
