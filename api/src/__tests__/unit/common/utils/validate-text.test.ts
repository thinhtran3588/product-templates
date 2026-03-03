import { describe, expect, it } from 'vitest';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { validateText } from '@app/common/utils/validate-text';

describe('validate-text', () => {
  it('throws if required and undefined', () => {
    expect(() =>
      validateText(undefined, { field: 'name', required: true })
    ).toThrowError(ValidationErrorCode.FIELD_IS_REQUIRED);
  });

  it('returns undefined if optional and undefined', () => {
    expect(
      validateText(undefined, { field: 'name', required: false })
    ).toBeUndefined();
  });

  it('throws if non-string value', () => {
    expect(() =>
      validateText(123 as unknown as string, { field: 'name' })
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws if required and empty string', () => {
    expect(() =>
      validateText('', { field: 'name', required: true })
    ).toThrowError(ValidationErrorCode.FIELD_IS_REQUIRED);
  });

  it('returns undefined if empty and optional', () => {
    expect(
      validateText('', { field: 'name', required: false })
    ).toBeUndefined();
  });

  it('throws if below minLength', () => {
    expect(() =>
      validateText('ab', { field: 'name', minLength: 3 })
    ).toThrowError(ValidationErrorCode.FIELD_IS_TOO_SHORT);
  });

  it('throws if above maxLength', () => {
    expect(() =>
      validateText('abcdef', { field: 'name', maxLength: 5 })
    ).toThrowError(ValidationErrorCode.FIELD_IS_TOO_LONG);
  });

  it('returns original value when valid', () => {
    expect(
      validateText('abc', { field: 'name', minLength: 1, maxLength: 5 })
    ).toBe('abc');
  });
});
