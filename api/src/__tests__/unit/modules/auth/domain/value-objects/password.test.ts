import { describe, expect, it } from 'vitest';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { Password } from '@app/modules/auth/domain/value-objects/password';

describe('Password', () => {
  it('creates valid password', () => {
    const password = Password.create('Strong1!');
    expect(password.getValue()).toBe('Strong1!');
  });

  it('throws when empty', () => {
    expect(() => Password.create('')).toThrowError(
      ValidationErrorCode.FIELD_IS_REQUIRED
    );
  });

  it('throws when too short', () => {
    expect(() => Password.create('Ab1!')).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_SHORT
    );
  });

  it('throws when too long', () => {
    expect(() => Password.create(`${'A'.repeat(18)}a1!`)).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_LONG
    );
  });

  it('throws when regex requirements are not met', () => {
    expect(() => Password.create('alllowercase1!')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
    expect(() => Password.create('ALLUPPERCASE1!')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
    expect(() => Password.create('NoDigits!!')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
    expect(() => Password.create('NoSpecial1')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('returns tryCreate error details for invalid value', () => {
    const result = Password.tryCreate('NoSpecial1');
    expect(result.password).toBeUndefined();
    expect(result.error?.code).toBe(ValidationErrorCode.FIELD_IS_INVALID);
  });
});
