import { describe, expect, it } from 'vitest';
import { ValidationException } from '@app/common/utils/errors';
import { validate } from '@app/common/utils/validate';

describe('validate', () => {
  it('does nothing for true boolean expression', () => {
    expect(() => validate(true)).not.toThrow();
  });

  it('throws ValidationException for false with string', () => {
    expect(() => validate(false, 'ERROR_CODE')).toThrowError('ERROR_CODE');
  });

  it('throws provided ValidationException for false', () => {
    const error = new ValidationException('CUSTOM_ERROR');
    expect(() => validate(false, error)).toThrow(error);
  });

  it('throws expression.error for object expression', () => {
    const error = new ValidationException('OBJECT_ERROR');
    expect(() => validate({ error })).toThrow(error);
  });

  it('does nothing for object expression without error', () => {
    expect(() => validate({ value: 1 })).not.toThrow();
  });
});
