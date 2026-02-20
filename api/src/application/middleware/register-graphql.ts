import type { OpenAPIHono } from '@hono/zod-openapi';
import { createYoga, createSchema as createYogaSchema } from 'graphql-yoga';
import { graphqlConfig } from '@app/application/config/graphql.config';
import { commonSchema } from '@app/application/graphql/common.schema';
import { createGraphQLContext } from '@app/application/graphql/context';
import type { AppEnv } from '@app/application/types/hono.env';
import type { Logger } from '@app/common/domain/interfaces/logger';
import type {
  GraphQLResolverConfiguration,
  GraphQLSchemaConfiguration,
} from '@app/common/interfaces/configuration';

function mergeResolvers(
  resolvers: GraphQLResolverConfiguration[]
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const resolverConfig of resolvers) {
    const resolver = resolverConfig.resolvers;
    for (const [key, value] of Object.entries(resolver)) {
      if (merged[key]) {
        merged[key] = {
          ...(merged[key] as Record<string, unknown>),
          ...(value as Record<string, unknown>),
        };
      } else {
        merged[key] = value;
      }
    }
  }
  return merged;
}

/**
 * Registers the GraphQL middleware with the Hono instance
 * @param app - The Hono instance to register the middleware with
 * @param schemas - GraphQL schema configurations discovered from modules
 * @param resolvers - GraphQL resolver configurations discovered from modules
 * @returns void
 */
export async function registerGraphQL(
  app: OpenAPIHono<AppEnv>,
  schemas: GraphQLSchemaConfiguration[],
  resolvers: GraphQLResolverConfiguration[],
  logger: Logger
): Promise<void> {
  const config = graphqlConfig();
  const enableUI = process.env['GRAPHQL_UI_ENABLED'] === 'true';
  logger.info(undefined, `GraphQL UI enabled: ${enableUI}`);

  const allSchemas: string[] = [commonSchema, ...schemas.map((s) => s.schema)];
  const mergedResolvers = mergeResolvers(resolvers);

  const yoga = createYoga({
    schema: createYogaSchema({
      typeDefs: allSchemas.join('\n'),
      resolvers: mergedResolvers as any,
    }),
    context: createGraphQLContext,
    graphqlEndpoint: config.endpoint,
    graphiql: enableUI,
  });

  app.use(config.endpoint, async (c) => {
    return yoga.handle(c.req.raw, { c });
  });

  logger.info(undefined, `GraphQL endpoint registered at ${config.endpoint}`);
  if (enableUI) {
    logger.info(undefined, `GraphiQL UI available at ${config.endpoint}`);
  }
}
