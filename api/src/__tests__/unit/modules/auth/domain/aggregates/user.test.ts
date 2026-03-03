import { describe, expect, it } from 'vitest';
import { Uuid } from '@app/common/domain/uuid';
import { User } from '@app/modules/auth/domain/aggregates/user';
import { AuthExceptionCode } from '@app/modules/auth/domain/enums/auth-exception-code';
import { SignInType } from '@app/modules/auth/domain/enums/sign-in-type';
import { UserEventType } from '@app/modules/auth/domain/enums/user-event-type';
import { UserStatus } from '@app/modules/auth/domain/enums/user-status';
import { Email } from '@app/modules/auth/domain/value-objects/email';
import { Username } from '@app/modules/auth/domain/value-objects/username';

describe('User aggregate', () => {
  const id = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
  const userGroupId = Uuid.create('660e8400-e29b-41d4-a716-446655440000');
  const email = Email.create('user@example.com');

  it('creates user with REGISTERED event', () => {
    const user = User.create({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-1',
      username: Username.create('User_1234'),
      displayName: 'User Name',
    });

    expect(user.status).toBe(UserStatus.ACTIVE);
    expect(user.getEvents()[0]?.eventType).toBe(UserEventType.REGISTERED);
  });

  it('serializes user to json', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.GOOGLE,
      externalId: 'external-2',
    });

    const json = user.toJson();
    expect(json['id']).toBe(id.getValue());
    expect(json['email']).toBe(email.getValue());
    expect(json['signInType']).toBe(SignInType.GOOGLE);
  });

  it('changes status between active and disabled', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-3',
    });

    expect(user.isActive()).toBe(true);
    user.disable();
    expect(user.isDisabled()).toBe(true);
    expect(user.getEvents()[0]?.eventType).toBe(UserEventType.STATUS_CHANGED);

    user.activate();
    expect(user.isActive()).toBe(true);
    expect(user.getEvents()[1]?.eventType).toBe(UserEventType.STATUS_CHANGED);
  });

  it('throws when disabling non-active user', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-4',
      status: UserStatus.DISABLED,
    });

    expect(() => user.disable()).toThrowError(
      AuthExceptionCode.USER_MUST_BE_ACTIVE
    );
  });

  it('throws when activating non-disabled user', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-5',
      status: UserStatus.ACTIVE,
    });

    expect(() => user.activate()).toThrowError(
      AuthExceptionCode.USER_MUST_BE_DISABLED
    );
  });

  it('marks user for deletion and blocks repeated deletion', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-6',
    });

    user.markForDeletion();
    expect(user.isDeleted()).toBe(true);
    expect(user.getEvents()[0]?.eventType).toBe(UserEventType.DELETED);

    expect(() => user.markForDeletion()).toThrowError(
      AuthExceptionCode.USER_ALREADY_DELETED
    );
  });

  it('updates username/displayName and emits UPDATED', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-7',
    });

    user.setUsername(Username.create('User_5678'));
    user.setDisplayName('Updated Name');

    expect(user.username?.getValue()).toBe('User_5678');
    expect(user.displayName).toBe('Updated Name');
    expect(user.getEvents()[0]?.eventType).toBe(UserEventType.UPDATED);
    expect(user.getEvents()[1]?.eventType).toBe(UserEventType.UPDATED);
  });

  it('throws when updating deleted user', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-8',
      status: UserStatus.DELETED,
    });

    expect(() => user.setUsername(Username.create('User_9999'))).toThrowError(
      AuthExceptionCode.USER_DELETED
    );
    expect(() => user.setDisplayName('Name')).toThrowError(
      AuthExceptionCode.USER_DELETED
    );
  });

  it('emits user group relation events', () => {
    const user = new User({
      id,
      email,
      signInType: SignInType.EMAIL,
      externalId: 'external-9',
    });

    user.addedToUserGroup(userGroupId);
    user.removedFromUserGroup(userGroupId);

    expect(user.getEvents()[0]?.eventType).toBe(
      UserEventType.ADDED_TO_USER_GROUP
    );
    expect(user.getEvents()[1]?.eventType).toBe(
      UserEventType.REMOVED_FROM_USER_GROUP
    );
  });

  it('validates display name max length', () => {
    expect(() => User.validateDisplayName('a'.repeat(256))).toThrow();
  });
});
