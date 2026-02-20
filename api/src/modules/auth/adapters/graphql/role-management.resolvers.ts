import type { GraphQLContext } from '@app/application/graphql/context';
import type { FindRolesQueryParams } from '@app/modules/auth/application/interfaces/queries/role-query-params';
import { FindRolesQueryHandler } from '@app/modules/auth/application/query-handlers/find-roles.query-handler';
import { GetRoleQueryHandler } from '@app/modules/auth/application/query-handlers/get-role.query-handler';

export const roleManagementResolvers = {
  Query: {
    roles: async (
      _parent: unknown,
      args: { query: FindRolesQueryParams },
      context: GraphQLContext
    ) => {
      const findRolesQueryHandler =
        context.diContainer.resolve<FindRolesQueryHandler>(
          'findRolesQueryHandler'
        );
      return await findRolesQueryHandler.execute(
        args.query,
        context.appContext
      );
    },
    role: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const getRoleQueryHandler =
        context.diContainer.resolve<GetRoleQueryHandler>('getRoleQueryHandler');
      return await getRoleQueryHandler.execute(
        { id: args.id },
        context.appContext
      );
    },
  },
};
