import { Kind, type GraphQLResolveInfo } from 'graphql';
import { describe, expect, it } from 'vitest';
import { extractGraphQLFields } from '@app/common/utils/extract-graphql-fields';

describe('extract-graphql-fields', () => {
  it('returns undefined when root field has no selection set', () => {
    const info = { fieldNodes: [{}] } as unknown as GraphQLResolveInfo;
    expect(extractGraphQLFields(info, 'data')).toBeUndefined();
  });

  it('returns undefined when target field is missing', () => {
    const info = {
      fieldNodes: [
        {
          selectionSet: { selections: [] },
        },
      ],
    } as unknown as GraphQLResolveInfo;
    expect(extractGraphQLFields(info, 'data')).toBeUndefined();
  });

  it('returns selected fields', () => {
    const info = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                kind: Kind.FIELD,
                name: { value: 'data' },
                selectionSet: {
                  selections: [
                    { kind: Kind.FIELD, name: { value: 'id' } },
                    { kind: Kind.FIELD, name: { value: 'name' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    } as unknown as GraphQLResolveInfo;

    expect(extractGraphQLFields(info, 'data')).toEqual(['id', 'name']);
  });

  it('returns undefined when selected target has no field selections', () => {
    const info = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                kind: Kind.FIELD,
                name: { value: 'data' },
                selectionSet: { selections: [] },
              },
            ],
          },
        },
      ],
    } as unknown as GraphQLResolveInfo;

    expect(extractGraphQLFields(info, 'data')).toBeUndefined();
  });

  it('ignores non-field selections inside target selection set', () => {
    const info = {
      fieldNodes: [
        {
          selectionSet: {
            selections: [
              {
                kind: Kind.FIELD,
                name: { value: 'data' },
                selectionSet: {
                  selections: [
                    { kind: Kind.FRAGMENT_SPREAD, name: { value: 'frag' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    } as unknown as GraphQLResolveInfo;

    expect(extractGraphQLFields(info, 'data')).toBeUndefined();
  });
});
