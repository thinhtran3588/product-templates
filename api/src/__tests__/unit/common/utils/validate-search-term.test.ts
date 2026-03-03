import { describe, expect, it } from 'vitest';
import { SEARCH_TERM_MAX_LENGTH } from '@app/common/constants';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { validateSearchTerm } from '@app/common/utils/validate-search-term';

describe('validate-search-term', () => {
  it('returns undefined for empty input', () => {
    expect(validateSearchTerm(undefined)).toBeUndefined();
  });

  it('returns value for valid input', () => {
    expect(validateSearchTerm(' hello ')).toBe(' hello ');
  });

  it('throws when search term exceeds max length', () => {
    expect(() =>
      validateSearchTerm('a'.repeat(SEARCH_TERM_MAX_LENGTH + 1))
    ).toThrowError(ValidationErrorCode.FIELD_IS_TOO_LONG);
  });
});
