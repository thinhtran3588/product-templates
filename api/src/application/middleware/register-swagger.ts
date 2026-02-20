import { swaggerUI } from '@hono/swagger-ui';
import type { OpenAPIHono } from '@hono/zod-openapi';
import {
  swaggerConfig,
  swaggerUiConfig,
} from '@app/application/config/swagger.config';
import type { AppEnv } from '@app/application/types/hono.env';
import type { RouteTag } from '@app/common/interfaces/configuration';

/**
 * Registers the Swagger middleware with the Hono instance
 * @param app - The Hono instance to register the middleware with
 * @param tags - The tags to register with the Swagger middleware
 * @returns void
 */
export function registerSwagger(
  app: OpenAPIHono<AppEnv>,
  tags: RouteTag[]
): void {
  const enableSwagger = process.env['SWAGGER_ENABLED'] === 'true';
  if (!enableSwagger) {
    return;
  }

  const config = swaggerConfig().openapi;
  const ui = swaggerUiConfig();

  app.doc('/openapi.json', {
    openapi: config.openapi,
    info: config.info,
    servers: config.servers,
    security: [],
    tags: tags as any,
  });

  app.get(
    ui.routePrefix,
    swaggerUI({
      url: '/openapi.json',
    })
  );
}
