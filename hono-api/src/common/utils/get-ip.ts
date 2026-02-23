import type { AppContext } from '@app/common/interfaces';

/**
 * Extracts the client IP address from request headers.
 * prioritize Cloudflare's connecting IP, then standard forwarding headers.
 *
 * @param c Hono Context
 * @returns Client IP address or '127.0.0.1'
 */
export const getIP = (c: AppContext): string => {
  return (
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-forwarded-for') ||
    c.req.header('x-real-ip') ||
    '127.0.0.1'
  );
};
