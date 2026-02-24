import { validate as isValidUuid, v7 as uuidv7 } from 'uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { ValidationException } from '@app/common/utils/exceptions';

/**
 * UUID value object
 * Represents a validated UUID (Universally Unique Identifier)
 * Can be used for any entity ID that requires UUID validation
 */
export class Uuid {
  private constructor(private readonly value: string) {}

  /**
   * Creates a Uuid value object, throwing ValidationException if invalid
   * @param value - UUID string to validate and wrap
   * @param fieldName - Optional field name for error messages (defaults to 'id')
   * @returns Uuid value object
   * @throws ValidationException if UUID is invalid
   */
  static create(value: string | undefined, fieldName: string = 'id'): Uuid {
    const result = Uuid.tryCreate(value, fieldName);
    if (result.error) {
      throw result.error;
    }
    return result.uuid!;
  }

  /**
   * Attempts to create a Uuid value object, returning an ErrorValidationResult if invalid
   * @param value - UUID string to validate and wrap
   * @param fieldName - Optional field name for error messages (defaults to 'id')
   * @returns Object with uuid and error, where error is undefined if valid
   */
  static tryCreate(
    value: string | undefined,
    fieldName: string = 'id'
  ): {
    uuid?: Uuid;
    error?: ValidationException;
  } {
    if (value === undefined) {
      return {
        error: new ValidationException(
          ValidationErrorCode.FIELD_IS_REQUIRED,
          fieldName
        ),
      };
    }

    if (typeof value !== 'string' || !isValidUuid(value)) {
      return {
        error: new ValidationException(
          ValidationErrorCode.FIELD_IS_INVALID,
          fieldName
        ),
      };
    }

    return {
      uuid: new Uuid(value),
    };
  }

  /**
   * Gets the UUID value as a string
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compares two Uuid objects for equality
   */
  equals(other: Uuid): boolean {
    return this.value === other.value;
  }

  /**
   * Generates a new random UUID (v7)
   * Used for creating new aggregate IDs
   * @returns A new Uuid instance with a randomly generated UUID
   */
  static generate(): Uuid {
    return new Uuid(uuidv7());
  }
}
