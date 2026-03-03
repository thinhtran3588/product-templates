import { describe, expect, it } from 'vitest';
import { DomainEvent } from '@app/common/domain/domain-event';
import { Uuid } from '@app/common/domain/uuid';

describe('DomainEvent', () => {
  it('creates event and serializes to plain object', () => {
    const id = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
    const aggregateId = Uuid.create('660e8400-e29b-41d4-a716-446655440000');
    const createdBy = Uuid.create('770e8400-e29b-41d4-a716-446655440000');
    const createdAt = new Date('2026-01-01T00:00:00.000Z');

    const event = new DomainEvent({
      id,
      aggregateId,
      aggregateName: 'User',
      eventType: 'USER_CREATED',
      data: { email: 'a@example.com' },
      metadata: { source: 'test' },
      createdAt,
      createdBy,
    });

    expect(event.eventType).toBe('USER_CREATED');
    expect(event.aggregateName).toBe('User');

    expect(event.toJson()).toEqual({
      id: id.getValue(),
      aggregateId: aggregateId.getValue(),
      aggregateName: 'User',
      eventType: 'USER_CREATED',
      data: { email: 'a@example.com' },
      metadata: { source: 'test' },
      createdAt,
      createdBy: createdBy.getValue(),
    });
  });

  it('serializes createdBy as undefined when not present', () => {
    const id = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
    const aggregateId = Uuid.create('660e8400-e29b-41d4-a716-446655440000');

    const event = new DomainEvent({
      id,
      aggregateId,
      aggregateName: 'User',
      eventType: 'USER_UPDATED',
      data: {},
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(event.toJson()['createdBy']).toBeUndefined();
  });
});
