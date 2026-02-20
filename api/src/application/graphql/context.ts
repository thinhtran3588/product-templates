import type { AwilixContainer } from 'awilix';
import type { Context } from 'hono';
import type { Container } from '@app/application/container';
import type { AppEnv } from '@app/application/types/hono.env';
import type { AppContext } from '@app/common/interfaces/context';

export interface GraphQLContext {
  c: Context<AppEnv>;
  appContext: AppContext;
  diContainer: AwilixContainer<Container>;
}

/**
 * Creates GraphQL context from Yoga initial context
 * This function is used by Yoga to build the context for GraphQL resolvers
 */
export function createGraphQLContext(
  initialContext: { c: Context<AppEnv> } & any
): GraphQLContext {
  const { c } = initialContext;
  return {
    c,
    appContext: c.get('appContext'),
    diContainer: c.get('diContainer'),
  };
}
