import { describe, expect, it } from 'vitest';
import { BaseAggregate } from '@app/common/domain/base-aggregate';
import { Uuid } from '@app/common/domain/uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';

class TestAggregate extends BaseAggregate {
  constructor(
    params: ConstructorParameters<typeof BaseAggregate>[0],
    private readonly name: string = 'test'
  ) {
    super(params);
  }

  emit(
    type: string,
    data: Record<string, unknown>,
    metadata?: Record<string, unknown>
  ): void {
    this.registerEvent(type, data, metadata);
  }

  toJson(): Record<string, unknown> {
    return {
      name: this.name,
      ...this.getBaseJson(),
    };
  }
}

describe('BaseAggregate', () => {
  const aggregateId = Uuid.create('550e8400-e29b-41d4-a716-446655440000');
  const creatorId = Uuid.create('660e8400-e29b-41d4-a716-446655440000');
  const operatorId = Uuid.create('770e8400-e29b-41d4-a716-446655440000');

  it('initializes default values', () => {
    const aggregate = new TestAggregate({ id: aggregateId });

    expect(aggregate.id.getValue()).toBe(aggregateId.getValue());
    expect(aggregate.version).toBe(0);
    expect(aggregate.createdAt).toBeInstanceOf(Date);
    expect(aggregate.updatePrepared).toBe(false);
  });

  it('prepareUpdate sets audit fields, increments version, and marks prepared', () => {
    const aggregate = new TestAggregate({
      id: aggregateId,
      version: 2,
      createdBy: creatorId,
    });

    aggregate.prepareUpdate(operatorId, 2);

    expect(aggregate.version).toBe(3);
    expect(aggregate.lastModifiedBy?.getValue()).toBe(operatorId.getValue());
    expect(aggregate.lastModifiedAt).toBeInstanceOf(Date);
    expect(aggregate.updatePrepared).toBe(true);
  });

  it('prepareUpdate works without expectedVersion', () => {
    const aggregate = new TestAggregate({ id: aggregateId, version: 2 });
    aggregate.prepareUpdate(operatorId);
    expect(aggregate.version).toBe(3);
  });

  it('prepareUpdate throws when version is outdated', () => {
    const aggregate = new TestAggregate({ id: aggregateId, version: 1 });

    expect(() => aggregate.prepareUpdate(operatorId, 2)).toThrowError(
      ValidationErrorCode.OUTDATED_VERSION
    );
  });

  it('registers events and returns copies', () => {
    const aggregate = new TestAggregate({
      id: aggregateId,
      createdBy: creatorId,
    });

    aggregate.emit('CREATED', { foo: 'bar' }, { source: 'unit-test' });

    const events = aggregate.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('CREATED');
    expect(events[0]?.aggregateName).toBe('TestAggregate');
    expect(events[0]?.aggregateId.getValue()).toBe(aggregateId.getValue());
    expect(events[0]?.createdBy?.getValue()).toBe(creatorId.getValue());

    events.push(events[0]!);
    expect(aggregate.getEvents()).toHaveLength(1);
  });

  it('uses lastModifiedBy as createdBy for later events', () => {
    const aggregate = new TestAggregate({
      id: aggregateId,
      createdBy: creatorId,
      version: 0,
    });
    aggregate.prepareUpdate(operatorId, 0);
    aggregate.emit('UPDATED', { foo: 'bar' });

    expect(aggregate.getEvents()[0]?.createdBy?.getValue()).toBe(
      operatorId.getValue()
    );
  });

  it('clears events', () => {
    const aggregate = new TestAggregate({ id: aggregateId });
    aggregate.emit('CREATED', {});
    expect(aggregate.getEvents()).toHaveLength(1);

    aggregate.clearEvents();
    expect(aggregate.getEvents()).toHaveLength(0);
  });

  it('returns base json fields', () => {
    const aggregate = new TestAggregate({
      id: aggregateId,
      version: 5,
      createdBy: creatorId,
      lastModifiedBy: operatorId,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      lastModifiedAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    const json = aggregate.toJson();
    expect(json['version']).toBe(5);
    expect(json['createdBy']).toBe(creatorId.getValue());
    expect(json['lastModifiedBy']).toBe(operatorId.getValue());
  });
});
