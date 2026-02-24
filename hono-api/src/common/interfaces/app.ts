import type { OpenAPIHono } from '@hono/zod-openapi';
import type { AwilixContainer } from 'awilix';
import type { Context } from 'hono';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppEnv<T extends object = any> {
  Variables: {
    diContainer: AwilixContainer<T>;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type App<T extends object = any> = OpenAPIHono<AppEnv<T>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppContext<T extends object = any> = Context<AppEnv<T>>;
