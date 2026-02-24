import type { App } from '.';

export interface AdapterConfiguration {
  registerRoutes(app: App): void;
  graphql?: {
    typeDefs: string;
    resolvers: Record<string, unknown>;
  };
}
