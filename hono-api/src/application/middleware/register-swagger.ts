import { swaggerUI } from '@hono/swagger-ui';
import type { App } from '@app/common/interfaces';

import pkg from '../../../package.json';

export const registerSwagger = (app: App) => {
  if (process.env.SWAGGER_ENABLED === 'true') {
    app.doc('/api.json', {
      openapi: '3.0.0',
      info: {
        version: pkg.version,
        title: 'API',
      },
    });

    app.get('/api', swaggerUI({ url: '/api.json' }));
  }
};
