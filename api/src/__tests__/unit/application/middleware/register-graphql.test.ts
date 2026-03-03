import { GraphQLError } from 'graphql';
import { describe, expect, it, vi } from 'vitest';
import {
  registerGraphQL,
  wrapGraphQLResolvers,
} from '@app/application/middleware/register-graphql';
import {
  AuthorizationExceptionCode,
  BusinessError,
  ValidationError,
} from '@app/common';

describe('wrapGraphQLResolvers', () => {
  it('keeps non-function resolver values unchanged', () => {
    const wrapped = wrapGraphQLResolvers({
      constantValue: 123,
    });

    expect(wrapped['constantValue']).toBe(123);
  });

  it('maps business errors to GraphQL errors with status and data', async () => {
    const wrapped = wrapGraphQLResolvers({
      getMe: () => {
        throw new BusinessError(AuthorizationExceptionCode.UNAUTHORIZED, {
          reason: 'missing token',
        });
      },
    });

    const resolver = wrapped['getMe'] as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await expect(resolver({}, {})).rejects.toMatchObject({
      message: AuthorizationExceptionCode.UNAUTHORIZED,
      extensions: {
        error: AuthorizationExceptionCode.UNAUTHORIZED,
        data: { reason: 'missing token' },
        statusCode: 401,
      },
    });
  });

  it('maps validation not found errors to 404 status', async () => {
    const wrapped = wrapGraphQLResolvers({
      getUser: () => {
        throw new ValidationError('USER_NOT_FOUND');
      },
    });

    const resolver = wrapped['getUser'] as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await expect(resolver({}, {})).rejects.toMatchObject({
      message: 'USER_NOT_FOUND',
      extensions: {
        error: 'USER_NOT_FOUND',
        statusCode: 404,
      },
    });
  });

  it('rethrows GraphQLError instances without modification', async () => {
    const originalError = new GraphQLError('already formatted', {
      extensions: { error: 'EXISTING_GRAPHQL_ERROR' },
    });
    const wrapped = wrapGraphQLResolvers({
      testResolver: () => {
        throw originalError;
      },
    });

    const resolver = wrapped['testResolver'] as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await expect(resolver({}, {})).rejects.toBe(originalError);
  });

  it('maps unknown errors to internal server error and logs details', async () => {
    const logger = { error: vi.fn() };
    const context = {
      var: {
        container: {
          cradle: {
            logger,
          },
        },
      },
    };
    const wrapped = wrapGraphQLResolvers({
      save: () => {
        throw new Error('unexpected');
      },
    });

    const resolver = wrapped['save'] as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await expect(resolver({}, context)).rejects.toMatchObject({
      message: 'INTERNAL_SERVER_ERROR',
      extensions: {
        error: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    });
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('handles malformed contexts without logger access', async () => {
    const wrapped = wrapGraphQLResolvers({
      save: () => {
        throw new Error('unexpected');
      },
    });

    const resolver = wrapped['save'] as (
      ...args: unknown[]
    ) => Promise<unknown>;

    await expect(resolver({}, 0)).rejects.toMatchObject({
      message: 'INTERNAL_SERVER_ERROR',
    });
    await expect(resolver({}, { var: 0 })).rejects.toMatchObject({
      message: 'INTERNAL_SERVER_ERROR',
    });
    await expect(resolver({}, { var: { container: 0 } })).rejects.toMatchObject(
      {
        message: 'INTERNAL_SERVER_ERROR',
      }
    );
    await expect(
      resolver({}, { var: { container: { cradle: { logger: {} } } } })
    ).rejects.toMatchObject({
      message: 'INTERNAL_SERVER_ERROR',
    });
    await expect(
      resolver({}, { var: { container: { cradle: 0 } } })
    ).rejects.toMatchObject({
      message: 'INTERNAL_SERVER_ERROR',
    });
  });
});

describe('registerGraphQL', () => {
  it('does not register graphql when disabled', () => {
    process.env['GRAPHQL_ENABLED'] = 'false';
    const app = { use: vi.fn() };

    registerGraphQL(app as never, []);

    expect(app.use).not.toHaveBeenCalled();
    delete process.env['GRAPHQL_ENABLED'];
  });

  it('registers graphql endpoint and merges resolver objects by type name', () => {
    process.env['GRAPHQL_ENABLED'] = 'true';
    process.env['GRAPHQL_ENDPOINT'] = '/custom-graphql';
    process.env['GRAPHIQL_ENABLED'] = 'true';

    const app = { use: vi.fn() };
    const modules = [
      {
        adapters: [
          {
            graphql: {
              typeDefs: 'extend type Query { ping: String }',
              resolvers: {
                Query: { ping: () => 'pong' },
              },
            },
          },
        ],
      },
      {
        adapters: [
          {
            graphql: {
              typeDefs: 'extend type Query { health: String }',
              resolvers: {
                Query: { health: () => 'ok' },
              },
            },
          },
        ],
      },
    ];

    registerGraphQL(app as never, modules as never);

    expect(app.use).toHaveBeenCalledTimes(1);
    expect(app.use.mock.calls[0]?.[0]).toBe('/custom-graphql');

    delete process.env['GRAPHQL_ENABLED'];
    delete process.env['GRAPHQL_ENDPOINT'];
    delete process.env['GRAPHIQL_ENABLED'];
  });

  it('handles adapters without graphql definitions', () => {
    process.env['GRAPHQL_ENABLED'] = 'true';
    const app = { use: vi.fn() };
    const modules = [
      {
        adapters: [{ graphql: undefined }, {}],
      },
    ];

    registerGraphQL(app as never, modules as never);
    expect(app.use).toHaveBeenCalledTimes(1);
    delete process.env['GRAPHQL_ENABLED'];
  });
});
