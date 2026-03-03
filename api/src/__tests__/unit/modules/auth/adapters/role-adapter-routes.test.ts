/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
import { describe, expect, it, vi } from 'vitest';
import { roleAdapter } from '@app/modules/auth/adapters/role-adapter';

const createContext = (
  values: Record<string, unknown>,
  cradle: Record<string, unknown>
) => {
  return {
    req: {
      valid: (type: string) => values[type],
    },
    json: vi.fn((payload: unknown, status: number) => ({ payload, status })),
    var: {
      user: { id: 'operator-id' },
      container: { cradle },
    },
  };
};

describe('roleAdapter routes and resolvers', () => {
  it('registers and executes REST route handlers', async () => {
    const handlers: Array<(c: any) => Promise<unknown>> = [];
    const app = {
      openapi: vi.fn((_route, handler) => {
        handlers.push(handler);
      }),
    };

    roleAdapter.registerRoutes?.(app as never);
    expect(handlers).toHaveLength(2);

    const findRolesExecute = vi
      .fn()
      .mockResolvedValue({ data: [], pagination: { count: 0, pageIndex: 0 } });
    const getRoleExecute = vi.fn().mockResolvedValue({ id: 'r1' });

    const c1 = createContext(
      { query: { pageIndex: 0 } },
      { findRolesQueryHandler: { execute: findRolesExecute } }
    );
    await handlers[0]!(c1);
    expect(findRolesExecute).toHaveBeenCalled();
    expect(c1.json).toHaveBeenCalledWith(
      { data: [], pagination: { count: 0, pageIndex: 0 } },
      200
    );

    const c2 = createContext(
      { param: { id: '550e8400-e29b-41d4-a716-446655440000' } },
      { getRoleQueryHandler: { execute: getRoleExecute } }
    );
    await handlers[1]!(c2);
    expect(getRoleExecute).toHaveBeenCalled();
    expect(c2.json).toHaveBeenCalledWith({ id: 'r1' }, 200);
  });

  it('executes graphql role resolver', async () => {
    const getRoleExecute = vi.fn().mockResolvedValue({ id: 'r1' });
    const c = createContext(
      {},
      {
        getRoleQueryHandler: { execute: getRoleExecute },
      }
    );

    const resolver = roleAdapter.graphql?.resolvers['role'] as (
      q: { id: string },
      c: any
    ) => Promise<unknown>;
    await resolver({ id: '550e8400-e29b-41d4-a716-446655440000' }, c);

    expect(getRoleExecute).toHaveBeenCalled();
  });
});
