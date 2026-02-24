import { graphqlServer } from '@hono/graphql-server';
import { buildSchema } from 'graphql';
import type { App, ModuleConfiguration } from '@app/common/interfaces';

export const registerGraphQL = (app: App, modules: ModuleConfiguration[]) => {
  if (process.env.GRAPHQL_ENABLED !== 'false') {
    const typeDefs = modules
      .flatMap((m) => m.adapters.map((a) => a.graphql?.typeDefs))
      .filter(Boolean)
      .join('\n');

    const resolvers = modules.reduce((acc, m) => {
      const moduleResolvers = m.adapters.reduce((adapterAcc, a) => {
        return { ...adapterAcc, ...(a.graphql?.resolvers || {}) };
      }, {});
      return { ...acc, ...moduleResolvers };
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
