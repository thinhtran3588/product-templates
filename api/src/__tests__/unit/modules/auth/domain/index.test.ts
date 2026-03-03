import { describe, expect, it } from 'vitest';
import * as authDomain from '@app/modules/auth/domain';

describe('auth domain index exports', () => {
  it('exports key symbols', () => {
    expect(authDomain.User).toBeDefined();
    expect(authDomain.UserGroup).toBeDefined();
    expect(authDomain.Role).toBeDefined();
    expect(authDomain.Email).toBeDefined();
    expect(authDomain.UserStatus).toBeDefined();
  });
});
