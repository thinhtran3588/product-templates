import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import { PAGINATION_MAX_ITEMS_PER_PAGE } from '@app/common/constants';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';
import { AddUserToUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/add-user-to-user-group.command-handler';
import { DeleteUserCommandHandler } from '@app/modules/auth/application/command-handlers/delete-user.command-handler';
import { RemoveUserFromUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/remove-user-from-user-group.command-handler';
import { ToggleUserStatusCommandHandler } from '@app/modules/auth/application/command-handlers/toggle-user-status.command-handler';
import { UpdateUserCommandHandler } from '@app/modules/auth/application/command-handlers/update-user.command-handler';
import {
  USER_READ_MODEL_FIELDS,
  USER_READ_MODEL_SORT_FIELDS,
} from '@app/modules/auth/application/interfaces/queries/user.read-model';
import { FindUsersQueryHandler } from '@app/modules/auth/application/query-handlers/find-users.query-handler';
import { GetUserQueryHandler } from '@app/modules/auth/application/query-handlers/get-user.query-handler';

const TAG = 'user';

const UserSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    signInType: z.enum(['EMAIL', 'GOOGLE', 'APPLE']),
    externalId: z.string(),
    displayName: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    status: z.enum(['ACTIVE', 'DISABLED', 'DELETED']),
    version: z.number(),
    createdAt: z.string().datetime(),
    createdBy: z.string().nullable().optional(),
    lastModifiedAt: z.string().datetime(),
    lastModifiedBy: z.string().nullable().optional(),
  })
  .openapi('User');

const errorResponse = z.object({
  error: z.string(),
  data: z.any().optional(),
});

function createErrorResponse(description: string) {
  return {
    content: {
      'application/json': {
        schema: errorResponse,
      },
    },
    description,
  };
}

const findUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  tags: [TAG],
  summary: 'Find users by search term with pagination',
  description:
    'Searches for users by displayName, email, or username with pagination support.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      searchTerm: z.string().optional(),
      userGroupId: z.string().uuid().optional(),
      pageIndex: z.coerce.number().min(0).optional(),
      itemsPerPage: z.coerce
        .number()
        .min(1)
        .max(PAGINATION_MAX_ITEMS_PER_PAGE)
        .optional(),
      fields: z
        .union([
          z.enum(USER_READ_MODEL_FIELDS as any),
          z.array(z.enum(USER_READ_MODEL_FIELDS as any)),
        ])
        .optional(),
      sortField: z.enum(USER_READ_MODEL_SORT_FIELDS as any).optional(),
      sortOrder: z.enum(['ASC', 'DESC']).optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(UserSchema),
            pagination: z.object({
              count: z.number(),
              pageIndex: z.number(),
            }),
          }),
        },
      },
      description: 'List of users',
    },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    500: createErrorResponse('Internal server error'),
  },
});

const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  tags: [TAG],
  summary: 'Get user by ID',
  description: 'Retrieves a specific user by their unique identifier.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
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
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{id}',
  tags: [TAG],
  summary: 'Update user',
  description:
    'Updates an existing user. Only displayName and username can be updated.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            displayName: z.string().optional(),
            username: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    204: { description: 'Updated successfully' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const toggleUserStatusRoute = createRoute({
  method: 'patch',
  path: '/users/{id}/status',
  tags: [TAG],
  summary: 'Toggle user status',
  description: 'Enables or disables a user by their unique identifier.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            enabled: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    204: { description: 'Status updated' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{id}',
  tags: [TAG],
  summary: 'Delete user',
  description: 'Deletes a user by their unique identifier.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    204: { description: 'Deleted' },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const addUserToUserGroupRoute = createRoute({
  method: 'post',
  path: '/users/{id}/user-groups/{userGroupId}',
  tags: [TAG],
  summary: 'Add a user to a user group',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
      userGroupId: z.string().uuid(),
    }),
  },
  responses: {
    204: { description: 'User added to user group' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const removeUserFromUserGroupRoute = createRoute({
  method: 'delete',
  path: '/users/{id}/user-groups/{userGroupId}',
  tags: [TAG],
  summary: 'Remove a user from a user group',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
      userGroupId: z.string().uuid(),
    }),
  },
  responses: {
    204: { description: 'User removed from user group' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

function register(app: OpenAPIHono<AppEnv>): void {
  app.openapi(findUsersRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<FindUsersQueryHandler>('findUsersQueryHandler');
    const query = c.req.valid('query');

    let fieldsArray: string[] | undefined;
    if (query.fields) {
      fieldsArray = Array.isArray(query.fields) ? query.fields : [query.fields];
    }
    const typedQuery = { ...query, fields: fieldsArray };

    const result = await handler.execute(
      typedQuery as any,
      c.get('appContext')
    );
    return c.json(result as any, 200);
  });

  app.openapi(getUserRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<GetUserQueryHandler>('getUserQueryHandler');
    const { id } = c.req.valid('param');
    const result = await handler.execute({ id }, c.get('appContext'));
    return c.json(result as any, 200);
  });

  app.openapi(updateUserRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<UpdateUserCommandHandler>('updateUserCommandHandler');
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    await handler.execute({ id, ...body }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(toggleUserStatusRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<ToggleUserStatusCommandHandler>(
        'toggleUserStatusCommandHandler'
      );
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    await handler.execute({ id, ...body }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(deleteUserRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<DeleteUserCommandHandler>('deleteUserCommandHandler');
    const { id } = c.req.valid('param');
    await handler.execute({ id }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(addUserToUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<AddUserToUserGroupCommandHandler>(
        'addUserToUserGroupCommandHandler'
      );
    const { id, userGroupId } = c.req.valid('param');
    await handler.execute({ userId: id, userGroupId }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(removeUserFromUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<RemoveUserFromUserGroupCommandHandler>(
        'removeUserFromUserGroupCommandHandler'
      );
    const { id, userGroupId } = c.req.valid('param');
    await handler.execute({ userId: id, userGroupId }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });
}

export const routeConfiguration: RouteConfiguration = {
  tags: [
    {
      name: TAG,
      description: 'User management endpoints',
    },
  ],
  register,
};
