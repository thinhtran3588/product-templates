import type { MiddlewareHandler } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import type { App, AppContext } from '@app/common/interfaces';
import { getIP } from '@app/common/utils/get-ip';

let limiter: MiddlewareHandler | undefined;

export const registerRateLimit = (app: App) => {
  if (process.env.RATE_LIMIT_ENABLED === 'true') {
    app.use('*', async (c: AppContext, next) => {
      if (!limiter) {
        limiter = rateLimiter({
          windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000,
          limit: Number(process.env.RATE_LIMIT_MAX) || 100,
          standardHeaders: 'draft-6',
          keyGenerator: (c: AppContext) => getIP(c),
        });
      }
      return limiter(c, next);
    });
  }
};
