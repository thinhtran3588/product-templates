import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import type { App, ModuleConfiguration } from '@app/common/interfaces';

export const moduleConfiguration: ModuleConfiguration = {
  typeDefs: `
    type HealthStatus {
      status: String
    }
    type Query {
      health: HealthStatus
    }
    type Mutation {
      _empty: String
    }
  `,
  resolvers: {
    health: () => ({ status: 'ok' }),
  },
  register(app: App): void {
    // GET /health
    app.openapi(
      createRoute({
        method: 'get',
        path: '/health',
        summary: 'Health check',
        tags: ['health'],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: z.object({
                  status: z.string().openapi({ example: 'ok' }),
                }),
              },
            },
            description: 'Health status',
          },
        },
      }),
      (c) => {
        return c.json({ status: 'ok' });
      }
    );

    // GET / (Hidden from Swagger)
    app.get('/', (c) => {
      return c.json({
        message: 'Server is running!',
      });
    });

    // Sample User Route using Awilix
    app.get('/users', async (c) => {
      const { userController } = c.var.diContainer.cradle;
      return userController.getAllUsers(c);
    });

    app.get('/users/:id', async (c) => {
      const { userController } = c.var.diContainer.cradle;
      return userController.getUser(c);
    });
  },
};
