import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '@app/application/types/hono.env';
import type { RouteConfiguration } from '@app/common/interfaces/configuration';
import { DeleteAccountCommandHandler } from '@app/modules/auth/application/command-handlers/delete-account.command-handler';
import { RegisterCommandHandler } from '@app/modules/auth/application/command-handlers/register.command-handler';
import { RequestAccessTokenCommandHandler } from '@app/modules/auth/application/command-handlers/request-access-token.command-handler';
import { SignInCommandHandler } from '@app/modules/auth/application/command-handlers/sign-in.command-handler';
import { UpdateProfileCommandHandler } from '@app/modules/auth/application/command-handlers/update-profile.command-handler';
import { GetProfileQueryHandler } from '@app/modules/auth/application/query-handlers/get-profile.query-handler';

const TAG = 'auth';

const UserProfileSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    signInType: z.enum(['EMAIL', 'GOOGLE', 'APPLE']),
    externalId: z.string(),
    displayName: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    version: z.number(),
    createdAt: z.string().datetime(),
  })
  .openapi('UserProfile');

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

const registerRoute = createRoute({
  method: 'post',
  path: '/auth/register',
  tags: [TAG],
  summary: 'Register a new user',
  description: 'Registers a new user with email, password, and displayName.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
            password: z.string(),
            displayName: z.string().optional(),
            username: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            idToken: z.string(),
            signInToken: z.string(),
          }),
        },
      },
      description: 'Account created',
    },
    400: createErrorResponse('Bad request'),
    500: createErrorResponse('Internal server error'),
  },
});

const signInRoute = createRoute({
  method: 'post',
  path: '/auth/sign-in',
  tags: [TAG],
  summary: 'Sign in user',
  description: 'Authenticates a user and returns an access token.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            emailOrUsername: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.string(),
            idToken: z.string(),
            signInToken: z.string(),
          }),
        },
      },
      description: 'Sign in successful',
    },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    500: createErrorResponse('Internal server error'),
  },
});

const getProfileRoute = createRoute({
  method: 'get',
  path: '/auth/me',
  tags: [TAG],
  summary: 'Get current user profile',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserProfileSchema,
        },
      },
      description: 'User profile',
    },
    401: createErrorResponse('Unauthorized'),
    500: createErrorResponse('Internal server error'),
  },
});

const updateProfileRoute = createRoute({
  method: 'put',
  path: '/auth/me',
  tags: [TAG],
  summary: 'Update current user profile',
  security: [{ bearerAuth: [] }],
  request: {
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
    204: {
      description: 'Profile updated',
    },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    500: createErrorResponse('Internal server error'),
  },
});

const deleteAccountRoute = createRoute({
  method: 'delete',
  path: '/auth/me',
  tags: [TAG],
  summary: 'Delete current user account',
  security: [{ bearerAuth: [] }],
  responses: {
    204: {
      description: 'Account deleted',
    },
    401: createErrorResponse('Unauthorized'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

const requestAccessTokenRoute = createRoute({
  method: 'post',
  path: '/auth/me/access-token',
  tags: [TAG],
  summary: 'Request access token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            idToken: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            token: z.string(),
          }),
        },
      },
      description: 'Access token generated',
    },
    400: createErrorResponse('Bad request'),
    401: createErrorResponse('Unauthorized'),
    404: createErrorResponse('Not found'),
    500: createErrorResponse('Internal server error'),
  },
});

function register(app: OpenAPIHono<AppEnv>): void {
  app.openapi(registerRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<RegisterCommandHandler>('registerCommandHandler');
    const result = await handler.execute(c.req.valid('json'));
    return c.json(result as any, 201);
  });

  app.openapi(signInRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<SignInCommandHandler>('signInCommandHandler');
    const result = await handler.execute(c.req.valid('json'));
    return c.json(result as any, 200);
  });

  app.openapi(getProfileRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<GetProfileQueryHandler>('getProfileQueryHandler');
    const appContext = c.get('appContext');
    const result = await handler.execute({}, appContext);
    return c.json(result as any, 200);
  });

  app.openapi(updateProfileRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<UpdateProfileCommandHandler>('updateProfileCommandHandler');
    const appContext = c.get('appContext');
    await handler.execute(c.req.valid('json'), appContext);
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(deleteAccountRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<DeleteAccountCommandHandler>('deleteAccountCommandHandler');
    const appContext = c.get('appContext');
    await handler.execute({}, appContext);
    return c.body(null, 204); // eslint-disable-line no-null/no-null
  });

  app.openapi(requestAccessTokenRoute, async (c) => {
    const handler = c
      .get('diContainer')
      .resolve<RequestAccessTokenCommandHandler>(
        'requestAccessTokenCommandHandler'
      );
    const result = await handler.execute(c.req.valid('json'));
    return c.json(result as any, 200);
  });
}

export const routeConfiguration: RouteConfiguration = {
  tags: [
    {
      name: TAG,
      description: 'Authentication and user profile endpoints',
    },
  ],
  register,
};
