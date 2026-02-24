import { OpenAPIHono } from '@hono/zod-openapi';

import { createDIContainer, type Container } from './application/container';
import { moduleConfiguration as defaultModule } from './application/default-module-configuration';
import { registerContainer } from './application/middleware/register-container';
import { registerCors } from './application/middleware/register-cors';
import { registerGraphQL } from './application/middleware/register-graphql';
import { registerLogger } from './application/middleware/register-logger';
import { registerRateLimit } from './application/middleware/register-rate-limit';
import { registerSwagger } from './application/middleware/register-swagger';
import type { AppEnv } from './common/interfaces';
import { moduleConfiguration as authModule } from './modules/auth/module-configuration';

const app = new OpenAPIHono<AppEnv<Container>>();
const container = createDIContainer();

// Middlewares
registerContainer(app, container);
registerLogger(app);
registerCors(app);
registerRateLimit(app);

// Modules
const modules = [defaultModule, authModule];

// Register Module Dependencies and Routes
modules.forEach((module) => {
  module.registerDependencies(container);
  module.adapters.forEach((adapter) => {
    adapter.registerRoutes(
      app as unknown as Parameters<typeof adapter.registerRoutes>[0]
    );
  });
});

// Register Swagger and GraphQL
registerGraphQL(app, modules);
registerSwagger(app);

export default app;
