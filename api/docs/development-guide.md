# Development Guide

This guide provides step-by-step instructions for adding new features and creating new modules following the Clean Architecture, DDD, and CQRS patterns.

## Table of Contents

1. [Adding a New Feature](#adding-a-new-feature)
   - [Step 1: Identify the Module](#step-1-identify-the-module)
   - [Step 2: Define Domain Objects](#step-2-define-domain-objects)
   - [Step 3: Create CQRS Handler](#step-3-create-cqrs-handler)
   - [Step 4: Register Dependencies](#step-4-register-dependencies)
   - [Step 5: Implement Infrastructure](#step-5-implement-infrastructure)
   - [Step 6: Create Adapter](#step-6-create-adapter)
   - [Step 7: Write Tests](#step-7-write-tests)
2. [Creating a New Module](#creating-a-new-module)
   - [Module Structure](#module-structure)
   - [Step-by-Step](#step-by-step)
3. [Common Patterns](#common-patterns)
   - [CQRS Handler Pattern](#cqrs-handler-pattern)
   - [Value Object Pattern](#value-object-pattern)
   - [Interface Implementation](#interface-implementation)
4. [Testing](#testing)

## Adding a New Feature

### Step 1: Identify the Module

Determine which module the feature belongs to:

- `auth` - Authentication and user management
- `books` - Book CRUD and management
- `settings` - User settings
- Or create a new module (see [Creating a New Module](#creating-a-new-module))

### Step 2: Define Domain Objects

Add Value Objects and Aggregates in `src/modules/{module}/domain/`.

#### Value Objects

```typescript
// domain/value-objects/feature-name.ts
export class FeatureName extends ValueObject<string> {
  public static create(name: string): FeatureName {
    validate(name.length >= 3, 'Name too short');
    return new FeatureName(name);
  }
}
```

#### Aggregates

```typescript
// domain/aggregates/feature.ts
export class Feature extends BaseAggregate {
  private constructor(private name: FeatureName) {
    super();
  }

  public static create(name: FeatureName): Feature {
    const feature = new Feature(name);
    feature.registerEvent(new FeatureCreatedEvent(feature.id));
    return feature;
  }
}
```

### Step 3: Create CQRS Handler

Add handler in `src/modules/{module}/application/command-handlers/` or `query-handlers/`.

```typescript
// application/command-handlers/create-feature.command-handler.ts
export class CreateFeatureCommandHandler
  implements CommandHandler<CreateFeatureCommand, CreateFeatureResult>
{
  constructor(private readonly repository: FeatureRepository) {}

  async execute(command: CreateFeatureCommand): Promise<CreateFeatureResult> {
    const name = FeatureName.create(command.name);
    const feature = Feature.create(name);
    await this.repository.save(feature);
    return { id: feature.id };
  }
}
```

### Step 4: Register Dependencies

Update `src/modules/{module}/module-configuration.ts`:

```typescript
// module-configuration.ts
export const moduleConfiguration: ModuleConfiguration = {
  registerDependencies: (container) => {
    container.register({
      featureRepository: asClass(SequelizeFeatureRepository).singleton(),
      createFeatureCommandHandler: asClass(
        CreateFeatureCommandHandler
      ).singleton(),
    });
  },
};
```

### Step 5: Implement Infrastructure

Add Database Models and Repository implementations in `src/modules/{module}/infrastructure/`.

#### Model

```typescript
// infrastructure/models/feature.model.ts
export const modelConfiguration: ModelConfiguration = {
  register: (sequelize) => {
    FeatureModel.init({ ... }, { sequelize });
  },
};
```

#### Repository

```typescript
// infrastructure/repositories/sequelize-feature.repository.ts
export class SequelizeFeatureRepository
  extends BaseRepository<Feature>
  implements FeatureRepository {
  // Implementation using Sequelize models
}
```

### Step 6: Create Adapter

Add HTTP Route or GraphQL Resolver in `src/modules/{module}/adapters/`.

#### Route

```typescript
// adapters/routes/feature.route.ts
export const routeConfiguration: RouteConfiguration = {
  register: (app) => {
    app.post('/features', async (request, reply) => {
      const handler = request.diContainer.resolve(
        'createFeatureCommandHandler'
      );
      const result = await handler.execute(request.body);
      return reply.code(201).send(result);
    });
  },
};
```

### Step 7: Write Tests

Add tests in `src/__tests__/modules/{module}/`.

```typescript
// __tests__/modules/{module}/application/create-feature.command-handler.test.ts
describe('CreateFeatureCommandHandler', () => {
  it('should create a feature successfully', async () => {
    // Test logic
  });
});
```

## Creating a New Module

### Module Structure

```text
modules/{module-name}/
├── domain/                      # Domain layer
│   ├── aggregates/              # Aggregate roots
│   ├── value-objects/           # Value objects
│   ├── interfaces/              # Domain interfaces (repositories/services)
│   └── enums/                   # Domain enums & exception codes
├── application/                 # Application layer
│   ├── command-handlers/        # CQRS write handlers
│   ├── query-handlers/          # CQRS read handlers
│   ├── event-handlers/          # Async event processing
│   └── interfaces/              # Application interfaces (commands/queries)
├── infrastructure/              # Infrastructure layer
│   ├── models/                  # Sequelize models
│   ├── repositories/            # Repository implementations
│   └── services/                # External service implementations
├── adapters/                    # Adapters layer
│   ├── routes/                  # HTTP routes
│   └── graphql/                 # GraphQL schemas & resolvers
└── module-configuration.ts      # DI & Error code registration
```

### Step-by-Step

1. **Create folder structure** following the module convention.
2. **Define domain** (Aggregates, Value Objects, Repository interfaces).
3. **Implement infrastructure** (Sequelize models, Repository implementations).
4. **Create application logic** (Command/Query handlers, interfaces).
5. **Register dependencies** in `module-configuration.ts`.
6. **Expose via adapters** (Routes or GraphQL Resolvers).
7. **Write tests** mirroring the structure in `src/__tests__/`.

## Common Patterns

### CQRS Handler Pattern

```typescript
export class MyCommandHandler implements CommandHandler<MyCommand, MyResult> {
  constructor(private readonly dependency: IDependency) {}

  async execute(command: MyCommand, context: AppContext): Promise<MyResult> {
    // 1. Validate
    // 2. Load Aggregate
    // 3. Execute logic
    // 4. Save & Publish events
    return result;
  }
}
```

### Value Object Pattern

```typescript
export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(email: string): Email {
    if (!isValid(email)) throw new ValidationException('Invalid email');
    return new Email(email.toLowerCase());
  }
}
```

### Interface Implementation

```typescript
// domain/interfaces/repositories/user-repository.ts
export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: Uuid): Promise<User | null>;
}

// infrastructure/repositories/sequelize-user-repository.ts
export class SequelizeUserRepository
  extends BaseRepository<User>
  implements UserRepository {
  // Implementation details
}
```

## Testing

### Quick Reference

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm test`              | Run all tests                            |
| `npm run test:coverage` | Run with coverage report (100% required) |
| `npm run validate`      | Full validation (lint + format + tests)  |

### Key Points

- **100% code coverage** is strictly enforced.
- Tests mirror source structure in `src/__tests__/`.
- Use `npm run validate` before every commit.
