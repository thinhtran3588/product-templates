import { describe, expect, it } from 'vitest';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { validateUuid } from '@app/common/utils/validate-uuid';

describe('validate-uuid', () => {
  const validUuid = '550e8400-e29b-41d4-a716-446655440000';

  it('throws if required and undefined', () => {
    expect(() =>
      validateUuid(undefined, { field: 'id', required: true })
    ).toThrowError(ValidationErrorCode.FIELD_IS_REQUIRED);
  });

  it('returns undefined if optional and undefined', () => {
    expect(
      validateUuid(undefined, { field: 'id', required: false })
    ).toBeUndefined();
  });

  it('throws if non-string value', () => {
    expect(() =>
      validateUuid(123 as unknown as string, { field: 'id' })
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws if required and empty string', () => {
    expect(() =>
      validateUuid('   ', { field: 'id', required: true })
    ).toThrowError(ValidationErrorCode.FIELD_IS_REQUIRED);
  });

  it('returns undefined if optional and empty string', () => {
    expect(
      validateUuid('   ', { field: 'id', required: false })
    ).toBeUndefined();
  });

  it('throws if invalid uuid format', () => {
    expect(() => validateUuid('invalid-uuid', { field: 'id' })).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('returns trimmed uuid when valid', () => {
    expect(
      validateUuid(`  ${validUuid}  `, { field: 'id', required: true })
    ).toBe(validUuid);
  });
});
