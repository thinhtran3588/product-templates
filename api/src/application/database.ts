import { Sequelize } from 'sequelize';
import { databaseConfig } from '@app/application/config/database.config';
import type { Logger } from '@app/common/domain/interfaces/logger';

const options = {
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

function getLogging(logger: Logger): ((sql: string) => void) | false {
  return process.env['DB_LOGGING_ENABLED'] === 'true'
    ? (sql: string) => {
        logger.info(undefined, sql);
      }
    : false;
}

/**
 * Initializes the write database connection (for write operations)
 */
export function initializeWriteDatabase(logger: Logger): Sequelize {
  const config = databaseConfig();
  return new Sequelize(config.writeDatabaseUri, {
    ...options,
    logging: getLogging(logger),
  });
}

/**
 * Initializes the read database connection (for read operations)
 */
export function initializeReadDatabase(logger: Logger): Sequelize {
  const config = databaseConfig();
  return new Sequelize(config.readDatabaseUri, {
    ...options,
    logging: getLogging(logger),
  });
}
