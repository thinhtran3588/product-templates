import type { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { webConfig } from '@app/application/config/web.config';
import type { AppEnv } from '@app/application/types/hono.env';

/**
 * Registers the CORS middleware with the Hono instance
 * @param app - The Hono instance to register the middleware with
 * @returns void
 */
export function registerCors(app: OpenAPIHono<AppEnv>): void {
  const {
    cors: { enabled, origins },
  } = webConfig();

  if (!enabled) {
    return;
  }

  app.use(
    '*',
    cors({
      origin: origins?.length ? origins : '*',
      credentials: true,
    })
  );
}
