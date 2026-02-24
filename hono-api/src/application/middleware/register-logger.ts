import type { App, AppContext } from '@app/common/interfaces';

export const registerLogger = (app: App) => {
  if (process.env.LOGGER_ENABLED === 'true') {
    app.use('*', async (c: AppContext, next) => {
      const { method, path } = c.req;
      const start = Date.now();

      await next();

      const end = Date.now();
      const ms = end - start;
      const { status } = c.res;
      const { logger } = c.var.diContainer.cradle;
      const message = `${method} ${path} ${status} ${ms}ms`;

      if (status >= 400) {
        logger.error(message);
      } else {
        logger.info(message);
      }
    });
  }
};
