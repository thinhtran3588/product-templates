import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '@app/application/graphql/context';
import { extractGraphQLFields } from '@app/common/utils/extract-graphql-fields';
import { AddUserToUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/add-user-to-user-group.command-handler';
import { DeleteUserCommandHandler } from '@app/modules/auth/application/command-handlers/delete-user.command-handler';
import { RemoveUserFromUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/remove-user-from-user-group.command-handler';
import { ToggleUserStatusCommandHandler } from '@app/modules/auth/application/command-handlers/toggle-user-status.command-handler';
import { UpdateUserCommandHandler } from '@app/modules/auth/application/command-handlers/update-user.command-handler';
import type { ToggleUserStatusCommand } from '@app/modules/auth/application/interfaces/commands/toggle-user-status.command';
import type { UpdateUserCommand } from '@app/modules/auth/application/interfaces/commands/update-user.command';
import type { FindUsersQueryParams } from '@app/modules/auth/application/interfaces/queries/user-query-params';
import { FindUsersQueryHandler } from '@app/modules/auth/application/query-handlers/find-users.query-handler';
import { GetUserQueryHandler } from '@app/modules/auth/application/query-handlers/get-user.query-handler';

export const userManagementResolvers = {
  Query: {
    users: async (
      _parent: unknown,
      args: { input?: FindUsersQueryParams },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ) => {
      const findUsersQueryHandler =
        context.diContainer.resolve<FindUsersQueryHandler>(
          'findUsersQueryHandler'
        );
      const fields = extractGraphQLFields(info, 'data');
      return await findUsersQueryHandler.execute(
        { ...args.input, fields },
        context.appContext
      );
    },
    user: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const getUserQueryHandler =
        context.diContainer.resolve<GetUserQueryHandler>('getUserQueryHandler');
      return await getUserQueryHandler.execute(
        { id: args.id },
        context.appContext
      );
    },
  },
  Mutation: {
    users: () => ({}),
  },
  UserManagementMutation: {
    updateUser: async (
      _parent: unknown,
      args: { id: string; input: Omit<UpdateUserCommand, 'id'> },
      context: GraphQLContext
    ) => {
      const updateUserCommandHandler =
        context.diContainer.resolve<UpdateUserCommandHandler>(
          'updateUserCommandHandler'
        );
      await updateUserCommandHandler.execute(
        { id: args.id, ...args.input },
        context.appContext
      );
      return true;
    },
    toggleUserStatus: async (
      _parent: unknown,
      args: { id: string; input: Omit<ToggleUserStatusCommand, 'id'> },
      context: GraphQLContext
    ) => {
      const toggleUserStatusCommandHandler =
        context.diContainer.resolve<ToggleUserStatusCommandHandler>(
          'toggleUserStatusCommandHandler'
        );
      await toggleUserStatusCommandHandler.execute(
        { id: args.id, ...args.input },
        context.appContext
      );
      return true;
    },
    deleteUser: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const deleteUserCommandHandler =
        context.diContainer.resolve<DeleteUserCommandHandler>(
          'deleteUserCommandHandler'
        );
      await deleteUserCommandHandler.execute(
        { id: args.id },
        context.appContext
      );
      return true;
    },
    addUserToUserGroup: async (
      _parent: unknown,
      args: {
        id: string;
        input: { userGroupId: string };
      },
      context: GraphQLContext
    ) => {
      const addUserToUserGroupCommandHandler =
        context.diContainer.resolve<AddUserToUserGroupCommandHandler>(
          'addUserToUserGroupCommandHandler'
        );
      await addUserToUserGroupCommandHandler.execute(
        { userId: args.id, userGroupId: args.input.userGroupId },
        context.appContext
      );
      return true;
    },
    removeUserFromUserGroup: async (
      _parent: unknown,
      args: {
        id: string;
        input: { userGroupId: string };
      },
      context: GraphQLContext
    ) => {
      const removeUserFromUserGroupCommandHandler =
        context.diContainer.resolve<RemoveUserFromUserGroupCommandHandler>(
          'removeUserFromUserGroupCommandHandler'
        );
      await removeUserFromUserGroupCommandHandler.execute(
        { userId: args.id, userGroupId: args.input.userGroupId },
        context.appContext
      );
      return true;
    },
  },
};
