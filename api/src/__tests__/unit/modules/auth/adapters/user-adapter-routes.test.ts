/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call */
import { describe, expect, it, vi } from 'vitest';
import { userAdapter } from '@app/modules/auth/adapters/user-adapter';

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

describe('userAdapter routes and resolvers', () => {
  it('registers and executes REST route handlers', async () => {
    const handlers: Array<(c: any) => Promise<unknown>> = [];
    const app = {
      openapi: vi.fn((_route, handler) => {
        handlers.push(handler);
      }),
    };

    userAdapter.registerRoutes?.(app as never);
    expect(handlers).toHaveLength(7);

    const cradle = {
      findUsersQueryHandler: {
        execute: vi.fn().mockResolvedValue({
          data: [],
          pagination: { count: 0, pageIndex: 0 },
        }),
      },
      getUserQueryHandler: { execute: vi.fn().mockResolvedValue({ id: 'u1' }) },
      updateUserCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      deleteUserCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      toggleUserStatusCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      addUserToUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      removeUserFromUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
    };
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const userGroupId = '660e8400-e29b-41d4-a716-446655440000';

    await handlers[0]!(createContext({ query: { pageIndex: 0 } }, cradle));
    await handlers[1]!(createContext({ param: { id } }, cradle));
    await handlers[2]!(
      createContext({ param: { id }, json: { displayName: 'Name' } }, cradle)
    );
    await handlers[3]!(createContext({ param: { id } }, cradle));
    await handlers[4]!(
      createContext({ param: { id }, json: { enabled: true } }, cradle)
    );
    await handlers[5]!(
      createContext({ param: { id }, json: { userGroupId } }, cradle)
    );
    await handlers[6]!(createContext({ param: { id, userGroupId } }, cradle));

    expect(cradle.findUsersQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.getUserQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.updateUserCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.deleteUserCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.toggleUserStatusCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.addUserToUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(
      cradle.removeUserFromUserGroupCommandHandler.execute
    ).toHaveBeenCalled();
  });

  it('executes graphql mutation/query resolvers', async () => {
    const cradle = {
      getUserQueryHandler: { execute: vi.fn().mockResolvedValue({ id: 'u1' }) },
      updateUserCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      deleteUserCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      toggleUserStatusCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      addUserToUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
      removeUserFromUserGroupCommandHandler: {
        execute: vi.fn().mockResolvedValue(undefined),
      },
    };
    const c = createContext({}, cradle);
    const resolvers = userAdapter.graphql?.resolvers ?? {};

    await (resolvers['user'] as any)({ id: 'u1' }, c);
    await (resolvers['updateUser'] as any)(
      { id: 'u1', displayName: 'Name' },
      c
    );
    await (resolvers['deleteUser'] as any)({ id: 'u1' }, c);
    await (resolvers['toggleUserStatus'] as any)(
      { id: 'u1', enabled: true },
      c
    );
    await (resolvers['addUserToUserGroup'] as any)(
      { id: 'u1', userGroupId: 'g1' },
      c
    );
    await (resolvers['removeUserFromUserGroup'] as any)(
      { id: 'u1', userGroupId: 'g1' },
      c
    );

    expect(cradle.getUserQueryHandler.execute).toHaveBeenCalled();
    expect(cradle.updateUserCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.deleteUserCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.toggleUserStatusCommandHandler.execute).toHaveBeenCalled();
    expect(cradle.addUserToUserGroupCommandHandler.execute).toHaveBeenCalled();
    expect(
      cradle.removeUserFromUserGroupCommandHandler.execute
    ).toHaveBeenCalled();
  });
});
