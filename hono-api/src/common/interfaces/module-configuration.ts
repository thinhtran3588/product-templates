import type { App } from './';

export interface ModuleConfiguration {
  register(app: App): void;
  typeDefs?: string;
  resolvers?: Record<string, unknown>;
}
