import { describe, expect, it } from 'vitest';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { Username } from '@app/modules/auth/domain/value-objects/username';

describe('Username', () => {
  it('creates valid username', () => {
    const username = Username.create('User_1234');
    expect(username.getValue()).toBe('User_1234');
  });

  it('throws when too short', () => {
    expect(() => Username.create('short')).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_SHORT
    );
  });

  it('throws when too long', () => {
    expect(() => Username.create('a'.repeat(21))).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_LONG
    );
  });

  it('throws when username has invalid chars', () => {
    expect(() => Username.create('invalid-name')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('compares usernames by exact value', () => {
    const a = Username.create('User_1234');
    const b = Username.create('User_1234');
    const c = Username.create('user_1234');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('returns tryCreate error for invalid input', () => {
    const result = Username.tryCreate('invalid-name');
    expect(result.username).toBeUndefined();
    expect(result.error?.code).toBe(ValidationErrorCode.FIELD_IS_INVALID);
  });
});
