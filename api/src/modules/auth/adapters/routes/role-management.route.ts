import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import { PAGINATION_MAX_ITEMS_PER_PAGE } from '@app/common/constants';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';
import {
  ROLE_READ_MODEL_FIELDS,
  ROLE_READ_MODEL_SORT_FIELDS,
} from '@app/modules/auth/application/interfaces/queries/role.read-model';
import { FindRolesQueryHandler } from '@app/modules/auth/application/query-handlers/find-roles.query-handler';
import { GetRoleQueryHandler } from '@app/modules/auth/application/query-handlers/get-role.query-handler';

const TAG = 'role';

const RoleSchema = z
  .object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    description: z.string(),
    version: z.number(),
    createdAt: z.string().datetime(),
    createdBy: z.string().nullable().optional(),
    lastModifiedAt: z.string().datetime(),
    lastModifiedBy: z.string().nullable().optional(),
  })
  .openapi('Role');

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

const findRolesRoute = createRoute({
  method: 'get',
  path: '/roles',
  tags: [TAG],
  summary: 'Find roles by search term with pagination',
  description:
    'Searches for roles by name or description with pagination support. If no searchTerm is provided, returns all roles.',
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
          z.enum(ROLE_READ_MODEL_FIELDS as any),
          z.array(z.enum(ROLE_READ_MODEL_FIELDS as any)),
        ])
        .optional(),
      sortField: z.enum(ROLE_READ_MODEL_SORT_FIELDS as any).optional(),
      sortOrder: z.enum(['ASC', 'DESC']).optional(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(RoleSchema),
            pagination: z.object({
              count: z.number(),
              pageIndex: z.number(),
            }),
          }),
        },
      },
      description: 'List of roles',
    },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    500: createErrorResponse('Internal server error'),
  },
});

const getRoleRoute = createRoute({
  method: 'get',
  path: '/roles/{id}',
  tags: [TAG],
  summary: 'Get role by ID',
  description: 'Retrieves a specific role by its unique identifier.',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RoleSchema,
        },
      },
      description: 'Role details',
    },
    401: createErrorResponse('Unauthorized'),
    403: createErrorResponse('Forbidden'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

function register(app: OpenAPIHono<AppEnv>): void {
  app.openapi(findRolesRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<FindRolesQueryHandler>('findRolesQueryHandler');
    const query = c.req.valid('query');

    // Ensure fields is array if provided
    let fieldsArray: string[] | undefined;
    if (query.fields) {
      fieldsArray = Array.isArray(query.fields) ? query.fields : [query.fields];
    }

    const typedQuery = {
      ...query,
      fields: fieldsArray as any,
    };

    const result = await handler.execute(
      typedQuery as any,
      c.get('appContext')
    );
    return c.json(result as any, 200);
  });

  app.openapi(getRoleRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<GetRoleQueryHandler>('getRoleQueryHandler');
    const { id } = c.req.valid('param');
    const result = await handler.execute({ id }, c.get('appContext'));
    return c.json(result as any, 200);
  });
}

export const routeConfiguration: RouteConfiguration = {
  tags: [
    {
      name: TAG,
      description: 'Role management endpoints',
    },
  ],
  register,
};
