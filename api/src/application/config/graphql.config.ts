/**
 * GraphQL configuration
 */
export function graphqlConfig() {
  return {
    endpoint: process.env['GRAPHQL_ENDPOINT'] ?? '/graphql',
  };
}
