import { describe, expect, it, vi } from 'vitest';
import { DomainEvent } from '@app/common/domain/domain-event';
import { Uuid } from '@app/common/domain/uuid';
import { DrizzleDomainEventRepository } from '@app/common/infrastructure/domain-event-repository-impl';

const createEvent = () =>
  new DomainEvent({
    id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
    aggregateId: Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
    aggregateName: 'TestAggregate',
    eventType: 'CREATED',
    data: { foo: 'bar' },
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    createdBy: Uuid.create('770e8400-e29b-41d4-a716-446655440000'),
  });

describe('DrizzleDomainEventRepository', () => {
  it('returns early when save receives empty events', async () => {
    const repo = new DrizzleDomainEventRepository({
      writeDatabase: {} as never,
    });
    const tx = { insert: vi.fn() };

    await repo.save([], tx as never);
    expect(tx.insert).not.toHaveBeenCalled();
  });

  it('saves event payloads via transaction', async () => {
    const repo = new DrizzleDomainEventRepository({
      writeDatabase: {} as never,
    });
    const values = vi.fn().mockResolvedValue(undefined);
    const tx = {
      insert: vi.fn(() => ({ values })),
    };

    await repo.save([createEvent()], tx as never);

    expect(tx.insert).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledTimes(1);
  });

  it('maps rows to DomainEvent instances on findByAggregateId', async () => {
    const where = vi.fn().mockReturnThis();
    const orderBy = vi.fn().mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        aggregateId: '660e8400-e29b-41d4-a716-446655440000',
        aggregateName: 'TestAggregate',
        eventType: 'CREATED',
        data: { foo: 'bar' },
        metadata: { source: 'test' },
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        createdBy: '770e8400-e29b-41d4-a716-446655440000',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        aggregateId: '660e8400-e29b-41d4-a716-446655440000',
        aggregateName: 'TestAggregate',
        eventType: 'UPDATED',
        data: {},
        metadata: undefined,
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
        createdBy: undefined,
      },
    ]);
    const from = vi.fn(() => ({ where, orderBy }));
    const select = vi.fn(() => ({ from }));
    const writeDatabase = { select };

    const repo = new DrizzleDomainEventRepository({
      writeDatabase: writeDatabase as never,
    });
    const events = await repo.findByAggregateId(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000')
    );

    expect(select).toHaveBeenCalled();
    expect(events).toHaveLength(2);
    expect(events[0]?.eventType).toBe('CREATED');
    expect(events[1]?.toJson()['createdBy']).toBeUndefined();
  });
});
