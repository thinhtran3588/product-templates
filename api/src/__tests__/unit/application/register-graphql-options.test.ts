import { afterEach, describe, expect, it, vi } from 'vitest';

const { graphqlServerMock } = vi.hoisted(() => ({
  graphqlServerMock: vi.fn((options: unknown) => ({ options })),
}));

vi.mock('@hono/graphql-server', () => ({
  graphqlServer: graphqlServerMock,
}));

describe('registerGraphQL options wiring', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    delete process.env['GRAPHQL_ENABLED'];
    delete process.env['GRAPHIQL_ENABLED'];
  });

  it('passes wrapped resolvers and graphiql option to graphqlServer', async () => {
    const { registerGraphQL } = await import(
      '@app/application/middleware/register-graphql'
    );

    process.env['GRAPHQL_ENABLED'] = 'true';
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
    ];

    registerGraphQL(app as never, modules as never);

    expect(graphqlServerMock).toHaveBeenCalledTimes(1);
    const options = graphqlServerMock.mock.calls[0]?.[0] as {
      rootResolver: () => Record<string, unknown>;
      graphiql: boolean;
    };
    expect(options.graphiql).toBe(true);
    expect(options.rootResolver()).toHaveProperty('Query');
  });
});
