import { describe, expect, it } from 'vitest';
import { AuthorizationExceptionCode } from '@app/common/enums/authorization-exception-code';
import {
  ADMIN_ROLE,
  AuthorizationService,
} from '@app/common/infrastructure/authorization-service';

describe('AuthorizationService', () => {
  const service = new AuthorizationService();

  const getErrorCode = (fn: () => void): string => {
    try {
      fn();
      return '';
    } catch (error) {
      return (error as { code?: string }).code ?? '';
    }
  };

  it('requires authentication', () => {
    expect(getErrorCode(() => service.requireAuthenticated({} as never))).toBe(
      AuthorizationExceptionCode.UNAUTHORIZED
    );
  });

  it('allows authenticated user', () => {
    expect(() =>
      service.requireAuthenticated({
        user: { userId: 'u1', roles: [] },
      } as never)
    ).not.toThrow();
  });

  it('has admin role helper', () => {
    expect(
      service.hasAdminRole({
        user: { userId: 'u1', roles: [ADMIN_ROLE] },
      } as never)
    ).toBe(true);
    expect(
      service.hasAdminRole({ user: { userId: 'u1', roles: ['USER'] } } as never)
    ).toBe(false);
  });

  it('requires single role unless admin', () => {
    expect(() =>
      service.requireRole('MANAGER', {
        user: { userId: 'u1', roles: ['MANAGER'] },
      } as never)
    ).not.toThrow();

    expect(() =>
      service.requireRole('MANAGER', {
        user: { userId: 'u1', roles: [ADMIN_ROLE] },
      } as never)
    ).not.toThrow();

    expect(
      getErrorCode(() =>
        service.requireRole('MANAGER', {
          user: { userId: 'u1', roles: ['VIEWER'] },
        } as never)
      )
    ).toBe(AuthorizationExceptionCode.FORBIDDEN);
  });

  it('requires one of roles unless admin', () => {
    expect(() =>
      service.requireOneOfRoles(['MANAGER', 'EDITOR'], {
        user: { userId: 'u1', roles: ['EDITOR'] },
      } as never)
    ).not.toThrow();

    expect(() =>
      service.requireOneOfRoles(['MANAGER', 'EDITOR'], {
        user: { userId: 'u1', roles: [ADMIN_ROLE] },
      } as never)
    ).not.toThrow();

    expect(
      getErrorCode(() =>
        service.requireOneOfRoles(['MANAGER', 'EDITOR'], {
          user: { userId: 'u1', roles: ['VIEWER'] },
        } as never)
      )
    ).toBe(AuthorizationExceptionCode.FORBIDDEN);
  });

  it('handles contexts without roles arrays', () => {
    expect(
      getErrorCode(() =>
        service.requireRole('MANAGER', {
          user: { userId: 'u1' },
        } as never)
      )
    ).toBe(AuthorizationExceptionCode.FORBIDDEN);

    expect(
      getErrorCode(() =>
        service.requireOneOfRoles(['MANAGER'], {
          user: { userId: 'u1' },
        } as never)
      )
    ).toBe(AuthorizationExceptionCode.FORBIDDEN);

    expect(service.hasAdminRole({ user: undefined } as never)).toBe(false);
  });
});
