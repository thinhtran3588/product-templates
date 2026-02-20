import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  tags: ['health'],
  description: 'Health check endpoint',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
          }),
        },
      },
      description: 'Health check response',
    },
  },
});

function registerRoutes(app: OpenAPIHono<AppEnv>): void {
  // Health check route
  app.openapi(healthRoute, (c) => {
    return c.json({ status: 'ok' }, 200);
  });
}

/**
 * Route configuration for health check routes
 */
export const routeConfiguration: RouteConfiguration = {
  tags: [{ name: 'health', description: 'Health check endpoints' }],
  register: registerRoutes,
};
