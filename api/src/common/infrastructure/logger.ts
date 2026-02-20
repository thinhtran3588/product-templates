import type { Logger } from '@app/common/domain/interfaces/logger';

/**
 * Console logger implementation
 * Implements the common Logger interface
 */
export class ConsoleLogger implements Logger {
  trace(bindings?: object, message?: string): void {
    console.trace(message, bindings || '');
  }

  debug(bindings?: object, message?: string): void {
    console.debug(message, bindings || '');
  }

  info(bindings?: object, message?: string): void {
    console.info(message, bindings || '');
  }

  warn(bindings?: object, message?: string): void {
    console.warn(message, bindings || '');
  }

  error(bindings?: object, message?: string): void {
    console.error(message, bindings || '');
  }
}
