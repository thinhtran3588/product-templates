import type { Context } from 'hono';

/**
 * Extracts the client IP address from request headers.
 * prioritize Cloudflare's connecting IP, then standard forwarding headers.
 *
 * @param c Hono Context
 * @returns Client IP address or 'unknown'
 */
export const getIP = (c: Context): string => {
  return (
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-forwarded-for') ||
    c.req.header('x-real-ip') ||
    'unknown'
  );
};
