import { describe, expect, it } from 'vitest';
import { extractBaseAggregateParams } from '@app/common/infrastructure/extract-base-aggregate-params';

describe('extractBaseAggregateParams', () => {
  it('maps model data to aggregate params', () => {
    const result = extractBaseAggregateParams({
      id: '550e8400-e29b-41d4-a716-446655440000',
      version: 3,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      lastModifiedAt: new Date('2026-01-02T00:00:00.000Z'),
      createdBy: '660e8400-e29b-41d4-a716-446655440000',
      lastModifiedBy: '770e8400-e29b-41d4-a716-446655440000',
    });

    expect(result.id.getValue()).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(result.version).toBe(3);
    expect(result.createdBy?.getValue()).toBe(
      '660e8400-e29b-41d4-a716-446655440000'
    );
    expect(result.lastModifiedBy?.getValue()).toBe(
      '770e8400-e29b-41d4-a716-446655440000'
    );
  });

  it('applies defaults for nullables', () => {
    const nullable = JSON.parse('null') as null;
    const result = extractBaseAggregateParams({
      id: '550e8400-e29b-41d4-a716-446655440000',
      version: nullable,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      lastModifiedAt: nullable,
      createdBy: nullable,
      lastModifiedBy: nullable,
    });

    expect(result.version).toBe(0);
    expect(result.lastModifiedAt).toBeUndefined();
    expect(result.createdBy).toBeUndefined();
    expect(result.lastModifiedBy).toBeUndefined();
  });
});
