import { createRoute, z } from '@hono/zod-openapi';
import type {
  App,
  AppContext,
  ModuleConfiguration,
} from '@app/common/interfaces';

const UserSchema = z.object({
  id: z.string().openapi({ example: '1' }),
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
});

export const moduleConfiguration: ModuleConfiguration = {
  graphql: {
    typeDefs: `
      type User {
        id: String
        name: String
        email: String
      }

      extend type Query {
        users(name: String): [User]
        user(id: String!): User
      }

      extend type Mutation {
        createUser(name: String!, email: String!): User
        updateUser(id: String!, name: String, email: String): User
        deleteUser(id: String!): Boolean
      }
    `,
    resolvers: {
      users: async ({ name }: { name?: string }, c: AppContext) => {
        const { userService } = c.var.diContainer.cradle;
        return userService.findUsers(name);
      },
      user: async ({ id }: { id: string }, c: AppContext) => {
        const { userService } = c.var.diContainer.cradle;
        return userService.getUserById(id);
      },
      createUser: async (
        data: { name: string; email: string },
        c: AppContext
      ) => {
        const { userService } = c.var.diContainer.cradle;
        return userService.createUser(data);
      },
      updateUser: async (
        { id, ...data }: { id: string; name?: string; email?: string },
        c: AppContext
      ) => {
        const { userService } = c.var.diContainer.cradle;
        return userService.updateUser(id, data);
      },
      deleteUser: async ({ id }: { id: string }, c: AppContext) => {
        const { userService } = c.var.diContainer.cradle;
        return userService.deleteUser(id);
      },
    },
  },
  register(app: App): void {
    // GET /users
    app.openapi(
      createRoute({
        method: 'get',
        path: '/users',
        summary: 'List users',
        tags: ['users'],
        request: {
          query: z.object({
            name: z.string().optional().openapi({ example: 'John' }),
          }),
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: z.array(UserSchema),
              },
            },
            description: 'List of users',
          },
        },
      }),
      (c) => {
        const { userController } = c.var.diContainer.cradle;
        return userController.findUsers(c as unknown as AppContext) as never;
      }
    );

    // GET /users/:id
    app.openapi(
      createRoute({
        method: 'get',
        path: '/users/{id}',
        summary: 'Get user by ID',
        tags: ['users'],
        request: {
          params: z.object({
            id: z.string().openapi({ example: '1' }),
          }),
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: UserSchema,
              },
            },
            description: 'User details',
          },
          404: {
            description: 'User not found',
          },
        },
      }),
      (c) => {
        const { userController } = c.var.diContainer.cradle;
        return userController.getUser(c as unknown as AppContext) as never;
      }
    );

    // POST /users
    app.openapi(
      createRoute({
        method: 'post',
        path: '/users',
        summary: 'Create user',
        tags: ['users'],
        request: {
          body: {
            content: {
              'application/json': {
                schema: UserSchema.omit({ id: true }),
              },
            },
          },
        },
        responses: {
          201: {
            content: {
              'application/json': {
                schema: UserSchema,
              },
            },
            description: 'User created',
          },
        },
      }),
      (c) => {
        const { userController } = c.var.diContainer.cradle;
        return userController.createUser(c as unknown as AppContext) as never;
      }
    );

    // PATCH /users/:id
    app.openapi(
      createRoute({
        method: 'patch',
        path: '/users/{id}',
        summary: 'Update user',
        tags: ['users'],
        request: {
          params: z.object({
            id: z.string().openapi({ example: '1' }),
          }),
          body: {
            content: {
              'application/json': {
                schema: UserSchema.omit({ id: true }).partial(),
              },
            },
          },
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: UserSchema,
              },
            },
            description: 'User updated',
          },
          404: {
            description: 'User not found',
          },
        },
      }),
      (c) => {
        const { userController } = c.var.diContainer.cradle;
        return userController.updateUser(c as unknown as AppContext) as never;
      }
    );

    // DELETE /users/:id
    app.openapi(
      createRoute({
        method: 'delete',
        path: '/users/{id}',
        summary: 'Delete user',
        tags: ['users'],
        request: {
          params: z.object({
            id: z.string().openapi({ example: '1' }),
          }),
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean() }),
              },
            },
            description: 'User deleted',
          },
          404: {
            description: 'User not found',
          },
        },
      }),
      (c) => {
        const { userController } = c.var.diContainer.cradle;
        return userController.deleteUser(c as unknown as AppContext) as never;
      }
    );
  },
};
