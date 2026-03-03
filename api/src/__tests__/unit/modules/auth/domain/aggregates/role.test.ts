import { describe, expect, it } from 'vitest';
import { Uuid } from '@app/common/domain/uuid';
import { Role } from '@app/modules/auth/domain/aggregates/role';

describe('Role aggregate', () => {
  it('creates role and serializes to json', () => {
    const id = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
    const role = new Role({
      id,
      code: 'ADMIN',
      name: 'Administrator',
      description: 'Full access',
    });

    expect(role.code).toBe('ADMIN');
    expect(role.name).toBe('Administrator');
    expect(role.description).toBe('Full access');

    const json = role.toJson();
    expect(json['id']).toBe(id.getValue());
    expect(json['code']).toBe('ADMIN');
  });
});
