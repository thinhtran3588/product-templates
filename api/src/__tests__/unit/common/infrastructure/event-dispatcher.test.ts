import { afterEach, describe, expect, it, vi } from 'vitest';
import { DomainEvent } from '@app/common/domain/domain-event';
import { Uuid } from '@app/common/domain/uuid';
import { EventDispatcherImpl } from '@app/common/infrastructure/event-dispatcher';

const createEvent = (eventType: string) =>
  new DomainEvent({
    id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
    aggregateId: Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
    aggregateName: 'Test',
    eventType,
    data: {},
    createdAt: new Date(),
  });

describe('EventDispatcherImpl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when registering handler without eventTypes', () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);

    expect(() =>
      dispatcher.registerHandler({ eventTypes: [], handle: vi.fn() } as never)
    ).toThrow('EventHandler must provide eventTypes');
  });

  it('dispatches events to matching handlers', async () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);
    const handle = vi.fn().mockResolvedValue(undefined);
    dispatcher.registerHandler({ eventTypes: ['A'], handle } as never);

    await dispatcher.dispatch([createEvent('A')]);
    await new Promise((resolve) => setImmediate(resolve));

    expect(handle).toHaveBeenCalledTimes(1);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('logs handler errors and continues', async () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);
    const handle = vi.fn().mockRejectedValue(new Error('boom'));
    dispatcher.registerHandler({ eventTypes: ['A'], handle } as never);

    await dispatcher.dispatch([createEvent('A')]);
    await new Promise((resolve) => setImmediate(resolve));

    expect(handle).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('handles non-Error rejection values', async () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);
    const handle = vi.fn().mockRejectedValue('failed-as-string');
    dispatcher.registerHandler({ eventTypes: ['A'], handle } as never);

    await dispatcher.dispatch([createEvent('A')]);
    await new Promise((resolve) => setImmediate(resolve));

    expect(logger.error).toHaveBeenCalledTimes(1);
  });

  it('does nothing when event type has no handlers', async () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);

    await dispatcher.dispatch([createEvent('NO_HANDLER')]);
    await new Promise((resolve) => setImmediate(resolve));
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('returns immediately for empty events', async () => {
    const logger = { error: vi.fn() };
    const dispatcher = new EventDispatcherImpl({ logger } as never);

    await expect(dispatcher.dispatch([])).resolves.toBeUndefined();
    expect(logger.error).not.toHaveBeenCalled();
  });
});
