import { swaggerUI } from '@hono/swagger-ui';
import type { App } from '@app/common/interfaces';

export const registerSwagger = (app: App) => {
  if (process.env.SWAGGER_ENABLED === 'true') {
    app.doc('/api.json', {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Hono API',
      },
    });

    app.get('/api', swaggerUI({ url: '/api.json' }));
  }
};
