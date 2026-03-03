# Coding Conventions

## Table of Contents

1. [Routing (Transport Only)](#routing-transport-only)
2. [Commands, Queries, and Mutations](#commands-queries-and-mutations)
3. [File and Folder Conventions](#file-and-folder-conventions)
4. [Validation and Schemas](#validation-and-schemas)
5. [Error Messages and Localization Readiness](#error-messages-and-localization-readiness)

## Routing (Transport Only)

Adapters define transport contracts and delegate business logic to handlers. Routes and resolvers should not contain business rules.

### Route Example

```ts
export const registerUserRoute = createApiRoute({
  method: "post",
  path: "/users",
  request: {
    body: createBodySchema(createUserSchema),
  },
  handler: async (c) => {
    const body = c.req.valid("json");
    const commandBus = c.get("commandBus");
    await commandBus.execute(new CreateUserCommand(body));
    return c.json({ success: true }, 201);
  },
});
```

## Commands, Queries, and Mutations

- Use command handlers for state changes.
- Use query handlers for read operations.
- Keep handlers small and focused on one use case.
- Never query database models directly from adapters.

## File and Folder Conventions

### Naming

- Use kebab-case for file names.
- Use explicit suffixes: `-command-handler.ts`, `-query-handler.ts`, `-repository-impl.ts`.
- Keep interface names noun-based and implementation names `*-impl`.

### Types and DTOs

- Place API contracts in adapter or interfaces folders.
- Keep domain types in `domain`.
- Keep persistence-specific types in `infrastructure`.

### Folder Structure

- Follow module boundaries under `src/modules/{module}`.
- Avoid cross-module imports unless through explicit interfaces.
- Keep shared utilities under `src/common`.

## Validation and Schemas

- Validate all external input at adapter boundaries.
- Re-validate critical business invariants in domain/value objects.
- Use shared schema helpers in `src/common/utils` for consistency.

### Example

```ts
const parsed = createUserSchema.safeParse(payload);
if (!parsed.success) {
  throw createValidationError(parsed.error);
}
```

## Error Messages and Localization Readiness

- Prefer structured error codes over free-text-only messages.
- Map internal exceptions to stable API error responses.
- Keep message text clear and user-facing when returned to clients.

### Example

```ts
throw createApplicationError({
  code: "AUTH_INVALID_CREDENTIALS",
  message: "Invalid email or password.",
});
```
