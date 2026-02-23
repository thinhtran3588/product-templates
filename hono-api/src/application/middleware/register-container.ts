import { asValue } from 'awilix';
import { getConnInfo } from 'hono/bun';
import { createDIContainer } from '@app/application/container';
import type { App } from '@app/common/interfaces';

const container = createDIContainer();

export const registerContainer = (app: App) => {
  app.use('*', async (c, next) => {
    const info = getConnInfo(c);
    const ip =
      c.req.header('x-forwarded-for') || info.remote.address || 'unknown';

    // Create a child logger with the request IP
    const childLogger = container.cradle.logger.child({ ip });

    // Create a scoped container for this request
    const scopedContainer = container.createScope();

    // Override the logger in the scoped container
    scopedContainer.register({
      logger: asValue(childLogger),
    });

    c.set('diContainer', scopedContainer);
    await next();
  });
};
