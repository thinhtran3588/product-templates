import { validate as isValidUuid } from 'uuid';
import { describe, expect, it } from 'vitest';
import { Uuid } from '@app/common/domain/uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';

describe('Uuid', () => {
  const valid = '550e8400-e29b-41d4-a716-446655440000';

  it('creates valid uuid', () => {
    const uuid = Uuid.create(valid);
    expect(uuid.getValue()).toBe(valid);
  });

  it('throws for missing values', () => {
    // eslint-disable-next-line no-null/no-null
    expect(() => Uuid.create(null)).toThrowError(
      ValidationErrorCode.MISSING_ID
    );
    expect(() => Uuid.create(undefined)).toThrowError(
      ValidationErrorCode.MISSING_ID
    );
    expect(() => Uuid.create('  ')).toThrowError(
      ValidationErrorCode.MISSING_ID
    );
  });

  it('throws for invalid type or value', () => {
    expect(() => Uuid.create(123 as unknown as string)).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
    expect(() => Uuid.create('bad-value')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('uses custom field name in tryCreate errors', () => {
    const result = Uuid.tryCreate(undefined, 'userId');
    expect(result.uuid).toBeUndefined();
    expect(result.error?.data?.['field']).toBe('userId');
  });

  it('compares by value', () => {
    const a = Uuid.create(valid);
    const b = Uuid.create(valid);
    const c = Uuid.generate();
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('generates valid uuid', () => {
    const uuid = Uuid.generate();
    expect(isValidUuid(uuid.getValue())).toBe(true);
  });
});
