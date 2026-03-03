import { describe, expect, it } from 'vitest';
import { pickFields } from '@app/common/utils/pick-fields';

describe('pick-fields', () => {
  it('returns original object when fields are not provided', () => {
    const obj = { id: 1, name: 'Alice' };

    expect(pickFields(obj)).toEqual(obj);
    expect(pickFields(obj, [])).toEqual(obj);
  });

  it('returns selected fields and converts undefined/missing to null', () => {
    const obj = { id: 1, name: undefined as string | undefined };
    const result = pickFields(obj, ['id', 'name', 'missing']);
    const nullable = JSON.parse('null') as null;

    expect(result).toEqual({
      id: 1,
      name: nullable,
      missing: nullable,
    });
  });
});
