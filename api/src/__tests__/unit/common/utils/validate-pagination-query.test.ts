import { describe, expect, it } from 'vitest';
import { PAGINATION_DEFAULT_ITEMS_PER_PAGE } from '@app/common/constants';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { validatePaginationQuery } from '@app/common/utils/validate-pagination-query';

describe('validate-pagination-query', () => {
  const validFields = ['id', 'name', 'email'] as const;
  const validSortFields = ['name', 'email'] as const;

  it('returns defaults when params are empty', () => {
    const result = validatePaginationQuery({}, validFields, validSortFields);
    expect(result.pageIndex).toBe(0);
    expect(result.itemsPerPage).toBe(PAGINATION_DEFAULT_ITEMS_PER_PAGE);
  });

  it('throws for invalid pageIndex values', () => {
    expect(() =>
      validatePaginationQuery({ pageIndex: -1 }, validFields, validSortFields)
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
    expect(() =>
      validatePaginationQuery({ pageIndex: 1.2 }, validFields, validSortFields)
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws for invalid itemsPerPage values', () => {
    expect(() =>
      validatePaginationQuery({ itemsPerPage: 0 }, validFields, validSortFields)
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
    expect(() =>
      validatePaginationQuery(
        { itemsPerPage: 999 },
        validFields,
        validSortFields
      )
    ).toThrowError(ValidationErrorCode.FIELD_ABOVE_MAX_VALUE);
    expect(() =>
      validatePaginationQuery(
        { itemsPerPage: 1.1 },
        validFields,
        validSortFields
      )
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws when fields include invalid entries', () => {
    expect(() =>
      validatePaginationQuery(
        { fields: ['name', 'invalid'] },
        validFields,
        validSortFields
      )
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws when sortField invalid or sort metadata missing', () => {
    expect(() =>
      validatePaginationQuery({ sortField: 'name' }, validFields)
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
    expect(() =>
      validatePaginationQuery({ sortField: 'id' }, validFields, validSortFields)
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('throws when sortOrder invalid', () => {
    expect(() =>
      validatePaginationQuery(
        { sortField: 'name', sortOrder: 'UP' as 'ASC' },
        validFields,
        validSortFields
      )
    ).toThrowError(ValidationErrorCode.FIELD_IS_INVALID);
  });

  it('defaults sortOrder to ASC when sortField provided', () => {
    const result = validatePaginationQuery(
      { sortField: 'name' },
      validFields,
      validSortFields
    );
    expect(result.sortOrder).toBe('ASC');
  });

  it('returns provided sortOrder when valid', () => {
    const result = validatePaginationQuery(
      { sortField: 'name', sortOrder: 'DESC' },
      validFields,
      validSortFields
    );
    expect(result.sortOrder).toBe('DESC');
  });
});
