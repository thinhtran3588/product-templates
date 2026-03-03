import { describe, expect, it } from 'vitest';
import { AuthorizationExceptionCode } from '@app/common/enums/authorization-exception-code';
import { getStatusCodeFromErrorCode } from '@app/common/utils/get-status-code-from-error-code';

describe('get-status-code-from-error-code', () => {
  it('returns 401 for unauthorized codes', () => {
    expect(
      getStatusCodeFromErrorCode(AuthorizationExceptionCode.UNAUTHORIZED)
    ).toBe(401);
    expect(
      getStatusCodeFromErrorCode(AuthorizationExceptionCode.INVALID_TOKEN)
    ).toBe(401);
  });

  it('returns 403 for forbidden codes', () => {
    expect(
      getStatusCodeFromErrorCode(AuthorizationExceptionCode.FORBIDDEN)
    ).toBe(403);
    expect(
      getStatusCodeFromErrorCode(
        AuthorizationExceptionCode.INSUFFICIENT_PERMISSIONS
      )
    ).toBe(403);
  });

  it('returns 404 for *_NOT_FOUND and 400 otherwise', () => {
    expect(getStatusCodeFromErrorCode('USER_NOT_FOUND')).toBe(404);
    expect(getStatusCodeFromErrorCode('BAD_REQUEST')).toBe(400);
  });
});
