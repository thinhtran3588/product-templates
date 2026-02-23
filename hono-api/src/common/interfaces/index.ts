import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AwilixContainer } from 'awilix';
import type { Container } from '@app/application/container';

import type { Logger } from './logger';
import type { ModuleConfiguration } from './module-configuration';

export interface AppEnv {
  Variables: {
    diContainer: AwilixContainer<Container>;
  };
}

export type App = OpenAPIHono<AppEnv>;

export { type Logger, type ModuleConfiguration };
