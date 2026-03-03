# Testing Guide

## Table of Contents

1. [Overview](#overview)
2. [Test Configuration](#test-configuration)
3. [Test Organization](#test-organization)
4. [Test Types](#test-types)
5. [Writing Tests](#writing-tests)
6. [Test Utilities](#test-utilities)
7. [Coverage Requirements](#coverage-requirements)
8. [Running Tests](#running-tests)
9. [Best Practices](#best-practices)

## Overview

The API test strategy prioritizes fast feedback for business logic and stable contracts at adapter boundaries.

### Key Principles

- Test behavior, not implementation details.
- Keep tests deterministic and isolated.
- Mock external dependencies at infrastructure boundaries.
- Cover both success and failure paths.

## Test Configuration

- Test runner: Vitest
- Coverage provider: V8
- Setup file: shared setup under `src/__tests__/test-utils/`

Use a dedicated test environment and avoid production credentials.

## Test Organization

Tests are grouped by layer and module to mirror production code structure.

```text
src/__tests__/
  unit/
    common/
    modules/
  e2e/
```

### File Naming

Use `*.test.ts` and keep names aligned with source files where practical.

## Test Types

### Unit Tests

- Domain aggregates and value objects
- Command and query handlers
- Utility and helper functions

### Component Tests

For API context, component-level tests focus on adapters (route/resolver behavior) with mocked dependencies.

### Integration Tests

Use integration/e2e tests for critical end-to-end flows that span adapters, handlers, and infrastructure.

## Writing Tests

### Use Case Tests

Follow Arrange-Act-Assert:

1. Arrange dependencies and fixtures.
2. Act by executing one handler/use case.
3. Assert on output, side effects, and emitted errors/events.

### Component Tests

For adapters, assert:

- request validation behavior
- status codes and response schema
- command/query dispatch behavior

### Schema Tests

Validate Zod/OpenAPI schemas for expected acceptance and rejection cases.

## Test Utilities

Use reusable builders/factories for aggregate setup and command/query inputs. Keep helpers focused and explicit.

### Example Setup

```ts
beforeEach(() => {
  vi.clearAllMocks();
  repository = createMockUserRepository();
  handler = new CreateUserCommandHandler(repository, eventDispatcher);
});
```

## Coverage Requirements

This repository enforces a high coverage standard for API code. Keep coverage at required thresholds before merging.

### Branch Coverage

Cover conditional paths, guard clauses, and error branches.

### Coverage Exclusions

Exclude only generated or framework bootstrap files when necessary.

## Running Tests

```bash
bun run test
bun run test:coverage
bun run test:unit
bun run test:e2e
```

## Best Practices

- Keep one core behavior focus per test.
- Prefer explicit fixtures over hidden global state.
- Assert domain rules through public API/use-case methods.
- Ensure error code assertions are stable and meaningful.
