import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { graphqlConfig } from '@app/application/config/graphql.config';

describe('graphqlConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('happy path', () => {
    it('should return graphql configuration with endpoint', () => {
      const config = graphqlConfig();

      expect(config).toHaveProperty('endpoint');
      expect(config.endpoint).toBe('/graphql');
    });

    it('should use default endpoint when GRAPHQL_ENDPOINT is not set', () => {
      delete process.env['GRAPHQL_ENDPOINT'];

      const config = graphqlConfig();

      expect(config.endpoint).toBe('/graphql');
    });

    it('should use custom endpoint when GRAPHQL_ENDPOINT is set', () => {
      process.env['GRAPHQL_ENDPOINT'] = '/api/graphql';

      const config = graphqlConfig();

      expect(config.endpoint).toBe('/api/graphql');
    });
  });
});
