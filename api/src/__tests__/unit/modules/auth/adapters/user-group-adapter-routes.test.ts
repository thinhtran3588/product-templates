/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it, vi } from 'vitest';
import { userGroupAdapter } from '@app/modules/auth/adapters/user-group-adapter';

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

describe('userGroupAdapter routes and resolvers', () => {
  it('registers and executes REST route handlers', async () => {
    const handlers: Array<(c: any) => Promise<unknown>> = [];
    const app = {
      openapi: vi.fn((_route, handler) => {
        handlers.push(handler);
      }),
    };

    userGroupAdapter.registerRoutes?.(app as never);
    expect(handlers).toHaveLength(7);

    const cradle = {
      createUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue({ id: 'g1' }),
      },
      findUserGroupsQueryHandler: {
        execute: vi.fn().mockResolvedValue({
          data: [],
          pagination: { count: 0, pageIndex: 0 },
        }),
      },
      getUserGroupQueryHandler: {
        execute: vi.fn().mockResolvedValue({ id: 'g1' }),
      },
      updateUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      deleteUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      addRoleToUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      removeRoleFromUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
    };

    await handlers[0]!(
      createContext({ json: { name: 'Group', description: 'Desc' } }, cradle)
    );
    await handlers[1]!(createContext({ query: { pageIndex: 0 } }, cradle));
    await handlers[2]!(
      createContext(
        { param: { id: '550e8400-e29b-41d4-a716-446655440000' } },
        cradle
      )
    );
    await handlers[3]!(
      createContext(
        {
          param: { id: '550e8400-e29b-41d4-a716-446655440000' },
          json: { name: 'Updated' },
        },
        cradle
      )
    );
    await handlers[4]!(
      createContext(
        { param: { id: '550e8400-e29b-41d4-a716-446655440000' } },
        cradle
      )
    );
    await handlers[5]!(
      createContext(
        {
          param: { id: '550e8400-e29b-41d4-a716-446655440000' },
          json: { roleId: '660e8400-e29b-41d4-a716-446655440000' },
        },
        cradle
      )
    );
    await handlers[6]!(
      createContext(
        {
          param: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            roleId: '660e8400-e29b-41d4-a716-446655440000',
          },
        },
        cradle
      )
    );

    expect(cradle.createUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.findUserGroupsQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.getUserGroupQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.updateUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.deleteUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.addRoleToUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(
      cradle.removeRoleFromUserGroupCommandHandler.execute
    ).toHaveBeenCalled();
  });

  it('executes graphql mutation/query resolvers', async () => {
    const cradle = {
      getUserGroupQueryHandler: {
        execute: vi.fn().mockResolvedValue({ id: 'g1' }),
      },
      createUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue({ id: 'g1' }),
      },
      updateUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      deleteUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      addRoleToUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      removeRoleFromUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
    };
    const c = createContext({}, cradle);
    const resolvers = userGroupAdapter.graphql?.resolvers ?? {};

    await (resolvers['userGroup'] as any)({ id: 'g1' }, c);
    await (resolvers['createUserGroup'] as any)({ name: 'Group' }, c);
    const updateInput = { id: 'g1', name: 'Updated' };
    const updateResult = await (resolvers['updateUserGroup'] as any)(
      updateInput,
      c
    );
    await (resolvers['deleteUserGroup'] as any)({ id: 'g1' }, c);
    await (resolvers['addRoleToUserGroup'] as any)(
      { id: 'g1', roleId: 'r1' },
      c
    );
    await (resolvers['removeRoleFromUserGroup'] as any)(
      { id: 'g1', roleId: 'r1' },
      c
    );

    expect(updateResult).toEqual(updateInput);
    expect(cradle.getUserGroupQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.createUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.updateUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.deleteUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.addRoleToUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(
      cradle.removeRoleFromUserGroupCommandHandler.execute
    ).toHaveBeenCalled();
  });
});
