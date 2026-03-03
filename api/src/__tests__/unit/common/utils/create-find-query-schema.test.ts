import { z } from '@hono/zod-openapi';
import { describe, expect, it } from 'vitest';
import { createFindQuerySchema } from '@app/common/utils/create-find-query-schema';

describe('create-find-query-schema', () => {
  const fields = ['id', 'name'] as const;
  const sortFields = ['name'] as const;

  it('creates schema with defaults and parses valid input', () => {
    const schema = createFindQuerySchema(fields, sortFields);
    const parsed = schema.parse({
      searchTerm: 'hello',
      pageIndex: '1',
      itemsPerPage: '10',
      fields: 'id',
      sortField: 'name',
      sortOrder: 'ASC',
    });

    expect(parsed.pageIndex).toBe(1);
    expect(parsed.itemsPerPage).toBe(10);
    expect(parsed.fields).toEqual(['id']);
  });

  it('keeps fields array input unchanged', () => {
    const schema = createFindQuerySchema(fields, sortFields);
    const parsed = schema.parse({ fields: ['id', 'name'] });
    expect(parsed.fields).toEqual(['id', 'name']);
  });

  it('extends with extra shape', () => {
    const schema = createFindQuerySchema(fields, sortFields, {
      userGroupId: z.string().optional(),
    });
    const parsed = schema.parse({ userGroupId: 'g1' });
    expect(parsed.userGroupId).toBe('g1');
  });

  it('disables searchTerm when includeSearchTerm is false', () => {
    const schema = createFindQuerySchema(fields, sortFields, undefined, {
      includeSearchTerm: false,
    });

    expect(() => schema.parse({ searchTerm: 'hello' })).toThrow();
  });
});
