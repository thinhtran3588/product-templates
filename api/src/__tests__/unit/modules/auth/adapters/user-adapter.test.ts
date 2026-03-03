import { Kind, type GraphQLResolveInfo } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import type { Context } from '@app/common';
import { userAdapter } from '@app/modules/auth/adapters/user-adapter';
import type {
  AuthContainer,
  FindUsersQuery,
} from '@app/modules/auth/interfaces';

describe('user-adapter', () => {
  it('extracts fields from GraphQL selection for users resolver', async () => {
    const execute = vi.fn().mockResolvedValue({
      data: [],
      pagination: { count: 0, pageIndex: 1 },
    });
    const context = {
      var: {
        user: { id: 'operator-id' },
        container: {
          cradle: {
            findUsersQueryHandler: { execute },
          },
        },
      },
    } as unknown as Context<AuthContainer>;
    const info = {
      fieldNodes: [
        {
          kind: Kind.FIELD,
          name: { kind: Kind.NAME, value: 'users' },
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: [
              {
                kind: Kind.FIELD,
                name: { kind: Kind.NAME, value: 'data' },
                selectionSet: {
                  kind: Kind.SELECTION_SET,
                  selections: ['id', 'status', 'email', 'username'].map(
                    (field) => ({
                      kind: Kind.FIELD,
                      name: { kind: Kind.NAME, value: field },
                    })
                  ),
                },
              },
            ],
          },
        },
      ],
    } as unknown as GraphQLResolveInfo;

    const resolver = userAdapter.graphql?.resolvers['users'] as (
      query: FindUsersQuery,
      c: Context<AuthContainer>,
      info: GraphQLResolveInfo
    ) => Promise<unknown>;

    await resolver(
      {
        pageIndex: 1,
        fields: ['createdBy'],
      },
      context,
      info
    );

    expect(execute).toHaveBeenCalledWith(
      {
        pageIndex: 1,
        fields: ['id', 'status', 'email', 'username'],
      },
      {
        user: { id: 'operator-id' },
      }
    );
  });
});
