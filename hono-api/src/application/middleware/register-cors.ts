import { cors } from 'hono/cors';
import type { App } from '@app/common/interfaces';

export const registerCors = (app: App) => {
  if (process.env.CORS_ENABLED === 'true') {
    app.use(
      '*',
      cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })
    );
  }
};
