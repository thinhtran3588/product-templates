import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { describe, expect, it, vi } from 'vitest';
import { BaseAggregate } from '@app/common/domain/base-aggregate';
import { Uuid } from '@app/common/domain/uuid';
import { ValidationErrorCode } from '@app/common/enums/validation-error-code';
import { BaseRepositoryImpl } from '@app/common/infrastructure/base-repository';

const entities = pgTable('repo_entities', {
  id: text('id').notNull(),
  version: integer('version').notNull(),
  createdAt: timestamp('created_at').notNull(),
});

class TestAggregate extends BaseAggregate {
  emit(type: string): void {
    this.registerEvent(type, {});
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id.getValue(),
      version: this.version,
      createdAt: this.createdAt,
      ...this.getBaseJson(),
    };
  }
}

class TestRepository extends BaseRepositoryImpl<
  TestAggregate,
  typeof entities
> {
  protected getAggregateName(): string {
    return 'TestAggregate';
  }

  protected getTable(): typeof entities {
    return entities;
  }

  protected toDomain(model: {
    id: string;
    version: number;
    createdAt: Date;
  }): TestAggregate {
    return new TestAggregate({
      id: Uuid.create(model.id),
      version: model.version,
      createdAt: model.createdAt,
    });
  }
}

const createTx = (rowCount: number = 1) => {
  const values = vi.fn().mockResolvedValue(undefined);
  const execute = vi.fn().mockResolvedValue({ rowCount });
  const whereSelect = vi.fn().mockResolvedValue([{ version: 9 }]);
  const whereDelete = vi.fn().mockResolvedValue(undefined);

  const tx = {
    insert: vi.fn(() => ({ values })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({ execute })),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: whereSelect,
      })),
    })),
    delete: vi.fn(() => ({ where: whereDelete })),
  };
  return { tx, values, execute };
};

describe('BaseRepositoryImpl', () => {
  it('saves new aggregate and optional callback', async () => {
    const { tx, values } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    const callback = vi.fn().mockResolvedValue(undefined);

    await repo.save(aggregate, callback);
    expect(values).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('throws when saving existing aggregate without prepareUpdate', async () => {
    const { tx } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 1,
    });

    await expect(repo.save(aggregate)).rejects.toThrow(
      ValidationErrorCode.FIELD_IS_INVALID
    );
  });

  it('throws outdated version when update affects no rows', async () => {
    const { tx } = createTx(0);
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );

    await expect(repo.save(aggregate)).rejects.toThrow(
      ValidationErrorCode.OUTDATED_VERSION
    );
  });

  it('handles outdated version when current model is missing', async () => {
    const { tx } = createTx(0);
    tx.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([]),
      })),
    }));
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );

    await expect(repo.save(aggregate)).rejects.toThrow(
      ValidationErrorCode.OUTDATED_VERSION
    );
  });

  it('saves domain events when aggregate has events', async () => {
    const { tx } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.emit('CREATED');

    await repo.save(aggregate);
    expect(domainEventRepository.save).toHaveBeenCalledTimes(1);
  });

  it('updates prepared aggregate successfully when row is affected', async () => {
    const { tx, execute } = createTx(1);
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.prepareUpdate(
      Uuid.create('660e8400-e29b-41d4-a716-446655440000'),
      0
    );

    await repo.save(aggregate);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('findById returns aggregate or undefined', async () => {
    const where = vi.fn().mockReturnThis();
    const limit = vi.fn().mockResolvedValue([
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        version: 0,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    ]);
    const from = vi.fn(() => ({ where, limit }));
    const select = vi.fn(() => ({ from }));

    const writeDatabase = {
      transaction: vi.fn(),
      select,
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const found = await repo.findById(
      Uuid.create('550e8400-e29b-41d4-a716-446655440000')
    );
    expect(found).toBeDefined();

    limit.mockResolvedValueOnce([]);
    const missing = await repo.findById(
      Uuid.create('550e8400-e29b-41d4-a716-446655440000')
    );
    expect(missing).toBeUndefined();
  });

  it('deletes aggregate and persists events', async () => {
    const { tx } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });
    aggregate.emit('DELETED');

    await repo.delete(aggregate);
    expect(domainEventRepository.save).toHaveBeenCalledTimes(1);
  });

  it('deletes aggregate without events', async () => {
    const { tx } = createTx();
    const writeDatabase = {
      transaction: vi.fn(async (cb: (t: unknown) => Promise<void>) => cb(tx)),
      select: vi.fn(),
    };
    const domainEventRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const repo = new TestRepository({
      writeDatabase: writeDatabase as never,
      domainEventRepository: domainEventRepository as never,
    });

    const aggregate = new TestAggregate({
      id: Uuid.create('550e8400-e29b-41d4-a716-446655440000'),
      version: 0,
    });

    await repo.delete(aggregate);
    expect(domainEventRepository.save).not.toHaveBeenCalled();
  });
});
