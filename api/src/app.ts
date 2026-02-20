// Load environment variables first (before any other imports that might use them)
// This must be the first import to ensure env vars are loaded before other modules access process.env
import '@app/common/utils/load-env';

import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { createDIContainer } from '@app/application/container';
import {
  initializeReadDatabase,
  initializeWriteDatabase,
} from '@app/application/database';
import { attachAppContext } from '@app/application/middleware/attach-app-context';
import { errorHandler } from '@app/application/middleware/error.handler';
import { notFoundHandler } from '@app/application/middleware/not-found.handler';
import { registerCors } from '@app/application/middleware/register-cors';
import { registerGraphQL } from '@app/application/middleware/register-graphql';
import { registerRateLimit } from '@app/application/middleware/register-rate-limit';
import { registerSwagger } from '@app/application/middleware/register-swagger';
import { discoverModules } from '@app/application/module-discovery';
import type { AppEnv } from '@app/application/types/hono.env';
import type { Logger } from '@app/common/domain/interfaces/logger';
import { AuthorizationExceptionCode } from '@app/common/enums/authorization-exception-code';
import { SystemExceptionCode } from '@app/common/enums/system-exception-code';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { ConsoleLogger } from '@app/common/infrastructure/logger';
import { modelConfiguration as domainEventModelConfiguration } from '@app/common/infrastructure/models/domain-event.model';
import { ErrorCodeRegistry } from '@app/common/utils/error-code-registry';
import type { ExternalAuthenticationService } from '@app/modules/auth/domain/interfaces/services/external-authentication.service';

/**
 * Creates and configures the Hono application instance
 * This function is exported for testing purposes
 */
export async function createApp(): Promise<OpenAPIHono<AppEnv>> {
  const logger = new ConsoleLogger();
  const app = new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'VALIDATION_ERROR',
            data: {
              validation:
                (result.error as any).issues || (result.error as any).errors,
            },
          },
          400
        );
      }
      return;
    },
  });

  // Create error code registry
  const errorCodeRegistry = new ErrorCodeRegistry();
  // Register application-level error codes (shared across all modules)
  errorCodeRegistry.register({
    [AuthorizationExceptionCode.UNAUTHORIZED]: 401,
    [AuthorizationExceptionCode.FORBIDDEN]: 403,
    [AuthorizationExceptionCode.INSUFFICIENT_PERMISSIONS]: 403,
    [AuthorizationExceptionCode.INVALID_TOKEN]: 401,
    [ValidationErrorCode.ENTITY_NOT_FOUND]: 404,
    [ValidationErrorCode.ENTITY_ALREADY_EXISTS]: 400,
    [ValidationErrorCode.FIELD_IS_REQUIRED]: 400,
    [ValidationErrorCode.FIELD_IS_INVALID]: 400,
    [ValidationErrorCode.FIELD_IS_TOO_SHORT]: 400,
    [ValidationErrorCode.FIELD_IS_TOO_LONG]: 400,
    [ValidationErrorCode.FIELD_BELOW_MIN_VALUE]: 400,
    [ValidationErrorCode.FIELD_ABOVE_MAX_VALUE]: 400,
    [ValidationErrorCode.OUTDATED_VERSION]: 409,
    [SystemExceptionCode.INTERNAL_ERROR]: 500,
    [SystemExceptionCode.DATA_CORRUPTION_ERROR]: 400,
  });

  // Discover modules
  const {
    modules,
    models,
    modelAssociations,
    routes,
    graphqlSchemas,
    graphqlResolvers,
    moduleNames,
  } = await discoverModules();

  logger.info(
    undefined,
    `Discovered ${modules.length} module(s): ${moduleNames.join(', ')}`
  );

  // Initialize databases
  const readDatabase = initializeReadDatabase(logger);
  const writeDatabase = initializeWriteDatabase(logger);
  logger.info(undefined, 'Read database initialized');
  logger.info(undefined, 'Write database initialized');

  // Create and register dependency injection container
  const container = createDIContainer(writeDatabase, readDatabase, logger);

  // Set the global diContainer via a middleware so all routes have access to it
  app.use('*', async (c, next) => {
    c.set('diContainer', container);
    await next();
  });

  logger.info(undefined, 'Dependency injection container created');

  // Register models with read database first
  for (const model of models) {
    model.register(readDatabase);
  }
  domainEventModelConfiguration.register(readDatabase);

  // Register models with write database second
  for (const model of models) {
    model.register(writeDatabase);
  }
  domainEventModelConfiguration.register(writeDatabase);

  for (const modelAssociation of modelAssociations) {
    modelAssociation.register();
  }
  logger.info(undefined, 'Database models and associations registered');

  // Register middleware
  registerCors(app);
  registerRateLimit(app, logger);

  // Wait, graphql schemas
  await registerGraphQL(app, graphqlSchemas, graphqlResolvers, logger);

  const tags = routes.flatMap((route) => route.tags);
  registerSwagger(app, tags);

  app.onError((error, c) => {
    const res = errorHandler(error, c, errorCodeRegistry, logger);
    if (res) return res;
    return c.json({ error: 'INTERNAL_SERVER_ERROR' }, 500);
  });
  app.notFound(notFoundHandler);

  logger.info(undefined, 'Middleware registered');

  // Register modules
  for (const module of modules) {
    module.registerDependencies(container);
    module.registerErrorCodes(errorCodeRegistry);
  }
  logger.info(undefined, 'Modules registered');

  // Register routes
  for (const route of routes) {
    route.register(app);
  }
  logger.info(undefined, 'Routes registered');

  // Initialize external services
  const externalAuthenticationService: ExternalAuthenticationService =
    container.resolve('externalAuthenticationService');
  externalAuthenticationService.initialize();
  logger.info(undefined, 'External authentication service initialized');

  container.resolve('jwtService').initialize();
  logger.info(undefined, 'JWT service initialized');

  // Register global hook to extract application context
  app.use('*', attachAppContext);

  return app;
}

/**
 * Starts the server.
 * This function is exported for testing purposes
 */
export async function startServer(
  app: OpenAPIHono<AppEnv>,
  logger?: Logger
): Promise<void> {
  const log = logger ?? new ConsoleLogger();
  try {
    const portEnv = process.env['PORT'] ?? '8080';
    const portNumber = Number(portEnv);
    const port =
      Number.isNaN(portNumber) || portNumber <= 0 ? 8080 : portNumber;
    const host = process.env['HOST'] ?? '0.0.0.0';

    serve(
      {
        fetch: app.fetch,
        port,
        hostname: host,
      },
      (info) => {
        log.info(
          undefined,
          `Server listening at http://${info.address}:${info.port}`
        );
      }
    );
  } catch (err) {
    log.error({ err }, 'Error starting server');
    process.exit(1);
  }
}
