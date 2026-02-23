import type { App } from './';

export interface ModuleConfiguration {
  register(app: App): void;
  graphql?: {
    typeDefs: string;
    resolvers: Record<string, unknown>;
  };
}
