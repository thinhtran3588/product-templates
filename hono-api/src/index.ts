import { OpenAPIHono } from '@hono/zod-openapi';

import { moduleConfiguration as defaultModule } from './application/default-module.configuration';
import { registerContainer } from './application/middleware/register-container';
import { registerCors } from './application/middleware/register-cors';
import { registerGraphQL } from './application/middleware/register-graphql';
import { registerLogger } from './application/middleware/register-logger';
import { registerRateLimit } from './application/middleware/register-rate-limit';
import { registerSwagger } from './application/middleware/register-swagger';
import type { AppEnv } from './common/interfaces';
import { moduleConfiguration as authModule } from './modules/auth/module.configuration';

const app = new OpenAPIHono<AppEnv>();

// Middlewares
registerContainer(app);
registerLogger(app);
registerCors(app);
registerRateLimit(app);

// Modules
const modules = [defaultModule, authModule];

// Register Module REST Routes
modules.forEach((module) => {
  module.register(app);
});

// Register Swagger and GraphQL
registerGraphQL(app, modules);
registerSwagger(app);

export default app;
