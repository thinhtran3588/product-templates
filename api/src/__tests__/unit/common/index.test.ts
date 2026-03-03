import { describe, expect, it } from 'vitest';
import * as common from '@app/common';

describe('common index exports', () => {
  it('exports key symbols', () => {
    expect(common.validate).toBeTypeOf('function');
    expect(common.Uuid).toBeDefined();
    expect(common.BaseAggregate).toBeDefined();
    expect(common.includeRouteSchemas).toBeTypeOf('function');
  });
});
