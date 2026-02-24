import {
  asClass,
  asValue,
  createContainer,
  type AwilixContainer,
} from 'awilix';
import pino from 'pino';
import type { Logger } from '@app/common/interfaces';
import type { AuthContainer } from '@app/modules/auth/interfaces';

/**
 * Common application dependencies
 */
export interface CommonContainer {
  logger: Logger;
}

/**
 * Application container type combining all module containers
 */
export type Container = CommonContainer & AuthContainer;

/**
 * Creates and configures the dependency injection container
 * @returns The dependency injection container
 */
export function createDIContainer(): AwilixContainer<Container> {
  const container = createContainer<Container>({
    injectionMode: 'PROXY', // Use proxy injection
  });

  // Create pino logger instance
  const logger = pino({
    base: { pid: process.pid }, // Removes hostname, keeps pid
  });

  // Register application-level services
  container.register({
    logger: asValue(logger),
  });

  return container;
}
