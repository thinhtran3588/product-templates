import { describe, expect, it } from 'vitest';
import { ErrorCodeRegistry } from '@app/common/utils/error-code-registry';

describe('error-code-registry', () => {
  it('registers and resolves status codes', () => {
    const registry = new ErrorCodeRegistry();
    registry.register({ A: 400 });
    registry.register({ B: 404 });

    expect(registry.getStatusCode('A')).toBe(400);
    expect(registry.getStatusCode('B')).toBe(404);
    expect(registry.getStatusCode('UNKNOWN')).toBeUndefined();
  });

  it('returns a copy of mappings', () => {
    const registry = new ErrorCodeRegistry();
    registry.register({ A: 400 });

    const mappings = registry.getAllMappings();
    mappings['A'] = 500;

    expect(registry.getStatusCode('A')).toBe(400);
  });
});
