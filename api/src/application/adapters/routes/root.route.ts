import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';

const rootRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
          }),
        },
      },
      description: 'Root status',
    },
  },
});

function registerRoutes(app: OpenAPIHono<AppEnv>): void {
  app.openapi(rootRoute, (c) => {
    return c.json({ status: 'RUNNING' }, 200);
  });
}

/**
 * Route configuration for root routes
 */
export const routeConfiguration: RouteConfiguration = {
  tags: [],
  register: registerRoutes,
};
