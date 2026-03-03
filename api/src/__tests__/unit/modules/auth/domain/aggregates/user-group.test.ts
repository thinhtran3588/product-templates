import { describe, expect, it } from 'vitest';
import { Uuid } from '@app/common/domain/uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { UserGroup } from '@app/modules/auth/domain/aggregates/user-group';
import { UserGroupEventType } from '@app/modules/auth/domain/enums/user-group-event-type';

describe('UserGroup aggregate', () => {
  const id = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
  const creator = Uuid.create('660e8400-e29b-41d4-a716-446655440000');
  const roleId = Uuid.create('770e8400-e29b-41d4-a716-446655440000');

  it('creates group with CREATED event', () => {
    const group = UserGroup.create({
      id,
      name: 'Admins',
      description: 'Admin group',
      createdBy: creator,
    });

    expect(group.name).toBe('Admins');
    expect(group.description).toBe('Admin group');
    expect(group.getEvents()[0]?.eventType).toBe(UserGroupEventType.CREATED);
  });

  it('updates name and description and emits UPDATED events', () => {
    const group = new UserGroup({ id, name: 'GroupA' });

    group.setName('GroupB');
    group.setDescription('Description');

    const events = group.getEvents();
    expect(events[0]?.eventType).toBe(UserGroupEventType.UPDATED);
    expect(events[1]?.eventType).toBe(UserGroupEventType.UPDATED);
  });

  it('handles role add/remove and deletion events', () => {
    const group = new UserGroup({ id, name: 'GroupA' });

    group.addRole(roleId);
    group.removeRole(roleId);
    group.markForDeletion();

    const events = group.getEvents();
    expect(events[0]?.eventType).toBe(UserGroupEventType.ROLE_ADDED);
    expect(events[1]?.eventType).toBe(UserGroupEventType.ROLE_REMOVED);
    expect(events[2]?.eventType).toBe(UserGroupEventType.DELETED);
  });

  it('validates name/description', () => {
    expect(() => UserGroup.validateName(undefined)).toThrowError(
      ValidationErrorCode.FIELD_IS_REQUIRED
    );
    expect(() => UserGroup.validateName('a'.repeat(256))).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_LONG
    );
    expect(() => UserGroup.validateDescription('a'.repeat(1001))).toThrowError(
      ValidationErrorCode.FIELD_IS_TOO_LONG
    );
  });

  it('serializes to json', () => {
    const group = new UserGroup({ id, name: 'GroupA', description: 'Desc' });
    const json = group.toJson();
    expect(json['id']).toBe(id.getValue());
    expect(json['name']).toBe('GroupA');
    expect(json['description']).toBe('Desc');
  });
});
