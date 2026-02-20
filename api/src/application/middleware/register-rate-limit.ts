import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import type { Logger } from '@app/common/domain/interfaces/logger';

/**
 * Registers the rate limiting plugin with the Hono instance
 * @param _app - The Hono instance to register the middleware with
 * @returns void
 */
export function registerRateLimit(
  _app: OpenAPIHono<AppEnv>,
  logger: Logger
): void {
  // Rate limiting should be handled differently in Hono/Cloudflare,
  // Cloudflare provides native Edge rate limiting rules.
  logger.info(
    undefined,
    'Rate limit middleware omitted for Cloudflare compatibility'
  );
}
