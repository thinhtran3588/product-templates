import { rateLimiter } from 'hono-rate-limiter';
import type { App } from '@app/common/interfaces';

export const registerRateLimit = (app: App) => {
  if (process.env.RATE_LIMIT_ENABLED === 'true') {
    app.use(
      '*',
      rateLimiter({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000,
        limit: Number(process.env.RATE_LIMIT_MAX) || 100,
        standardHeaders: 'draft-6',
        keyGenerator: (c) => c.req.header('x-forwarded-for') || '127.0.0.1',
      })
    );
  }
};
