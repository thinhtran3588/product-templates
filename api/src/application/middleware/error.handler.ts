import type { Context } from 'hono';
import type { Logger } from '@app/common/domain/interfaces/logger';
import { ErrorCodeRegistry } from '@app/common/utils/error-code-registry';
import { BusinessException } from '@app/common/utils/exceptions';

/**
 * Error handler middleware for Hono
 * Handles all errors thrown in route handlers and controllers
 * Note: ValidationException extends BusinessException, so both are handled here
 */
export function errorHandler(
  error: Error,
  c: Context,
  errorCodeRegistry: ErrorCodeRegistry,
  logger: Logger
): Response | void {
  // Handle BusinessException (includes ValidationException which extends it)
  if (error instanceof BusinessException) {
    const statusCode = errorCodeRegistry.getStatusCode(error.code) ?? 400;
    return c.json(
      {
        error: error.code,
        data: error.data,
      },
      statusCode as any
    );
  }

  // Handle Hono validation errors (they usually don't throw, but just in case)
  logger.error({ error }, 'Unhandled error');
  return c.json(
    { error: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' },
    500
  );
}
