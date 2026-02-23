import { graphqlServer } from '@hono/graphql-server';
import { buildSchema } from 'graphql';
import type { App, ModuleConfiguration } from '@app/common/interfaces';

export const registerGraphQL = (app: App, modules: ModuleConfiguration[]) => {
  if (process.env.GRAPHQL_ENABLED !== 'false') {
    const typeDefs = modules
      .map((m) => m.typeDefs)
      .filter(Boolean)
      .join('\n');

    const resolvers = modules.reduce((acc, m) => {
      return { ...acc, ...m.resolvers };
    }, {});

    if (typeDefs) {
      const schema = buildSchema(typeDefs);
      app.use(
        '/graphql',
        graphqlServer({
          schema,
          rootResolver: () => resolvers,
          graphiql: process.env.GRAPHIQL_ENABLED === 'true',
        })
      );
    }
  }
};
