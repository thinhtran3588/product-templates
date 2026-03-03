import { describe, expect, it } from 'vitest';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { Email } from '@app/modules/auth/domain/value-objects/email';

describe('Email', () => {
  it('creates valid email and normalizes case/whitespace', () => {
    const email = Email.create('  User.Name+tag@Example.COM  ');
    expect(email.getValue()).toBe('user.name+tag@example.com');
  });

  it('throws when email is empty', () => {
    expect(() => Email.create('   ')).toThrowError(
      ValidationErrorCode.FIELD_IS_REQUIRED
    );
  });

  it('throws when email format is invalid', () => {
    expect(() => Email.create('invalid-email')).toThrowError(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('returns tryCreate error for invalid email', () => {
    const result = Email.tryCreate('bad@');
    expect(result.email).toBeUndefined();
    expect(result.error?.code).toBe(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('compares emails case-insensitively', () => {
    const a = Email.create('hello@example.com');
    const b = Email.create('HELLO@example.com');
    expect(a.equals(b)).toBe(true);
  });
});
