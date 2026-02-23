import { logger } from 'hono/logger';
import type { App } from '@app/common/interfaces';

export const registerLogger = (app: App) => {
  if (process.env.LOGGER_ENABLED === 'true') {
    app.use('*', logger());
  }
};
