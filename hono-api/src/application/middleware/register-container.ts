import { asValue } from 'awilix';
import { createDIContainer } from '@app/application/container';
import type { App, AppContext } from '@app/common/interfaces';
import { getIP } from '@app/common/utils/get-ip';

const container = createDIContainer();

export const registerContainer = (app: App) => {
  app.use('*', async (c: AppContext, next) => {
    const ip = getIP(c);

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
