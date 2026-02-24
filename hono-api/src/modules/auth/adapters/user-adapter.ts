import { createRoute, z } from '@hono/zod-openapi';
import type {
  AdapterConfiguration,
  App,
  AppContext,
} from '@app/common/interfaces';

import type { AuthContainer } from '../interfaces';

const UserSchema = z.object({
  id: z.string().openapi({ example: '1' }),
  name: z.string().openapi({ example: 'John Doe' }),
  email: z.string().email().openapi({ example: 'john@example.com' }),
});

export const userAdapter: AdapterConfiguration<AuthContainer> = {
  registerRoutes(app: App<AuthContainer>): void {
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
      async (c) => {
        const { findUsersQueryHandler } = c.var.diContainer.cradle;
        const name = c.req.query('name');
        const users = await findUsersQueryHandler.execute({ name });
        return c.json(users);
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
      async (c) => {
        const { getUserByIdQueryHandler } = c.var.diContainer.cradle;
        const { id } = c.req.valid('param');
        const user = await getUserByIdQueryHandler.execute({ id });
        if (!user) {
          return c.json({ error: 'User not found' }, 404);
        }
        return c.json(user);
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
      async (c) => {
        const { createUserCommandHandler } = c.var.diContainer.cradle;
        const data = c.req.valid('json');
        const user = await createUserCommandHandler.execute(data);
        return c.json(user, 201);
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
      async (c) => {
        const { updateUserCommandHandler } = c.var.diContainer.cradle;
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');
        const user = await updateUserCommandHandler.execute({ id, ...data });
        if (!user) {
          return c.json({ error: 'User not found' }, 404);
        }
        return c.json(user);
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
      async (c) => {
        const { deleteUserCommandHandler } = c.var.diContainer.cradle;
        const { id } = c.req.valid('param');
        const success = await deleteUserCommandHandler.execute({ id });
        if (!success) {
          return c.json({ error: 'User not found' }, 404);
        }
        return c.json({ success: true });
      }
    );
  },
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
      users: async (
        { name }: { name?: string },
        c: AppContext<AuthContainer>
      ) => {
        const { findUsersQueryHandler } = c.var.diContainer.cradle;
        return findUsersQueryHandler.execute({ name });
      },
      user: async ({ id }: { id: string }, c: AppContext<AuthContainer>) => {
        const { getUserByIdQueryHandler } = c.var.diContainer.cradle;
        return getUserByIdQueryHandler.execute({ id });
      },
      createUser: async (
        data: { name: string; email: string },
        c: AppContext<AuthContainer>
      ) => {
        const { createUserCommandHandler } = c.var.diContainer.cradle;
        return createUserCommandHandler.execute(data);
      },
      updateUser: async (
        { id, ...data }: { id: string; name?: string; email?: string },
        c: AppContext<AuthContainer>
      ) => {
        const { updateUserCommandHandler } = c.var.diContainer.cradle;
        return updateUserCommandHandler.execute({ id, ...data });
      },
      deleteUser: async (
        { id }: { id: string },
        c: AppContext<AuthContainer>
      ) => {
        const { deleteUserCommandHandler } = c.var.diContainer.cradle;
        return deleteUserCommandHandler.execute({ id });
      },
    },
  },
};
