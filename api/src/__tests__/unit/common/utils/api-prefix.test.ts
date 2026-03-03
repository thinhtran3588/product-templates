import { describe, expect, it } from 'vitest';
import { getApiPrefix, withApiPrefix } from '@app/common/utils/api-prefix';

describe('api-prefix', () => {
  it('returns default API prefix when env is undefined', () => {
    delete process.env['API_PREFIX'];
    expect(getApiPrefix()).toBe('/api');
  });

  it('normalizes prefix and handles root slash', () => {
    process.env['API_PREFIX'] = ' api/v1/ ';
    expect(getApiPrefix()).toBe('/api/v1');

    process.env['API_PREFIX'] = '/';
    expect(getApiPrefix()).toBe('');
  });

  it('prefixes paths correctly', () => {
    process.env['API_PREFIX'] = '/api/v1';
    expect(withApiPrefix('/users')).toBe('/api/v1/users');
    expect(withApiPrefix('users')).toBe('/api/v1/users');
    expect(withApiPrefix('/')).toBe('/api/v1/');
  });

  it('does not double-prefix already prefixed paths', () => {
    process.env['API_PREFIX'] = '/api';
    expect(withApiPrefix('/api/users')).toBe('/api/users');
    expect(withApiPrefix('/api.status')).toBe('/api.status');
    expect(withApiPrefix('/api')).toBe('/api');
  });

  it('returns normalized path when prefix is empty', () => {
    process.env['API_PREFIX'] = '/';
    expect(withApiPrefix('users/')).toBe('/users');
  });
});
