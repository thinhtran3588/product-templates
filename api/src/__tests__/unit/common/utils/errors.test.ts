import { describe, expect, it } from 'vitest';
import { BusinessError, ValidationError } from '@app/common/utils/errors';

describe('errors', () => {
  it('creates business and validation errors', () => {
    const b = new BusinessError('CODE', { a: 1 }, 'message');
    expect(b.name).toBe('BusinessError');
    expect(b.code).toBe('CODE');
    expect(b.data).toEqual({ a: 1 });
    expect(b.message).toBe('message');

    const v = new ValidationError('VCODE', { b: 2 });
    expect(v.name).toBe('ValidationError');
    expect(v.code).toBe('VCODE');
    expect(v.data).toEqual({ b: 2 });
    expect(v.message).toBe('VCODE');
  });

  it('works when Error.captureStackTrace is unavailable', () => {
    const original = (Error as { captureStackTrace?: unknown })
      .captureStackTrace;
    delete (Error as { captureStackTrace?: unknown }).captureStackTrace;

    const error = new BusinessError('CODE');
    expect(error.message).toBe('CODE');
    const validation = new ValidationError('VCODE');
    expect(validation.message).toBe('VCODE');

    (Error as { captureStackTrace?: unknown }).captureStackTrace = original;
  });
});
