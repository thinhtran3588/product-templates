import type { GraphQLContext } from '@app/application/graphql/context';
import { AddRoleToUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/add-role-to-user-group.command-handler';
import { CreateUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/create-user-group.command-handler';
import { DeleteUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/delete-user-group.command-handler';
import { RemoveRoleFromUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/remove-role-from-user-group.command-handler';
import { UpdateUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/update-user-group.command-handler';
import type { AddRoleToUserGroupCommand } from '@app/modules/auth/application/interfaces/commands/add-role-to-user-group.command';
import type { CreateUserGroupCommand } from '@app/modules/auth/application/interfaces/commands/create-user-group.command';
import type { RemoveRoleFromUserGroupCommand } from '@app/modules/auth/application/interfaces/commands/remove-role-from-user-group.command';
import type { UpdateUserGroupCommand } from '@app/modules/auth/application/interfaces/commands/update-user-group.command';
import type { FindUserGroupsQueryParams } from '@app/modules/auth/application/interfaces/queries/user-group-query-params';
import { FindUserGroupsQueryHandler } from '@app/modules/auth/application/query-handlers/find-user-groups.query-handler';
import { GetUserGroupQueryHandler } from '@app/modules/auth/application/query-handlers/get-user-group.query-handler';

export const userGroupManagementResolvers = {
  Query: {
    userGroups: async (
      _parent: unknown,
      args: { query: FindUserGroupsQueryParams },
      context: GraphQLContext
    ) => {
      const findUserGroupsQueryHandler =
        context.diContainer.resolve<FindUserGroupsQueryHandler>(
          'findUserGroupsQueryHandler'
        );
      return await findUserGroupsQueryHandler.execute(
        args.query,
        context.appContext
      );
    },
    userGroup: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const getUserGroupQueryHandler =
        context.diContainer.resolve<GetUserGroupQueryHandler>(
          'getUserGroupQueryHandler'
        );
      return await getUserGroupQueryHandler.execute(
        { id: args.id },
        context.appContext
      );
    },
  },
  Mutation: {
    userGroups: () => ({}),
  },
  UserGroupManagementMutation: {
    createUserGroup: async (
      _parent: unknown,
      args: { input: CreateUserGroupCommand },
      context: GraphQLContext
    ) => {
      const createUserGroupCommandHandler =
        context.diContainer.resolve<CreateUserGroupCommandHandler>(
          'createUserGroupCommandHandler'
        );
      return await createUserGroupCommandHandler.execute(
        args.input,
        context.appContext
      );
    },
    updateUserGroup: async (
      _parent: unknown,
      args: { id: string; input: Omit<UpdateUserGroupCommand, 'id'> },
      context: GraphQLContext
    ) => {
      const updateUserGroupCommandHandler =
        context.diContainer.resolve<UpdateUserGroupCommandHandler>(
          'updateUserGroupCommandHandler'
        );
      await updateUserGroupCommandHandler.execute(
        { id: args.id, ...args.input },
        context.appContext
      );
      return true;
    },
    deleteUserGroup: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const deleteUserGroupCommandHandler =
        context.diContainer.resolve<DeleteUserGroupCommandHandler>(
          'deleteUserGroupCommandHandler'
        );
      await deleteUserGroupCommandHandler.execute(
        { id: args.id },
        context.appContext
      );
      return true;
    },
    addRoleToUserGroup: async (
      _parent: unknown,
      args: {
        userGroupId: string;
        input: Omit<AddRoleToUserGroupCommand, 'userGroupId'>;
      },
      context: GraphQLContext
    ) => {
      const addRoleToUserGroupCommandHandler =
        context.diContainer.resolve<AddRoleToUserGroupCommandHandler>(
          'addRoleToUserGroupCommandHandler'
        );
      await addRoleToUserGroupCommandHandler.execute(
        { userGroupId: args.userGroupId, ...args.input },
        context.appContext
      );
      return true;
    },
    removeRoleFromUserGroup: async (
      _parent: unknown,
      args: {
        userGroupId: string;
        input: Omit<RemoveRoleFromUserGroupCommand, 'userGroupId'>;
      },
      context: GraphQLContext
    ) => {
      const removeRoleFromUserGroupCommandHandler =
        context.diContainer.resolve<RemoveRoleFromUserGroupCommandHandler>(
          'removeRoleFromUserGroupCommandHandler'
        );
      await removeRoleFromUserGroupCommandHandler.execute(
        { userGroupId: args.userGroupId, ...args.input },
        context.appContext
      );
      return true;
    },
  },
};
