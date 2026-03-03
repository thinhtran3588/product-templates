# Development Guide

## Table of Contents

1. [Adding a New Feature](#adding-a-new-feature)
2. [Creating a New Module](#creating-a-new-module)
3. [Common Patterns](#common-patterns)
4. [Testing](#testing)

## Adding a New Feature

### Step 1: Identify the Module

Choose an existing module under `src/modules/` or create a new one if the feature introduces a distinct business domain.

### Step 2: Create Domain Types (if needed)

Add or update value objects, aggregates, and domain services in the module `domain` layer.

### Step 3: Create Use Case

Implement command/query contracts and handlers in the `application` layer.

### Step 4: Register Use Case

Register handlers, repositories, and services in `module-configuration.ts` and container setup.

### Step 5: Create API Adapters

Add REST route(s) and/or GraphQL resolver(s) under `adapters`.

### Step 6: Wire Infrastructure

Implement repository/provider contracts in `infrastructure` and bind them in DI.

### Step 7: Write Tests

Add or update unit tests for domain and handlers, plus adapter-level tests for request/response behavior.

## Creating a New Module

### Module Structure

```text
src/modules/new-module/
  adapters/
  application/
    command-handlers/
    query-handlers/
  domain/
    aggregates/
    value-objects/
    interfaces/
  infrastructure/
    repositories/
    services/
  interfaces/
  module-configuration.ts
```

### Step-by-Step

1. Create module folders with the standard structure.
2. Define domain model and interfaces first.
3. Implement use cases in command/query handlers.
4. Implement infrastructure contracts.
5. Add adapters and schemas.
6. Register everything in module and application containers.
7. Add tests and run validation.

## Common Patterns

### Use Case Pattern

- One handler per command/query.
- Handler constructor receives only required interfaces.
- Return typed results, avoid transport concerns.

### Validation with Zod

- Validate request payloads in adapters.
- Reuse shared schema helpers for pagination, ids, and text fields.

### Resolving Use Cases

- Use DI container and shared resolver utilities.
- Avoid manual wiring in route files.

### Interface Implementation

- Define interfaces in `domain` or `interfaces`.
- Implement in `infrastructure`.
- Keep adapters dependent on use-case contracts only.

## Testing

### Quick Reference

- Domain logic: unit tests
- Command/query handlers: unit tests with mocked dependencies
- Routes/resolvers: adapter tests
- Critical flows: e2e/integration as needed

### Key Points

- Keep tests deterministic and isolated.
- Prefer behavior-focused assertions.
- Maintain the repository coverage policy before merging.
