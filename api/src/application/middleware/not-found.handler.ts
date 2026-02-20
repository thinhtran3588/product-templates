import type { Context } from 'hono';

/**
 * Not found handler middleware for Hono
 * Handles 404 errors when routes are not found
 */
export function notFoundHandler(c: Context): Response {
  return c.json(
    {
      message: `Route ${c.req.method}:${c.req.path} not found`,
      error: 'Not Found',
    },
    404
  );
}
