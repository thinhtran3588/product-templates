import { OpenAPIHono } from '@hono/zod-openapi';
import { beforeEach, describe, expect, it } from 'vitest';
import { routeConfiguration } from '@app/application/adapters/routes/health.route';
import type { AppEnv } from '@app/application/types/hono.env';

describe('health.route', () => {
  let app: OpenAPIHono<AppEnv>;

  beforeEach(() => {
    app = new OpenAPIHono<AppEnv>();
    routeConfiguration.register(app);
  });

  describe('routeConfiguration', () => {
    it('should have correct tags', () => {
      expect(routeConfiguration.tags).toEqual([
        { name: 'health', description: 'Health check endpoints' },
      ]);
    });

    it('should have register function', () => {
      expect(typeof routeConfiguration.register).toBe('function');
    });
  });

  describe('GET /health - happy path', () => {
    it('should return status ok', async () => {
      const response = await app.request('/health', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ status: 'ok' });
    });

    it('should have correct schema definition', async () => {
      const response = await app.request('/health', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
    });
  });

  describe('GET /health - schema', () => {
    it('should register health endpoint', async () => {
      const response = await app.request('/health', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
    });
  });
});
