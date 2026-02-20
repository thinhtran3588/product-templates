import { OpenAPIHono } from '@hono/zod-openapi';
import { beforeEach, describe, expect, it } from 'vitest';
import { routeConfiguration } from '@app/application/adapters/routes/root.route';
import type { AppEnv } from '@app/application/types/hono.env';

describe('root.route', () => {
  let app: OpenAPIHono<AppEnv>;

  beforeEach(() => {
    app = new OpenAPIHono<AppEnv>();
    routeConfiguration.register(app);
  });

  describe('routeConfiguration', () => {
    it('should have empty tags array', () => {
      expect(routeConfiguration.tags).toEqual([]);
    });

    it('should have register function', () => {
      expect(typeof routeConfiguration.register).toBe('function');
    });
  });

  describe('GET / - happy path', () => {
    it('should return status RUNNING', async () => {
      const response = await app.request('/', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ status: 'RUNNING' });
    });

    it('should return application/json content type', async () => {
      const response = await app.request('/', {
        method: 'GET',
      });

      expect(response.headers.get('content-type')).toContain(
        'application/json'
      );
    });
  });

  describe('GET / - schema', () => {
    it('should register root endpoint', async () => {
      const response = await app.request('/', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
    });
  });
});
