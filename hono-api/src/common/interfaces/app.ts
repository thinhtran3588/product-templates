import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AwilixContainer } from 'awilix';
import type { Context } from 'hono';
import type { Container } from '@app/application/container';

export interface AppEnv {
  Variables: {
    diContainer: AwilixContainer<Container>;
  };
}

export type App = OpenAPIHono<AppEnv>;
export type AppContext = Context<AppEnv>;
