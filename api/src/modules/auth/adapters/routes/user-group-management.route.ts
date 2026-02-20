import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import { PAGINATION_MAX_ITEMS_PER_PAGE } from '@app/common/constants';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';
import { AddRoleToUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/add-role-to-user-group.command-handler';
import { CreateUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/create-user-group.command-handler';
import { DeleteUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/delete-user-group.command-handler';
import { RemoveRoleFromUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/remove-role-from-user-group.command-handler';
import { UpdateUserGroupCommandHandler } from '@app/modules/auth/application/command-handlers/update-user-group.command-handler';
import {
  USER_GROUP_READ_MODEL_FIELDS,
  USER_GROUP_READ_MODEL_SORT_FIELDS,
} from '@app/modules/auth/application/interfaces/queries/user-group.read-model';
import { FindUserGroupsQueryHandler } from '@app/modules/auth/application/query-handlers/find-user-groups.query-handler';
import { GetUserGroupQueryHandler } from '@app/modules/auth/application/query-handlers/get-user-group.query-handler';

const TAG = 'user-group';

const UserGroupSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    version: z.number(),
    createdAt: z.string().datetime(),
    createdBy: z.string().nullable().optional(),
    lastModifiedAt: z.string().datetime(),
    lastModifiedBy: z.string().nullable().optional(),
  })
  .openapi('UserGroup');

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

const createUserGroupRoute = createRoute({
  method: 'post',
  path: '/user-groups',
  tags: [TAG],
  summary: 'Create a new user group',
  description:
    'Creates a new user group with the provided name and optional description.',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255),
            description: z.string().max(2000).optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({ id: z.string() }),
        },
      },
      description: 'Created',
    },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    500: createErrorResponse('Internal server error'),
  },
});

const findUserGroupsRoute = createRoute({
  method: 'get',
  path: '/user-groups',
  tags: [TAG],
  summary: 'Find user groups by search term with pagination',
  description:
    'Searches for user groups by name or description with pagination support.',
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      searchTerm: z.string().optional(),
      pageIndex: z.coerce.number().min(0).optional(),
      itemsPerPage: z.coerce
        .number()
        .min(1)
        .max(PAGINATION_MAX_ITEMS_PER_PAGE)
        .optional(),
      fields: z
        .union([
          z.enum(USER_GROUP_READ_MODEL_FIELDS as any),
          z.array(z.enum(USER_GROUP_READ_MODEL_FIELDS as any)),
        ])
        .optional(),
      sortField: z.enum(USER_GROUP_READ_MODEL_SORT_FIELDS as any).optional(),
      sortOrder: z.enum(['ASC', 'DESC']).optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(UserGroupSchema),
            pagination: z.object({
              count: z.number(),
              pageIndex: z.number(),
            }),
          }),
        },
      },
      description: 'List of user groups',
    },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    500: createErrorResponse('Internal server error'),
  },
});

const getUserGroupRoute = createRoute({
  method: 'get',
  path: '/user-groups/{id}',
  tags: [TAG],
  summary: 'Get user group by ID',
  description: 'Retrieves a specific user group by its unique identifier.',
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
          schema: UserGroupSchema,
        },
      },
      description: 'User group details',
    },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const updateUserGroupRoute = createRoute({
  method: 'put',
  path: '/user-groups/{id}',
  tags: [TAG],
  summary: 'Update user group',
  description:
    'Updates an existing user group. Both name and description can be updated.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255).optional(),
            description: z.string().max(2000).optional(),
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

const deleteUserGroupRoute = createRoute({
  method: 'delete',
  path: '/user-groups/{id}',
  tags: [TAG],
  summary: 'Delete user group',
  description:
    'Deletes a user group by its unique identifier. This operation is permanent.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    204: { description: 'Deleted successfully' },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const addRoleToUserGroupRoute = createRoute({
  method: 'post',
  path: '/user-groups/{id}/roles',
  tags: [TAG],
  summary: 'Add a role to a user group',
  description: 'Adds a single role to the specified user group.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            roleId: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    204: { description: 'Role added successfully' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const removeRoleFromUserGroupRoute = createRoute({
  method: 'delete',
  path: '/user-groups/{id}/roles/{roleId}',
  tags: [TAG],
  summary: 'Remove a role from a user group',
  description: 'Removes a single role from the specified user group.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
      roleId: z.string(),
    }),
  },
  responses: {
    204: { description: 'Role removed successfully' },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

function register(app: OpenAPIHono<AppEnv>): void {
  app.openapi(createUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<CreateUserGroupCommandHandler>('createUserGroupCommandHandler');
    const result = await handler.execute(
      c.req.valid('json'),
      c.get('appContext')
    );
    return c.json(result as any, 201);
  });

  app.openapi(findUserGroupsRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<FindUserGroupsQueryHandler>('findUserGroupsQueryHandler');
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

  app.openapi(getUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<GetUserGroupQueryHandler>('getUserGroupQueryHandler');
    const { id } = c.req.valid('param');
    const result = await handler.execute({ id }, c.get('appContext'));
    return c.json(result as any, 200);
  });

  app.openapi(updateUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<UpdateUserGroupCommandHandler>('updateUserGroupCommandHandler');
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    await handler.execute({ id, ...body }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(deleteUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<DeleteUserGroupCommandHandler>('deleteUserGroupCommandHandler');
    const { id } = c.req.valid('param');
    await handler.execute({ id }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(addRoleToUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<AddRoleToUserGroupCommandHandler>(
        'addRoleToUserGroupCommandHandler'
      );
    const { id } = c.req.valid('param');
    const { roleId } = c.req.valid('json');
    await handler.execute({ userGroupId: id, roleId }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(removeRoleFromUserGroupRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<RemoveRoleFromUserGroupCommandHandler>(
        'removeRoleFromUserGroupCommandHandler'
      );
    const { id, roleId } = c.req.valid('param');
    await handler.execute({ userGroupId: id, roleId }, c.get('appContext'));
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });
}

export const routeConfiguration: RouteConfiguration = {
  tags: [
    {
      name: TAG,
      description: 'User group management endpoints',
    },
  ],
  register,
};
